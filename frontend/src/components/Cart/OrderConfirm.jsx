import { useSelector } from 'react-redux';
import CartItem from './CartItem';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { Button, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const OrderConfirm = () => {
    const navigate = useNavigate();
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const handleProceedToPayment = () => {
        if (!shippingInfo.address) {
            return alert('Please add shipping information first');
        }
        navigate('/process/payment');
    };

    return (
        <>
            <MetaData title="Order Confirmation" />
            
            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
                    {/* Left Column */}
                    <div className="flex-1">
                        <Stepper activeStep={2}>
                            <div className="w-full bg-white p-6 rounded-t-sm">
                                {/* Shipping Address Section */}
                                <section className="mb-8">
                                    <Typography variant="h6" className="flex items-center gap-2 mb-4">
                                        <LocationOnIcon color="primary" />
                                        Delivery Address
                                    </Typography>
                                    <div className="space-y-2">
                                        <Typography>{user?.name}</Typography>
                                        <Typography>
                                            {shippingInfo?.address}, {shippingInfo?.city}
                                        </Typography>
                                        <Typography>
                                            {shippingInfo?.state} - {shippingInfo?.pincode}
                                        </Typography>
                                        <Typography>Phone: {shippingInfo?.phoneNo}</Typography>
                                    </div>
                                </section>

                                {/* Order Items Section */}
                                <section>
                                    <Typography variant="h6" className="mb-4">
                                        Order Items ({cartItems?.length})
                                    </Typography>
                                    <div className="space-y-4">
                                        {cartItems?.map((item, i) => (
                                            <CartItem 
                                                {...item} 
                                                inCart={false} 
                                                key={i}
                                                editable={false}  // Disable editing in confirmation
                                            />
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Proceed Button */}
                            <div className="bg-white px-6 py-4 rounded-b-sm shadow-top">
                                <div className="flex justify-between items-center">
                                    <Typography variant="body2">
                                        Review items and address before proceeding
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleProceedToPayment}
                                        className="bg-primary-orange hover:bg-primary-dark-orange"
                                        sx={{
                                            padding: '12px 24px',
                                            borderRadius: '4px',
                                            textTransform: 'uppercase',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Proceed to Payment
                                    </Button>
                                </div>
                            </div>
                        </Stepper>
                    </div>

                    {/* Price Sidebar */}
                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default OrderConfirm;