'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Popover, Transition } from '@headlessui/react';
import { FiGlobe } from 'react-icons/fi';
import { Locale, locales, languageNames, defaultLocale } from '@/i18n';
import Cookies from 'js-cookie';

interface LanguageSwitcherProps {
  locale: Locale;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // 客户端挂载后再显示，避免服务端渲染不匹配
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 切换语言
  const switchLanguage = (targetLocale: Locale) => {
    // 保存语言偏好到cookie，与中间件行为一致
    Cookies.set('NEXT_LOCALE', targetLocale, { 
      expires: 30, // 30天
      path: '/'
    });
    
    // 导航到新语言页面
    const url = getLanguageUrl(targetLocale);
    router.push(url);
  };
  
  // 生成语言切换链接
  const getLanguageUrl = (targetLocale: Locale) => {
    // 从当前路径中提取不带语言前缀的路径
    let path = pathname || '/';
    
    // 如果当前路径以语言代码开头，需要移除它
    for (const loc of locales) {
      if (path.startsWith(`/${loc}/`) || path === `/${loc}`) {
        path = path.substring(loc.length + 1) || '/';
        break;
      }
    }
    
    // 检查当前路径是否已经是x-default（不含语言前缀）
    const isXDefault = !locales.some(loc => 
      pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );
    
    // 如果目标语言是默认语言并且我们当前在x-default路径，或者从带语言的路径切换到默认语言
    if (targetLocale === defaultLocale) {
      // 返回不带语言前缀的路径
      return path === '/' ? '/' : path;
    } else {
      // 对于其他语言，添加语言前缀
      return `/${targetLocale}${path === '/' ? '' : path}`;
    }
  };

  // 如果不是客户端渲染，返回占位元素保持布局一致
  if (!mounted) {
    return (
      <div className="w-9 h-9"></div>
    );
  }

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center justify-center w-9 h-9 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <FiGlobe className="w-5 h-5" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2 min-w-[180px] max-w-[220px]">
          <div className="grid grid-cols-2 gap-1">
            {locales.map((lang) => (
              <button
                key={lang}
                onClick={() => switchLanguage(lang)}
                className={`
                  flex items-center justify-center px-2 py-1.5 text-sm rounded 
                  ${(locale === lang || (lang === defaultLocale && !locales.includes(pathname.split('/')[1] as Locale))) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                `}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
} 