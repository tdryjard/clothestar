import { ConsoleSqlOutlined } from '@ant-design/icons'
import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Star.scss'

export const Star = ({ star }: any) => {
    console.log(star)

    return (
        <>
                <div className="cardProduct">
                    <Link style={{ textDecoration: 'none' }} to={`/?star?${star.name}`}>
                        <div className="leftCardProduct">
                            <div className="containerImgProduct">
                                <img className="imgProduct" alt="new picture product" src={star.base1} />
                            </div>
                        </div>
                        <div className="rightCardProduct">
                                    {star.name && <p style={{fontSize: '20px'}} className="text">{star.name}</p>}
                        </div>
                    </Link>
                </div>
                </>
    )
}