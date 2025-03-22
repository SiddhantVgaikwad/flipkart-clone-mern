import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import successfull from '../../assets/images/Transaction/success.png';
import failed from '../../assets/images/Transaction/failed.png';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, orderId } = location.state || {};
    const [time, setTime] = useState(3);

    useEffect(() => {
        if (time === 0) {
            if (success) {
                navigate(`/order_details/${orderId}`);
            } else {
                navigate("/cart");
            }
            return;
        };
        const intervalId = setInterval(() => {
            setTime(time - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [time, navigate, success, orderId]);

    useEffect(() => {
        if (!location.state) {
            navigate("/");
        }
    }, [location.state, navigate]);

    return (
        <>
            <MetaData title={`Transaction ${success ? "Successful" : "Failed"}`} />

            <main className="w-full mt-20">
                <div className="flex flex-col gap-2 items-center justify-center sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow rounded p-6 pb-12">
                    <img draggable="false" className="w-1/2 h-60 object-contain" src={success ? successfull : failed} alt="Transaction Status" />
                    <h1 className="text-2xl font-semibold">Transaction {success ? "Successful" : "Failed"}</h1>
                    <p className="mt-4 text-lg text-gray-800">
                        Redirecting to {success ? "order details" : "cart"} in {time} sec
                    </p>
                    <Link 
                        to={success ? `/order_details/${orderId}` : "/cart"} 
                        className="bg-primary-blue mt-2 py-2.5 px-6 text-white uppercase shadow hover:shadow-lg rounded-sm"
                    >
                        go to {success ? "order details" : "cart"}
                    </Link>
                </div>
            </main>
        </>
    );
};

export default OrderSuccess;