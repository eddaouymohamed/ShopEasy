// import '../styles/CartStyles/CheckoutPath.css';
// import { AccountBalance, LibraryAddCheck, LocalShipping } from "@mui/icons-material"
import '../styles/CartStyles/CheckoutPath.css';

// ✅ Import MUI icons individually, keeping original names
import AccountBalance from '@mui/icons-material/AccountBalance';
import LibraryAddCheck from '@mui/icons-material/LibraryAddCheck';
import LocalShipping from '@mui/icons-material/LocalShipping';


const CheckOutPath=({activePath})=>{
    const path=[
        {
            label:'Shipping Daetails',
            icon:<LocalShipping />
        },
        {
            label:'Confirm Order',
            icon:<LibraryAddCheck />
        },
        {
            label:'Payment',
            icon:<AccountBalance/>

        }
    ]
    return(
        <div className="checkoutPath">
           {path.map((item,index)=>(
            <div className="checkoutPath-step" key={item.label} active={activePath===index?'true':'false'}
            completed={activePath>=index?'true':'false'} >
                <p className="checkoutPath-icon">
                    {item.icon}
                </p>
                <p className="checkoutPath-label">
                   {item.label}
                </p>
            </div>
                )) }
        </div>
    )
}
export default CheckOutPath