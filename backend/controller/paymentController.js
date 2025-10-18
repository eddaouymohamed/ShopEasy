import { stripe } from "../server.js";
import handleAsyncErrors from "../middleware/handleAsyncErrors.js";
import { sendMail } from "../utils/sendMail.js";
// export const processPayment=handleAsyncErrors(async(req ,res)=>{
//     let {amount}=Number(req.body);
//     amount*=100; // amount in cents 1 dollar === 100 cents

//     const options={
//         amount,
//         currency:'usd',
//         payment_method_types:['card']
//     }
//     const paymentIntent=await stripe.paymentIntents.create(options);
//     res.status(200).json({
//         success:true,
//         clientSecret:paymentIntent.client_secret
//     })
// })
// // send api piublished stripe key
// export const sendAPIkEY=handleAsyncErrors(async(_req,res)=>{
//     const key=process.env.STRIPE_PUBLISHED_KEY
//     res.status(200).json({
//         success:true,
//         key

//     })
// })

// sendstripe  api pub key
// const sessioncreate=async()=>{
//     console.log(await stripe.checkout.sessions.create({
//          payment_method_types: ['card'],
//         mode: 'payment',
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     unit_amount: Math.round(amount * 100),
//                     product_data: {
//                         name: 'general product',
//                         description: 'genral description || tahanks for purchase'


//                     },

//                 },
//                 quantity:1
//             }
//         ],
//         customer_email:user.email,
// metadata:{
//     buyer_name:user.name,
//     phone:shippingInfo.phoneNumber
// },
// success_url:`${process.env.CLIENT_URL}/payment/success`,
// cancel_url:`${process.env.CLIENT_URL}/payment/cancel`


//     }))
// }
// sessioncreate();
export const sendAPIKey = handleAsyncErrors(async (req, res) => {
    const stripePublishedKey = process.env.STRIPE_PUBLISHED_KEY
    res.status(200).json({
        success: true,
        stripePublishedKey
    })
})
export const createCheckoutSesssion = handleAsyncErrors(async (req, res) => {
    const { amount, shippingInfo, user } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(amount * 100),
                    product_data: {
                        name: 'general product',
                        description: 'genral description || tahanks for purchase'


                    },

                },
                quantity: 1
            }
        ],
        customer_email: user.email,
        metadata: {
            buyer_name: user.name,
            phone: shippingInfo.phoneNumber
        },
        success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`

    })
    res.status(200).json({
        success: true,
        session,
        id: session.id,
        url: session.url,

    })
})
export const verfiyPayment = handleAsyncErrors(async (req, res) => {
    const { session_id } = req.body
    if (!session_id || typeof (session_id) !== 'string') {
        res.status(400).json({
            success: false,
            message: 'A valid session id is required'
        })
        return;
    }
    // retrieve session from stripe
    const session=await stripe.checkout.sessions.retrieve(session_id);
    /// check payment status
    if (session.payment_status==='paid') {
        // crate and save order model
        // sedn mail notification to user
        //
        const orderSuccessMessage=`thank for your order!\n Total Paid:${session.amount_total}\n we will get started on fulfillment shortly`
        let emailSent;
       try {
         sendMail({
            email: session.customer_email,
            subject: 'Your Order Confirmation',
            orderSuccessMessage

        })
        emailSent=true
       } catch (error) {
        emailSent=false;

       }
        res.status(200).json({
            success:true,
            message:'payment verfied successfully',
            emailSent
        })
        return;

    } else {
        // payent not comleted
        res.status(402).json({
            success:false,
            message:'payment is not completed or still pending'
        })


    }

})