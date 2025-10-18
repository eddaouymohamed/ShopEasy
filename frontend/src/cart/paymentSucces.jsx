import axios from "axios";
import PageTitle from "../components/pageTitle";
import Footer from '../components/footer';
import NavBar from '../components/navBar'
import Loader from '../components/loder'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify";
import '../styles/CartStyles/PaymentSuccess.css';
import { createOrder, removeErrors, removeSuccess } from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
// import error from "../../../backend/middleware/error";
// import { Link } from "react-router-dom";

export default function PaymentSucces() {
    const [isVerified, setIsVerified] = useState(false);
    const [verificationErr, setVerificationErr] = useState(null)
    const [search] = useSearchParams();
    const session_id = search.get('session_id');
    // const {user}
    const user = JSON.parse(localStorage.getItem('user'))
    const { loading, success, error } = useSelector(state => state.order)
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const { data } = await axios.post('/api/v1/payment/verification', { session_id }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const { success, emailSent } = data
                if (success) {
                    setIsVerified(true)
                    if (emailSent && success) {
                        toast.success(` payment verifed,email notification successfully sent to ${user.email} `, { position: 'top-center', autoClose: 30000 })
                        return;

                    }
                    // Order validation failed: shippingInfo.city: Path `shippingInfo.city` is required.ORDERc
                    toast.success('payment verified', { position: 'top-center', autoClose: 30000 })
                }
                else {
                    setVerificationErr('payment verification failed  please refresh or go back to checkout again ')
                }

            } catch (error) {
                setVerificationErr('Something went wrong while verifying payment ')
                toast.error(error.message || 'payment verification error', { position: 'top-center', autoClose: 30000 })
            }
        }
        verifyPayment();
        if (verificationErr) {
            return (
                <div className="payment-success-container">
                    {verificationErr && <div className="success-content">
                        {verificationErr}
                        <Link to={'/order/confirm'} className="explore-btn">Go Back</Link>
                    </div>}

                </div>
            )
        }
    }, [])
    useEffect(() => {
        if (isVerified) {
            console.log('isVerified',isVerified);
            const createOrderData = async () => {
                try {
                    const shippingInformation = JSON.parse(localStorage.getItem('shippingInfo'))
                    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
                    const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
                    if (!orderItem || !cartItems || !shippingInformation) return;
                    const orderData = {
                        shippingInfo: {
                            address: shippingInformation.address,
                            city: shippingInformation.city,
                            state: shippingInformation.state,
                            country: shippingInformation.country,
                            phoneNumber: shippingInformation.phoneNumber,
                            pinCode: shippingInformation.pinCode
                        },
                        orderItems: cartItems.map(item => (
                            {
                                name: item.name,
                                price: item.price,
                                quantity: item.quantity,
                                image: item.image,
                                product: item.product
                            }
                        )),
                        paymentInfo: {
                            id: session_id,
                            status: 'succeeded'
                        },
                        itemPrice: orderItem.subtotal,
                        taxPrice: orderItem.tax,
                        shippingPrice: orderItem.shipping,
                        totalPrice: orderItem.total,
                    }
                    console.log('orderData', orderData);
                    await dispatch(createOrder(orderData)).unwrap();
                    dispatch(clearCart());
                    sessionStorage.removeItem('orderItem');
                    localStorage.removeItem('shippingInfo');
                } catch (error) {
                    toast.error(error.message || 'Order creation Error', { position: 'top-center', autoClose: 30000 })

                }
            }
            createOrderData();

        }
    }, [isVerified,dispatch])
    useEffect(() => {
        if (success) {
            toast.success('order placed', { position: 'top-center', autoClose: 30000 })
            dispatch(clearCart())
            dispatch(removeSuccess());
        }
    }, [success,dispatch])
    useEffect(() => {
        if (error) {
            toast.error(error || 'failed to create order ', { position: 'top-center', autoClose: 30000 })
            dispatch(removeErrors())
        }
    }, [error,dispatch])
    return (
        <>
            <PageTitle title={'payment||status'} />
            <div className="payment-success-container">
                {loading ? <Loader /> : <div className="success-content">
                    <div className="success-icon">
                        <div className="checkmark">

                        </div>
                    </div>
                    <h1>order Confirmed</h1>
                    <p>your payment was successful Reference ID: <strong>{session_id} </strong></p>
                    <Link to={'/orders/user'} className="explore-btn">view orders</Link>
                </div>}
            </div>
            <NavBar />
            <Footer />
        </>
    )


}