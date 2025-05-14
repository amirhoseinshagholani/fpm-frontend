'use client';
import * as XLSX from "xlsx";
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import { log } from "console";

const Users = () => {
    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'نام',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'last_name',
                header: 'نام خانوادگی',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'role_title',
                header: 'نقش',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'وضعیت',
                Cell: ({ cell }) => {
                    let status = cell.getValue<number>();
                    if (status == 0) {
                        return (
                            <span className={`px-2 py-1 font-vazir-bold text-xs text-red-600 bg-red-100 rounded-xl`}>
                                غیرفعال
                            </span>
                        )
                    } else {
                        return (
                            <span className={`px-2 py-1 font-vazir-bold text-xs text-green-600 bg-green-100 rounded-xl`}>
                                فعال
                            </span>
                        )
                    }

                },
            },
            {
                accessorKey: 'mobile',
                header: 'موبایل',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'username',
                header: 'نام کاربری',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'password',
                header: 'رمزعبور',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'description',
                header: 'توضیحات',
                size: 500,
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            },
        ],
        []
    );

    const [data, setData] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [role_Id, setRole_Id] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [last_name, setLast_name] = useState<string>("");
    const [status, setStatus] = useState<number>(0);
    const [mobile, setMobile] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const getRoles = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.get('/roles/getAllRoles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات نقش ها با مشکل مواجه شد", "error");
        }
    };

    const getUsers = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.get('/users/getAllUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات نقش ها با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getRoles();
        getUsers();
    }, []);



    const handleSubmit = async () => {
        if(role_Id==0){
            Swal.fire("خطا","نقش را انتخاب کنید","warning");
            return;
        }
        if(name==""){
            Swal.fire("خطا","نام را وارد کنید","warning");
            return;
        }
        if(last_name==""){
            Swal.fire("خطا","نام خانوادگی را وارد کنید","warning");
            return;
        }
        if(username==""){
            Swal.fire("خطا","نام کاربری را وارد کنید","warning");
            return;
        }
        if(password==""){
            Swal.fire("خطا","رمزعبور را وارد کنید","warning");
            return;
        }
        
        const token = Cookies.get('fpmToken');

        try {
            const response = await httpService.post('/users/addUser', {
                role_id: role_Id,
                name:name,
                last_name:last_name,
                status:status,
                mobile:mobile,
                username:username,
                password:password,
                description:description
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            if (!response.data.success) {
                Swal.fire("خطا", "مشکلی پیش آمده است، لطفا با پشتیبانی تماس بگیرید", "error");
                return;
            }


            Swal.fire("موفق", "ثبت کاربر با موفقیت انجام شد", "success");
            await getRoles();
            await getUsers();

            setRole_Id(0);
            setName("");
            setLast_name("");
            setStatus(0);
            setMobile("");
            setUsername("");
            setPassword("");
            setDescription("");

        } catch (err) {
            console.log(err);
            Swal.fire("خطا", "ارسال اطلاعات با مشکل مواجه شد", "error");
        }
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowNumbers: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        layoutMode: 'grid',
        getRowId: (row, index) => `${row.accounting_code}-${index}`,
    });


    return (
        <main className="flex-grow p-4 font-vazir flex mt-5">
            <div className="w-full max-w-full mx-auto bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-lg font-bold mb-4">لیست کاربران</h2>
                <div className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 bg-slate-100 rounded-xl p-5 pb-2 mb-2">

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="role_id">نقش  </label></div>
                        <div className="md:mt-1">
                            <select
                                name="role_id"
                                id="role_id"
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                onChange={(e) => setRole_Id(parseInt(e.target.value))}
                                value={role_Id}
                            >
                                <option value="">انتخاب کنید</option>
                                {
                                    roles.map((role) => role.status && (
                                        <option key={role.id} value={role.id}>{role.title}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="name">نام کاربر</label></div>
                        <div className="md:mt-1">
                            <input
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                id="name"
                                name="name"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="last_name">نام خانوادگی</label></div>
                        <div className="md:mt-1">
                            <input
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                id="last_name"
                                name="last_name"
                                type="text"
                                onChange={(e) => setLast_name(e.target.value)}
                                value={last_name}
                            />
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="status">وضعیت</label></div>
                        <div className="md:mt-1">
                            <select
                                name="status"
                                id="status"
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                onChange={(e) => setStatus(parseInt(e.target.value))}
                                value={status}
                            >
                                <option value="0">غیرفعال</option>
                                <option value="1">فعال</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="mobile">موبایل</label></div>
                        <div className="md:mt-1">
                            <input
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                id="mobile"
                                name="mobile"
                                type="text"
                                onChange={(e) => setMobile(e.target.value)}
                                value={mobile}
                            />
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="username">نام کاربری</label></div>
                        <div className="md:mt-1">
                            <input
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                id="username"
                                name="username"
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="password">رمزعبور</label></div>
                        <div className="md:mt-1">
                            <input
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                                id="password"
                                name="password"
                                type="text"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-auto md:col-span-3 md:flex-col">
                        <div><label htmlFor="description">توضیحات </label></div>
                        <div className="md:mt-1">
                            <input
                                className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full"
                                id="description"
                                name="description"
                                type="text"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                            />
                        </div>
                    </div>

                    <div className="flex w-full col-span-12 justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-green-500 text-white px-4 mb-2 flex  py-1 rounded-lg hover:bg-green-600  md:ml-20 md:w-auto"
                        >
                            افزودن
                        </button>
                    </div>
                </div>

                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Users;
