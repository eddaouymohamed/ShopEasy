import React, { useEffect, useState } from 'react'
import PageTitle from '../components/pageTitle'
import NavBar from '../components/navBar'
import Footer from '../components/footer'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUserDetails, removeErrors, removeMessage, removeSucces, updateUserRole } from '../features/admin/adminSlice';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AdminStyles/UpdateRole.css'
import Loader from '../components/loder';
import { toast } from 'react-toastify';

function UpdateUserRole() {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { user, loading, error, success, updating ,message} = useSelector(st => st.admin);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            dispatch(getSingleUserDetails(id))

        }
        return () => dispatch(removeErrors());

    }, [id, dispatch])
    useEffect(() => {
        if (user) {
            setRole(user.role);
            setName(user.name);
            setEmail(user.email)
            console.log(user)
        }
        else {
            console.log('no user yet')
        }

    }, [user])
    useEffect(() => {

        if (error) {
            toast.error(error || 'error while fetching user details', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors());
        }
        if(message && success){
            toast.success(message|| 'user Role updated Successfully',{position:'top-center',autoClose:3000});
            dispatch(removeMessage());
            navigate('/admin/users')

        }
        if (success ) {
            dispatch(removeSucces())
        }

    }, [dispatch, error, success,message])
    const handleUpdateRoleSubmit=(e)=>{
        e.preventDefault();
        const formData={
            role:role
        }
        dispatch(updateUserRole({id,formData}));
    }
    return (
        <>
            <PageTitle title={'Upadet User Role'} />
            <NavBar />
            <div className="page-wrapper">
                {loading ? <Loader /> : (
                    <div className="update-user-role-container">
                        <h1 className='update-user-role-title'>Update User Role</h1>
                        {user && <form className='update-user-role-form' onSubmit={handleUpdateRoleSubmit} >
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" name='name' id='name' readOnly value={name} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="text" name='email' id='email' readOnly value={email} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">User Role</label>
                                <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="admin"> Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <button className='btn'> {
                                updating[id] ? 'Updating User Role......' : 'Update User Role'
                            }
                            </button>
                        </form>}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default UpdateUserRole