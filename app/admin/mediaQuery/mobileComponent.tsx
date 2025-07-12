"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import formatNumber from "../functions/formatNumber";
import React, { useEffect, useState } from "react";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

const COLORS = ["#1E3A8A", "#3B82F6", "#64748B"];

interface Props {
    totalAmountInvoices: number;
    totalAmountPayments: number;
}

interface Payment {
    consumer_mobile: string;
    consumer_name: string;
    amount: number;
    status: number;
    created_at: string;
}

const MobileComponent = () => {
    const [totalInvoices, setTotalInvoices] = useState<number>(0);
    const [totalPayments, setTotalPayments] = useState<number>(0);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [countInvoices, setCountInvoices] = useState<number>(0);
    const [countCustomer, setCountCustomer] = useState<number>(0);
    const [countPayments, setCountPayments] = useState<number>(0);
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
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد", "error");
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
            Swal.fire("خطا", "دریافت اطلاعات پرداختی ها با مشکل مواجه شد", "error");
        }
    };

    const getCountInvoices = async () => {
        try {
            const response = await httpService.get('/invoices/getCountInvoices', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCountInvoices(response.data["data"][0].countInvoices);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد", "error");
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
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد", "error");
        }
    };

    const getCountPayments = async () => {
        try {
            const response = await httpService.get('/payments/getCountPayments', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCountPayments(response.data["data"][0].countPayments);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getTotalInvoices();
        getTotalPayments();
        getPayments();
        getCountInvoices();
        getCountCustomer();
        getCountPayments();
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

    return (
        <>
            <main className="flex-grow px-4 py-6 font-vazir-bold flex justify-center items-center h-full">
                <div className="p-4 md:p-10 rounded-2xl shadow-xl bg-white w-full h-full flex flex-col md:grid md:grid-cols-12 gap-6">

                    {/* Pie Chart */}
                    <div className="relative w-full max-w-[220px] h-[220px] self-center md:max-w-[400px] md:h-[400px] md:col-span-4">
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-xs text-gray-800 space-y-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#1E3A8A" }} />
                                <div className="text-center leading-tight">
                                    <div className="font-bold">مانده کل</div>
                                    <div>{formatNumber(remainingPercent)}%</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#3B82F6" }} />
                                <div className="text-center leading-tight">
                                    <div className="font-bold">پرداخت شده تاکنون</div>
                                    <div>{formatNumber(paidPercent)}%</div>
                                </div>
                            </div>
                        </div>

                        <PieChart width={220} height={200}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
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

                    {/* Totals and Legends */}
                    <div className="md:col-span-3">
                        <ul className="w-full space-y-3">
                            <li className="flex flex-wrap items-center justify-start font-bold bg-gray-200 p-3 rounded-xl gap-2">
                                <span className="text-base text-gray-800">کل سفارشات:</span>
                                <span className="text-base text-black">{formatNumber(safeTotalInvoices)}</span>
                                <span className="text-sm">ریال</span>
                            </li>
                            {data.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-sm text-gray-800">{item.name}:</span>
                                    <span className="text-sm text-gray-600">{formatNumber(item.value)} ریال</span>
                                </li>
                            ))}
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-red-500" />
                                <span className="text-sm text-gray-800">تعداد سفارشات:</span>
                                <span className="text-sm text-gray-600">{formatNumber(countInvoices)}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-green-600" />
                                <span className="text-sm text-gray-800">تعداد مشتریان:</span>
                                <span className="text-sm text-gray-600">{formatNumber(countCustomer)}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-pink-600" />
                                <span className="text-sm text-gray-800">تعداد تراکنش ها:</span>
                                <span className="text-sm text-gray-600">{formatNumber(countPayments)}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Recent Transactions */}
                    <div className="md:col-span-5 mt-2">
                        <div className="text-center mb-2">تراکنش‌های اخیر</div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {payments.slice(0, 10).map((payment, index) =>
                                payment.status === 2 ? (
                                    <div key={index} className="mt-1">
                                        <div className={`${index % 2 === 0 ? 'bg-blue-400' : 'bg-amber-400'} flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs`}>
                                            <div className="w-30"><span className="font-vazir-medium">{payment.consumer_name}</span></div>
                                            <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(payment.amount)}</span></div>
                                            <div className="w-36">
                                                <span className="font-vazir-medium text-nowrap">
                                                    {
                                                        "تایید شده"
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}

export default MobileComponent;