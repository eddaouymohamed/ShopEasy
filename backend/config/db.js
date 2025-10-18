import mongoose from "mongoose";
const dbUri=process.env.DB_URI;
 export const connectMongoDb=()=>{
try {
    mongoose.connect(dbUri).
then(data=>{
    console.log(`MongoDb Connected with server ${data.connection.host}`)
})
} catch (error) {
    console.log('error Connection to data base',error);
    throw new Error('connection to Data Base Failed'+error.message)
}
}