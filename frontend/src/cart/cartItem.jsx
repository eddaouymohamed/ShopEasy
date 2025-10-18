import { toast } from "react-toastify";
import { addItemsToCart, removeErrors, removeItemFromCart, removeMessage, removeSuccess } from "../features/cart/cartSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CartItem = ({ item }) => {
    const { success, message, loading, error } = useSelector(state => state.cart);
    const [quantity, setQuantity] = useState(item.quantity)
    const dispatch = useDispatch();
    const handleUpadte = () => {
        if (loading) return;
        if (quantity !== item.quantity) {
            dispatch(addItemsToCart({
                id: item.product,
                quantity
            }))
        }
    }
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('qauntity cannot be less than 1', { position: 'top-center', autoClose: 3000, toastId: 'min-error' })
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty - 1);
    }
    const increaseQuantity = () => {
        console.log(item.stock)
        if (item.stock <= quantity) {
            toast.error('qauntity cannot exceed available stock', { position: 'top-center', autoClose: 3000, toastId: 'stock-error' })
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty + 1);
    }
    const handleRemove = () => {
        if (loading) return;
        dispatch(removeItemFromCart(item.product))
        toast.success('Item removed successfuly', {
            position: 'top-center',
            autoClose: 3000
        })
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000, toastId: 'cart-error' })
        }

    }, [dispatch, error])
    useEffect(() => {
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 3000, toastId: 'cart-success' })
            dispatch(removeSuccess())
            dispatch(removeMessage())
        }

    }, [dispatch, message, success])
    return (
        <>
            <div className="cart-item">
                <div className="cart-info">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                        <h3 className="item-name">{item.name} </h3>
                        <p className="item-price"><strong>Price: </strong>{item.price.toFixed(2)} dh</p>
                        <p className="item-quantity"><strong>Qauntity: </strong>{item.quantity} </p>
                    </div>
                </div>
                <div className="quantity-controls">

                    <button className="quantity-button decrease-btn" onClick={decreaseQuantity} disabled={loading} >-</button>
                    <input type="number" value={quantity} readOnly className="quantity-input" />
                    <button className="quantity-button increase-btn" onClick={increaseQuantity} disabled={loading} >+</button>
                </div>
                <div className="item-total">
                    <span className="item-total-price">{(item.quantity * item.price).toFixed(2)} </span>
                </div>
                <div className="item-actions">
                    <button className="update-item-btn" onClick={handleUpadte} disabled={loading || item.quantity === quantity} >{loading ? 'updating' : 'Update'} </button>
                    <button className="remove-item-btn" disabled={loading} onClick={handleRemove}>Remove</button>
                </div>
            </div>
        </>
    )
}
export default CartItem