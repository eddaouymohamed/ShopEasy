import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import PageTitle from "../components/pageTitle";
import '../styles/pageStyles/Products.css';
import { useEffect, useState } from "react";
import { getProduct, removeErrors } from "../features/products/productsSlice";
import { toast } from "react-toastify";
import Loader from "../components/loder";
import Product from "../components/product";
import { useLocation, useNavigate } from "react-router-dom";
import NoProducts from "../components/noProducts";
import Pagination from "../components/Pagination";


const Products = () => {
    const { products, loading, error } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const SearchParams = new URLSearchParams(location.search);
    const keyword = SearchParams.get('keyword');
    const pageFromUrl = parseInt(SearchParams.get('page'), 10) || 1;
    const category = SearchParams.get('category');
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const navigate = useNavigate();
        const categories = ['tv', 'mobile','laptop', 'jackets', 'tablet','tshirt','watches'];

    // const categories = [
    //     'mobile',
    //     'laptop',
    //     'tablet',
    //     'tv',
    //     'jackets',
    //     'jeans',
    //     'accessories',
    //     'watches',
    //     'sports',
    //     'travel'
    // ];

    const handlePageChange = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page)
            const newSearchParams = new URLSearchParams(location.search)
            if (page === 1) {
                newSearchParams.delete('page');
            }
            else {
                newSearchParams.set('page', page)
            }
            navigate(`?${newSearchParams.toString()}`)

        }

    }
    const handleCategorieClick = category => {
        const newSearchParams = new URLSearchParams(location.search)
        newSearchParams.set('category', category);
        newSearchParams.delete('page');
        newSearchParams.delete('keyword')
        navigate(`?${newSearchParams.toString()}`);
    }
    useEffect(() => {
        dispatch(getProduct({ keyword, page: currentPage, category }))
    }, [dispatch, keyword, currentPage, category])
    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 300 })
            dispatch(removeErrors())
        }
    }, [dispatch, error])
    return (
        <>
            <PageTitle title={'All Products'} />
            <NavBar />
            <div className="products-layout">
                <div className="filter-section">
                    <h3 className="filter-heading">Categories</h3>
                    <ul>
                        {categories.map(category => {
                            return (
                                <li key={category} onClick={() => handleCategorieClick(category)}>{category} </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="products-section">
                    {
                        products.length > 0 ?
                            (<div className="products-product-container">
                                {loading && <Loader />}
                                {products &&
                                    products.map((product, index) => product.stock > 0 ?
                                        (<Product product={product} key={index} />) :
                                        null
                                    )}
                            </div>) :
                            (<NoProducts keyword={keyword} />)
                    }
                    <Pagination currentPage={currentPage}
                        onPageChange={handlePageChange} />
                </div>
            </div>
            <Footer />
        </>
    )
}
export default Products;