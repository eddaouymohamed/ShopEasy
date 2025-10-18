import Rating from "@mui/material/Rating";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import PageTitle from "../components/pageTitle";
import '../styles/pageStyles/ProductDetails.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createReview, getProductDetails, removeErrors, removeSuccess } from "../features/products/productsSlice";
import { toast } from "react-toastify";
import Loader from "../components/loder";
import { addItemsToCart, removeMessage,removeSuccess as removesuccessCart} from "../features/cart/cartSlice";
const ProductDetails = () => {
    const [userRating, setUserRating] = useState(4);
    const [comment, setComment] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState('')
    const [viewMoreProducts, setViewMoreProducts] = useState(null);
    const { product, error, loading, reviewLoading, reviewSuccess } = useSelector(state => state.product);
    const { loading: cartLoading, error: cartError, message, success } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { id } = useParams();
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('qauntity cannot be less than 1', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty - 1);
    }
    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error('qauntity cannot exceed available stock', { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors());
            return;
        }
        setQuantity(qty => qty + 1);
    }
    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }
    const addTOCart = () => {
        dispatch(addItemsToCart({ id, quantity }))
        setViewMoreProducts('ADD More Products')

    }
    useEffect(() => {
        if (id) {
            console.log(id)
            dispatch(getProductDetails(id));
        }
        return () => dispatch(removeErrors())

    }, [dispatch, id])
    useEffect(() => {
        if (product && product.image && product.image.length  > 0 && product.image[0].url ) {
            setSelectedImage(product.image[0].url);
        }
    }, [product])

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 })

            dispatch(removeErrors())
        }

    }, [dispatch, error])
    useEffect(() => {
        if (cartError) {
            toast.error(cartError, { position: 'top-center', autoClose: 3000 })
        }

    }, [dispatch, error, cartError])
    useEffect(() => {
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 3000 })

            dispatch(removeMessage())
            dispatch(removesuccessCart())
        }

    }, [dispatch, message, success])

    const handleReviewSubmit = e => {
        e.preventDefault();
        if (!userRating) {
            toast.error('please give a rating', { position: 'top-center', autoClose: 3000 })
            return;
        }
        dispatch(createReview({
            rating: userRating,
            comment,
            productId: id
        }))
    }
    useEffect(() => {
        if (reviewSuccess) {
            toast.success('review Submitted succesfuly', { position: 'top-center', autoClose: 3000 });
            setUserRating(0)
            setComment('');
            dispatch(removeSuccess());
            dispatch(getProductDetails(id))
        }
    }, [dispatch, id, reviewSuccess])
    return (
        <>
            <NavBar />
            {loading ? (<Loader />) : (product ? <>
                <PageTitle title={`${product.name} || details`} />
                <div className="product-details-container">
                    <div className="product-detail-container">
                        <div className="product-image-container">
                            {product && product.image && product.image.length > 0 && selectedImage &&
                                <img src={selectedImage} alt={product.name}
                                    className="product-detail-image" />
                            }
                            {product.image.length > 1 && (
                                <div className="product-thumbnails">
                                    {product.image.map((img, index) => (
                                        <img key={index} src={img.url} alt={`thumbnail ${index + 1}`}
                                            className="thumbnail-image" onClick={() => setSelectedImage(img.url)}
                                        />
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="product-info">
                            <h2>{product.name}</h2>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">
                                Price:{product.price} dh
                            </p>
                            <div className="product-rating">
                                <Rating
                                    value={product.ratings}
                                    disabled={true} />
                                <span className="productCardSpan">
                                    ({product.numOfReviews} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})
                                </span>

                            </div>
                            <div className="stock-status">
                                <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>{product.stock > 0 ? `In stock (${product.stock} available)` : 'out of stock'}</span>
                            </div>
                            {product.stock > 0 && <>
                                <div className="quantity-controls">
                                    <span className="quantity-label" >Quantity</span>
                                    <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                                    <input type="text" readOnly className="quantity-value" value={quantity} />
                                    <button className="quantity-button" onClick={increaseQuantity}>+</button>
                                </div>
                            </>}
                            <button className="add-to-cart-btn" disabled={cartLoading} onClick={addTOCart}>{cartLoading ? 'adding' : 'Add To Cart'} </button>
                            <button to={'/products'} className="add-to-cart-btn" disabled={cartLoading} style={{
                                display: viewMoreProducts ? 'block' : 'none'
                            }} onClick={() => navigate('/products')} > {viewMoreProducts} </button>
                            <form className="review-form" onSubmit={handleReviewSubmit}>
                                <h3>Write a review</h3>
                                <Rating value={userRating}
                                    disabled={false}
                                    onChange={(_, newValue) => handleRatingChange(newValue)}
                                />
                                <textarea
                                    name="review"
                                    id="review"
                                    placeholder="write your review here "
                                    className="review-input"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                >

                                </textarea>
                                <button className="submit-review-btn" disabled={reviewLoading} >{reviewLoading ? 'Submitting' : 'submit review'} </button>
                            </form>
                        </div>
                    </div>
                    <div className="reviews-container">
                        <h3>Customer Reviews</h3>
                        {(product.reviews && product.reviews.length > 0) ? (<div className="reviews-section">
                            {product.reviews.map((review, index) => (
                                <div className="review-item" key={index}>
                                    <div className="review-header">
                                        <Rating
                                            value={review.rating}
                                            disabled={true} />
                                    </div>
                                    <p className="review-comment">{review.comment} </p>
                                    <p className="review-name">By : {review.name}</p>
                                </div>
                            ))}
                        </div>) : (<p className="no-reviews">
                            No reviews yet. Be the first to rate this product!
                        </p>)

                        }
                    </div>
                </div>
            </> : (<> there is no product</>))}
            <Footer />

        </>
    )
}
export default ProductDetails;