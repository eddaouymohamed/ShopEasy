
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, removeSuccess, removeErrors } from '../features/user/userSlice';
import '../styles/UserStyles/Form.css';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/banner1.jpg');

    const { name, email, password } = user;
    const { loading, error, success } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle input changes
    const handleChangeInput = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(reader.result);
                        setAvatar(reader.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    // Handle form submit
    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password || !avatar) {
            toast.error('Please fill out all required fields', {
                position: 'top-center',
                autoClose: 3000,
            });
            return;
        }

        const userData = new FormData();
        userData.set('name', name);
        userData.set('email', email);
        userData.set('password', password);
        userData.set('avatar', avatar);

        dispatch(register(userData));
    };

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    // Handle success
    useEffect(() => {
        if (success) {
            toast.success('Registration successful', {
                position: 'top-center',
                autoClose: 3000,
            });

            dispatch(removeSuccess());

            // Reset form state before navigating
            setUser({ name: '', email: '', password: '' });
            setAvatar('');
            setAvatarPreview('/images/banner1.jpg');

            navigate('/login');
        }
    }, [dispatch, success, navigate]);

    return (
        <div className="form-container container">
            <div className="form-content">
                <form className="form" onSubmit={handleRegisterSubmit}>
                    <h2>Sign Up</h2>

                    {/* Username */}
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="User Name"
                            value={name}
                            onChange={handleChangeInput}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChangeInput}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChangeInput}
                            required
                        />
                    </div>

                    {/* Avatar Upload */}
                    <div className="input-group">
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            className="file-input"
                            accept="image/*"
                            onChange={handleChangeInput}
                            required
                        />
                        <div className="avatar-preview">
                            <img src={avatarPreview} alt="Avatar Preview" />
                        </div>
                    </div>

                    {/* Submit */}
                    <button className="authBtn" type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <p className="form-links">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
