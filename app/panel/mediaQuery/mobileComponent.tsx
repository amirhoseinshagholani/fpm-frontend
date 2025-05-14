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
    consumer_mobile: string;
    consumer_name: string;
    amount: number;
    status: number;
    created_at: string;
}

const MobileComponent: React.FC<Props> = ({ totalAmountInvoices, totalAmountPayments }) => {
    const accounting_code = Cookies.get('fpmUsername')?.slice(0, 7);

    const safeTotalInvoices = Number(totalAmountInvoices) || 0;
    const safeTotalPayments = Number(totalAmountPayments) || 0;
    const diff = safeTotalInvoices - safeTotalPayments;

    const data = [
        { name: 'کل سفارشات', value: safeTotalInvoices, color: '#1E3A8A' },
        { name: 'بدهی', value: diff > 0 ? diff : 0, color: '#3B82F6' },
        { name: 'بستانکاری', value: diff < 0 ? Math.abs(diff) : 0, color: '#64748B' },
    ];


    const total = data.reduce((acc, curr) => acc + (curr.value as number), 0);


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
            <main className="flex-grow p-10 pt-5 font-vazir-bold flex justify-center items-center block md:hidden">
                <div className="p-10 rounded-3xl shadow-2xl bg-white w-full grid grid-cols-12">
                    <div className="relative w-full h-[240px] md:w-[400px] md:h-[400px] col-span-12 md:col-span-4 mx-auto">
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-[10px] md:text-xs text-gray-800 space-y-2">
                            {data.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-1 md:space-x-2">
                                    <div
                                        className="w-2 h-2 md:w-3 md:h-3 rounded-sm"
                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                    <div className="text-center leading-tight">
                                        <div className="font-bold">{item.name}</div>
                                        <div>{formatNumber(item.value as number)} ریال</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <PieChart width={220} height={220} className="mx-auto">
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={100}
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
                            <ul className="w-full md:w-1/2">
                                {data.map((entry, index) => {
                                    const percentage = ((entry.value as number / total) * 100).toFixed(1);
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
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-5 flex items-center mt-10">
                        <div className="w-full">
                            <div className="text-center">تراکنش های اخیر</div>
                            <div className="mt-4">

                                {payments.slice(0, 10).map((payment, index) => (
                                    <div key={index} className="mt-1">
                                        <div className={`${index % 2 === 0 ? 'bg-blue-400' : 'bg-amber-400'} flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs`}>
                                            <div className="w-30"><span className="font-vazir-medium">{payment.consumer_name}</span></div>
                                            <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(payment.amount)}</span></div>
                                            <div className="w-36">
                                                <span className="font-vazir-medium text-nowrap">
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
                                        <div className="w-30"><span className="font-vazir-medium"></span></div>
                                        <div className="w-48 text-nowrap" style={{ marginTop: "2px" }}>جمع کل: <span className="font-vazir-medium">{formatNumber(totalAmountPayments)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium"></span></div>
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

export default MobileComponent;