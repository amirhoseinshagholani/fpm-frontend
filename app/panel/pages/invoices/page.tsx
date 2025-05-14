'use client';
import * as XLSX from "xlsx";
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import formatNumber from "../../functions/formatNumber";

const Invoices = () => {
    const accounting_code = Cookies.get('fpmUsername')?.slice(0, 7);

    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'invoice_number',
                header: 'شماره فاکتور',
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
                accessorKey: 'invoice_date',
                header: 'تاریخ',
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
                accessorKey: 'amount',
                header: 'مبلغ',
                Cell: ({ cell }) => {
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {`${formatNumber(Number(cell.getValue()))} ریال`}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'discount',
                header: 'تخفیف',
                Cell: ({ cell }) => {
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {`${formatNumber(Number(cell.getValue()))} ریال`}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'total_amount',
                header: 'مبلغ کل',
                Cell: ({ cell }) => {
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {`${formatNumber(Number(cell.getValue()))} ریال`}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'status',
                header: 'وضعیت',
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
                accessorKey: 'type',
                header: 'نوع',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            }],
        []
    );

    const [data, setData] = useState<any[]>([]);
    const [dataFile, setDataFile] = useState<any[]>([]);
    const [fileName, setFileName] = useState("");

    const getInvoices = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.post('/invoices/getCustomersInvoices', {
                accounting_code: accounting_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log(response);

            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات فاکتورها با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getInvoices();
    }, []);

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
            const response = await httpService.post('/invoices/updateInvoicesList', {
                invoicesList: dataFile,
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
                <h2 className="text-lg font-bold mb-4">لیست فاکتورها</h2>
                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Invoices;
