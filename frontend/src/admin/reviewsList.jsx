// import React, { useRef } from 'react'
// import '../styles/AdminStyles/ReviewsList.css'
// import PageTitle from '../components/pageTitle'
// import NavBar from '../components/navBar'
// import Footer from '../components/footer'
// import { useDispatch, useSelector } from 'react-redux'
// import { deleteProductReview, getAllAdminProducts, getProductReviews, removeErrors, removeMessage, removeSucces } from '../features/admin/adminSlice'
// import Loader from '../components/loder'
// import { useEffect } from 'react'
// import { toast } from 'react-toastify'
// import { Link, useNavigate } from 'react-router-dom'
// import { useState } from 'react'
// import { Delete } from '@mui/icons-material'
import React, { useRef, useEffect, useState } from 'react';
import '../styles/AdminStyles/ReviewsList.css';
import PageTitle from '../components/pageTitle';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteProductReview,
  getAllAdminProducts,
  getProductReviews,
  removeErrors,
  removeMessage,
  removeSucces
} from '../features/admin/adminSlice';
import Loader from '../components/loder';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Import MUI icon individually, keeping original name
import Delete from '@mui/icons-material/Delete';


function ReviewsList() {
    const { products, success, error, loading, message, reviews, reviewsLoading, deleting } = useSelector(st => st.admin);
    // const [reviewsState, ] = useState([]);
    const [productId, setProductId] = useState('');
    const tableRef = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getAllAdminProducts());
        return () => dispatch(removeErrors());
    }, [dispatch])
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success && message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeMessage());
            dispatch(removeSucces());
            navigate('/admin/products');

        }
        if (success) {
            dispatch(removeSucces());
        }


    }, [dispatch, error, success, message])
    const getProductReviewsHandler = (prod) => {
        // setReviews(prod.reviews)
        setProductId(prod._id)
        // console.log(prod._id)
        // console.log(prod);
        dispatch(getProductReviews(prod._id));

        if (reviews.length > 0 && tableRef) {
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
    //     useEffect(()=>{a
    // if(reviews){

    // }
    //     },[reviews])
    const deleteProductReviewHandler = (id) => {
        const isCconfirmed = window.confirm('are  you su<re you want delete this product Review');
        if (!isCconfirmed) return;
        dispatch(deleteProductReview({
            id, productId
        }))

    }
    if (!loading && products && products.length === 0) {
        return (
            <>
                <PageTitle title={'Reviews List'} />
                <NavBar />
                <div className="reviews-list-container">
                    <p className="no-admin-products">There are no products to see theeir reviews
                        <Link to={'/admin/dashboard'} className='view-btn' style={{
                            marginLeft: '10px'
                        }}>Go Back</Link>
                    </p>
                </div>
                <Footer />
            </>
        )
    }
    return (
        <>
            <PageTitle title={'Reviews List'} />
            <NavBar />
            {loading ? <Loader /> : (
                <div className="reviews-list-container">
                    <h1 className="reviews-list-container">
                        Products Reviews
                    </h1>
                    <table className="reviews-table">
                        <thead>
                            <tr>
                                <th>S1 No</th>
                                <th>Product Name</th>
                                <th>Product Imgae</th>
                                <th>Number Of Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <img className='product-image' src={product.image[0].url} alt={product.name} />
                                    </td>
                                    <td>{product.numOfReviews}</td>
                                    {product.numOfReviews > 0 && <td>
                                        <button className='view-btn' onClick={() => getProductReviewsHandler(product)}>
                                            <a target=""> View Reviews </a>
                                        </button>
                                    </td>}
                                </tr>))
                            }
                        </tbody>
                    </table>
                    {reviewsLoading && <div className='reviews-details'>
                        <Loader />
                    </div>}
                    {reviews && reviews.length > 0 && (<div className="reviews-details">
                        <h2>Product Reviews</h2>
                        <table className="reviews-table" id='reviews' ref={tableRef}>
                            <thead>
                                <tr>
                                    <th>S1 No</th>
                                    <th>Reviewer Name</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((rev, index) => (
                                    <tr key={index}>
                                        <td>{index + 1} </td>
                                        <td>{rev.name} </td>
                                        <td>{rev.rating} </td>
                                        <td>{rev.comment} </td>
                                        <td>
                                            {deleting[rev._id] ?
                                                'deleting....' :
                                                <Delete className='action-icon delete-icon' onClick={() => deleteProductReviewHandler(rev._id)} />}
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>

                    )}
                </div>)}
            <Footer />

        </>
    )
}

export default ReviewsList