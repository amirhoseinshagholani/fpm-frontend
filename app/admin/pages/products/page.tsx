'use client';
import * as XLSX from "xlsx";
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import formatNumber from "../../functions/formatNumber";

const Products = () => {
    const [data, setData] = useState<any[]>([]);
    const [dataFile, setDataFile] = useState<any[]>([]);
    const [fileName, setFileName] = useState("");

    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'accounting_code',
                header: 'کد جنس',
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
                header: 'شرح جنس',
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
                accessorKey: 'price',
                header: 'قیمت فروش',
                Cell: ({ cell }) => {
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {`${formatNumber(Number(cell.getValue()))} ریال`}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'inventory',
                header: 'موجودی',
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
                accessorKey: 'barcode',
                header: 'بارکد',
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
                accessorKey: 'technical_code',
                header: 'کد فنی',
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

    const getProducts = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.get('/products/getAllProducts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات محصولات با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let file = e.target.files?.[0];
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

            const allowedKeys = ['کد جنس', 'شرح جنس', 'قیمت فروش', 'موجودی کل تعداد', 'موجودی کل مقدار', 'بارکد', 'کد فنی'];
            const keys = Object.keys(jsonData[0]);
            const invalidKeys = keys.filter(key => allowedKeys.includes(key));

            // console.log(allowedKeys);
            // console.log(keys);
            // console.log(invalidKeys);

            if (invalidKeys.length > 0) {
                setDataFile(jsonData);
            } else {
                Swal.fire("خطا", "فایل آپلود شده، مناسب نیست!", "warning");
                setDataFile([]);         // پاک کردن داده فایل
                setFileName("");         // ریست نام فایل

                // ریست ورودی فایل:
                const inputElement = document.getElementById("file") as HTMLInputElement;
                if (inputElement) {
                    inputElement.value = "";
                }
            }



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
        console.log(dataFile);

        try {
            const response = await httpService.post('/products/updateProductsList', {
                productsList: dataFile,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);

            if (!response.data.success) {
                Swal.fire("خطا", "مشکلی پیش آمده است، لطفا با پشتیبانی تماس بگیرید", "error");
                return;
            }

            const mappedData = dataFile.map((item) => ({
                accounting_code: item['کد جنس'],
                title: item['شرح جنس'],
                price: item['قیمت فروش'],
                inventory: item['موجودی کل مقدار'] ?? item['موجودی کل تعداد'] ?? '',
                barcode: item['بارکد'],
                technical_code: item['کد فنی'],
            }));
            setData(mappedData);
            Swal.fire("موفق", "بروزرسانی با موفقیت انجام شد", "success");

            // setData(dataFile);
            setFileName("");
        } catch (err) {
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
                <h2 className="text-lg font-bold mb-4">لیست محصولات</h2>

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

export default Products;
