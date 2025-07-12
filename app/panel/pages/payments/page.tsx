'use client';
import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import formatNumber from "../../functions/formatNumber";

const Payments = () => {
    const accounting_code = Cookies.get('fpmUsername')?.slice(0, 7);
    const [data, setData] = useState<any[]>([]);
    const [totals, setTotals] = useState({ amount: 0 });

    useEffect(() => {
        const totalAmount = data.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        setTotals({ amount: totalAmount });
    }, [data]);

    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'consumer_name',
                header: 'نام و نام خانوادگی',
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
                accessorKey: 'consumer_mobile',
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
                accessorKey: 'amount',
                header: 'مبلغ',
                Cell: ({ cell }) => {
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {`${formatNumber(Number(cell.getValue()))} ریال`}
                        </span>
                    )
                },
                Footer: () => (
                    <span className="font-bold text-xs block text-right">
                        {`جمع : ${formatNumber(totals.amount)} ریال`}
                    </span>
                )
            },
            {
                accessorKey: 'status',
                header: 'وضعیت',
                Cell: ({ cell }) => {
                    const status = cell.getValue<number>();

                    let text = '';
                    let colorClass = '';

                    switch (status) {
                        case 3:
                            text = 'رد شده';
                            colorClass = 'text-red-700 bg-red-100';
                            break;
                        case 2:
                            text = 'تأیید شده';
                            colorClass = 'text-green-700 bg-green-100';
                            break;
                        case 1:
                            text = 'پرداخت شده، در انتظار تأیید';
                            colorClass = 'text-yellow-700 bg-yellow-100';
                            break;
                        case 0:
                            text = 'در انتظار پرداخت';
                            colorClass = 'text-blue-700 bg-blue-50';
                            break;
                        default:
                            text = 'نامشخص';
                            colorClass = 'text-gray-600 bg-gray-100';
                    }

                    return (
                        <span className={`px-2 py-1 font-vazir-bold rounded-full text-xs font-medium ${colorClass}`}>
                            {text}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: 'تاریخ',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text.split('T')[0]}
                        </span>
                    );
                },
            }
        ],
        [totals]
    );

    const getPayments = async () => {
        const token = Cookies.get('fpmToken');
        try {
            const response = await httpService.post('/payments/getCustomersInvoicesPayment', {
                accounting_code: accounting_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات پرداختی ها با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getPayments();
    }, []);

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
                <h2 className="text-lg font-bold mb-4">لیست پرداختی ها</h2>
                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Payments;
