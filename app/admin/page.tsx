"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import formatNumber from "./functions/formatNumber";

const data = [
    { name: 'کل پرداخت ها', value: 5000000000, color: '#1E3A8A' }, // آبی تیره
    { name: 'پرداخت های تایید شده', value: 4000000000, color: '#3B82F6' }, // سرمه‌ای مایل به خاکستری
    { name: 'پرداخت های تایید نشده', value: 1000000000, color: '#64748B' }, // سرمه‌ای خیلی تیره
];

const total = data.reduce((acc, curr) => acc + curr.value, 0);

const COLORS = ["#1E3A8A", "#3B82F6", "#64748B"];

const Dashboard = () => {
    return (
        <>
            <main className="flex-grow p-10 font-vazir-bold flex justify-center items-center hidden md:block">
                <div className="p-10 rounded-3xl shadow-2xl bg-white w-full grid grid-cols-12">
                    <div className="relative w-[400px] h-[400px] col-span-12 md:col-span-4">
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-xs text-gray-800 space-y-3">
                            {data.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                    <div className="text-center leading-tight">
                                        <div className="font-bold">{item.name}</div>
                                        <div>{formatNumber(item.value)} ریال</div>
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
                    <div className="col-span-12 md:col-span-3 flex items-center">
                        <div className="w-full">
                            <ul className="w-full md:w-full">
                                {data.map((entry, index) => {
                                    const percentage = ((entry.value / total) * 100).toFixed(1);
                                    return (
                                        <li key={`item-${index}`} className="flex items-center justify-start mb-4">
                                            <div
                                                className="w-4 h-4 rounded-sm ml-2"
                                                style={{ backgroundColor: entry.color }}
                                            ></div>
                                            <span className="text-xs font-vazir-bold text-gray-800 text-nowrap">{entry.name}:</span>
                                            <span className="text-xs font-vazir-bold text-gray-600 ml-2">
                                                ({percentage}%)
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-5 flex items-center">
                        <div className="w-full">
                            <div className="text-center">تراکنش های اخیر</div>
                            <div className="mt-4">
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09370965131</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">حانیه رضوانی</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09125547799</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(360000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">تایید شده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09370965131</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">حانیه رضوانی</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09125547799</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(360000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">تایید شده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09370965131</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">حانیه رضوانی</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09125547799</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(360000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">تایید شده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09370965131</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">حانیه رضوانی</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09125547799</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(360000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">تایید شده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09370965131</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-bold">نام: </span><span className="font-vazir-medium">حانیه رضوانی</span></div>
                                        <div className="w-30"><span>موبایل: </span><span className="font-vazir-medium">09125547799</span></div>
                                        <div className="w-30"><span>مبلغ: </span><span className="font-vazir-medium">{formatNumber(360000)}</span></div>
                                        <div className="w-30"><span>وضعیت: </span><span className="font-vazir-medium">تایید شده</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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
                                        <div>{formatNumber(item.value)} ریال</div>
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
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-5 flex items-center mt-10">
                        <div className="w-full">
                            <div className="text-center">تراکنش های اخیر</div>
                            <div className="mt-4">
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-blue-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <div className="bg-amber-400 flex justify-between p-3 pt-1 pb-1 rounded-lg text-xs">
                                        <div className="w-30"><span className="font-vazir-medium">هومن فلاح</span></div>
                                        <div className="w-30" style={{ marginTop: "2px" }}><span className="font-vazir-medium">{formatNumber(250000)}</span></div>
                                        <div className="w-30"><span className="font-vazir-medium">پرداخت نشده</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
