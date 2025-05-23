'use client';

import { useState, useEffect } from 'react';
import jsBeautify from 'js-beautify';
import { FiCopy, FiDownload, FiRefreshCw, FiCode } from 'react-icons/fi';
import JsonEditor from '../../components/JsonEditor';
import ToolLayout from '../../components/ToolLayout';
import { useTranslation } from '@/i18n/hooks';
import dynamic from 'next/dynamic';
import { Locale } from '@/i18n';
import Head from 'next/head';

// 动态导入JsonLdClient组件
const JsonLdClient = dynamic(() => import("../../components/JsonLdClient"), { ssr: false });

type BraceStyle = 'collapse' | 'expand' | 'end-expand' | 'none' | 'preserve-inline';

interface FormatterClientProps {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  pageIntroduction?: string;
  locale: Locale;
}

export default function FormatterClient({
  pageTitle,
  pageDescription,
  pageKeywords,
  pageIntroduction,
  locale
}: FormatterClientProps) {
  const { t } = useTranslation();
  const formatter = t('formatter');
  const ui = t('common').ui;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [formatOptions, setFormatOptions] = useState({
    braceStyle: 'collapse' as BraceStyle,
    preserveNewlines: true,
    maxPreserveNewlines: 2,
    wrapLineLength: 80, 
  });

  // SEO数据
  const seoData = {
    url: `https://jsonpanda.com/${locale}/formatter`,
    name: pageTitle,
    description: pageDescription,
    language: locale
  };

  // 设置页面标题
  useEffect(() => {
    // 直接使用翻译文件中的seo_title设置页面标题
    document.title = formatter.seo_title;
  }, [formatter.seo_title]);

  const formatJson = () => {
    setError(null);
    
    try {
      // 首先检查输入是否为有效JSON
      const parsedJson = JSON.parse(input);
      
      // 使用js-beautify格式化
      const formattedJson = jsBeautify.js_beautify(JSON.stringify(parsedJson), {
        indent_size: indentSize,
        brace_style: formatOptions.braceStyle,
        preserve_newlines: formatOptions.preserveNewlines,
        max_preserve_newlines: formatOptions.maxPreserveNewlines,
        wrap_line_length: formatOptions.wrapLineLength,
      });
      
      setOutput(formattedJson);
    } catch (err) {
      if (err instanceof Error) {
        setError(`${formatter.error}${err.message}`);
      } else {
        setError(formatter.unknown);
      }
      setOutput('');
    }
  };

  const copyOutput = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output);
        alert(ui.copied);
      } catch (err) {
        alert(ui.copyFailed);
      }
    }
  };

  const downloadOutput = () => {
    if (output) {
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-json.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <ToolLayout
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
      introduction={pageIntroduction}
      iconComponent={<FiCode className="w-6 h-6 text-blue-500" />}
    >
      {/* 添加结构化数据 */}
      <JsonLdClient seoData={seoData} />

      <div className="space-y-6">
        {/* 工具配置 */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{formatter.options}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="indent-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {formatter.indentSize}
              </label>
              <select
                id="indent-size"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
              >
                <option value="2">{formatter.spaces2}</option>
                <option value="4">{formatter.spaces4}</option>
                <option value="8">{formatter.spaces8}</option>
              </select>
            </div>

            <div>
              <label htmlFor="brace-style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {formatter.braceStyle}
              </label>
              <select
                id="brace-style"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={formatOptions.braceStyle}
                onChange={(e) => setFormatOptions({...formatOptions, braceStyle: e.target.value as BraceStyle})}
              >
                <option value="collapse">{formatter.collapse}</option>
                <option value="expand">{formatter.expand}</option>
                <option value="preserve-inline">{formatter.preserveInline}</option>
              </select>
            </div>

            <div>
              <label htmlFor="wrap-line" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {formatter.lineWidth}
              </label>
              <select
                id="wrap-line"
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                value={formatOptions.wrapLineLength}
                onChange={(e) => setFormatOptions({...formatOptions, wrapLineLength: Number(e.target.value)})}
              >
                <option value="0">{formatter.noLimit}</option>
                <option value="80">{formatter.chars80}</option>
                <option value="100">{formatter.chars100}</option>
                <option value="120">{formatter.chars120}</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={formatJson}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full h-10"
              >
                {formatter.format}
              </button>
            </div>
          </div>
        </div>

        {/* 输入/输出区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatter.input}
              </label>
              {/* 空div，用于占位对齐 */}
              <div className="opacity-0 invisible h-10"></div>
            </div>
            <JsonEditor
              value={input}
              onChange={setInput}
              placeholder={formatter.placeholder}
              error={error || undefined}
            />
          </div>
          
          <div>
            <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
                {formatter.output}
              </label>
              <div className="flex space-x-2">
                <button 
                  onClick={copyOutput}
                  disabled={!output}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiCopy className="mr-1" />
                  {ui.copy}
                </button>
                <button 
                  onClick={downloadOutput}
                  disabled={!output}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiDownload className="mr-1" />
                  {ui.download}
                </button>
                <button 
                  onClick={clearAll}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiRefreshCw className="mr-1" />
                  {ui.clear}
                </button>
              </div>
            </div>
            <JsonEditor 
              value={output}
              onChange={setOutput}
              readOnly={true}
              height="400px"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
} 