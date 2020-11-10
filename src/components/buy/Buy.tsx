import * as React from 'react'
import { CheckoutForm } from './CheckoutForm'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {Navbar} from '../navbar/Navbar'


export const Buy = ({ panier, price }: any) => {

    const stripePromise = loadStripe("pk_test_AGb35S7bWUgRgRUh3tsxgfrL00MDuBTKPS");

    return (
        <div className="containerElementPayment">
        <Elements stripe={stripePromise}>
            <CheckoutForm panier={panier} price={price} />
        </Elements>
        </div>
    );
};