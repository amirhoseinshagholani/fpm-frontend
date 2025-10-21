import PaymentComponent from "./paymentComponent";

const Payments = () => {

    return (
        <main className="flex-grow p-4 font-vazir flex mt-10">
            <div className="w-full max-w-full mx-auto bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-center text-lg font-bold mb-4">لیست پرداختی‌ها</h2>
                <PaymentComponent />
            </div>
        </main>
    );
};

export default Payments;
