import { ConsoleSqlOutlined } from '@ant-design/icons'
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Dress.scss'

export const Dress = ({ dress }: any) => {
    const [dressLocation] = useState(`?tenue${dress.id}`)

    return (
        <>
            {!window.location.search || window.location.search.split('?')[1] === 'star' ?
                <div className="cardProduct">
                    <Link style={{ textDecoration: 'none' }} to={`/?tenue${dress.id}`}>
                        <div className="leftCardProduct">
                            <div className="containerImgProduct">
                                <img className="imgProduct" alt="image dress star" src={require(`../images${dress.base1}`)} />
                            </div>
                        </div>
                        {((!window.location.search.split('?')[2]) || (window.location.search.split('?')[2] && window.location.search.split('?')[2].replace('%20', ' ') !== dress.name)) &&
                        <div className="rightCardProduct">
                                    {dress.name && <p style={{fontSize: '20px'}} className="text">{dress.name}</p>}
                        </div>}
                    </Link>
                </div>
                : window.location.search === dressLocation &&
                <div className="containerProductZoom">
                        <div className="contentProductZoomDress">
                                <div className="leftCardProductZoom">
                                <img className="imgProduct" alt="new picture product" src={require(`../images${dress.base1}`)} />
                                </div>
                            <div className="rightCardDressZoom">
                                <div className="containerTitleProductDress">
                    <p className="title">Sélectionne l'article qui t'intéresse</p>
                    </div>
                                <div className="containerProductDress">
                                {dress.product.map((product : any) => {
                                    return(
                                        <Link className="cardProductDress" style={{ textDecoration: 'none' }} to={`/boutique?${product.title}`}>
                                    <img  className="imgProductDress" alt="new picture product" src={require(`../images${product.base1}`)} />
                                    <div className="bottomCardProductDress">
                                            <p style={{ marginBottom: '0px', width: '90%', justifyContent: 'flex-start', alignItems: 'flex-start' }} className="textTitleProductDress">{product.title}</p>
                                    </div>
                                    </Link>
                                    )
                                })}
                                </div>       
                            </div>
                        </div>
                </div>}
                </>
    )
}

