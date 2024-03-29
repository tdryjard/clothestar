import React, { useState, useEffect } from 'react'
import { Navbar } from '../navbar/Navbar'
import { Product } from '../product/Product'
import ReactPixel from 'react-facebook-pixel';
import url from '../../api/url'

export const Shop = ({products} : any) => {
    const [name] = useState<string>('Clothestar')
    const [describe] = useState<any>(`Retrouvez les tenues de vos stars préférée aux meilleurs prix`)


    useEffect(() => {
        ReactPixel.pageView(); // For tracking page view
    }, [])

    return (
        <div className="container">
            <head>
                <title>{name} : boutique</title>
                <meta name="description" content={describe} />
                <meta name="og:title" property="og:title" content={name} />
                <meta name="og:description" property="og:description" content={describe} />
                <meta name="robots" content="index, follow" />
            </head>
            <Navbar />
                {products.length > 0 && products.map((product: any) => {
                    return (
                        <Product stock={product.stock} dateDelivery={product.date_delivery} imageId1={product.image_id} imageId2={product.image_id_2} imageId3={product.image_id_3} id={product.id} tokenProps={''} verifToken={false} priceId={product.price_stripe_id} pricePromo={product.promo_price} price={product.price} title={product.title} description={product.description} base1={product.base1} base2={product.base2} base3={product.base3} 
                        sizes={[product.size1, product.size2, product.size3, product.size4, product.size5, product.size6, product.size7, product.size8]} />
                    )
                })}
        </div>
    )
}