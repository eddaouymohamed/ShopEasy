import React, { useEffect, useState } from 'react'
import '../styles/AdminStyles/UpdateOrder.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleOrder, removeErrors, removeMessage, removeSucces, updateOrderStatus } from '../features/admin/adminSlice';
import PageTitle from '../components/pageTitle';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import Loader from '../components/loder';
import { toast } from 'react-toastify';
function UpdateOrder() {
    const [status, setStatus] = useState('');
    const { loading, error, success, order, message, updating } = useSelector(st => st.admin);
    const dispatch = useDispatch();
    const navigate=useNavigate()
    const { id } = useParams();
    const statuses = ['Delivered', 'Canceled', 'Processing'];
    useEffect(() => {
        if (id) {
            dispatch(getSingleOrder(id));
        }
        return () => dispatch(removeErrors())

    }, [dispatch])
    useEffect(() => {
        if (order) {
            setStatus(order.orderStatus);
        }

    }, [order])
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors())
        }
        if (success && message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeMessage())
            navigate('/admin/orders');
        }
        if (success) {
            dispatch(removeSucces())
        }

    }, [error, success, dispatch,message])
    const updateOrderStatusSubmit = e => {
        e.preventDefault();
        const formData = {
            status
        }
        dispatch(updateOrderStatus({ id, formData }));
    }
    if (!loading && !order) {
        return (
            <>
                <PageTitle title={'Upadte Order Status'} />
                <NavBar />
                <div className="order-container">
                    <p className='no-admin-order'> failed to get order
                        <button className='update-button' onClick={() => dispatch(getSingleOrder(id))}> try again </button>
                    </p>
                </div>
                <Footer />
            </>
        )
    }
    return (
        <>
            <PageTitle title={'Upadte Order Status'} />
            <NavBar />
            {loading ? <Loader /> : (<div className="order-container">
                <h1 className="order-title">Upadte Order</h1>
                {order && <>
                    <div className="order-details">
                        <h2>Order Information</h2>
                        <p>Order ID:        {order._id}</p>
                        {order.shippingInfo && <>
                            <p>Shipping Adress: {order.shippingInfo.adrress}</p>
                            <p>Phone:           {order.shippingInfo.phoneNumber}</p>
                        </>
                        }
                        <p>Order Status:    {order.orderStatus}</p>
                        {order.paymentInfo &&
                            <p>Payment Status:  {order.paymentInfo.status}</p>}
                        <p> Total Price:    {order.totalPrice}</p>
                    </div>
                    <div className="order-items">
                        <h2>Order Items</h2>
                        <table className='order-table'>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems && order.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img className='order-item-image' src={item.image} alt={item.name} />
                                        </td>
                                        <td>{item.name} </td>
                                        <td>{item.quantity} </td>
                                        <td>{item.price} </td>
                                    </tr>
                                ))

                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="order-status">
                        <h2>Order Staus</h2>
                        <form onSubmit={updateOrderStatusSubmit} >

                            <select name="status" id="status" className="status-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                {statuses.map((stat, index) => (
                                    <option value={stat} key={index}>{stat} </option>
                                ))}
                            </select>
                            <button className='update-button'>
                                {updating[order._id] ? 'Updating Status.....' : 'Update Status'}
                            </button>
                        </form>
                    </div>
                </>}
            </div>
            )
            }
            <Footer />

        </>
    )
}

export default UpdateOrder