import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/UserStyles/Form.css'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeSuccess } from '../features/user/userSlice';
import { removeErrors } from '../features/user/userSlice';
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const { loading, error, success,isAuthenticated } = useSelector(state => state.user);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation();
    const redirect=new URLSearchParams(location.search).get('redirect') || '/';

    const handleLoginSubmit = e => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('please fill in the required fields to login', { position: 'top-center', autoClose: 3000 })
            return;
        }
        dispatch(login({email,password}));
    }
    useEffect(()=>{
      if(error){
    toast.error(error,{position:'top-center',autoClose:3000})

    dispatch(removeErrors())
      }
    },[dispatch,error])

    useEffect(()=>{
      if(isAuthenticated){
        navigate(redirect);
      }
    },[isAuthenticated])
    useEffect(()=>{
      if(success){
    toast.success('login successfully',{position:'top-center',autoClose:3000})
    dispatch(removeSuccess())
      }
    },[dispatch,success])
    return (
        <>
            <div className="form-container container">
                <div className="form-content">
                    <form className="form"  onSubmit={handleLoginSubmit}>
                        <h2>Sign In</h2>

                        <div className="input-group">
                            <input type="email" name="email" id="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                        </div>

                        <button className='authBtn'>{loading?'Sinning In':"Sign In"}</button>
                        <p className="form-links">
                            Forgot password <Link to='/forgot/password'>Reset password</Link>
                        </p>
                        <p className="form-links">
                            Don't have an acccount <Link to='/register'>Register Here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Login;