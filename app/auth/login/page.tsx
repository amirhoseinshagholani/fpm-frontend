'use client';

import { httpService } from "@/app/functions/httpService";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { Token } from "@mui/icons-material";

const Login = () => {
    const [isUser, setIsUser] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    
    const login = async () => {
        if (username == "") {
            Swal.fire("خطا", "نام کاربری را وارد نمایید", "warning");
            return;
        }
        if (password == "") {
            Swal.fire("خطا", "رمزعبور را وارد نمایید", "warning");
            return;
        }

        const responseLogin = await httpService.post('/auth/login', {
            "username": username,
            "password": password,
            "isUser": isUser
        });

        // console.log(responseLogin.data.type=='user');
        // return; 
        
        // console.log(responseLogin);

        if (responseLogin.data.success) {
            Cookies.set('fpmToken',responseLogin.data.result,{expires:1});
            Cookies.set('fpmUsername',username,{expires:1});
            if(responseLogin.data.type=='user'){
                redirect('/admin');
            }else{
                redirect('/panel');
            }
        }else{
            Swal.fire("خطا",responseLogin.data.message,"error");
        }

    }

    return (
        <>
            <div className="bg-white h-screen text-black">
                <div className="flex h-screen items-center p-5 md:p-0">
                    <div className="mx-auto bg-slate-300 shadow-lg w-100 h-2/3 rounded-2xl">
                        <div className="flex mt-5" id="logo">
                            <Image className="mx-auto" src="/img/logo.webp" alt="logo" width={100} height={100} />
                        </div>
                        <div className="mt-3 flex">
                            <div className="mx-auto font-vazir-medium">نام کاربری و رمز عبور خود را وارد کنید</div>
                        </div>
                        <div className="mt-5 p-5">
                            <input onChange={(e) => setUsername(e.target.value)} id="username" value={username} className="bg-white p-1 h-10 rounded-lg shadow-sm w-full focus:outline-none font-vazir-medium mt-2" type="text" placeholder="نام کاربری خود را وارد کنید" />
                            <input onChange={(e) => setPassword(e.target.value)} id="password" value={password} className="bg-white p-1 h-10 rounded-lg shadow-sm w-full focus:outline-none font-vazir-medium mt-2" type="password" placeholder="رمزعبور خود را وارد کنید" />
                            {/* <div className="gap-2 flex mt-5">
                                <input onChange={() => setIsRemember(!isRemember)} id="remember" type="checkbox" />
                                <label className="font-vazir-medium text-sm" htmlFor="remember">مرا به خاطر بسپار</label>
                            </div> */}
                            <div className="gap-2 flex mt-2">
                                <input onChange={() => setIsUser(!isUser)} id="isUser" type="checkbox" />
                                <label className="font-vazir-medium text-sm" htmlFor="isUser">ورود به عنوان ادمین</label>
                            </div>
                        </div>
                        <div className="mt-7 flex">
                            <button onClick={() => login()} className="font-vazir-medium mx-auto bg-[#18bb0d] hover:bg-green-600 text-white rounded-lg p-2 pr-10 pl-10 shadow-md">ورود</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;