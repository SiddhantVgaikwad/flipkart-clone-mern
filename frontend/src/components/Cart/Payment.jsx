import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [payDisable, setPayDisable] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentDetails, setPaymentDetails] = useState({
        upiId: '',
        bank: ''
    });

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handlePaymentDetails = (e) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setPayDisable(true);
    
        try {
            const orderData = {
                paymentMethod,
                paymentDetails,
                amount: totalPrice,
                shippingInfo,
                items: cartItems,
                user: user._id
            };
    
            // Fix API endpoint URL
            const { data } = await axios.post(
                'http://localhost:4000/api/v1/payment/process',  // Add backend URL
                orderData,
                { withCredentials: true }
            );
            
            // Redirect to receipt page with order ID
            navigate('/order/success', { 
                state: { 
                  success: true, 
                  orderId: data.order._id 
                } 
              });
            enqueueSnackbar('Payment processed successfully!', { variant: "success" });

        } catch (error) {
            setPayDisable(false);
            console.error('Payment Error:', error.response?.data);
            enqueueSnackbar(error.response?.data?.message || "Payment failed!", { 
                variant: "error" 
            });
        }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Secure Payment" />

            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
                    <div className="flex-1">
                        <Stepper activeStep={3}>
                            <div className="w-full bg-white p-6 rounded-lg shadow-sm">
                                <form onSubmit={submitHandler} className="flex flex-col gap-4">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            {/* COD Option */}
                                            <FormControlLabel
                                                value="cod"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            className="h-6 w-6 object-contain"
                                                            src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"
                                                            alt="COD"
                                                        />
                                                        <span>Cash on Delivery (COD)</span>
                                                    </div>
                                                }
                                            />

                                            {/* UPI Option */}
                                            <FormControlLabel
                                                value="upi"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            className="h-6 w-6 object-contain"
                                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png"
                                                            alt="UPI"
                                                        />
                                                        <span>UPI Payment</span>
                                                    </div>
                                                }
                                            />

                                            {/* Net Banking Option */}
                                            <FormControlLabel
                                                value="netbanking"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            className="h-6 w-6 object-contain"
                                                            src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
                                                            alt="Net Banking"
                                                        />
                                                        <span>Net Banking</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    {paymentMethod === 'upi' && (
                                        <TextField
                                            fullWidth
                                            label="UPI ID"
                                            name="upiId"
                                            value={paymentDetails.upiId}
                                            onChange={handlePaymentDetails}
                                            placeholder="yourname@upi"
                                            required
                                        />
                                    )}

                                    {paymentMethod === 'netbanking' && (
                                        <TextField
                                            select
                                            fullWidth
                                            label="Select Bank"
                                            name="bank"
                                            value={paymentDetails.bank}
                                            onChange={handlePaymentDetails}
                                            required
                                            SelectProps={{
                                                native: true,
                                            }}
                                        >
                                            <option value=""></option>
                                            <option value="hdfc">HDFC Bank</option>
                                            <option value="icici">ICICI Bank</option>
                                            <option value="sbi">State Bank of India</option>
                                            <option value="axis">Axis Bank</option>
                                        </TextField>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={payDisable}
                                        className={`${
                                            payDisable
                                                ? "bg-primary-grey cursor-not-allowed"
                                                : "bg-primary-orange cursor-pointer"
                                        } w-full my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
                                    >
                                        {payDisable ? 'Processing...' : 
                                            paymentMethod === 'cod' ? 
                                            `Confirm Order ₹${totalPrice.toLocaleString()}` : 
                                            `Pay ₹${totalPrice.toLocaleString()}`
                                        }
                                    </button>
                                </form>
                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;