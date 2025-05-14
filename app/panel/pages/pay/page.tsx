'use client';

import { useState } from "react";
import Swal from "sweetalert2";

const Pay = () => {
    const [mobile, setMobile] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState({ mobile: "", amount: "" });

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const numeric = raw.replace(/\D/g, ""); // فقط عدد نگه‌دار

        setMobile(numeric);

        // اعتبارسنجی ساده: اگر کاربر چیزی وارد کرده و فرمت غلط بود
        if (numeric && !/^09\d{9}$/.test(numeric)) {
            setErrors((prev) => ({
                ...prev,
                mobile: "شماره موبایل معتبر نیست. باید با 09 شروع شود و 11 رقم باشد.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, mobile: "" }));
        }
    };


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const numeric = raw.replace(/\D/g, ""); // حذف تمام حروف غیراعداد
        setAmount(numeric);
        setErrors((prev) => ({ ...prev, amount: "" }));
    };

    const makePaymentLink = () => {
        Swal.fire('موفق!','لینک پرداخت با موفقیت ارسال شد','success');
    }



    return (
        <main className="flex-grow p-4 font-vazir flex items-center">
            <div className="space-y-4 mx-auto justify-center px-6 py-10 sm:p-10 rounded-3xl shadow-2xl bg-white w-full max-w-2xl">
                <div className="text-center pb-5 font-vazir-bold text-xl">پرداخت</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center mt-5">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0 whitespace-nowrap">
                        نام و نام خانوادگی مشتری:
                    </label>
                    <input
                        className="bg-slate-400 text-white focus:outline-none p-2 text-sm rounded-lg sm:w-[400px] w-full shadow-lg ml-auto"
                        type="text"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0">شماره موبایل:</label>
                    <div className="w-full sm:w-[400px] ml-auto">
                        <input
                            type="tel"
                            value={mobile}
                            onChange={handleMobileChange}
                            className="bg-slate-400 text-white focus:outline-none p-2 text-sm rounded-lg w-full shadow-lg ml-auto"
                            maxLength={11}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0">مبلغ:</label>
                    <div className="w-full sm:w-[400px] ml-auto">
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            className="bg-slate-400 text-white focus:outline-none p-2 text-sm rounded-lg w-full shadow-lg"
                        />
                        {errors.amount && (
                            <div className="text-red-600 text-xs mt-1 text-right">{errors.amount}</div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0">توضیحات:</label>
                    <input
                        className="bg-slate-400 text-white focus:outline-none p-2 text-sm rounded-lg sm:w-[400px] w-full shadow-lg ml-auto"
                        type="text"
                    />
                </div>

                <div className="mt-7 flex justify-end">
                    <button onClick={()=>makePaymentLink()} className="font-vazir-medium bg-[#18bb0d] hover:bg-green-600 text-white rounded-lg p-2 pr-10 pl-10 shadow-md">
                        ثبت
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Pay;
