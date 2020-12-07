import * as React from 'react'
import { CheckoutForm } from './CheckoutForm'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {Navbar} from '../navbar/Navbar'
import ReactPixel from 'react-facebook-pixel';


export const Buy = ({ panier, price, promoCode, newTotalPrice }: any) => {

    const stripePromise = loadStripe("pk_live_u4e03SLJFJMC8k4Bv7g1T3Py00rrpMeJLo");

    React.useEffect(() => {
        ReactPixel.pageView(); // For tracking page view

    }, [])

    return (
        <div className="containerElementPayment">
        <Elements stripe={stripePromise}>
            <CheckoutForm newTotalPrice={newTotalPrice} promoCode={promoCode} panier={panier} price={price} />
        </Elements>
        </div>
    );
};