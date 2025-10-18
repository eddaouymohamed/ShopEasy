import { useSelector } from "react-redux";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import PageTitle from "../components/pageTitle";
import '../styles/CartStyles/Cart.css';
import CartItem from "./cartItem";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems } = useSelector(state => state.cart);
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = tax + subtotal + shipping;
    const navigate = useNavigate();
    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');

    }
    return (
        <>
            <PageTitle title={'your cart'} />
            <NavBar />
            {
                cartItems.length === 0 ? (<>
                    <div className="empty-cart-container">
                        <p className="empty-cart-message">Your Cart is Emtpy</p>
                        <Link className="viewProducts" to={'/products'} >View Products</Link>
                    </div>

                </>) : (<>
                    <div className="cart-page">
                        <div className="cart-items">
                            <div className="cart-items-heading">your cart</div>
                            <div className="cart-table">
                                <div className="cart-table-header">
                                    <div className="header-product">Product</div>
                                    <div className="header-quantity">Qunatity</div>
                                    <div className="header-total item-total-heading">Item Total</div>
                                    <div className="header-action">Actions</div>
                                </div>
                                {
                                    cartItems && cartItems.map(item => <CartItem key={item.product} item={item} />)
                                }
                            </div>
                        </div>
                        <div className="price-summary">
                            <h2 className="price-summary-heading">Price Summary</h2>
                            <div className="summary-item">
                                <p className="summary-label">Subtotal</p>
                                <p className="summary-value">{subtotal}dh</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">tax (18%)</p>
                                <p className="summary-value">{tax}dh</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Shipping</p>
                                <p className="summary-value">{shipping}dh</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Total</p>
                                <p className="summary-value">{total}dh</p>
                            </div>
                            <button className="checkout-btn" onClick={checkoutHandler} >
                                Proceed to checkout
                            </button>

                        </div>


                    </div>

                </>)
            }

            <Footer />
        </>
    )
}
export default Cart;
