import * as React from 'react'
import url from '../../api/url'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {Link} from 'react-router-dom'
import './payment.css'

export const CheckoutForm = ({ panier, price }: any) => {

    const [email, setEmail] = React.useState<string>('')
    const [name, setName] = React.useState<string>('')
    const [error, setError] = React.useState<string>()
    const [load, setLoad] = React.useState(false)
    const [address, setAddress] = React.useState('')
    const [codePostal, setCodePostal] = React.useState('')
    const [country, setCountry] = React.useState('')
    const [city, setCity] = React.useState('')
    const [pay, setPay] = React.useState(false)

    const stripe = useStripe();
    const elements = useElements();

    const CARD_OPTIONS: object = {
        iconStyle: 'solid',
        style: {
            base: {
                iconColor: 'rgb(36, 36, 36)',
                color: 'rgb(36, 36, 36)',
                fontWeight: 600,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': { color: 'rgb(36, 36, 36)' },
                '::placeholder': { color: 'rgb(36, 36, 36)' },
            },
            invalid: {
                iconColor: '#ffc7ee',
                color: '#ffc7ee',
            },
        },
    };

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
    }

    function validateEemail(email: string) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validateCodePostal(code: string) {
        const re = /^(([0-8][0-9])|(9[0-5])|(2[ab]))[0-9]{3}$/;
        return re.test(code)
    }


    const subscription = async () => {
        if (!email || !validateEemail(email)) setError('Veuillez entrer une email correct')
        else if (!name) setError(`Veuillez entrer votre nom et prénom`)
        else if (!address) setError(`Veuillez entrer votre adresse postale`)
        else if (!codePostal || !validateCodePostal(codePostal)) setError('Veuillez un code postal correct')
        else if (!country) setError(`Veuillez entrer votre pays`)
        else if (!city) setError(`Veuillez entrer votre ville`)
        else {
            setLoad(true)
            const Email: string = email;
            const Name: string = name;
            let panierString = ""
            panier.map((product : any) => {
                panierString += `(id: ${product.id} nb: ${product.nb} size: ${product.size}) `
            })
            const resCustomer = await fetch(`${url}/create-customer`, {
                method: 'post',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    email: Email,
                    name: Name,
                    address: address,
                    city: city,
                    codePostal: codePostal,
                    country: country,
                    description : panierString
                })
            })
            const resCustomJson = await resCustomer.json()
            if (resCustomJson) {
                let price : any = 0
                    fetch(`${url}/product/find`)
                    .then(res => res.json())
                    .then(res => {
                        for(let i = 0; i < panier.length; i++){
                            for(let x = 0; x < res.length; x++){
                                if(res[x].id === panier[i].id) price += (panier[i].nb*res[x].price)
                            }
                            
                        }
                        if(price){
                        fetch(`${url}/secret`, {
                            method: 'post',
                            credentials: 'include',
                            headers: headRequest,
                            body: JSON.stringify({
                                price: parseFloat(price).toFixed(2),
                                customer: resCustomJson.customer.id,
                                email: email
                            })
                        })
                        .then(res => res.json())
                        .then(res => {
                            if (res) {
                                const clientSecret = res.client_secret;
                                paymenthod(clientSecret, name, Email, address, codePostal, country, city)
                            } else {
                                setError('Un problème est survenue avec le paiement, veuillez réessayer')
                                setLoad(false)
                            }
                        })
                    }
                    })
            } else {
                setError('Un problème est survenue avec le paiement, veuillez réessayer')
                setLoad(false)
            }
        }
    }

    const paymenthod = async (clientSecret: any, name: string, email: string, adresseP: string, codePostalP: string, countryP: string, cityP: string) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        let clientCountry = ""
        if((countryP.toLocaleLowerCase().replace(' ', '') === 'france') || countryP.toLocaleLowerCase() === 'fr') clientCountry = 'fr'
        else clientCountry = "us"
        let cardConfig: any = elements!.getElement(CardElement)
        const result = await stripe!.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardConfig,
                billing_details: {
                    name: name,
                    email : email,
                    address : {
                        city : cityP,
                        country: clientCountry,
                        line1 : adresseP,
                        postal_code : codePostalP
                    }
                },
            }
        });
        if (result.error) {
            setError('Un problème avec votre paiement est survenu, veuillez réessayer')
            setLoad(false)
        } else {
            setLoad(false)
            setPay(true)
            localStorage.setItem('panier', '')
        }
    }

    React.useEffect(() => {
        setTimeout(() => {
            setError('')
            setLoad(false)
        }, 7000)
    }, [error])


    const getemail = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target) setEmail(e.target.value)
    }

    const getName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }


    return (
        <div className="containerPayment">
            <div className="columnProductBuy">
                {!pay && <p style={{marginTop: '20px', marginBottom: '20px', fontWeight: "bold"}} className="text">temps de livraison estimé : 7 à 18 jours</p>}
            </div>
            {!pay ?
                <div className="containerBuy">
                    {error && <p className="errorPay">Une erreur s'est produite lors du paiment, veuillez réessayer</p>}
                    {!load ?
                        <>
                            <input className="inputPricingCard" onChange={getemail} placeholder="Votre email" />
                            <input className="inputPricingCard" onChange={getName} placeholder="Nom et prénom" />
                            <input className="inputPricingCard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setAddress(e.target.value) }} placeholder="Adresse" />
                            <input className="inputPricingCard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCity(e.target.value) }} placeholder="Ville" />
                            <input className="inputPricingCard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCodePostal(e.target.value) }} placeholder="Code postal" />
                            <input className="inputPricingCard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCountry(e.target.value) }} placeholder="Pays" />
                        </>
                        : <img alt="loading icon" style={{ width: "50%" }} src={require('./image/load.gif')} />}

                    <div className="inputPricingCard">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                    <p className="textConfirmCGV">En appuyant sur valider vous confirmez avoir pris connaissance de nos <Link to="/conditions-generales-de-vente" target="_blank" className="cgvConfirm">conditions générales de vente</Link> </p>
                    {!load && <button style={{ marginTop: '15px', maxWidth: '80%' }} onClick={() => { subscription() }} type="submit" className="button">Valider commande {price}€</button>}
                </div>
                :
                <div className="containerBuy" >
                    <p className="title">Merci d'avoir commandé !</p>
                    <ul style={{flexDirection: 'column', marginTop: '30px', marginBottom: '30px', justifyContent: 'flex-start', alignItems: 'flex-start'}} className="text">
                        <li>Prix : {price}€</li>
                        <li>Temps de livraison estimé : 7 à 18 jours</li>
                        <li>Adresse de livraison : {address}, {city}, {codePostal}, {country}</li>
                    </ul>
                    <p className="text">Vous allez recevoir votre facture par mail très prochainement, encore merci et à bientot !</p>
                </div>}
        </div>
    )
}