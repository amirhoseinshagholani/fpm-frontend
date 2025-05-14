import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('fpmToken');

    if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/panel')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }

    return NextResponse.next();
}
