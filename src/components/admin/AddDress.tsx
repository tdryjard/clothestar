import React, { useState, useEffect } from 'react'
import url from '../../api/url'
import { Product } from '../product/Product'
import { propsAdmin } from '../../types'
import './AddProduct.scss'

export const AddDress = () => {
    const [nameDress, setNameDress] = useState<string>('')
    const [changeImg, setChangeImg] = useState<boolean>()
    const [token] = useState<any>(sessionStorage.getItem('tokenEcom'))
    const [addingProduct, setAddingProduct] = useState<boolean>(false)
    const [picture, setPicture] = useState<any>()
    const [error, setError] = useState('')
    const [stars, setStars] = useState([])
    const [starSelect, setStarSelect] = useState<any>({})

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }


    const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file: any = e.target.files[0];
            if (file) {
                if (file.size > 3000000) {
                    alert(`l'image ne doit pas dépasser 3mo`)
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

    useEffect(() => {
        fetch(`${url}/star/find`)
        .then(res => res.json())
        .then(resJson => {
            if (resJson) setStars(resJson)
        })
    }, [])



    const createDress = async () => {
        console.log(starSelect)
        if(!nameDress) setError('nom du dressing manquant')
        else if(!picture) setError('image parincipale du dressing manquante')
        else if(!(starSelect && starSelect.id)) setError('Selectionner une star')
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
            const lastRes = await fetch(`${url}/dress/create`, {
                method: 'POST',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    star_id: starSelect.id,
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

        console.log(starSelect)



    return (
        <div style={{minHeight: 'auto'}} className="container">
            {error &&
            <div className="backPopup">
                <div className="containerPopup">
                    <p className="text">{error}</p>
                    <button onClick={() => {setError('')}} style={{marginTop: '30px'}} className="button">Compris</button>
                </div>
            </div>}
            <p className="title" style={{ fontSize: '50px', marginTop: '30px', marginBottom: '-50px' }}>Ajouter un dressing</p>
            <div style={{marginBottom: '50px', marginTop: '50px'}} className="containerAddProduct">
                <div style={{ marginRight: '50px', width: '30%', alignItems: 'flex-start' }} className="column">
                    <input maxLength={150} className="input"
                        placeholder="nom du dressing"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNameDress(e.target.value) }} />
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
                </div>
                <div className="column">
                    <button onClick={createDress} style={{ marginTop: '40px' }} className="button">Créer le dressing</button>
                    <div style={{marginTop: '50px'}} className="containerStars">
                        <p className="centerTitle">Select star</p>
                        {stars && stars.length > 0 && stars.map((star : any) => {
                            return(
                                <div style={starSelect === star ? {backgroundColor: 'rgba(22, 170, 244, 0.459)', color: 'white'} : {}} onClick={() => setStarSelect(star)} className="containerStarAdmin">
                                <p>{star.name}</p>
                                </div>
                            )
                        })}
                    </div>
                    </div>

            </div>
        </div>
    )
}