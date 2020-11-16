import React, { useState, useEffect } from 'react'
import url from '../../api/url'
import { Product } from '../product/Product'
import { propsAdmin } from '../../types'
import './AddProduct.scss'

export const AddStar = () => {
    const [nameStar, setNameStar] = useState<string>('')
    const [changeImg, setChangeImg] = useState<boolean>()
    const [token] = useState<any>(sessionStorage.getItem('tokenEcom'))
    const [addingProduct, setAddingProduct] = useState<boolean>(false)
    const [picture, setPicture] = useState<any>()
    const [error, setError] = useState('')

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }


    const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                        if (!picture) {
                            setPicture(reader.result)
                        }
                        setChangeImg(!changeImg)
                    };
                }
            }
        }
    }



    const createStar = async () => {
        if(!nameStar) setError('nom de la star manquant')
        else if(!picture) setError('image parincipale du produit manquante')
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
            if(resImgJson){
            const lastRes = await fetch(`${url}/star/create`, {
                method: 'POST',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    name: nameStar,
                    image_id: resImgJson.id
                })
            })
            if (lastRes){
                setAddingProduct(!addingProduct)
                window.location.reload()
            }
        }
            }
        }



    return (
        <div style={{minHeight: 'auto'}} className="container">
            {error &&
            <div className="backPopup">
                <div className="containerPopup">
                    <p className="text">{error}</p>
                    <button onClick={() => {setError('')}} style={{marginTop: '30px'}} className="button">Compris</button>
                </div>
            </div>}
            <p className="title" style={{ fontSize: '50px', marginTop: '30px', marginBottom: '-50px' }}>Ajouter une star</p>
            <div style={{marginBottom: '50px', marginTop: '50px'}} className="containerAddProduct">
                <div style={{ marginRight: '50px', width: '30%', alignItems: 'flex-start' }} className="column">
                    <input maxLength={150} className="input"
                        placeholder="nom de la star"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNameStar(e.target.value) }} />
                    
                    <input maxLength={150} className="input"
                        placeholder="path"
                        style={{marginTop: '15px'}}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPicture(e.target.value) }} />
                </div>
                    <button onClick={createStar} style={{ marginTop: '40px' }} className="button">Ajouter la star</button>

            </div>
        </div>
    )
}