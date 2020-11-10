import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Footer.scss'

export const Footer = () => {
    const [origin, setOrigin] = useState('')
    const [panier] = useState<any>(localStorage.getItem('panier'))

    useEffect(() => {
        let loc: any = window.location.pathname
        setOrigin(loc)
    }, [])




    return(
        <div style={{boxShadow: 'none'}} className="containerFooter">
            <div className="rowFooter">
        <p className="titleFooter">CLOTHESTAR</p>
                <div className="containerLinkFooter">
                    <Link className={origin === "/conditions-generales-de-vente" ? "linkOnFooter" : "linkFooter"} to="/conditions-generales-de-vente">Conditions générles de vente</Link>
                <div style={{ marginRight: '10px', marginLeft: '10px' }} className="verticalTiret" />
                    <Link className={origin === "/contact" ? "linkOnFooter" : "linkFooter"} to="/contact">CONTACT</Link>
                </div>
            <Link to='/panier' className="containerPanierFooter">
            <img src={require('../images/panier_navbar.png')}  className="panierFooter" />
            {panier && JSON.parse(panier).panier && <p className="nbArticlePanierFooter">{JSON.parse(panier).panier.length}</p>}
            </Link>
            </div>
        </div>
    )
}