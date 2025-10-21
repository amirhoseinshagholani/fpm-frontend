'use client';

import MenuSvg from '@/public/svg/menuSvg';
import styles from '@/styles/Header.module.css';

import { useState } from 'react';

const Header = () => {
    const [active, setActive] = useState(false);

    const tooglestatus =()=>{
        if(active){
            setActive(false)
        }else{
            setActive(true);
        }
    }

    return (
        <>
            <header className={`font-vazir-bold text-black bg-yellow-400 rounded-b-2xl hidden md:block ${styles.header} ${styles.active}`}>
                <ul className={styles.nav}>
                    <li className={styles.loud}>
                        <a href="/panel/panel">داشبورد</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/panel/pages/pay">لینک ساز</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/panel/pages/payments">مشاهده پرداختی ها</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/panel/pages/invoices">سفارشات</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/auth/login">خروج</a>
                    </li>
                </ul>
            </header>

            <header className={`font-vazir-bold text-black bg-yellow-400 rounded-b-2xl block md:hidden ${styles.header} ${active ? styles.active : ''}`}>
                <ul className={`${styles.nav}`}>
                    <li className={styles.loud}>
                        <a href="/panel/panel/panel">داشبورد</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/panel/pages/pay">پرداخت</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/panel/pages/payments">مشاهده پرداختی ها</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/panel/pages/orders">سفارشات</a>
                    </li>
                    <li className={styles.loud}>
                        <a href="/panel/auth/login">خروج</a>
                    </li>
                </ul>
                <div onClick={()=>tooglestatus()} className='flex'>
                    <span className='mx-auto text-lg p-5 pb-2'><MenuSvg/></span>
                </div>
            </header>
        </>
    );
}

export default Header;