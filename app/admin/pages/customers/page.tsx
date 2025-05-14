'use client';
import * as XLSX from "xlsx";
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';

const Customers = () => {
    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'accounting_code',
                header: 'کد حسابداری',
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
                accessorKey: 'title',
                header: 'عنوان',
                size: 300,
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
                accessorKey: 'name',
                header: 'نام',
                size: 100,
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
                size: 150,
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
                accessorKey: 'mobile',
                header: 'موبایل',
                size: 100,
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
                accessorKey: 'tell',
                header: 'تلفن',
                size: 100,
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
                accessorKey: 'province',
                header: 'استان',
                size: 120,
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
                accessorKey: 'city',
                header: 'شهر',
                size: 120,
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
                accessorKey: 'address',
                header: 'آدرس',
                size: 600,
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
                accessorKey: 'marketer',
                header: 'بازاریاب',
                size: 300,
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
                size: 300,
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
                size: 300,
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
    const [dataFile, setDataFile] = useState<any[]>([]);
    const [fileName, setFileName] = useState("");

    const getCustomers = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.get('/customers/getAllCustomers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات مشتریان با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getCustomers();
    }, [data]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        setFileName(file?.name || "");

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result;
            if (!arrayBuffer) return;

            const data = new Uint8Array(arrayBuffer as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
            setDataFile(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const token = Cookies.get('fpmToken');

        if (!dataFile.length) {
            Swal.fire("خطا", "هیچ دیتایی خوانده نشد، لطفا دوباره امتحان کنید", "error");
            return;
        }

        try {
            const response = await httpService.post('/customers/updateCustomerList', {
                customerList: dataFile,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            if (!response.data.success) {
                Swal.fire("خطا", "مشکلی پیش آمده است، لطفا با پشتیبانی تماس بگیرید", "error");
                return;
            }


            Swal.fire("موفق", "بروزرسانی با موفقیت انجام شد", "success");
            // await getCustomers();
            setData(dataFile); // نمایش اطلاعات جدید در جدول
            setFileName("");
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
        getRowId: (row, index) => `${row.accounting_code}-${index}`, // تضمین یکتایی
    });


    return (
        <main className="flex-grow p-4 font-vazir flex mt-5">
            <div className="w-full max-w-full mx-auto bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-lg font-bold mb-4">لیست مشتریان</h2>

                <div className="mb-5">
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                name="file"
                                id="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <label
                                htmlFor="file"
                                className="diodfont-semibold w-60 text-sm shadow-md bg-blue-200 h-9 p-1 pr-2 pb-2 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-300"
                            >
                                {fileName ? fileName : "انتخاب فایل..."}
                            </label>

                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
                            >
                                آپلود فایل
                            </button>
                        </div>
                    </form>
                </div>

                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Customers;
