
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('fpmToken');

  // چون با matcher محدود کردیم، نیاز به شرط نیست ولی نگه داشتنش هم اوکیه
  if (!token) {
    return NextResponse.redirect(new URL('/panel/auth/login', req.url));
  }

  return NextResponse.next();
}

// اینجا مسیرهایی که باید Middleware روشون اجرا بشه
export const config = {
  matcher: ['/panel/admin/:path*', '/panel/panel/:path*'],
};



// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//     const token = req.cookies.get('fpmToken');

//     if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/panel')) {
//         if (!token) {
//             return NextResponse.redirect(new URL('/auth/login', req.url));
//         }
//     }

//     return NextResponse.next();
// }
