'use client';

import { httpService } from "@/app/functions/httpService";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';

const Login = () => {
    const [isUser, setIsUser] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const login = async () => {
        if (username === "") {
            Swal.fire("خطا", "نام کاربری را وارد نمایید", "warning");
            return;
        }
        if (password === "") {
            Swal.fire("خطا", "رمزعبور را وارد نمایید", "warning");
            return;
        }

        const responseLogin = await httpService.post('/auth/login', {
            username,
            password,
            isUser
        });

        if (responseLogin.data.success) {
            Cookies.set('fpmToken', responseLogin.data.result, { expires: 1 });
            Cookies.set('fpmUsername', username, { expires: 1 });
            if (responseLogin.data.type === 'user') {
                redirect('/admin');
            } else {
                redirect('/panel');
            }
        } else {
            Swal.fire("خطا", responseLogin.data.message, "error");
        }
    };

    const openVideo = () => {
        setShowVideo(true);
        setTimeout(() => {
            videoRef.current?.play().catch(() => {
                console.log("Autoplay بلاک شد");
            });
        }, 200);
    };

    const closeVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setShowVideo(false);
    };

    useEffect(() => {
        if (showVideo && videoRef.current) {
            videoRef.current.play().catch(() => {
                console.log("Autoplay بلاک شد");
            });
        }
    }, [showVideo]);

    return (
        <>
            <div className="bg-white h-screen text-black">
                <div className="flex items-center h-full p-5 md:p-0">
                    <div className="mx-auto bg-slate-300 shadow-lg w-100 h-fit rounded-2xl p-10 items-center">
                        <div className="flex mt-5" id="logo">
                            <Image
                                className="mx-auto rounded-lg"
                                src="/panel/img/logo.webp"
                                alt="logo"
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className="mt-5 flex">
                            <div
                                className="mx-auto font-vazir-medium text-blue-500 text-sm cursor-pointer"
                                onClick={openVideo}
                            >
                                <div className="flex gap-2">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
                                        </svg>
                                    </span>
                                    <span>مشاهده آموزش کار با سیستم</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex">
                            <div className="mx-auto font-vazir-medium">
                                نام کاربری و رمز عبور خود را وارد کنید
                            </div>
                        </div>
                        <div className="mt-3 pt-0 p-5">
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                id="username"
                                value={username}
                                className="bg-white p-1 h-10 rounded-lg shadow-sm w-full focus:outline-none font-vazir-medium mt-2"
                                type="text"
                                placeholder="نام کاربری خود را وارد کنید"
                            />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                value={password}
                                className="bg-white p-1 h-10 rounded-lg shadow-sm w-full focus:outline-none font-vazir-medium mt-2"
                                type="password"
                                placeholder="رمزعبور خود را وارد کنید"
                            />
                            <div className="gap-2 flex mt-2">
                                <input
                                    onChange={() => setIsUser(!isUser)}
                                    id="isUser"
                                    type="checkbox"
                                />
                                <label
                                    className="font-vazir-medium text-sm"
                                    htmlFor="isUser"
                                >
                                    ورود به عنوان ادمین
                                </label>
                            </div>
                        </div>
                        <div className="mt-5 flex">
                            <button
                                onClick={() => login()}
                                className="font-vazir-medium mx-auto text-center text-sm w-28 bg-[#18bb0d] hover:bg-green-600 text-white rounded-lg p-2 pr-10 pl-10 shadow-md"
                            >
                                ورود
                            </button>
                        </div>
                    </div>
                </div>

                {/* پاپ‌آپ همیشه توی DOM هست */}
                <div
                    className={`overlay fixed inset-0 bg-gradient-to-b from-yellow-200 md:bg-gray-600 md:bg-opacity-25 hover:bg-gradient-to-b from-yellow-200 z-[999] 
                               transition-opacity duration-500 ease-in-out
                               ${showVideo ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    onClick={closeVideo}
                ></div>

                <div
                    className={`popup fixed top-1/2 left-1/2 
                                -translate-x-1/2 -translate-y-1/2 
                                 z-[1000] w-full h-fit max-w-[1000px] 
                                overflow-hidden rounded-xl shadow-lg
                                transition-all duration-700 ease-in-out
                                ${showVideo ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
                >
                    <video
                        ref={videoRef}
                        controls
                        playsInline
                        preload="auto"
                        className="w-full  object-contain bg-black"
                    >
                        <source src="/panel/video/fpm.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .popup {
                        max-width: 90% !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Login;
