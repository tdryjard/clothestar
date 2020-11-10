import React, {useState, useEffect} from 'react'
import { Button } from 'antd';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import {Buy} from '../buy/Buy'
import {Navbar} from '../navbar/Navbar'
import './Panier.scss'


export const Panier = ({products} : any) => {
    console.log(products)
    const [panier, setPanier] = useState<any>([])
    const [totalPrice, setTotalPrice] = useState<any>(0)
    const [sizeWindow, setSizeWindow] = useState<any>(window.screen.width)
    const [validPanier, setValidPanier] = useState(false)
    const [payment, setPayment] = useState(false)

    useEffect(() => {
        if(localStorage.getItem('panier') && products.length > 0){
        let panier : any = localStorage.getItem('panier')
        console.log(panier)
        panier = JSON.parse(panier).panier
        console.log(products)
        let newPanier : any = []
        if(panier && panier.length > 0){
        products.map((product : any) => {
            panier.map((article : any, index : number) => {
                console.log(product, article)
                if(product.id === article.article.id) newPanier.push({...article.article, ...product, nb : 1})
            })

        })
    }
        console.log(newPanier)
        setPanier(newPanier)
    }
    }, [products])

    console.log(panier)

    useEffect(() => {
        let price : any = 0
        panier.map((product: any) => {
            console.log(product.price)
            price += (product.price*product.nb)
        })
        setTotalPrice(parseFloat(price).toFixed(2))
    }, [panier])

    const changeQuantity = (index: any, type : any) => {
        let stockProducts = panier.slice()
        if(type !== "minus") stockProducts[index].nb += 1
        else stockProducts[index].nb -= 1
        setPanier(stockProducts)
    }


    window.onresize = function(event : any) {
        setSizeWindow(window.screen.width)
    };

    console.log(sizeWindow)

    const deleteArticle = (index: any) => {
        
        if(localStorage.getItem('panier') && products.length > 0){
            let panierStorage : any = localStorage.getItem('panier')
            console.log(panier)
            panierStorage = JSON.parse(panierStorage).panier.slice()
            console.log(panierStorage)
            panierStorage.splice(index, 1)
            console.log(panierStorage)
            localStorage.setItem('panier', JSON.stringify({panier : panierStorage}))
            let newPanier : any = []
            products.map((product : any) => {
                panierStorage.map((article : any, index : number) => {
                    console.log(product, article)
                    if(product.id === article.article.id) newPanier.push({...article.article, ...product, nb : 1})
                })

            })
            setPanier(newPanier)
        }
    }





    return(
        <div className="containerPanier">
        {!validPanier && sizeWindow > 1000 && <Navbar/>}
        {!payment &&
        sizeWindow < 1000 && !validPanier &&
        <div className="containerBuyPanier">
            <p className="titlePricePanier">Total :</p>
            <p className="pricePanier">{totalPrice}€</p>
            <p className="textPurchasePanier">Temps de livraison estimée : 7 à 14 jours</p>
            <p className="tiret"/>
            {panier && panier.length > 0 && <button onClick={() => setValidPanier(true)} className="buttonPanier">Valider le panier</button>}
        </div>}
        {sizeWindow < 1000 && validPanier &&
            <Buy panier={panier} price={totalPrice}/>}
        {!validPanier &&
            <div className="containerProductsPanier">
            {panier.map((product : any, index : any) => {
                return(
                    <div className="containerProductPanier">
                        <div style={{height: '100%', justifyContent: 'start', width: '50%', marginRight: '0px'}} className="rowImgPanier">
                            {sizeWindow < 1000 ?
                            <div style={{height: '100%', justifyContent: 'start', width: '50%', marginRight: '0px'}} className="column">
                                <p className="titleProductPanier" >{product.title}</p>
                                <img className="imgProductPanier" src={product.base1}/>
                            </div>
                            :
                            <img className="imgProductPanier" src={product.base1}/>}
                            {sizeWindow > 1000 &&
                            <div style={{alignItems: 'flex-start', marginLeft: '50px'}} className="columnTextImgPanier">
                                <p className="titleProductPanier" >{product.title}</p>
                                <p className="describeProductPanier" >{product.description}</p>
                            </div>}
                        </div>
                        {sizeWindow > 1000 ?
                        <div className="rightCardProductPanier">
                            <p className="titleProductPanier">{product.price}€</p>
                            <p className="sizeProductPanier">Taille : {product.size}</p>
                            <div className="containerQuantity">
                                <p style={{marginRight: '15px'}}>Quantité: {product.nb}</p>
                                <div className="columnButtonPanier">
                                    <Button style={{marginBottom: '5px', height: '25px'}} onClick={() => changeQuantity(index, 'plus')} icon={<PlusOutlined />}/>
                                    {product.nb > 1 && <Button style={{marginTop: '5px', height: '25px'}} onClick={() => changeQuantity(index, 'minus')} icon={<MinusOutlined />}/>}
                                </div>
                            </div>
                            <p onClick={() => deleteArticle(index)} className="textDeleteArticlePanier">supprimer article</p>
                        </div>
                        :
                        <div className="rightCardProductPanier">
                            <p className="titleProductPanier">{product.price}€</p>
                            <p className="sizeProductPanier">Taille : {product.size}</p>
                            <div className="containerQuantity">
                                <div className="columnButtonPanier">
                                    <Button style={{marginBottom: '5px', height: '25px'}} onClick={() => changeQuantity(index, 'plus')} icon={<PlusOutlined />}/>
                                    {product.nb > 1 && <Button style={{marginTop: '5px', height: '25px'}} onClick={() => changeQuantity(index, 'minus')} icon={<MinusOutlined />}/>}
                                </div>
                                <p>Quantité: {product.nb}</p>
                            </div>
                            <p onClick={() => deleteArticle(index)} className="textDeleteArticlePanier">supprimer article</p>
                        </div>}
                    </div>
                )
            })}
            </div>}
            {sizeWindow > 1000 && !validPanier &&
            <div className="containerBuyPanier">
                <p className="titlePricePanier">Total :</p>
                <p className="pricePanier">{totalPrice}€</p>
                <p className="textPurchasePanier">Temps de livraison estimée : 7 à 14 jours</p>
                <p className="tiret"/>
                {panier && panier.length > 0 && <button onClick={() => setValidPanier(true)} className="buttonPanier">Valider le panier</button>}
            </div>}
            {sizeWindow > 1000 && validPanier &&
                <Buy panier={panier} price={totalPrice} />}
        </div>
    )
}