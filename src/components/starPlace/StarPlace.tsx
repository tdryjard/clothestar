import React, { useState, useEffect } from 'react'
import { Navbar } from '../navbar/Navbar'
import { Star } from '../star/Star'
import url from '../../api/url'

export const StarPlace = () => {
    const [stars, setStars] = useState([])


    useEffect(() => {
        getStars()
    }, [])

    const getStars = async () => {
        const res = await fetch(`${url}/star/find`)
        if (res) {
            const resJson = await res.json()
            if (resJson) setStars(resJson)
        }
    }

    return (
        <div className="container">
            <head>
                <title>Clothestar : stars</title>
                <meta name="description" content="" />
                <meta name="og:title" property="og:title" content="" />
                <meta name="og:description" property="og:description" content="" />
                <meta name="robots" content="index, follow" />
            </head>
            <Navbar />
            <div style={{ marginTop: '150px' }} className="containerProducts">
                {stars.length > 0 && stars.map((star: any) => {
                    return (
                        <Star star={star}/>
                    )
                })}
            </div>
        </div>
    )
}