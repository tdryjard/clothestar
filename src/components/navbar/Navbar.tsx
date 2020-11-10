import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.scss'

export const Navbar = () => {
    const [origin, setOrigin] = useState('')
    const [panier] = useState<any>(localStorage.getItem('panier'))

    useEffect(() => {
        let loc: any = window.location.pathname
        setOrigin(loc)
    }, [])

    console.log(panier && JSON.parse(panier))

    return (
        <div className="containerNavbar">
            <div className="rowNavbar">
        <p className="titleNavbar">CLOTHESTAR</p>
        {window.innerWidth > 1100 ?
                <div className="containerLinkNav">
                    <Link className={origin === "/" ? "linkOn" : "link"} to="/">DRESSINGS</Link>
                <div style={{ marginRight: '20px', marginLeft: '20px' }} className="verticalTiret" />
                    <Link className={origin === "/stars" ? "linkOn" : "link"} to="/stars">STARS</Link>
                </div>
            :
            <div className="containerLinkNav">
                <div className="contentLinkNav">
                <Link className={origin === "/" ? "linkOn" : "link"} to="/">DRESSINGS</Link>
                </div>
            <div style={{ marginRight: '20px', marginLeft: '20px' }} className="verticalTiret" />
                <div className="contentLinkNav2">
                <Link className={origin === "/stars" ? "linkOn" : "link"} to="/stars">STARS</Link>
                </div>
            </div>}
            <Link to='/panier' className="containerPanierNav">
            <img src={require('../images/panier_gradient.png')}  className="panierNavbar" />
            {panier && JSON.parse(panier).panier && <p className="nbArticlePaniernav">{JSON.parse(panier).panier.length}</p>}
            </Link>
            </div>
        </div>
    )
}