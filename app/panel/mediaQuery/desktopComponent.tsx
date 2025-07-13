"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import formatNumber from "./../functions/formatNumber";
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
    tracking_code:string,
    consumer_mobile: string;
    consumer_name: string;
    amount: number;
    status: number;
    created_at: string;
}

const DesktopComponent: React.FC<Props> = ({ totalAmountInvoices, totalAmountPayments }) => {
    const accounting_code = Cookies.get('fpmUsername')?.slice(0, 7);

    const safeTotalInvoices = Number(totalAmountInvoices) || 0;
    const safeTotalPayments = Number(totalAmountPayments) || 0;
    const diff = safeTotalInvoices - safeTotalPayments;

    const remaining = Math.max(safeTotalInvoices - safeTotalPayments, 0);
    const data = [
        { name: 'جمع مانده', value: remaining, color: '#3B82F6' },
        { name: 'جمع پرداختی ها', value: safeTotalPayments, color: '#64748B' }
    ];

    // const total = data.reduce((acc, curr) => acc + (curr.value as number), 0);
    let paidPercent: number = 0;
    let remainingPercent: number = 0;

    if (safeTotalInvoices > 0) {
        paidPercent = parseFloat(((totalAmountPayments / safeTotalInvoices) * 100).toFixed(1));
        remainingPercent = parseFloat((100 - paidPercent).toFixed(1));
    }



    const [payments, setPayments] = useState<Payment[]>([]);

    const getPayments = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.post('/payments/getCustomersInvoicesPayment', {
                accounting_code: accounting_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPayments(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات پرداختی ها با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getPayments();
    }, [])

    return (
        <>
            <main className="flex-grow p-10 font-vazir-bold flex justify-center items-center">
                <div className="p-10 rounded-3xl shadow-2xl bg-white w-full grid grid-cols-12 h-full">
                    <div className="sm:col-span-12 md:col-span-12 lg:col-span-3 xl:col-span-3 2xl:col-span-3 relative w-[400px] h-[400px] md:mx-auto h-full flex items-center">
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-xs text-gray-800 space-y-3">
                            {/* <div className="text-center leading-tight">
                                <div className="font-bold">کل سفارشات</div>
                                <div>{formatNumber(safeTotalInvoices as number)} ریال</div>
                            </div> */}
                            {data.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                    <div className="text-center leading-tight">
                                        <div className="font-bold">{item.name}</div>
                                        <div>{formatNumber(item.value as number)} ریال</div>
                                    </div>
                                </div>
                            ))}
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
                    <div className="sm:col-span-12 md:col-span-12 lg:col-span-9 xl:col-span-3 2xl:col-span-3 md:mt-5 flex items-center">
                        <div className="mx-auto">
                            <ul className="w-full md:w-1/2">
                                <li className="flex items-center justify-start mb-8 font-bold">
                                    <span className="text-lg font-vazir-bold text-gray-800 text-nowrap">کل سفارشات:</span>
                                    <span className="text-lg font-vazir-bold text-gray-600 ml-2">
                                        {formatNumber(safeTotalInvoices)}
                                    </span>
                                    <span>ریال</span>
                                </li>
                                <li className="flex items-center justify-start mb-3">
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
                                    <span className="text-sm font-vazir-bold text-gray-800 text-nowrap">پرداختی ها:</span>
                                    <span className="text-sm font-vazir-bold text-gray-600 ml-2">
                                        ({paidPercent}%)
                                    </span>
                                </li>

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
                    <div className="sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-6 md:mt-5 flex items-center">
                        <div className="w-full">
                            <div className="text-center">تراکنش های اخیر</div>
                            <div className="mt-4">

                                {payments.slice(0, 10).map((payment, index) => (
                                    <div key={index} className="mt-1">
                                        <div className={`${index % 2 === 0 ? 'bg-blue-400' : 'bg-amber-400'} flex justify-between gap-3 p-3 pt-1 pb-1 rounded-lg text-xs`}>
                                            <div className="w-30 flex">
                                                <span className="font-vazir-bold hidden lg:block">نام: </span>
                                                <span className="font-vazir-medium text-nowrap">{payment.consumer_name}</span>
                                            </div>
                                            <div className="w-30 flex">
                                                <span className="font-vazir-bold hidden lg:block">موبایل: </span>
                                                <span className="font-vazir-medium">{payment.consumer_mobile}</span>
                                            </div>
                                            <div className="w-20 flex">
                                                <span className="font-vazir-bold">مبلغ: </span>
                                                <span className="font-vazir-medium">{formatNumber(payment.amount)}</span>
                                            </div>
                                            <div className="w-40 block">
                                                <span className="font-vazir-bold hidden md:block">کدپیگیری: </span>
                                                <span className="font-vazir-medium hidden md:block">{payment.tracking_code}</span>
                                            </div>
                                            <div className="w-30 text-nowrap">
                                                {/* <span>وضعیت: </span> */}
                                                <span className="font-vazir-medium">
                                                    {
                                                        payment.status === 0 ? "در انتظار پرداخت" :
                                                            payment.status === 1 ? "پرداخت شده، در انتظار تأیید" :
                                                                payment.status === 2 ? "تایید شده" :
                                                                    payment.status === 3 ? "رد شده" : "نامشخص"
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-1">
                                    <div className="flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold"></span><span className="font-vazir-medium"></span></div>
                                        <div className="w-30"><span></span><span className="font-vazir-medium"></span></div>
                                        {/* <div className="w-30"><span>جمع کل: </span><span className="font-vazir-medium">{formatNumber(totalAmountPayments)}</span></div> */}
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

export default DesktopComponent;