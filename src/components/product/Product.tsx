import React, { useEffect, useState } from 'react'
import { PropsShop } from '../../types'
import { Buy } from '../buy/Buy'
import url from '../../api/url'
import { Link } from 'react-router-dom'
import { CheckOutlined } from '@ant-design/icons'
import {Navbar} from '../navbar/Navbar'
import { Rate, Divider, Input } from 'antd';
import './Product.scss'

export const Product = ({ stock, dateDelivery, imageId1, imageId2, imageId3, id, title, base1, base2, base3, description, price, pricePromo, priceId, tokenProps, verifToken, sizes }: PropsShop) => {
    const [command, setCommand] = useState(false)
    const [editProduct, setEditProduct] = useState(false)
    const [deleteProduct, setDeleteProduct] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [imgBase1, setImgBase1] = useState(base1)
    const [imgBase2, setImgBase2] = useState(base2)
    const [imgBase3, setImgBase3] = useState(base3)
    const [productLocation] = useState('?' + title)
    const [editTitle, setEditTitle] = useState(false)
    const [editDescribe, setEditDescribe] = useState(false)
    const [editDateDelivery, setEditDateDelivery] = useState(false)
    const [editPrice, setEditPrice] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newDescribe, setNewDescribe] = useState('')
    const [newPrice, setNewPrice] = useState('')
    const [newPromoPrice, setNewPromoPrice] = useState('')
    const [newDateDelivery, setNewDateDelivery] = useState('')
    const [updated, setUpdated] = useState(false)
    const [panier, setPanier] = useState<any>(localStorage.getItem('panier'))
    const [panierArray, setPanierArray] = useState<any>()
    const [productAdd, setProductAdd] = useState<any>([])
    const [sizeSelect, setSizeSelect] = useState(null)
    const [sizeWindow, setSizeWindow] = useState(window.innerWidth)
    const [promo, setPromo] = useState(false)
    const [productAdding, setProductAdding] = useState(false)
    const [newRate, setNewRate] = useState<any>()
    const [newComment, setNewComment] = useState('')
    const [newPersonComment, setNewPersonComment] = useState('')
    const [comments, setComments] = useState([])
    const [newStock, setNewStock] = useState('')

    const [imgSelect, setImgSelect] = useState(1)

      useEffect(() => {
          if(sessionStorage.getItem('promoClothestar') !== 'true'){
            setTimeout(() => {
                setPromo(true)
                sessionStorage.setItem('promoClothestar', 'true')
            }, 3000)
        } else {
            sessionStorage.setItem('promoClothestar', 'false')
        }
      }, [])
    

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': tokenProps
    }

    useEffect(() => {
        getComment()
    }, [updated])

    const getComment = async () => {
        const res = await fetch(`${url}/advice/find/${id}`)
        const resJson = await res.json()
        setComments(resJson.reverse())
    }

    useEffect(() => {
        if(localStorage.getItem('panier')){
        let panierSplit : any = localStorage.getItem('panier')
        let newPanier : any = []
        if(panierSplit) {
        panierSplit.split(',').map((id : any) => {
            if(id !== ',' && id) newPanier.push(id)
        })
    }
        setPanierArray(newPanier)
    }
    }, [])


    const deleteProductFC = async () => {
        const res = await fetch(`${url}/product/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: headRequest
        })
        const resJson = await res.json()
        if (resJson && resJson.type === "success") {
            const res2 = await fetch(`${url}/image/delete/${imageId1}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: headRequest
            })
            if (res2 && imageId2) {
                const res3 = await fetch(`${url}/image/delete/${imageId2}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: headRequest
                })
                if (res3 && imageId3) {
                    const res3 = await fetch(`${url}/image/delete/${imageId3}`, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: headRequest
                    })
                }
            }
            setDeleted(true)
        }
    }

    const getFile = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file: any = e.target.files[0];
            if (file) {
                if (file.size > 760000) {
                    alert(`l'image ne doit pas dépasser 750ko`)
                }
                else {
                    e.preventDefault();
                    const reader: any = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        updateImg(id, reader.result)
                    };
                }
            }
        }
    }

    const updateImg = async (id: string, picture: string) => {
        const res = await fetch(`${url}/image/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                base: picture
            })
        })
        if (res) {
            if (id === imageId1) setImgBase1(picture)
            else if (id === imageId2) setImgBase2(picture)
            else if (id === imageId3) setImgBase3(picture)
        }
    }

    const sendNewTitle = async () => {
        const res = await fetch(`${url}/product/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                title: newTitle
            })
        })
        if (res) {
            setUpdated(!updated)
            setEditTitle(false)
        }
    }

    const sendNewDescribe = async () => {
        const res = await fetch(`${url}/product/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                description: newDescribe
            })
        })
        if (res) {
            setUpdated(!updated)
            setEditDescribe(false)
        }
    }

    const sendNewDateDelivery = async () => {
        const res = await fetch(`${url}/product/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                date_delivery: newDateDelivery
            })
        })
        if (res) {
            setUpdated(!updated)
            setEditDateDelivery(false)
        }
    }

    const sendNewPrice = async () => {
        if (newPromoPrice) {
            const res = await fetch(`${url}/product/update/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    price: newPrice,
                    promo_price: newPromoPrice
                })
            })
            if (res) {
                setUpdated(!updated)
                setEditPrice(false)
            }
        } else {
            const res = await fetch(`${url}/product/update/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    price: newPrice
                })
            })
            if (res) {
                setUpdated(!updated)
                setEditPrice(false)
            }
        }
    }

    const savePanier = () => {
        if(panier && JSON.parse(panier).panier){
            localStorage.setItem('panier', JSON.stringify({panier : [...JSON.parse(panier).panier, {article : {
                id : id,
                size : sizeSelect
            }}
        ]}
        ))
        setPanier(JSON.stringify({panier : [...JSON.parse(panier).panier, {article : {
            id : id,
            size : sizeSelect
          }}
         ]}
        ))
        }
        else {
            localStorage.setItem('panier', JSON.stringify({panier : [{article : {
                id : id,
                size : sizeSelect
            }}
        ]}
        ))
        setPanier(JSON.stringify({panier : [{article : {
            id : id,
            size : sizeSelect
        }}
    ]}
    ))
        }
        let stockProductAdd = productAdd
        stockProductAdd = [...productAdd, sizeSelect]
        setProductAdd(stockProductAdd)
    }



    window.onresize = function(event : any) {
        setSizeWindow(window.screen.width)
    };

    const sendAdvice = async () => {
            const res = await fetch(`${url}/advice/create`, {
                method: 'POST',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    comment: newComment,
                    promo_price: newPromoPrice,
                    product_id : id,
                    rate : newRate,
                    person : newPersonComment
                })
            })
            if (res) {
                setUpdated(!updated)
            }
    }

    const sendNewStock = async () => {
        const res = await fetch(`${url}/product/update/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: headRequest,
            body: JSON.stringify({
                stock: newStock
            })
        })
        if (res) {
            setNewStock('')
            setUpdated(!updated)
        }
    }

    return (
        <>
        {!(tokenProps && verifToken) && <Navbar/>}
            {tokenProps && verifToken && window.location.search !== encodeURI(productLocation) && !deleted && !editProduct && !deleteProduct ?
                <div className="cardProduct">
                    {tokenProps && verifToken &&
                        <img src={require('../images/edit.png')} alt="edit logo" className="logoCard" onClick={() => { setEditProduct(true) }} />}
                    {tokenProps && verifToken &&
                        <img style={{ left: '100px' }} src={require('../images/delete.png')} alt="delete logo" className="logoCard" onClick={(e) => { return (setDeleteProduct(true), e.stopPropagation()) }} />}
                    <Link style={{ textDecoration: 'none' }} to={`/boutique?${title}`}>
                        <div className="leftCardProduct">
                            <div className="containerImgProduct">
                                <img className="imgProduct" alt="new picture product" src={require(`../images${base1}`)} />
                            </div>
                        </div>
                        <div className="rightCardProduct">
                            <div className="containerPriceProduct">
                                <p style={{ marginBottom: '20px' }} className="title">{title}</p>
                                <div style={{ justifyContent: "center", alignItems: 'center' }} className="containerPrice">
                                    {pricePromo && pricePromo !== '0' &&
                                        <div className="containerPromoPrice">
                                            <p style={{ fontSize: '20px' }} className="text">{pricePromo}€</p>
                                            <div className="tiretPromo" />
                                        </div>}
                                    <p className="textPrice">{price}€</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                : window.location.search === encodeURI(productLocation) && !deleted &&
                <div className="containerProductZoom">
                    {!command && !deleteProduct && !editProduct ?
                        <div className="contentProductZoom">
                            <div className="column" style={sizeWindow < 1000 ? {alignItems: 'flex-start'} : {flexDirection: 'row', alignItems: 'flex-start'}}>
                            {sizeWindow > 1000 ?
                                <div className="leftCardProductZoom">
                                {promo && window.innerWidth > 1100 && <img src={require('../images/promo.png')} alt="promo ticket clothestar" className="promoTicket"/>}
                                    <div className="containerLittleImgProduct">
                                        {base2 &&
                                            <img onClick={() => { imgSelect === 1 ? setImgSelect(2) : imgSelect === 2 ? setImgSelect(3) : setImgSelect(1) }} className="imgProductZoom2" alt="new picture product" src={imgSelect === 1 ? require(`../images${base2}`) : imgSelect === 2 ? require(`../images${base3}`) : require(`../images${base1}`)} />}
                                        {base3 &&
                                            <img onClick={() => { imgSelect === 1 ? setImgSelect(3) : imgSelect === 2 ? setImgSelect(1) : setImgSelect(2) }} className="imgProductZoom3" alt="new picture product" src={imgSelect === 1 ? require(`../images${base3}`) : imgSelect === 2 ? require(`../images${base1}`) : require(`../images${base2}`)} />}
                                    </div>
                                    <img className="imgProductZoom1" alt="new picture product" src={imgSelect === 1 ? require(`../images${base1}`) : imgSelect === 2 ? require(`../images${base2}`) : require(`../images${base3}`)}/>
                                </div>
                                :
                                <div className="leftCardProductZoom">
                                    <img className="imgProductZoom1" alt="new picture product" src={imgSelect === 1 ? require(`../images${base1}`) : imgSelect === 2 ? require(`../images${base2}`) : require(`../images${base3}`)} />
                                    <div className="containerLittleImgProduct">
                                        {base2 &&
                                            <img onClick={() => { imgSelect === 1 ? setImgSelect(2) : imgSelect === 2 ? setImgSelect(3) : setImgSelect(1) }} className="imgProductZoom2" alt="new picture product" src={imgSelect === 1 ? require(`../images${base2}`) : imgSelect === 2 ? require(`../images${base3}`) : require(`../images${base1}`)} />}
                                        {base3 &&
                                            <img onClick={() => { imgSelect === 1 ? setImgSelect(3) : imgSelect === 2 ? setImgSelect(1) : setImgSelect(2) }} className="imgProductZoom3" alt="new picture product" src={imgSelect === 1 ? require(`../images${base3}`) : imgSelect === 2 ? require(`../images${base1}`) : require(`../images${base2}`)} />}
                                    </div>
                                </div>}
                            <div className="rightCardProductZoom">
                                {stock &&
                                <p style={parseInt(stock, 10) < 5 ? {color: 'red'} : {}} className="textStock">stock restant : {stock}</p>}

                                <p className="title">{title}</p>
                                <div className="containerPrice">
                                    {pricePromo && pricePromo !== "0" &&
                                        <div className="containerPromoPrice">
                                            <p style={{ fontSize: '20px' }} className="text">{pricePromo}€</p>
                                            <div className="tiretPromo" />
                                        </div>}
                                    <p style={window.innerWidth < 1100 ? { fontSize: '22px', width: '100%', position: 'relative', textAlign: 'center' } : { fontSize: '22px', width: '100%', position: 'relative', textAlign: 'start' }} className="textPrice">{price}€
                                    
                            {promo && window.innerWidth < 1100 && <img src={require('../images/promo.png')} alt="promo ticket clothestar" className="promoTicket"/>}
                            </p>
                                </div>
                                <p style={promo ? { marginTop: '90px' } : {marginTop: '25px'}} className="text">{description}</p>
                                <p style={{marginBottom: '5px', marginTop: '20px'}} className="title">Selectionner taille</p>
                            <div className="containerSizeProduct">
                                {sizes.map((size: any, index : any) => {
                                    return(
                                        size &&
                                    <p onClick={() => {return(setSizeSelect(size), setProductAdding(true) )}} className={sizeSelect === size ? "boxSizeSelect" : "boxSize"}>{size}</p>
                                    )
                                })}
                            </div>
                            {sizeSelect !== null && pricePromo !== '0' &&
                                    ((!(panier && JSON.parse(panier).panier && JSON.parse(panier).panier && JSON.parse(panier).panier.some((article : any) => (article.article.id === id && article.article.size === sizeSelect)))) && (!productAdd.includes(sizeSelect))) ?
                                    <button style={sizeWindow > 1000 ? { marginTop: '60px' } : {marginTop : '20px'}} onClick={() => {return(savePanier(), setProductAdding(true) )}} className="button">Ajouter au panier</button>
                                : sizeSelect !== null &&
                                <>
                                <button style={{ marginTop: '20px' }} className="buttonOn">Déja dans votre panier <CheckOutlined  style={{color: 'white', marginLeft: '15px'}} /> </button>
                                 <Link to='/panier' style={{ marginTop: '30px' }} className="buttonPanier">Consulter panier <img src={require('../images/panier_gradient.png')}  style={sizeWindow > 1000 ? {color: 'white', marginLeft: '15px', height: '45px'} : {color: 'white', marginLeft: '15px', height: '45px'}} /> </Link>
                                 <Link to='/' style={{ marginTop: '30px' }} className="buttonPanier">Revenir aux tenues <img src={require('../images/hanger_gradient.png')}  style={sizeWindow > 1000 ? {color: 'white', marginLeft: '15px', height: '45px'} : {color: 'white', marginLeft: '15px', height: '45px'}} /> </Link>
                                </>}
                            </div>
                        </div>
                            {comments.map((comment : any, index : any) => {
                            return(
                       <div className="contentComment">
                           <Divider />
                       <div className="rowComment">
                   <Rate disabled defaultValue={comment.rate} />
                   <p className="personComment">{comment.person}</p>
                   </div>
                   <p className="commentText">{comment.comment}</p>
                    </div> 
                            )
                        })}
                        </div>
                        :
                        <div className="contentProductZoom">
                            <Buy dateDelivery={dateDelivery} base={base1} title={title} price={price} priceId={priceId} />
                        </div>}
                </div>}


            {editProduct && tokenProps && verifToken && !deleted ?
                <div className="containerProductZoom">
                    <div className="contentProductZoom">
                        <div className="column">
                        <div className="row">
                        {sizeWindow > 1000 ?
                            <div className="leftCardProductZoom">
                                <div className="containerLittleImgProduct">
                                    {base2 &&
                                        <div style={{ position: 'relative' }} className="containerLittleImg">
                                            <div style={{ height: '50px', position: 'absolute', top: '5px', left: '5px', marginTop: '0px', width: '60px' }} className="containerInputFile">
                                                <div className="upload-btn-wrapper">
                                                    <button className="buttonImgUpdate" />
                                                    <input className="inputEditImg" accept=".jpeg,.jpg,.png"
                                                        type="file"
                                                        name="file"
                                                        onChange={(e) => { getFile(imageId2, e) }} />
                                                </div>
                                            </div>
                                            <img className="imgProductZoom2" alt="new picture product" src={require(`../images${imgBase2}`)} />
                                        </div>}
                                    {base3 &&
                                        <div style={{ position: 'relative' }} className="containerLittleImg" >
                                            <div style={{ height: '50px', position: 'absolute', top: '25px', left: '5px', marginTop: '0px', width: '60px' }} className="containerInputFile">
                                                <div className="upload-btn-wrapper">
                                                    <button className="buttonImgUpdate" />
                                                    <input className="inputEditImg" accept=".jpeg,.jpg,.png"
                                                        type="file"
                                                        name="file"
                                                        onChange={(e) => { getFile(imageId3, e) }} />
                                                </div>
                                            </div>
                                            <img className="imgProductZoom3" alt="new picture product" src={require(`../images${imgBase3}`)} />
                                        </div>}
                                </div>
                                <div style={{ position: 'relative' }} className="containerLittleImg" >
                                    <div style={{ height: '50px', position: 'absolute', top: '15px', left: '30px', marginTop: '0px', width: '60px' }} className="containerInputFile">
                                        <div className="upload-btn-wrapper">
                                            <button className="buttonImgUpdate" />
                                            <input className="inputEditImg" accept=".jpeg,.jpg,.png"
                                                type="file"
                                                name="file"
                                                onChange={(e) => { getFile(imageId1, e) }} />
                                        </div>
                                    </div>
                                    <img className="imgProductZoom1" alt="new picture product" src={require(`../images${imgBase1}`)} />
                                </div>
                            </div>
                            :
                            <div className="leftCardProductZoom">
                                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="containerLittleImg" >
                                    <div style={{ height: '50px', position: 'absolute', top: '15px', left: '30px', marginTop: '0px', width: '60px' }} className="containerInputFile">
                                        <div className="upload-btn-wrapper">
                                            <button className="buttonImgUpdate" />
                                            <input className="inputEditImg" accept=".jpeg,.jpg,.png"
                                                type="file"
                                                name="file"
                                                onChange={(e) => { getFile(imageId1, e) }} />
                                        </div>
                                    </div>
                                    <img className="imgProductZoom1" alt="new picture product" src={require(`../images${imgBase1}`)} />
                                </div>
                                <div className="containerLittleImgProduct">
                                    {base2 &&
                                        <div style={{ position: 'relative' }} className="containerLittleImg">
                                            <div style={{ height: '50px', position: 'absolute', top: '0px', right: '-5px', marginTop: '0px', width: '60px' }} className="containerInputFile">
                                                <div className="upload-btn-wrapper">
                                                    <button className="buttonImgUpdate" />
                                                    <input className="inputEditImg" accept=".jpeg,.jpg,.png"
                                                        type="file"
                                                        name="file"
                                                        onChange={(e) => { getFile(imageId2, e) }} />
                                                </div>
                                            </div>
                                            <img style={{ width: '100%' }} className="imgProductZoom2" alt="new picture product" src={require(`../images${imgBase2}`)} />
                                        </div>}
                                    {base3 &&
                                        <div style={{ position: 'relative' }} className="containerLittleImg" >
                                            <div style={{ height: '50px', position: 'absolute', top: '0px', right: '-5px', marginTop: '0px', width: '60px' }} className="containerInputFile">
                                                <div className="upload-btn-wrapper">
                                                    <button className="buttonImgUpdate" />
                                                    <input className="inputEditImg" accept=".jpeg,.jpg,.png"
                                                        type="file"
                                                        name="file"
                                                        onChange={(e) => { getFile(imageId3, e) }} />
                                                </div>
                                            </div>
                                            <img style={{ width: '100%' }} className="imgProductZoom3" alt="new picture product" src={require(`../images${imgBase3}`)} />
                                        </div>}
                                </div>
                            </div>}
                        <div className="rightCardProductZoom">
                            {!editTitle && !newTitle ?
                                <p style={{ position: 'relative' }} className="title">{title} <img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditTitle(true) }} /> </p>
                                : !editTitle && newTitle ?
                                    <p style={{ position: 'relative' }} className="title">{newTitle} <img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditTitle(true) }} /> </p>
                                    :
                                    <div className="column">
                                        <input className="input" placeholder="nouveau titre" onChange={(e) => { setNewTitle(e.target.value) }} />
                                        <button style={{ marginTop: '10px', marginBottom: '20px' }} className="button" onClick={sendNewTitle}>Valider</button>
                                    </div>}
                            {!editPrice && pricePromo && !newPromoPrice ?
                                <div className="containerPromoPrice">
                                    <p style={{ fontSize: '20px' }} className="text">{pricePromo}€</p>
                                    <div className="tiretPromo" />
                                </div>
                                : !editPrice && pricePromo && newPromoPrice &&
                                <div className="containerPromoPrice">
                                    <p style={{ fontSize: '20px' }} className="text">{newPromoPrice}€</p>
                                    <div className="tiretPromo" />
                                </div>}
                            {!editPrice && !newPrice ?
                                <p style={{ fontSize: '22px', position: 'relative' }} className="text">{price}€<img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditPrice(true) }} /></p>
                                : !editPrice && newPrice &&
                                <p style={{ fontSize: '22px', position: 'relative' }} className="text">{newPrice}€<img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditPrice(true) }} /></p>}
                            {editPrice &&
                                <div style={{ marginTop: '15px' }} className="column">
                                    <input style={{ marginBottom: '15px' }} className="input" placeholder="nouveau prix" onChange={(e) => { setNewPrice(e.target.value) }} />
                                    {pricePromo &&
                                        <input style={{ marginBottom: '15px' }} className="input" placeholder="nouveau prix promo" onChange={(e) => { setNewPromoPrice(e.target.value) }} />}
                                    <button className="button" onClick={sendNewPrice}>Valider</button>
                                </div>}
                            {!editDescribe && !newDescribe ?
                                <p style={{ marginTop: '60px', position: 'relative' }} className="text">{description}<img style={{marginRight: '110px', top: '0px'}} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditDescribe(true) }} /></p>
                                : !editDescribe && newDescribe ?
                                    <p style={{ marginTop: '60px', position: 'relative' }} className="text">{newDescribe}<img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditDescribe(true) }} /></p>
                                    :
                                    <div className="column">
                                        <textarea style={{ height: '250px', marginTop: '30px', marginBottom: '15px' }} className="input" placeholder="nouvelle description" onChange={(e) => { setNewDescribe(e.target.value) }} />
                                        <button className="button" onClick={sendNewDescribe}>Valider</button>
                                    </div>}
                            {!editDateDelivery && !newDateDelivery ?
                                <p style={{ marginTop: '60px', position: 'relative' }} className="text">temps de livraison estimé : 7 à 18 jours<img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditDateDelivery(true) }} /></p>
                                : !editDateDelivery && newDateDelivery ?
                                    <p style={{ marginTop: '60px', position: 'relative' }} className="text">temps de livraison estimé : 7 à 18 jours<img style={{ marginRight: '15px' }} src={require('../images/edit.png')} className="editLogo" onClick={(e) => { setEditDateDelivery(true) }} /></p>
                                    :
                                    <div className="column">
                                        <input style={{ marginTop: '30px', marginBottom: '10px' }} className="input" placeholder="nouveau temps de livraison" onChange={(e) => { setNewDateDelivery(e.target.value) }} />
                                        <button className="button" onClick={sendNewDateDelivery}>Valider</button>
                                    </div>}
                            <Input placeholder="stock" onPressEnter={sendNewStock} defaultValue={stock ? stock : ''} onChange={(e: any) => setNewStock(e.target.value)}/>
                            {!editProduct && <button style={{ marginTop: '60px' }} onClick={() => { setCommand(true) }} className="button">Commander</button>}
                        </div>
                        </div>
                    <div className="containerComment">
                       <div className="contentComment">
                           <div className="rowComment">
                       <Rate onChange={(e: any) => setNewRate(e)} allowHalf defaultValue={2.5} />
                       <input placeholder="nom personne" style={{marginLeft: '20px'}} className="input" onChange={(e : any) => setNewPersonComment(e.target.value)}/>
                       </div>
                       <textarea placeholder="commentaire" style={{marginTop: '20px', marginBottom: '15px'}} onChange={(e: any) => setNewComment(e.target.value)}/>
                        </div> 
                        <button onClick={sendAdvice} className="button">add comment</button>
                        {comments.map((comment : any, index : any) => {
                            return(
                       <div className="contentComment">
                           <Divider />
                       <div className="rowComment">
                   <Rate disabled defaultValue={comment.rate} />
                   <p className="personComment">{comment.person}</p>
                   </div>
                   <p className="commentText">{comment.comment}</p>
                    </div> 
                            )
                        })}
                    </div>
                    </div>
                    </div>
                </div>
                : deleteProduct && tokenProps && verifToken && !deleted &&
                <div className="containerProductZoom">
                    <div className="containerPopup">
                        <p style={{ marginBottom: '50px' }} className="title">Vous voulez vous vraiment supprimer votre article : {title} ?</p>
                        <div className="row">
                            <button style={{ marginRight: '15px', marginLeft: '15px', width: '100px' }} onClick={deleteProductFC} className="button">Oui</button>
                            <button style={{ marginRight: '15px', marginLeft: '15px', width: '100px' }} onClick={() => { setDeleteProduct(false) }} className="button">Non</button>
                        </div>
                    </div>
                </div>}
        </>
    )
}