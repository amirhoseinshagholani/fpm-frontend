'use client';

import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import formatNumber from "../../functions/formatNumber";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import Select from 'react-select';
import toJalaliDate from "../../functions/jalaliDate";


interface Customer {
    id: number;
    accounting_code: string;
    title: string;
    name: string;
    last_name: string;
    mobile: string;
    tell: string;
    province: string;
    city: string;
    address: string;
    description: string;
    marketer: string;
}

interface Payment {
    id: number;
    refer_to: number;
    customer_accounting_code: string;
    token: string;
    url_payment: string;
    consumer_mobile: string;
    consumer_name: string;
    amount: number;
    status: number;
    created_at: string;
    updated_at: string;
}

const Payments = () => {
    const token = Cookies.get('fpmToken');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [data, setData] = useState<Payment[]>([]);
    // const [accounting_code, setAccountingCode] = useState("");


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
                            {toJalaliDate(text)}
                        </span>
                    );
                },
            }
        ],
        []
    );

    // const data = useMemo(
    //     () => [
    //         {
    //             name: 'هومن فلاح',
    //             mobile: '09370965131',
    //             amount: 245000,
    //             status: 'در انتظار تایید',
    //             date: '1404/01/18'
    //         },
    //         {
    //             name: 'حانیه رضوانی',
    //             mobile: '09125468794',
    //             amount: 245000,
    //             status: 'تایید شده',
    //             date: '1404/01/18'
    //         }
    //     ],
    //     []
    // );

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowNumbers: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        layoutMode: 'grid', // یا 'semantic' بسته به نیاز
    });

    const getCustomers = async () => {
        try {
            const response = await httpService.get('/customers/getAllCustomers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات مشتریان با مشکل مواجه شد", "error");
        }
    };

    useEffect(() => {
        getCustomers();
    }, []);

    const normalize = (str: string) =>
        str
            .replace(/ي/g, 'ی') // ی عربی → ی فارسی
            .replace(/ك/g, 'ک') // ک عربی → ک فارسی
            .replace(/ة/g, 'ه') // ة → ه
            .replace(/\s+/g, '') // حذف فاصله اضافی
            .toLowerCase();

    const customFilter = (option: { label: string; value: string }, inputValue: string) => {
        return normalize(option.label).includes(normalize(inputValue));
    };


    const options = customers.map(customer => ({
        value: customer.accounting_code,
        label: customer.title + " - " + customer.accounting_code
    }));

    const handleChangeCustomer = async (accounting_code: string) => {
        try {
            const response = await httpService.post('/payments/getCustomersInvoicesPayment', {
                accounting_code:accounting_code
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data['data']);
        } catch (err) {
            Swal.fire("خطا", "دریافت اطلاعات پرداختی ها با مشکل مواجه شد", "error");
        }
    }

    return (
        <main className="flex-grow p-4 font-vazir flex mt-10">
            <div className="w-full max-w-full mx-auto bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-center text-lg font-bold mb-4">لیست پرداختی‌ها</h2>
                <div className="bg-slate-100 p-5 rounded-xl mb-5 md:w-full ">
                    <Select className="md:w-80 font-vazir text-sm"
                        options={[{ value: "00", label: "همه" }, ...options]}
                        isSearchable={true}
                        filterOption={customFilter}
                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                        onChange={(selectedOption) => {
                            handleChangeCustomer(selectedOption?.value ?? "")
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: '#f1f2f2',
                                color: '#3d3e3e',
                                borderColor: '#3d3e3e',
                                fontSize:13
                            }),
                            input: (base) => ({
                                ...base,
                                color: '#3d3e3e',
                                fontSize:13
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: '#3d3e3e',
                                fontSize:13
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: '#3d3e3e',
                                fontSize:13
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: '#f1f2f2',
                                zIndex: 9999,
                                fontSize:13
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? '#f1f2f2' : '#f1f2f2',
                                color: '#3d3e3e',
                                fontSize:13
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                                fontSize:13
                            }),
                        }}
                    />



                    {/* <select className="bg-gray-300 p-2 rounded-xl" name="customer_accounting_code" id="customer_accounting_code">
                        <option value="00">همه</option>
                        {
                            customers && customers.map((customer) => (
                                <option key={customer.id} value={customer.accounting_code}>{customer.title}</option>
                            ))
                        }
                    </select> */}
                </div>
                <MaterialReactTable table={table} />
            </div>
        </main>
    );
};

export default Payments;
