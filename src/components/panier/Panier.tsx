import React, {useState, useEffect} from 'react'
import { Button, Input } from 'antd';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import {Buy} from '../buy/Buy'
import {Navbar} from '../navbar/Navbar'
import url from '../../api/url'
import './Panier.scss'


export const Panier = ({products} : any) => {
    const [panier, setPanier] = useState<any>([])
    const [totalPrice, setTotalPrice] = useState<any>(0)
    const [sizeWindow, setSizeWindow] = useState<any>(window.screen.width)
    const [validPanier, setValidPanier] = useState(false)
    const [payment, setPayment] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [goodPromo, setGoodPromo] = useState<any>('')
    const [newTotalPrice, setNewTotalPrice] = useState<any>(null)

    const { Search } = Input;

    const headerReq : any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
    }

    useEffect(() => {
        if(localStorage.getItem('panier') && products.length > 0){
        let panier : any = localStorage.getItem('panier')
        panier = JSON.parse(panier).panier
        let newPanier : any = []
        if(panier && panier.length > 0){
        products.map((product : any) => {
            panier.map((article : any, index : number) => {
                if(product.id === article.article.id) newPanier.push({...article.article, ...product, nb : 1})
            })

        })
    }
        setPanier(newPanier)
    }
    }, [products])

    useEffect(() => {
        let price : any = 0
        panier.map((product: any) => {
            price += (product.price*product.nb)
        })
        price = parseFloat(price).toFixed(2)
        setTotalPrice(price)
        let newPrice : any = (price - (price * goodPromo / 100))
        if(newTotalPrice) setNewTotalPrice(parseFloat(newPrice).toFixed(2))
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


    const deleteArticle = (index: any) => {
        
        if(localStorage.getItem('panier') && products.length > 0){
            let panierStorage : any = localStorage.getItem('panier')
            panierStorage = JSON.parse(panierStorage).panier.slice()
            panierStorage.splice(index, 1)
            localStorage.setItem('panier', JSON.stringify({panier : panierStorage}))
            let newPanier : any = []
            products.map((product : any) => {
                panierStorage.map((article : any, index : number) => {
                    if(product.id === article.article.id) newPanier.push({...article.article, ...product, nb : 1})
                })

            })
            setPanier(newPanier)
        }
    }

    const addPromoCode = async () => {
        const res : any = await fetch(`${url}/promoCode`, {
            method: 'POST',
            credentials: 'include',
            headers: headerReq,
            body: JSON.stringify({
                promoCode
            })
        })
        if(res) {
            const resJson : any = await res.json()
            if(resJson[0] && resJson[0].name){
                setGoodPromo(resJson[0].percent)
            }
        }
    }

    useEffect(() => {
        let newPrice : any = (totalPrice - (totalPrice * parseInt(goodPromo, 10)/100))
        setNewTotalPrice(parseFloat(newPrice).toFixed(2))
    }, [goodPromo])





    return(
        <div className="containerPanier">
        <head>
            <title>Clothestar: panier</title>
        </head>
        {!validPanier && sizeWindow > 1000 && <Navbar/>}
        {!payment &&
        sizeWindow < 1000 && !validPanier &&
        <div className="containerBuyPanier">
            <p className="titlePricePanier">Total :</p>
            {newTotalPrice ?
            <div style={{justifyContent: 'flex-start'}} className="row">
            <div className="containerPromoPricePanier">
            <p className="pricePanier">{totalPrice}€</p>
            <div className="tiretPromoPanier" />
            </div>
            <p className="pricePanier">{newTotalPrice}€</p>
        </div>
        :
        <p className="pricePanier">{totalPrice}€</p>}
            
            <p className="textPurchasePanier">Temps de livraison estimé : 7 à 18 jours</p>
            <p className="tiret"/>
            {panier && panier.length > 0 &&
            <>
            <button onClick={() => setValidPanier(true)} style={{marginLeft: '20px'}} className="buttonPanier">Valider le panier</button>
            <div style={{justifyContent: 'flex-start'}} className="row">
            <Input className="inputCodePromo" placeholder="Code promo" onChange={(e : any) => setPromoCode(e.target.value)} onPressEnter={() => addPromoCode()}/>
            <button onClick={addPromoCode} className="buttonValidPromoCode">valider</button>
            </div>
                </>}
        </div>}
        {sizeWindow < 1000 && validPanier &&
            <Buy newTotalPrice={newTotalPrice} promoCode={promoCode} panier={panier} price={totalPrice}/>}
        {!validPanier &&
            <div className="containerProductsPanier">
            {panier.map((product : any, index : any) => {
                return(
                    <div className="containerProductPanier">
                        <div style={{height: '100%', justifyContent: 'start', width: '50%', marginRight: '0px'}} className="rowImgPanier">
                            {sizeWindow < 1000 ?
                            <div style={{height: '100%', justifyContent: 'start', width: '50%', marginRight: '0px'}} className="column">
                                <p className="titleProductPanier" >{product.title}</p>
                                <img className="imgProductPanier" src={require(`../images${product.base1}`)}/>
                            </div>
                            :
                            <img className="imgProductPanier" src={require(`../images${product.base1}`)}/>}
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
            {newTotalPrice ?
            <div style={{justifyContent: 'flex-start'}} className="row">
            <div className="containerPromoPricePanier">
            <p className="pricePanier">{totalPrice}€</p>
            <div className="tiretPromoPanier" />
            </div>
            <p className="pricePanier">{newTotalPrice}€</p>
        </div>
        :
        <p className="pricePanier">{totalPrice}€</p>}
                <p className="textPurchasePanier">Temps de livraison estimé : 7 à 18 jours</p>
                <p className="tiret"/>
                {panier && panier.length > 0 && 
                <>
                <button onClick={() => setValidPanier(true)} className="buttonPanier">Valider le panier</button>
                <div style={{justifyContent: 'flex-start'}} className="row">
            <Input className="inputCodePromo" placeholder="Code promo" onChange={(e : any) => setPromoCode(e.target.value)} onPressEnter={() => addPromoCode()}/>
            <button onClick={addPromoCode} className="buttonValidPromoCode">valider</button>
            </div>
                </>}
            </div>}
            {sizeWindow > 1000 && validPanier &&
                <Buy newTotalPrice={newTotalPrice} promoCode={promoCode} panier={panier} price={totalPrice} />}
        </div>
    )
}