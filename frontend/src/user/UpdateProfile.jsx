import { useState } from 'react'
import Footer from '../components/footer'
import NavBar from '../components/navBar'
import '../styles/UserStyles/Form.css';
import banner1 from '/images/banner1.jpg'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, removeSuccess, updateProfile } from '../features/user/userSlice';
import { useEffect } from 'react';
export const UpadteProfile=()=>{
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [avatar,setAvatar]=useState('')
    const [avatarPreview,setAvatarPreview]=useState(banner1);
    const {user,success,error,message}=useSelector(state=>state.user);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const profileImageUpadte=e=>{
        const reader=new FileReader();

        reader.onload=()=>{
            if(reader.readyState===2){
                setAvatarPreview(reader.result);
        setAvatar(reader.result);
    }
    reader.onerror=(error)=>{
        toast.error('Failed to read File ',{position:'top-center',autoClose:3000})

    }
}
reader.readAsDataURL(e.target.files[0]);
}
const handleSubmitUpdate=e=>{
        e.preventDefault();
        const myForm=new FormData();
        myForm.set('name',name)
        myForm.set('email',email)
        myForm.set('avatar',avatar)
        console.log(myForm)
        dispatch(updateProfile(myForm));
    }
    useEffect(()=>{
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
    },[dispatch,error])
    useEffect(()=>{
        if(success){
            console.log(success,'upadte profile success',user)
            toast.success(message,{position:'top-center',autoClose:3000})
            dispatch(removeSuccess())
            navigate('/profile')
        }
    },[dispatch,success])

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAvatarPreview(user.avatar?.url || banner1);
        }
    }, [user]);
    return(
        <>
    <NavBar />
    <div className="container update-container">
        <div className="form-content">
            <form className='form' onSubmit={handleSubmitUpdate} encType='multipart/form-data'>
                <h2>Update Profile</h2>
                <div className="input-group avatar-group">
                    <input type="file" accept='image/*'  className='file-input' name='avatar'  onChange={profileImageUpadte}/>
                    <img src={avatarPreview} alt="User Profile" className='avatar' />
                </div>
                <div className="input-group">
                    <input type="text" name='name' value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                 <div className="input-group">
                    <input type="email"  name='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <button className="authBtn" type='submit'>Upadte</button>
            </form>
        </div>
    </div>
    <Footer/>

    </>

    )
}