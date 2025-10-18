import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import PageTitle from '../components/pageTitle';
import '../styles/CartStyles/Payment.css'
import CheckOutPath from './checkoutPath';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const Payment = () => {
    const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
    const { user } = useSelector(state => state.user);
    const { shippingInfo } = useSelector(state => state.cart);
    const completPayment = async (amount) => {
        try {
            const { data: stripeKeyData } = await axios.get('/api/v1/getkey');
            console.log(stripeKeyData);
            const stripe = await loadStripe(stripeKeyData.stripePublishedKey);
            if (!stripe) {
                toast.error('Stripe not loaded properly', { position: 'top-center', autoClose: 3000 });
                return;
            }

            if (!user || !user.email || !user.name) {
                toast.error('Please login to proceed', { position: 'top-center', autoClose: 3000 });
                return;
            }

            if (!shippingInfo || !shippingInfo.phoneNumber) {
                toast.error('Please provide shipping information', { position: 'top-center', autoClose: 3000 });
                return;
            }
            const body = {
                user, shippingInfo, amount
            }
            const { data: sessionData } = await axios.post('/api/v1/create-checkout-session', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const result = await stripe.redirectToCheckout({
                sessionId: sessionData.id

            })
            if (result.error) {
                toast.error('Something went wrong while staring your payment,please try again.', { position: 'top-center', autoClose: 3000 })
            }
        } catch (err) {
            toast.error('payment error', { position: 'top-center', autoClose: 3000 })
        }
    }
    return (
        <>
            <PageTitle title={'process |Payment'} />
            <NavBar />
            <CheckOutPath activePath={2} />
            <div className="payment-container">
                <Link to={'/order/confirm'} className='payment-go-back'> Go Back</Link>
                <button className='payment-btn' onClick={() => completPayment(orderItem.total)}>pay ({orderItem.total} dh)</button>
            </div>
            <Footer />
        </>
    )
}
export default Payment