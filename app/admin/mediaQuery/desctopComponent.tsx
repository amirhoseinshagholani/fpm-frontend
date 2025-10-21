"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import formatNumber from "../functions/formatNumber";
import React, { useEffect, useState } from "react";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

const COLORS = ["#1E3A8A", "#3B82F6", "#64748B"];

// interface Props {
//     totalAmountInvoices: number;
//     totalAmountPayments: number;
// }

interface Payment {
    tracking_code: string;
    customer_title: string;
    consumer_mobile: string;
    consumer_name: string;
    amount: number;
    status: number;
    created_at: string;
}

interface Invoice {
    invoice_number: string;
    invoice_date: string;
    customer_accounting_code: string;
    customer_title: string;
    status: string;
}

const DesktopComponent = () => {
    const [totalInvoices, setTotalInvoices] = useState<number>(0);
    const [totalPayments, setTotalPayments] = useState<number>(0);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [countInvoices, setCountInvoices] = useState<number>(0);
    const [countCustomer, setCountCustomer] = useState<number>(0);
    const [countPayments, setCountPayments] = useState<number>(0);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const token = Cookies.get('fpmToken');
    const getTotalInvoices = async () => {
        try {
            const response = await httpService.get('/invoices/getInvoicesTotalAmount', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalInvoices(response.data["data"][0].total_amounts_invoices);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد", "error");
        }
    };
    const getTotalPayments = async () => {
        try {
            const response = await httpService.get('/payments/getInvoicesTotalPayment', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalPayments(response.data["data"][0].total_payments);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد" + err, "error");
        }
    };

    const getInvoices = async () => {
        try {
            const response = await httpService.get('/invoices/getAllInvoices', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInvoices(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات فاکتورها با مشکل مواجه شد" + err, "error");
        }
    };

    const getPayments = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.post('/payments/getCustomersInvoicesPayment', {
                accounting_code: "00"
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log(response.data['data']);

            setPayments(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات پرداختی ها با مشکل مواجه شد"+err, "error");
        }
    };

    const getCountInvoices = async () => {
        try {
            const response = await httpService.get('/invoices/getCountInvoices', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCountInvoices(response.data["data"][0].countInvoices);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد"+err, "error");
        }
    };

    const getCountCustomer = async () => {
        try {
            const response = await httpService.get('/customers/getCountCustomers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log(response.data["data"][0].countCustomers);

            setCountCustomer(response.data["data"][0].countCustomers);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد"+err, "error");
        }
    };

    const getCountPayments = async () => {
        try {
            const response = await httpService.get('/payments/getCountPayments', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCountPayments(response.data["data"][0].countPayments);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد"+err, "error");
        }
    };

    useEffect(() => {
        getTotalInvoices();
        getTotalPayments();
        getPayments();
        getCountInvoices();
        getCountCustomer();
        getCountPayments();
        getInvoices();
    }, [])

    const safeTotalInvoices = Number(totalInvoices) || 0;
    const safeTotalPayments = Number(totalPayments) || 0;

    const remaining = Math.max(safeTotalInvoices - safeTotalPayments, 0);
    const data = [
        { name: 'جمع مانده', value: remaining, color: '#1E3A8A' },
        { name: 'جمع پرداختی پرداختی ها', value: safeTotalPayments, color: '#3B82F6' }
    ];

    // const total = data.reduce((acc, curr) => acc + (curr.value as number), 0);
    let paidPercent: number = 0;
    let remainingPercent: number = 0;

    if (safeTotalInvoices > 0) {
        paidPercent = parseFloat(((totalPayments / totalInvoices) * 100).toFixed(1));
        remainingPercent = parseFloat((100 - paidPercent).toFixed(1));
    }
    const filteredPayments = payments.filter(p => p.status === 2).slice(0, 10);
    const filteredInvoices = invoices.filter(invoice => invoice.status === 'تائید شده').slice(0, 10);

    return (
        <>
            <main className="flex-grow p-10 font-vazir-bold flex justify-center items-center h-full">
                <div className="p-10 rounded-3xl shadow-2xl bg-white w-full h-full grid grid-cols-12">

                    <div className="sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 2xl:col-span-3 relative w-[400px] h-[400px] flex items-center h-full">
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-xs text-gray-800 space-y-3">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: "#1E3A8A" }}
                                />
                                <div className="text-center leading-tight">
                                    <div className="font-bold">مانده کل</div>
                                    <div>{formatNumber(remainingPercent as number)} %</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: "#3B82F6" }}
                                />
                                <div className="text-center leading-tight">
                                    <div className="font-bold">پرداخت شده تاکنون</div>
                                    <div>{formatNumber(paidPercent as number)} %</div>
                                </div>
                            </div>
                        </div>
                        <PieChart id="myPie" width={400} height={400}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={125}
                                outerRadius={180}
                                paddingAngle={2}
                                dataKey="value"
                                isAnimationActive={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${formatNumber(value)} ریال`} />
                        </PieChart>
                    </div>
                    <div className="sm:col-span-12 md:col-span-12 lg:col-span-6 xl:col-span-6 2xl:col-span-3 2xl:mx-auto flex items-center">
                        <div className="w-full">
                            <ul className="w-full md:w-fit">
                                <li className="flex items-center justify-start mb-8 font-bold bg-gray-200 p-3 rounded-xl gap-1">
                                    <span className="text-lg font-vazir-bold text-gray-800 text-nowrap">کل سفارشات:</span>
                                    <span className="text-lg font-vazir-bold text-black">
                                        {formatNumber(safeTotalInvoices)}
                                    </span>
                                    <span>ریال</span>
                                </li>
                                {data.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-start mb-3 gap-1">
                                        <div
                                            className="w-4 h-4 rounded-sm"
                                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                        ></div>
                                        <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">{item.name}: </span>
                                        <span className="text-sm font-vazir-bold text-gray-600 ml-2 text-nowrap">
                                            {formatNumber(item.value as number)} ریال
                                        </span>
                                    </li>
                                ))}
                                <li className="flex items-center justify-start mb-3 gap-1">
                                    <div
                                        className="w-4 h-4 rounded-sm "
                                        style={{ backgroundColor: "#ff0000" }}
                                    ></div>
                                    <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">تعداد کل سفارشات: </span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2 text-nowrap">
                                        {formatNumber(countInvoices as number)}
                                    </span>
                                </li>
                                <li className="flex items-center justify-start mb-3 gap-1">
                                    <div
                                        className="w-4 h-4 rounded-sm"
                                        style={{ backgroundColor: "#20b833" }}
                                    ></div>
                                    <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">تعداد کل مشتریان: </span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2 text-nowrap">
                                        {formatNumber(countCustomer as number)}
                                    </span>
                                </li>
                                <li className="flex items-center justify-start mb-3 gap-1">
                                    <div
                                        className="w-4 h-4 rounded-sm"
                                        style={{ backgroundColor: "#ca24b5" }}
                                    ></div>
                                    <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">تعداد کل تراکنش ها: </span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2 text-nowrap">
                                        {formatNumber(countPayments as number)}
                                    </span>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div className="sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-6 flex items-center">
                        <div className="w-full">
                            <div className="text-center">تراکنش های اخیر</div>
                            <div className="mt-4 h-48 overflow-auto">

                                {filteredPayments.slice(0, 10).map((payment, index) => {
                                    if (payment.status == 2) {
                                        return (
                                            <div key={index} className="mt-1">
                                                <div className={`${index % 2 === 0 ? 'bg-blue-400' : 'bg-amber-400'} flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs`}>
                                                    <div className="w-30">
                                                        <span className="font-vazir-medium">{payment.customer_title}</span>
                                                    </div>
                                                    <div className="w-30">
                                                        <span className="font-vazir-bold">نام: </span>
                                                        <span className="font-vazir-medium">{payment.consumer_name}</span>
                                                    </div>
                                                    {/* <div className="w-30">
                                                        <span className="font-vazir-bold">کدپیگیری: </span>
                                                        <span className="font-vazir-medium">{payment.tracking_code}</span>
                                                    </div> */}
                                                    <div className="w-30">
                                                        <span>موبایل: </span>
                                                        <span className="font-vazir-medium">{payment.consumer_mobile}</span>
                                                    </div>
                                                    <div className="w-30">
                                                        <span>مبلغ: </span>
                                                        <span className="font-vazir-medium">{formatNumber(payment.amount)}</span>
                                                    </div>
                                                    <div className="w-36 text-nowrap">
                                                        <span>وضعیت: </span>
                                                        <span className="font-vazir-medium">
                                                            تایید شده
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                                )}

                                <div className="mt-2">
                                    <div className="flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold"></span><span className="font-vazir-medium"></span></div>
                                        <div className="w-30"><span></span><span className="font-vazir-medium"></span></div>
                                        <div className="w-36"><span></span><span className="font-vazir-medium"></span></div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 flex items-center mt-5 hidden xl:block">
                        <div className="w-full">
                            <div className="text-center">سفارشات اخیر</div>
                            <div className="mt-2 h-40 overflow-auto">

                                {filteredInvoices.slice(0, 10).map((invoice, index) => {
                                    return (
                                        <div key={index} className="mt-1">
                                            <div className={`${index % 2 === 0 ? 'bg-blue-300' : 'bg-amber-300'} flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs`}>
                                                <div className="w-40">
                                                    <span className="font-vazir-bold">شماره فاکتور: </span>
                                                    <span className="font-vazir-medium">{invoice.invoice_number}</span>
                                                </div>
                                                <div className="w-40">
                                                    <span className="font-vazir-bold">کد حسابداری مشتری: </span>
                                                    <span className="font-vazir-medium">{invoice.customer_accounting_code}</span>
                                                </div>
                                                <div className="w-60 flex">
                                                    {/* <span className="text-nowrap">نام مشتری: </span> */}
                                                    <span className="font-vazir-medium text-nowrap">{invoice.customer_title}</span>
                                                </div>
                                                <div className="w-40">
                                                    <span>تاریخ: </span>
                                                    <span className="font-vazir-medium">{invoice.invoice_date}</span>
                                                </div>
                                                <div className="w-36 text-nowrap">
                                                    <span>وضعیت: </span>
                                                    <span className="font-vazir-medium">
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                )}

                                {/* <div className="mt-2">
                                    <div className="flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold"></span><span className="font-vazir-medium"></span></div>
                                        <div className="w-30"><span></span><span className="font-vazir-medium"></span></div>
                                        <div className="w-36"><span></span><span className="font-vazir-medium"></span></div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    )
}

export default DesktopComponent;