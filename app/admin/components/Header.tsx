'use client';

import MenuSvg from '@/public/svg/menuSvg';
import styles from '@/styles/Header.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Header = () => {
    const [active, setActive] = useState(false);
    const router = useRouter();

    const tooglestatus = () => {
        setActive(prev => !prev);
    };

    const logout = () => {
        Cookies.remove('fpmToken');
        router.push('/auth/login');
    };

    return (
        <>
            {/* دسکتاپ */}
            <header className={`font-vazir-bold text-black bg-blue-400 rounded-b-2xl hidden md:block ${styles.header} ${styles.active}`}>
                <ul className={styles.nav}>
                    <li className={styles.loud}><a href="/admin">داشبورد</a></li>
                    <li className={styles.loud}><a href="/admin/pages/roles">نقش ها</a></li>
                    <li className={styles.loud}><a href="/admin/pages/users">کاربران</a></li>
                    <li className={styles.loud}><a href="/admin/pages/customers">مشتریان</a></li>
                    <li className={styles.loud}><a href="/admin/pages/products">محصولات</a></li>
                    <li className={styles.loud}><a href="/admin/pages/payments">پرداخت ها</a></li>
                    <li className={styles.loud}><a href="/admin/pages/invoices">سفارشات</a></li>
                    <li className={styles.loud}><a href="#" onClick={logout}>خروج</a></li>
                </ul>
            </header>

            {/* موبایل */}
            <header className={`font-vazir-bold text-black bg-blue-400 rounded-b-2xl block md:hidden ${styles.header} ${active ? styles.active : ''}`}>
                <ul className={`${styles.nav}`}>
                <li className={styles.loud}><a href="/admin">داشبورد</a></li>
                    <li className={styles.loud}><a href="/admin/pages/roles">نقش ها</a></li>
                    <li className={styles.loud}><a href="/admin/pages/users">کاربران</a></li>
                    <li className={styles.loud}><a href="/admin/pages/customers">مشتریان</a></li>
                    <li className={styles.loud}><a href="/admin/pages/products">محصولات</a></li>
                    <li className={styles.loud}><a href="/admin/pages/payments">پرداخت ها</a></li>
                    <li className={styles.loud}><a href="/admin/pages/invoices">سفارشات</a></li>
                    <li className={styles.loud}><a href="#" onClick={logout}>خروج</a></li>
                </ul>
                <div onClick={tooglestatus} className="flex">
                    <span className="mx-auto text-lg p-5 pb-2"><MenuSvg /></span>
                </div>
            </header>
        </>
    );
};

export default Header;
