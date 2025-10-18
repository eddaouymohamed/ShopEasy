import mongoose from "mongoose";
const productsSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter  a product name'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Please neter  a product category ']

    },
    price:{
        type:Number,
        required:[true,'Please enter a product price'],
        maxLength:[7,'Price cannot exceed 7 digits']
    },
    ratings:{
           type:Number,
           default:0
    },
    image:[
        {
            public_id:{
                       type:String,
                       required:true,
                       default:'/images/banner1.jpg'
            },
            url:{
                type:String,
                required:true,
                  default:'/images/banner1.jpg'
            }

        }
    ],
    category:{
            type:String,
            required:[true,'please enter a product category']
    },
     stock:{
         type:Number,
         required:[true,'please entre  product stock  '],
         maxLength:[5,'stock number cannot exceed 5 digits'],
         default:1
     },
     numOfReviews:{
        type:Number,
        default:0

     },
     reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },

            name:{
                type:String,
                trim:false,
                required:true
            },
            rating:{
                type:Number,
               required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
     ],
     user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
     },
     createdAt:{
        type:Date,
        default:Date.now
     }

})
export default mongoose.model('Product',productsSchema);