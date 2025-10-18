const jwtCookieExpiresIn=process.env.JWT_COOKIE_EXPIRES_IN || 3;
 const  sendToken=(user,statuscode,res)=>{
    const token=user.getJwtToken();
    const options={
        expires:new Date(Date.now()+jwtCookieExpiresIn*24*60*60*1000)
        ,httponly:true
    }
    res.status(statuscode).
    cookie('token',token,options).
    json({
        success:true,
        user,
        token,
    })
}
export default sendToken;
