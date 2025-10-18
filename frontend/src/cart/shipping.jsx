
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/footer';
import NavBar from '../components/navBar';
import PageTitle from '../components/pageTitle';
import '../styles/CartStyles/Shipping.css'
import CheckOutPath from './checkoutPath';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Country, State, City } from 'country-state-city'
import { saveShipingInfo } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
const Shipping = () => {
    const { shippingInfo } = useSelector(state => state.cart);
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || '');
    const [country, setCountry] = useState(shippingInfo.country || '');
    const [state, setState] = useState(shippingInfo.state || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const shippingInfoSubmit = e => {
        e.preventDefault();
        if (phoneNumber.length !== 10) {
            toast.error('phone Number should be 10 digits', { position: 'top-center', autoClose: 2550, toastId: 'phone-error' })
            return;
        }
        dispatch(saveShipingInfo({
            address,
            pinCode,
            phoneNumber,
            country,
            state,
            city
        }))
        navigate('/order/confirm')


    }
    // const []
    return (
        <>
            <PageTitle title={'shipping |info'} />
            <NavBar />
            <CheckOutPath activePath={0} />

            <div className="shipping-form-container">
                <h1 className='shipping-form-header'> Shipping Deatils</h1>
                <form className="shipping-form" onSubmit={shippingInfoSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="address">Adresss *</label>
                            <input type="text" name="address" id="address" placeholder='please enter your address' required value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">PinCode</label>
                            <input type="text" name="pinCode" id="pinCode" placeholder='please enter your pinCode'
                                value={pinCode} onChange={(e) => setPinCode(e.target.value)}

                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="phoneNumber">Phone Number *</label>
                            <input type="tel" name="phoneNumber" id="phoneNumber" placeholder='please enter your phone Number' required
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}

                            />
                        </div>
                    </div>
                    <div className="shipping-form-section">
                        <div className="shipping-form-group">
                            <label htmlFor='country'>Country</label>

                            <select name="country" id="country"  required value={country} onChange={(e) => {
                                setCountry(e.target.value)
                                setState('');
                                setCity('')
                                }}>
                                <option value="">Select a country</option>
                                {
                                    Country && Country.getAllCountries().map(ctry => (
                                        <option value={ctry.isoCode} key={ctry.isoCode}>{ctry.name} </option>
                                    ))}
                            </select>
                        </div>
                      { country && <>  <div className="shipping-form-group">
                            <label htmlFor='state' >State *</label>

                            <select name="state" id="state" value={state}  onChange={(e) => {setState(e.target.value)
                                setCity('')
                            }}

                                required>
                                <option value="">Select a state</option>
                                {
                                    State && State.getStatesOfCountry(country).map(ste => (
                                        <option value={ste.isoCode} key={ste.isoCode}>{ste.name} </option>
                                    ))
                                }
                            </select>
                        </div>
                       { state && <div className="shipping-form-group">
                            <label htmlFor='city'>City </label>

                            <select name="city" id="city"
                                value={city} onChange={(e) => setCity(e.target.value)}>
                                <option value="">Select a city</option>
                                {
                                    City && City.getCitiesOfState(country, state).map(cty => (
                                        <option value={cty.name} key={cty.name}> {cty.name} </option>
                                    ))
                                }
                            </select>
                        </div>} </>}
                    </div>
                    <button className="shipping-submit-btn">Continue</button>

                </form>
            </div>
            <Footer />



        </>
    )
}
export default Shipping;