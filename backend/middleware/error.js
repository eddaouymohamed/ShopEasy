// error.js
import ErrorHandling from "../utils/errorHandling.js";

export default (err,req,res,next)=>{  // err instance of ErrorHandling
    // mo,godb error ex id parm is for 16 chars if we enter jsut 10 chars this catserror and
    // err.path is id
    if(err.name==='CastError'){
        const message=`this is invalid resource ${err.path}` // err.path ex:id:htpp:any"/"-__"_"çé
        //  // id=-__"_"çé
        err=new ErrorHandling(message,404)
    }
    ///handling error of  aunique field and renter the same value
    if(err.code===11000){
        const message =`the ${ Object.keys(err.keyValue)} already exists please sign in to continue `;
        /// err.keyValue ex: {email:"AISJJJSSS"} this an objec with one pair key-value so OBJ.//
        // keys is email
        err=new ErrorHandling(message,400)
    }
    const message=err.message || 'Internal Server Error'
    const statusCode=err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:message
    })
}