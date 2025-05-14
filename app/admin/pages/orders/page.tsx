'use client';

import { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import formatNumber from "../../functions/formatNumber";

const Orders = () => {
    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            {
                accessorKey: 'order_number',
                header: 'شماره سفارش',
            },
            {
                accessorKey: 'amount',
                header: 'مبلغ',
                Cell: ({ cell }) => `${formatNumber(Number(cell.getValue()))} ریال`,
            },
            {
                accessorKey: 'discount',
                header: 'تخفیف',
                Cell: ({ cell }) => `${(cell.getValue())} %`,
            },
            {
                accessorKey: 'discount_amount',
                header: 'مبلغ تخفیف',
                Cell: ({ cell }) => `${cell.getValue() ? formatNumber(Number(cell.getValue())):'0'} ریال`,
            },
            {
                accessorKey: 'tax',
                header: 'ارزش افزوده',
                Cell: ({ cell }) => `${formatNumber(Number(cell.getValue()))} ریال`,
            },
            {
                accessorKey: 'total_amount',
                header: 'مبلغ کل',
                Cell: ({ cell }) => `${formatNumber(Number(cell.getValue()))} ریال`,
            },
            {
                accessorKey: 'date',
                header: 'تاریخ',
            }
        ],
        []
    );

    const data = useMemo(
        () => [
            {
                order_number:'100000012',
                amount: 245000,
                discount: 15,
                discount_amount: 36750,
                tax:20825,
                total_amount: 229075,
                date: '1404/01/18'
            },
            {
                order_number:'100000013',
                amount: 250000,
                discount: 0,
                discount_amount: 0,
                tax:25000,
                total_amount: 275000,
                date: '1404/01/18'
            },
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

export default Orders;
