'use client';

import { useState } from "react";
import Swal from "sweetalert2";
import formatNumber from "../../functions/formatNumber";
import Cookies from 'js-cookie';
import { httpService } from "@/app/functions/httpService";
import { Description } from "@mui/icons-material";
import { removeFormatNumber } from "../../functions/removeFormatNumber";

const Pay = () => {
    const [consumerName, setConsumerName] = useState("");
    const [mobile, setMobile] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const username = Cookies.get('fpmUsername');
    const accounting_code = Cookies.get('fpmUsername')?.slice(0, 7);
    const token = Cookies.get('fpmToken');

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
        const numericSep = formatNumber(parseInt(numeric));
        setAmount(numericSep);
        setErrors((prev) => ({ ...prev, amount: "" }));
    };

    function generateRandomToken(length = 20) {
        let token = '';
        for (let i = 0; i < length; i++) {
            token += Math.floor(Math.random() * 10); // عدد تصادفی 0-9
        }
        return token;
    }

    const generateLink = async () => {
        if (!consumerName || !mobile || !amount) {
            alert("لطفاً تمام فیلدها را تکمیل کنید");
            return;
        }

        const tracking_code = generateRandomToken();
        const params = new URLSearchParams({
            consumerName,
            mobile,
            amount,
            description,
            tracking_code
        });

        const link = `https://shop.nekatel.com/fpm?${params.toString()}`;
        // const link = `testii`;
        console.log(link);

        try {
            const response = await httpService.post('/pay/sendLink', {
                accounting_code: accounting_code,
                username: username,
                link: link,
                name: consumerName,
                mobile: mobile,
                amount: parseInt(removeFormatNumber(amount)),
                description: description,
                tracking_code: tracking_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("موفق", "ارسال لینک با موفقیت انجام شد", "success");
            setConsumerName("");
            setMobile("");
            setAmount("");
            setDescription("");
        } catch (err) {
            console.log(err);
            Swal.fire("خطا", "مشکلی پیش آمده است، لطفا با پشتیبانی تماس بگیرید", "error");
        }

    };




    return (
        <main className="flex-grow p-4 font-vazir flex items-center">
            <div className="space-y-4 mx-auto justify-center px-6 py-10 sm:p-10 rounded-3xl shadow-2xl bg-white w-full max-w-2xl">
                <div className="text-center pb-5 font-vazir-bold text-xl">لینک ساز</div>

                {/* <form> */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center mt-5">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0 whitespace-nowrap">
                        نام و نام خانوادگی مشتری:
                    </label>
                    <input
                        type="text"
                        name="consumerName"
                        value={consumerName}
                        onChange={(e) => setConsumerName(e.target.value)}
                        className="bg-slate-400 text-white focus:outline-none p-2 text-sm rounded-lg sm:w-[400px] w-full shadow-lg ml-auto"

                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0">شماره موبایل:</label>
                    <div className="w-full sm:w-[400px] ml-auto">
                        <input
                            type="tel"
                            name="mobile"
                            value={mobile}
                            onChange={handleMobileChange}
                            className="bg-slate-400 text-white text-right focus:outline-none p-2 text-sm rounded-lg w-full shadow-lg ml-auto"
                            maxLength={11}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <label className="sm:w-52 w-full text-right sm:pr-2 mb-1 sm:mb-0">مبلغ(ریال):</label>
                    <div className="w-full sm:w-[400px] ml-auto">
                        <input
                            type="text"
                            name="amount"
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
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mt-7 flex justify-end">
                    <button onClick={generateLink} className="font-vazir-medium bg-[#18bb0d] hover:bg-green-600 text-white rounded-lg p-2 pr-10 pl-10 shadow-md">
                        ثبت
                    </button>
                </div>
                {/* </form> */}
            </div>
        </main>
    );
};

export default Pay;
