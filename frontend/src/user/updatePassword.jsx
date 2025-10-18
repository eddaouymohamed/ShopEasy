import { useEffect, useState } from 'react';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import '../styles/UserStyles/Form.css';
import PageTitle from '../components/pageTitle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeErrors, removeSuccess, updatePassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';
 const UpdatePassword=()=>{
    const [oldPassword,setOldPassword]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {error,loading,success}=useSelector(state=>state.user);
    const handleUpdatePassword=e=>{
        e.preventDefault();
        const myForm=new FormData();
        myForm.set('oldPassword',oldPassword)
        myForm.set('newPassword',newPassword)
        myForm.set('confirmPassword',confirmPassword)
        console.log(myForm)
        dispatch(updatePassword(myForm));
    }
useEffect(()=>{
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
    },[dispatch,error])
    useEffect(()=>{
        if(success){
            // console.log(success,'password updated succesfully',user)
            toast.success('password updated succesfully',{position:'top-center',autoClose:3000})
            dispatch(removeSuccess())
            navigate('/profile')
        }
    },[dispatch,success])

    return(
        <>
        <NavBar/>
        <PageTitle title={'password|update'}/>
        <div className="container update-container">
                   <div className="form-content">
                     <form className="form"  onSubmit={handleUpdatePassword}>
                        <h2>changing password</h2>
                        <div className="input-group">
                            {/* oldPassword, newPassword, confirmPassword */}
                            <input type="password" name="oldPassword"  placeholder='old password' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type="password" name="newPassword" id="newPassword" placeholder='New Password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type="password" name="confirmPassword"  placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                        </div>

                        <button className='authBtn'>Update Password</button>


                    </form>
                   </div>
        </div>
        <Footer/>
        </>
    )
}
export default UpdatePassword;