import handleAsyncErrors from "../middleware/handleAsyncErrors.js";
import ErrorHandling from "../utils/errorHandling.js";
import Order from '../models/orderModel.js';
import Product from '../models/productsmodel.js';

// create order
export const createNewOrder = handleAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice,
        shippingPrice, totalPrice, } = req.body
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id|| req.user.id
    })
    res.status(201).json({
        success: true,
        order
    })
})
// get single order by admin
export const getSingleOrder = handleAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('user', 'name email');
    // just admin can get singleOrder,so we use populate to get email and name of user who make this order
    let message;
    if (!order) {
        message = 'Order not found ';
        return next(new ErrorHandling(message, 404))

    }
    res.status(200).json({
        success: true,
        order
    })
})
// get all orders of user
export const allMyOrders = handleAsyncErrors(async (req, res, next) => {
    const userId = req.user._id || req.user.id;


    const orders = await Order.find({
        user: userId
    })
    let message;
    if (!orders) {
        message = 'there is no order';
        return next(new ErrorHandling(message, 404))

    }
    res.status(200).json({
        success: true,
        orders
    })

})
// getALLorders  for admin
export const getAllOrders = handleAsyncErrors(async (_req, res, next) => {
    const orders = await Order.find();
    let message;
    if (!orders) {
        message = 'there is no order';
        return next(new ErrorHandling(message, 404))

    }
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })

})
// update order status
export const updateOrderStatus = handleAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    let message;
    if (!order) {
        message = 'No Order Found '
        return next(new ErrorHandling(message, 404))

    }
    if (order.orderStatus === 'Delivered') {
        message = 'this order is already have been delivered'
        return next(new ErrorHandling(message, 404))
    }
    const { status } = req.body;
    if (status === 'Delivered') {
        Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)))
        order.deliveredAt = Date.now()
    }
    order.orderStatus = status
    await order.save({
        validateBeforeSave:false
    })
    res.status(200).json({
        success:true,
        order,
        message:'order Staus updated successfully'
    })

})
// upadate quantity function
async function updateQuantity(id,quantity) {
    const product=await Product.findById(id);
    let message;
    if(!product){
        message='Product not found'
        throw new Error(message);
    }
    product.stock-=quantity;
    await product.save({
        validateBeforeSave:false
    })

}
// delete order
export const deleteOrder=handleAsyncErrors (async (req,res,next)=>{
    const orderId=req.params.id;
    const order=await Order.findById(orderId);
    let message;
    if (!order) {
        message=`there is no order match the id :${orderId}`;
        return next (new ErrorHandling(message,404))

    }
    if (order.orderStatus!=='Delivered') {
        message='this order under processing and cannot delete it ';
        return next(new ErrorHandling(message,404))

    }
    await Order.deleteOne({_id:orderId});
    res.status(200).json({
        success:true,
        message:'order deleted successfully'
    })

})