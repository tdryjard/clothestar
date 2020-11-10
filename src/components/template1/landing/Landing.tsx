import React, { useState, useEffect } from 'react'
import { Navbar } from '../../navbar/Navbar'
import {Link} from 'react-router-dom'
import url from '../../../api/url'
import Chatbot from '../../sortouch/chatbotArea/ChatBotArea'
import {Dress} from '../../dress/Dress'
import {Footer} from '../../footer/Footer'
import './Landing.scss'

export const Landing = () => {
    const [starSearch, setStarSearch] = useState<any>(window.location.search.split('?'))
    const [stars, setStars] = useState([])
    const [name] = useState<string>('Clothestar')
    const [describe] = useState<any>(`Retrouvez les tenues de vos stars préférée aux meilleurs prix`)

    const [dress, setDress] = useState([])
    const [load, setLoad] = useState(true)

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
    }

    useEffect(() => {
        getDress()
        getStars()
    }, [])

    const getDress = async () => {
        let newDress : any = []
        const resDress = await fetch(`${url}/dress/find`)
        const resDressJson = await resDress.json()
            if(resDressJson){
                    for(let i = 0; i < resDressJson.length; i++ ){
                        const resProduct = await fetch(`${url}/dress/find/products`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: headRequest,
                            body: JSON.stringify({
                                dress: resDressJson[i]
                            })
                        })
                        if(resProduct){
                            const resProductJson = await resProduct.json()
                            newDress = [...newDress, resProductJson]
                        }

                    }
                
                console.log('dalu')
                console.log(newDress)
                newDress.sort(function(a : any, b : any){
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                })
                setLoad(false)
                setDress(newDress)
            }
    }

    const getStars = async () => {
        const resStars = await fetch(`${url}/star/find`)
        const resStarsJson = await resStars.json()
        setStars(resStarsJson)

    }

    console.log(stars)

    return (
        <div className="container">
        <head>
            <title>Clothestar</title>
            <meta name="description" content={describe} />
            <meta name="og:title" property="og:title" content={name} />
            <meta name="og:description" property="og:description" content={describe} />
            <meta name="robots" content="index, follow" />
        </head>

            <Navbar />
            {load ?
            <img src={require('../../images/load.gif')} className="load"/>
            :
            <div style={{ marginTop: '150px' }} className="containerProducts">
                {starSearch[1] === "star" &&
                stars.map((star : any) => {
                    return(
                        starSearch[2].replace('%20', ' ') === star.name &&
                        <div className="containerHeadSortStar">
                            <p className="title">Dressing de</p>
                        <div className="cardProduct">
                        <div className="leftCardProduct">
                            <div className="containerImgProduct">
                                <img className="imgProduct" alt="new picture product" src={star.base1} />
                            </div>
                        </div>
                        <div className="rightCardProduct">
                                    {star.name && <p style={{fontSize: '20px'}} className="title">{star.name}</p>}
                        </div>
                        </div>
                        <Link to='/?cfc' onClick={() => setStarSearch('')}  style={{marginTop: '30px'}} className="button">Retrouver les tenues de toutes les stars</Link>
                        </div>
                    )
                })}
            {dress.length > 0 && dress.map((dress : any) => {
                return(
                ((starSearch[1] === "star" && starSearch[2].replace('%20', ' ') === dress.name) || (starSearch[1] !== "star")) &&
                <Dress dress={dress}/>
                )
            })}
            </div>}
            <Footer/>
        </div>
    )
}