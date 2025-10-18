import Footer from "../components/footer";
import NavBar from "../components/navBar";
import '../styles/pageStyles/Home.css';
import ImageSlider from "../components/imageSlider";
import Product from "../components/product";
import PageTitle from "../components/pageTitle";
import { getProduct, removeErrors } from "../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../components/loder";
import { toast } from "react-toastify";

const Home = () => {
  const { products, productCount, error, loading } = useSelector(state => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct({ keyword: '' }))
  }, [dispatch])
  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: 'top-center', autoClose: 3000 })
      dispatch(removeErrors())
    }
  }, [dispatch, error])
  return (
    <>
      {loading ? (<Loader />) : (<>
        <PageTitle title='home page' />
        <NavBar />
        <ImageSlider />
        <div className="home-container">
          <h2 className="home-heading">Trending Now </h2>
          <div className="home-product-container">
            {products.map((product, index) => (<Product product={product} key={index} />))}
          </div>
        </div>
        <Footer />
      </>)
      }
    </>
  )
}
export default Home;
