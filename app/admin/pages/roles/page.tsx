'use client';
import * as XLSX from "xlsx";
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import { log } from "console";

const Customers = () => {
    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'عنوان نقش',
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
    const [roleTitle, setRoleTitle] = useState<string>("");
    const [roleStatus, setRoleStatus] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    const getRoles = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.get('/roles/getAllRoles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات نقش ها با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getRoles();
    }, []);



    const handleSubmit = async () => {
        const token = Cookies.get('fpmToken');
        if (roleTitle == "") {
            Swal.fire("خطا", "عنوان نقش را وارد کنید", "warning");
            return;
        }

        try {
            const response = await httpService.post('/roles/addRole', {
                roleTitle: roleTitle,
                roleStatus: roleStatus,
                roleDescription: description
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            if (!response.data.success) {
                Swal.fire("خطا", "مشکلی پیش آمده است، لطفا با پشتیبانی تماس بگیرید", "error");
                return;
            }

            Swal.fire("موفق", "ثبت نقش با موفقیت انجام شد", "success");
            await getRoles();
            //     setData(dataFile); // نمایش اطلاعات جدید در جدول
            setRoleTitle("");
            setRoleStatus(0);
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
                <h2 className="text-lg font-bold mb-4">لیست نقش ها</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-slate-100 p-5 rounded-xl mb-5">
                    <div className="text-sm w-full md:w-auto">
                        <label htmlFor="title">عنوان نقش: </label>
                        <input
                            className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                            id="title"
                            name="title"
                            type="text"
                            onChange={(e) => setRoleTitle(e.target.value)}
                            value={roleTitle}
                        />
                    </div>
                    <div className="text-sm w-full md:w-auto">
                        <label htmlFor="status">وضعیت : </label>
                        <select
                            name="status"
                            id="status"
                            className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-52"
                            onChange={(e) => setRoleStatus(parseInt(e.target.value))}
                            value={roleStatus}

                        >
                            <option value="0">غیرفعال</option>
                            <option value="1">فعال</option>
                        </select>
                    </div>
                    <div className="text-sm w-full md:w-auto">
                        <label htmlFor="description">توضیحات: </label>
                        <input
                            className="bg-gray-300 p-2 rounded-lg focus:outline-0 text-sm w-full md:w-64"
                            id="description"
                            name="description"
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 w-full md:w-auto"
                    >
                        افزودن
                    </button>
                </div>
                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Customers;
