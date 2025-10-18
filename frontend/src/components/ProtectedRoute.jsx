import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Loader from "./loder";
import '../styles/UserStyles/Profile.css';
import { useEffect } from "react";




export const ProtectedRoute = ({ element, adminOnly = false }) => {
    const { isAuthenticated, user, loading, error } = useSelector(state => state.user);
    // const navigate = useNavigate();
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to={'/'} />
    }
    if (loading) {
        return (
            <div className='profile-container'>
                <Loader />
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className='profile-container'>
                <div className="profile-image">
                    <h2 style={{
                        marginBlock: '5px'
                    }}>Error loading profile</h2>
                    <p style={{
                        marginBlock: '10px'
                    }}>{error}</p>
                    <Link to="/login">Go to Login</Link>
                </div>
            </div>
        );
    }

    // Handle case when user is not authenticated or user data is missing
    if (!isAuthenticated || !user) {
        return (
            <div className='profile-container'>
                <div className="profile-image">
                    <h2 style={{
                        marginBlock: '10px'
                    }}>Please log in to view your profile</h2>
                    <Link to="/login">Go to Login</Link>
                </div>
            </div>
        );
    }
    //  useEffect(()=>{
    //  },[])


    return element
}