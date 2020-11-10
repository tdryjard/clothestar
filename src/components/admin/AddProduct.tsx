import React, { useState, useEffect } from 'react'
import url from '../../api/url'
import { Product } from '../product/Product'
import { propsAdmin } from '../../types'
import { Menu } from 'antd';
import {CaretDownOutlined} from '@ant-design/icons'
import './AddProduct.scss'

const { SubMenu } = Menu;

export const AddProduct = ({ tokenProps, verifToken }: propsAdmin) => {
    const [nameProduct, setNameProduct] = useState<string>('')
    const [describeProduct, setDescribeProduct] = useState<string>('')
    const [priceProduct, setPriceProduct] = useState<string>('')
    const [pricePromo, setPricePromo] = useState<string>('')
    const [logo, setLogo] = useState<any>()
    const [load, setLoad] = useState<boolean>()
    const [changeImg, setChangeImg] = useState<boolean>()
    const [token] = useState<any>(sessionStorage.getItem('tokenEcom'))
    const [promo, setPromo] = useState<boolean>(true)
    const [products, setProducts] = useState([])
    const [addingProduct, setAddingProduct] = useState<boolean>(false)
    const [picture, setPicture] = useState<any>()
    const [picture2, setPicture2] = useState<any>()
    const [picture3, setPicture3] = useState<any>()
    const [dateDelivery, setDateDelivery] = useState('')
    const [error, setError] = useState('')
    const [stars, setStars] = useState<any>()
    const [dress, setDress] = useState<any>()
    const [starSelect, setStarSlect] = useState<any>()
    const [dressSelect, setDressSelect] = useState<any>()
    const [sizes, setSizes] = useState(['', '', '', '', '', '', '', ''])


    useEffect(() => {
        fetch(`${url}/star/find`)
        .then(res => res.json())
        .then(resJson => {
            if (resJson) setStars(resJson)
        })
        fetch(`${url}/dress/find`)
        .then(res => res.json())
        .then(resJson => {
            if (resJson) setDress(resJson)
        })
    }, [])

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }

    useEffect(() => {
        GetProducts()
    }, [])

    useEffect(() => {
        GetProducts()
    }, [addingProduct])

    const GetProducts = async () => {
        const res = await fetch(`${url}/product/find`)
        if (res) {
            const resJson = await res.json()
            if (resJson) setProducts(resJson)
        }
    }

    console.log(sizes)

    const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file: any = e.target.files[0];
            if (file) {
                setLoad(true)
                if (file.size > 3000000) {
                    alert(`l'image ne doit pas dépasser 750ko`)
                }
                else {
                    e.preventDefault();
                    const reader: any = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        if (!picture) {
                            setPicture(reader.result)
                        } else if (!picture2) {
                            setPicture2(reader.result)
                        } else if (!picture3) {
                            setPicture3(reader.result)
                        }
                        setChangeImg(!changeImg)
                    };
                }
            }
        }
    }

    useEffect(() => {
        console.log(sizes)
    }, [sizes])



    const createProduct = async () => {
        console.log(dressSelect)
        let resImgJson2
        let resImgJson3
        let imgId2 = ''
        let imgId3 = ''
        if(!nameProduct) setError('nom du produit manquant')
        else if(!describeProduct) setError('description manquante')
        else if(!picture) setError('image parincipale du produit manquante')
        else if(!priceProduct) setError('prix du produit manquant')
        else if(!sizes) setError('il faut ajouter les tailles')
        else if(!dressSelect) setError('il faut selectionner une tenue pour lier cet article à celle-ci')
        else{
            const resImg = await fetch(`${url}/image/create`, {
                method: 'POST',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    base: picture
                })
            })
            const resImgJson = await resImg.json()
            if (resImg) {
                if (picture2) {
                    const resImg2 = await fetch(`${url}/image/create`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: headRequest,
                        body: JSON.stringify({
                            base: picture2
                        })
                    })
                    resImgJson2 = await resImg2.json()
                    if (resImgJson2) imgId2 = resImgJson2.id
                }
                if (picture3) {
                    const resImg3 = await fetch(`${url}/image/create`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: headRequest,
                        body: JSON.stringify({
                            base: picture3
                        })
                    })
                    resImgJson3 = await resImg3.json()
                    if (resImgJson3) imgId3 = resImgJson3.id
                }
                const lastRes = await fetch(`${url}/product/create`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: headRequest,
                    body: JSON.stringify({
                        title: nameProduct,
                        description: describeProduct,
                        promo_price: pricePromo,
                        price: priceProduct,
                        image_id: resImgJson.id,
                        image_id_2: imgId2,
                        image_id_3: imgId3,
                        date_delivery: dateDelivery,
                        dress_id : dressSelect.id,
                        sizes : sizes
                    })
                })
                if (lastRes){
                    setAddingProduct(!addingProduct)
                }
            }
        }
    }

    console.log(starSelect, dress)



    return (
        <div className="container">
            {error &&
            <div className="backPopup">
                <div className="containerPopup">
                    <p className="text">{error}</p>
                    <button onClick={() => {setError('')}} style={{marginTop: '30px'}} className="button">Compris</button>
                </div>
            </div>}
            <p className="title" style={{ fontSize: '50px', marginTop: '30px', marginBottom: '-50px' }}>Ajouter un nouveau produit</p>
            <div className="containerAddProduct">
        <div className="column">
            <div className="rowAddProduct">
                <div style={{ marginRight: '50px', width: '30%', alignItems: 'flex-start' }} className="column">
                    <input maxLength={150} className="input"
                        placeholder="nom du produit"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNameProduct(e.target.value) }} />
                    {!picture ?
                        <div className="containerInputFile">
                            <div className="upload-btn-wrapper">
                                <button className="buttonImg">Image <img style={{ marginTop: '10px' }} alt="cross icon" src={require("../images/cross.png")} /> </button>
                                <input className="inputGetFile" accept=".jpeg,.jpg,.png"
                                    type="file"
                                    name="file"
                                    onChange={getFile} />
                            </div>
                        </div>
                        :
                        <div className="containerImgAddProduct">
                            <img className="imgAddProduct" alt="new picture product" src={picture} />
                        </div>}
                    {picture && !picture2 ?
                        <div className="containerInputFile">
                            <div className="upload-btn-wrapper">
                                <button className="buttonImg">Image <img style={{ marginTop: '10px' }} alt="cross icon" src={require("../images/cross.png")} /> </button>
                                <input className="inputGetFile" accept=".jpeg,.jpg,.png"
                                    type="file"
                                    name="file"
                                    onChange={getFile} />
                            </div>
                        </div>
                        : picture && picture2 &&
                        <div className="containerImgAddProduct">
                            <img className="imgAddProduct" alt="new picture product" src={picture2} />
                        </div>}
                    {picture2 && !picture3 ?
                        <div className="containerInputFile">
                            <div className="upload-btn-wrapper">
                                <button className="buttonImg">Image <img style={{ marginTop: '10px' }} alt="cross icon" src={require("../images/cross.png")} /> </button>
                                <input className="inputGetFile" accept=".jpeg,.jpg,.png"
                                    type="file"
                                    name="file"
                                    onChange={getFile} />
                            </div>
                        </div>
                        : picture2 && picture3 &&
                        <div className="containerImgAddProduct">
                            <img className="imgAddProduct" alt="new picture product" src={picture3} />
                        </div>}

           
                </div>

                <textarea style={{ height: '350px', width: '250px' }} className="input"
                    placeholder="description du produit"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setDescribeProduct(e.target.value) }} />
                     <Menu
        mode="inline"
        style={{ width: 256 }}
        className="containerMenuAdmin"
      >
        <SubMenu className="subMenuAdmin" title={
            <span>
              <span style={{fontWeight: 'bold'}}>Choisir une star</span>
              <CaretDownOutlined style={{marginLeft: '50px'}} />
            </span>
          }>
          {stars && stars.length > 0 && stars.map((star : any) => {
              return(
              <p className={starSelect === star ? "nameStarSubMenuOn" : 'nameStarSubMenu'} onClick={() => setStarSlect(star)} >{star.name}</p>
              )
          })}
        </SubMenu>
        {starSelect &&
        <SubMenu className="subMenuAdmin2" title={
            <span>
              <span style={{fontWeight: 'bold'}}>Choisir une tenue</span>
              <CaretDownOutlined style={{marginLeft: '50px'}} />
            </span>
          }>
          {dress.map((dress : any) => {
              return(
                  dress.star_id === starSelect.id &&
                  <img onClick={() => setDressSelect(dress)} className={dressSelect === dress ? "imgSubMenuAdminOn" : "imgSubMenuAdmin"} src={dress.base1}/>
              )
          })}
          </SubMenu>}
      </Menu>
                <div className="containerPriceAdd">
                    <p className="title">Ajouter prix</p>
                    <div className="row">
                        <p className="text">Promotion</p>
                        <div className="toggle-button-input-cover">
                            <div className="button-input-cover">
                                <div className="button-input r" id="button-input-1">
                                    <input onClick={() => { return(setPromo(!promo), setPricePromo('')) }} type="checkbox" className="checkbox" />
                                    <div className="knobs"></div>
                                    <div className="layer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {promo &&
                        <input className="input" style={{ marginBottom: '30px' }}
                            placeholder="anciens prix"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPricePromo(e.target.value) }} />}
                    <input className="input" style={{ marginBottom: '30px' }}
                        placeholder="prix du produit"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPriceProduct(e.target.value) }} />
                    <input className="input"
                        placeholder="temps de livraison estimé"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDateDelivery(e.target.value) }} />
                    <button onClick={createProduct} style={{ marginTop: '40px' }} className="button">Ajouter le produit</button>
                </div>
            </div>
      <div className="containerSizeAdmin">
          <input onChange={(e) => {
              
              let stockSizes : any = sizes
              stockSizes[0] = e.target.value
                  setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 1"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[1] = e.target.value
                  setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 2"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[2] = e.target.value
            setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 3"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[3] = e.target.value
            setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 4"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[4] = e.target.value
            setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 5"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[5] = e.target.value
            setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 6"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[6] = e.target.value
            setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 7"
            />
            <input onChange={(e) => {
              let stockSizes : any = sizes.slice()
              stockSizes[7] = e.target.value
            setSizes(stockSizes)
            }}
            className="inputSizeAdmin"
            placeholder="Size 8"
            />
            </div>
            <div className="containerProducts">
                {products.length && products.map((product: any) => {
                    return (
                        <Product dateDelivery={product.date_delivery} imageId1={product.image_id} imageId2={product.image_id_2} imageId3={product.image_id_3} id={product.id} tokenProps={tokenProps} verifToken={verifToken} priceId={product.price_stripe_id} pricePromo={product.promo_price} price={product.price} title={product.title} description={product.description} base1={product.base1} base2={product.base2} base3={product.base3} 
                        sizes={[product.size1, product.size2, product.size3, product.size4, product.size5, product.size6, product.size7, product.size8]} />
                    )
                })}
            </div>
      </div>
      </div>
      </div>
    )
}