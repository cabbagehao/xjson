import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { Locale, locales, defaultLocale } from './i18n'

// 获取用户首选语言
function getLocale(request: NextRequest): Locale {
  // 1. 检查cookie中的语言设置
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  // 2. 从Accept-Language头部获取首选语言列表
  let headers = new Headers(request.headers)
  let acceptLanguage = headers.get('accept-language') || ''
  
  // 构造Negotiator需要的headers对象
  let languages: string[] = []
  try {
    languages = new Negotiator({ 
      headers: { 'accept-language': acceptLanguage } 
    }).languages()
  } catch (e) {
    console.error('Failed to parse Accept-Language header:', e)
    // 如果解析失败，返回默认语言
    return defaultLocale
  }

  // 3. 使用intl-localematcher匹配最佳语言
  try {
    // 首先尝试精确匹配
    const matchedLocale = match(languages, locales, defaultLocale) as Locale
    return matchedLocale
  } catch (e) {
    console.error('Failed to match locale:', e)
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查URL是否已经包含语言代码
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // 如果URL中已有语言代码，或者是其他不需要处理的路径，则跳过
  if (pathnameHasLocale || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  // 获取用户首选语言，仅用于设置Cookie，不再进行重定向
  const locale = getLocale(request)
  
  // 设置语言cookie，有效期30天
  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', locale, { 
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax'
  })
  
  return response
}

// 配置中间件只在这些路径上运行
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
} 