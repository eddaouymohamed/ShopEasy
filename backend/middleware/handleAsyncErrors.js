export default fn=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next)
}
/// for handling validtion errors in mongodb ex we give name of produuct required
// this midlewre is remplace trycath bloc insdie an ayns function