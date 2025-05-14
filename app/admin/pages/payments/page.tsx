'use client';

import { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import formatNumber from "../../functions/formatNumber";

const Payments = () => {
    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
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
                accessorKey: 'date',
                header: 'تاریخ',
                Cell: ({ cell }) => {
                    let text = cell.getValue<string>();
                    return (
                        <span className={`px-2 py-1 font-vazir-bold text-xs`}>
                            {text}
                        </span>
                    );
                },
            }
        ],
        []
    );

    const data = useMemo(
        () => [
            {
                name: 'هومن فلاح',
                mobile: '09370965131',
                amount: 245000,
                status: 'در انتظار تایید',
                date: '1404/01/18'
            },
            {
                name: 'حانیه رضوانی',
                mobile: '09125468794',
                amount: 245000,
                status: 'تایید شده',
                date: '1404/01/18'
            }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowNumbers: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        layoutMode: 'grid', // یا 'semantic' بسته به نیاز
    });

    return (
        <main className="flex-grow p-4 font-vazir flex mt-10">
            <div className="w-full max-w-full mx-auto bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-center text-lg font-bold mb-4">لیست پرداختی‌ها</h2>
                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Payments;
