"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import formatNumber from "./functions/formatNumber";
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

const Dashboard = () => {
    const [totalInvoices, setTotalInvoices] = useState<number>(0);
    const [totalPayments, setTotalPayments] = useState<number>(0);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [countInvoices, setCountInvoices] = useState<number>(0);
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
            console.log(response.data["data"][0].countInvoices);
            
            setCountInvoices(response.data["data"][0].countInvoices);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getTotalInvoices();
        getTotalPayments();
        getPayments();
        getCountInvoices();
    }, [])

    const safeTotalInvoices = Number(totalInvoices) || 0;
    const safeTotalPayments = Number(totalPayments) || 0;

    const diff = safeTotalInvoices - safeTotalPayments;

    const remaining = Math.max(safeTotalInvoices - safeTotalPayments, 0);
    const data = [
        { name: 'جمع مانده', value: remaining, color: '#1E3A8A' },
        { name: 'جمع پرداختی ها', value: safeTotalPayments, color: '#3B82F6' }
    ];

    // const total = data.reduce((acc, curr) => acc + (curr.value as number), 0);
    let paidPercent: number = 0;
    let remainingPercent: number = 0;

    if (safeTotalInvoices > 0) {
        paidPercent = parseFloat(((totalPayments / totalInvoices) * 100).toFixed(1));
        remainingPercent = parseFloat((100 - paidPercent).toFixed(1));
    }





    // const getPayments = async () => {
    //     const token = Cookies.get('fpmToken');
    //     try {
    //         const response = await httpService.post('/payments/getCustomersInvoicesPayment', {
    //             accounting_code: accounting_code
    //         }, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         setPayments(response.data['data']);
    //     } catch (err) {
    //         Swal.fire("خطا", "دریافت اطلاعات پرداختی ها با مشکل مواجه شد", "error");
    //     }
    // };

    // useEffect(() => {
    //     getPayments();
    // }, [])

    return (
        <>
            <main className="flex-grow p-10 font-vazir-bold flex justify-center items-center hidden md:block">
                <div className="p-10 rounded-3xl shadow-2xl bg-white w-full grid grid-cols-12">
                    <div className="relative w-[400px] h-[400px] col-span-12 md:col-span-4">
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-xs text-gray-800 space-y-3">
                            {/* <div className="text-center leading-tight">
                                <div className="font-bold">کل سفارشات</div>
                                <div>{formatNumber(safeTotalInvoices as number)} ریال</div>
                            </div> */}
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
                            {/* {data.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                    <div className="text-center leading-tight">
                                        <div className="font-bold">مانده</div>
                                        <div>{formatNumber(remainingPercent as number)} %</div>
                                    </div>
                                </div>
                            ))} */}
                        </div>

                        <PieChart width={400} height={400}>
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
                    <div className="col-span-12 md:col-span-3 flex items-center">
                        <div className="w-full">
                            <ul className="w-full md:w-fit">
                                <li className="flex items-center justify-start mb-8 font-bold bg-gray-200 p-3 rounded-xl">
                                    <span className="text-lg font-vazir-bold text-gray-800 text-nowrap">کل سفارشات:</span>
                                    <span className="text-lg font-vazir-bold text-gray-600 ml-2">
                                        {formatNumber(safeTotalInvoices)}
                                    </span>
                                    <span>ریال</span>
                                </li>
                                {data.map((item, idx) => (
                                    <li className="flex items-center justify-start mb-3">
                                        <div
                                            className="w-4 h-4 rounded-sm ml-2"
                                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                        ></div>
                                        <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">{item.name}: </span>
                                        <span className="text-sm font-vazir-bold text-gray-600 ml-2 text-nowrap">
                                            {formatNumber(item.value as number)} ریال
                                        </span>
                                    </li>
                                ))}
                                <li className="flex items-center justify-start mb-3">
                                    <div
                                        className="w-4 h-4 rounded-sm ml-2"
                                        style={{ backgroundColor: "#ff0000" }}
                                    ></div>
                                    <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">تعداد کل سفارشات: </span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2 text-nowrap">
                                        {formatNumber(countInvoices as number)}
                                    </span>
                                </li>
                                {/* <li className="flex items-center justify-start mb-3">
                                    <div
                                        className="w-4 h-4 rounded-sm ml-2"
                                        style={{ backgroundColor: '#1E3A8A' }}
                                    ></div>
                                    <span className="text-sm font-vazir-bold text-gray-800">مانده:</span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2">
                                        ({remainingPercent}%)
                                    </span>
                                </li>
                                <li className="flex items-center justify-start mb-3">
                                    <div
                                        className="w-4 h-4 rounded-sm ml-2"
                                        style={{ backgroundColor: '#3B82F6' }}
                                    ></div>
                                    <span className="text-sm font-vazir-bold text-gray-800">پرداختی ها:</span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2">
                                        ({paidPercent}%)
                                    </span>
                                </li> */}

                                {/* {data.map((entry, index) => {
                                    const percentage = ((entry.value / total) * 100).toFixed(1);
                                    return (
                                        <li key={`item-${index}`} className="flex items-center justify-start mb-4">
                                            <div
                                                className="w-4 h-4 rounded-sm ml-2"
                                                style={{ backgroundColor: entry.color }}
                                            ></div>
                                            <span className="text-sm font-vazir-bold text-gray-800">{entry.name}:</span>
                                            <span className="text-sm font-vazir-bold text-gray-600 ml-2">
                                                ({percentage}%)
                                            </span>
                                        </li>
                                    );
                                })} */}

                            </ul>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-5 flex items-center">
                        <div className="w-full">
                            <div className="text-center">تراکنش های اخیر</div>
                            <div className="mt-4">

                                {payments.slice(0, 10).map((payment, index) => {
                                    if (payment.status == 2) {
                                        return (
                                            <div key={index} className="mt-1">
                                                <div className={`${index % 2 === 0 ? 'bg-blue-400' : 'bg-amber-400'} flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs`}>
                                                    <div className="w-30">
                                                        <span className="font-vazir-bold">نام: </span>
                                                        <span className="font-vazir-medium">{payment.consumer_name}</span>
                                                    </div>
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
                                        <div className="w-36 flex"><span className="text-nowrap">جمع کل: </span><span className="font-vazir-medium">{formatNumber(totalPayments)}</span></div>
                                        <div className="w-36"><span></span><span className="font-vazir-medium"></span></div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard;