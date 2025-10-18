import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails, removeErrors } from "../features/order/orderSlice";
import PageTitle from "../components/pageTitle";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import '../styles/OrderStyles/OrderDetails.css'
import Loader from "../components/loder";
import { toast } from "react-toastify";

export default function OrderDeatils() {
    const { orderId } = useParams();
    const { order, error, loading } = useSelector(state => state.order);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getOrderDetails(orderId))
        return ()=>dispatch(removeErrors());
    }, [dispatch, orderId])
    useEffect(() => {
        if (error) {
            toast.error(error || 'Failed to get order details', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors());
        }

    }, [dispatch, error])

    const {
        shippingInfo = {},
        paymentInfo = {},
        orderItems = [],
        itemPrice,
        totalPrice,
        taxPrice,
        shippingPrice,
        orderStatus,
        paidAt

    } = order
    const paymentStatus=paymentInfo.status==='succeeded'?"Paid":"Not Paid";
    const finalOrderSatatus=paymentStatus==='Not Paid'?'cancelled':orderStatus;
    const orderStatusClass=finalOrderSatatus==='Delivered'?'status-tag delivered':`status-tag ${finalOrderSatatus.toLowerCase()}`;
    const paymentStatusClass=`pay-tag ${paymentStatus===`Paid`?`paid`:`not-paid`}`

    return (
        <>
            <PageTitle title={orderId} />
            <NavBar />
            {loading ? <Loader /> : (
                <div className="order-box">
                    {/* order Items table */}
                    <div className="table-block">
                        <h2 className="table-title">Order Items</h2>
                        <table className="table-main">
                            <thead>
                                <tr>
                                    <th className="head-cell">Image</th>
                                    <th className="head-cell">Name</th>
                                    <th className="head-cell">Qauntity</th>
                                    <th className="head-cell">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                               {orderItems.map(item=>(
                                 <tr className="table-row" key={item._id}>
                                    <td className="table-cell">
                                        <img src={item.image} alt={item.name} className="item-img" />
                                    </td>
                                    <td className="table-cell">{item.name} </td>
                                    <td className="table-cell">{item.quantity}</td>
                                    <td className="table-cell">{item.price}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                    {/* shipping Info table */}
                    <div className="table-block">
                        <h2 className="table-title">
                            Shipping Info
                        </h2>
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell"> Adress</th>
                                    <td className="table-cell">{shippingInfo.address},{shippingInfo.city},{shippingInfo.state},{shippingInfo.country},{shippingInfo.pincode}</td>

                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell"> Phone</th>
                                    <td className="table-cell">{shippingInfo.phoneNumber} </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* oRDER Summary */}
                    <div className="table-block">
                        <h2 className="table-title">
                            Order Summary
                        </h2>
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">
                                        Order Status
                                    </th>
                                    <td className="table-cell">
                                        <span className={orderStatusClass}>
                                           {finalOrderSatatus}
                                        </span>
                                    </td>
                                </tr>
                                {/* //tr */}
                                <tr className="table-row">
                                    <th className="table-cell">
                                        Payment
                                    </th>
                                    <td className="table-cell">
                                        <span className={paymentStatusClass}>
                                           {paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                               {paidAt && <tr className="table-row">
                                    <th className="table-cell">
                                        Paid At
                                    </th>
                                    <td className="table-cell">
                                       {(new Date(paidAt)).toLocaleString()}
                                    </td>
                                </tr>}
                                <tr className="table-row">
                                    <th className="table-cell">
                                        Items Price
                                    </th>
                                    <td className="table-cell">
                                       {itemPrice}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">
                                        Tax Price
                                    </th>
                                    <td className="table-cell">
                                       {taxPrice}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">
                                        Shipping Price
                                    </th>
                                    <td className="table-cell">
                                        {shippingPrice}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">
                                        Total Price
                                    </th>
                                    <td className="table-cell">
                                        {totalPrice}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Footer />

        </>
    )

}