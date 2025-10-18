import { useSelector } from 'react-redux';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import PageTitle from '../components/pageTitle';
import '../styles/CartStyles/OrderConfirm.css';
import { useNavigate } from 'react-router-dom';
const OrderConfirm = () => {
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
     const subtotal=cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0);
    const tax=subtotal*0.18;
    const shipping=subtotal>500?0:50;
    const total=tax + subtotal + shipping;
    const navigate=useNavigate();
    const proceedToPayement=()=>{
        const data={
            subtotal,
            shipping,
            total,
            tax
        }
        sessionStorage.setItem('orderItem',JSON.stringify(data));
        navigate('/process/payment')

    }
    return (
        <>
            <PageTitle />
            <NavBar />
            <div className="confirm-container">
                <h1 className="confirm-table-container">
                    Order Confirmation
                </h1>
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.name} </td>
                                <td>{shippingInfo.phoneNumber} </td>
                                <td>
                                    {shippingInfo.address},{shippingInfo.city},{shippingInfo.state},{shippingInfo.country}-{shippingInfo.pinCode}

                                     </td>

                            </tr>

                        </tbody>
                    </table>
                    <table className="confirm-table cart-table">
                        <caption> Cart Items </caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                           {
                            cartItems && cartItems.map(item=>(
                                 <tr key={item.product}>
                                <td>
                                    <img src={item.image} alt={item.name} className='order-product-image' />

                                                                    </td>
                                <td>{item.name} </td>
                                <td>{item.price.toFixed(2)} dh </td>
                                <td>{item.quantity} </td>
                                <td>{(item.quantity*item.price).toFixed(2)} dh </td>
                            </tr>
                            ))
                           }
                        </tbody>
                    </table>
                    <table className="confirm-table">
<caption>Order Summary</caption>
<thead>
    <tr>
        <th>Subtotal</th>
        <th>Shipping Charges</th>
        <th>Tax</th>
        <th>Total</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>{subtotal.toFixed(2)} dh </td>
        <td>{shipping} dh </td>
        <td> {tax} dh</td>
        <td>{total.toFixed(2)} dh </td>
    </tr>
</tbody>

                    </table>
                </div>
                <button className="proceed-button" onClick={proceedToPayement}>Proceed to Payment</button>
            </div>
            <Footer />
        </>
    )
}
export default OrderConfirm;