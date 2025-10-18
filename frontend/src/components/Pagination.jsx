import { useSelector } from "react-redux";
import '../styles/componentStyles/Pagination.css';

const Pagination=({
    onPageChange,
    currentPage,
activeClass='active',
nexPageText='Next',
prevPageText='Prev',
lastPageText='Last',
FisrtPageText='1st'
})=>{
    const paginationBtnClass='pagination-btn'
    const {products,totalPages}=useSelector(state=>state.product);
    if(!products || totalPages<=1) return null;
    const getPageNumbers=()=>{
const pageNumbers=[];
const pageWindow=2;
for (let index = Math.max(1,currentPage-pageWindow); index < Math.min(totalPages,currentPage+pageWindow); index++) {
pageNumbers.push(index);
}
return pageNumbers;
    }
    return(<div className="pagination">
    {currentPage>1 &&<>
    <button className={paginationBtnClass} onClick={()=>onPageChange(1)}>{FisrtPageText} </button>
    <button className={paginationBtnClass} onClick={()=>onPageChange(currentPage-1)}>{prevPageText} </button>
    </>}
    {
        getPageNumbers().map(number=>(
           <button className={paginationBtnClass+`${currentPage===number?` ${activeClass}`:''}`} key={number} onClick={()=>onPageChange(number)}>{number} </button>
        ))
    }
     {currentPage<totalPages &&<>
    <button className={paginationBtnClass} onClick={()=>onPageChange(currentPage+1)}>{nexPageText}</button>
    <button className={paginationBtnClass} onClick={()=>onPageChange(totalPages)}>{lastPageText}</button>
    </>}
    </div>
    )
}
export default Pagination;