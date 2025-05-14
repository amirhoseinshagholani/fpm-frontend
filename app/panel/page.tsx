"use client";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";
// import formatNumber from "./functions/formatNumber";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { httpService } from '../functions/httpService';
import Swal from 'sweetalert2';

const DesktopComponent = dynamic(() => import('./mediaQuery/desktopComponent'), { ssr: false });
const MobileComponent = dynamic(() => import("./mediaQuery/mobileComponent"), { ssr: false });

const Dashboard = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [totalAmountInvoices, setTotalAmountInvoices] = useState<number>(0);
    const [totalAmountPayments, setTotalAmountPayments] = useState<number>(0);

    const accounting_code = Cookies.get('fpmUsername')?.slice(0, 7);

    const getAmoutInvoices = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.post('/invoices/getCustomersInvoicesTotalAmount', {
                accounting_code: accounting_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(accounting_code);

            setTotalAmountInvoices(response.data['data'][0].total_amounts_invoices);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات فاکتورها با مشکل مواجه شد", "error");
        }
    };

    const getAmoutInvoicesPayment = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.post('/payments/getCustomersInvoicesTotalPayment', {
                accounting_code: accounting_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data['data'][0].total_payments);

            setTotalAmountPayments(response.data['data'][0].total_payments);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات پرداخت ها با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getAmoutInvoices();
        getAmoutInvoicesPayment();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {isMobile ?
                <MobileComponent totalAmountInvoices={totalAmountInvoices || 0} totalAmountPayments={totalAmountPayments || 0} />
                :
                <DesktopComponent totalAmountInvoices={totalAmountInvoices || 0} totalAmountPayments={totalAmountPayments || 0} />
            }
        </>
    );
};

export default Dashboard;
