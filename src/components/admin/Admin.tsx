import React, { useState, useEffect } from 'react'
import { AddProduct } from './AddProduct'
import {AddDress} from './AddDress'
import {AddStar} from './AddStar'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form";
import url from '../../api/url'

export const Admin = () => {

    const [pseudo, setPseudo] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [alert, setAlert] = useState<any>()
    const [token] = useState<any>(sessionStorage.getItem('tokenEcom'))
    const [verifTokenBool, setVerifTokenBool] = useState(false)


    const { register, handleSubmit } = useForm<FormData>()

    const headRequest: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        'authorization': token
    }

    useEffect(() => {
        verifToken()
    }, [])


    const verifToken = async () => {
        const resVerif = await fetch(`${url}/verif-token`, {
            method: 'GET',
            credentials: 'include',
            headers: headRequest
        })
        const resJson = await resVerif.json()
        if (resJson.type === 'error') sessionStorage.setItem('tokenEcom', '')
        else setVerifTokenBool(true)
    }

    const validSub = async () => {
        let valid = false
        const cookie = await fetch(`${url}/cookie`, {
            method: 'GET',
            credentials: 'include',
            headers: headRequest
        })
        if (cookie) {
            const Pseudo: string = pseudo;
            const Password: string = password
            fetch(`${url}/admin/connect`, {
                method: 'POST',
                credentials: 'include',
                headers: headRequest,
                body: JSON.stringify({
                    pseudo: Pseudo,
                    password: Password
                })
            }).then(res => res.json())
                .then(result => {
                    if (result.alertType === "success") {
                        sessionStorage.setItem('tokenEcom', result.token)
                        valid = true
                        const go = sessionStorage.getItem('tokenEcom')
                        if (go) {
                            window.location.reload()
                        }
                    } else {
                        setAlert("pseudo ou mot de passe incorrect")
                        setTimeout(() => {
                            setAlert('')
                        }, 2000);
                    }
                })
            setTimeout(() => {
                if (!valid) {
                    setAlert("pseudo ou mot de passe incorrect")
                    setTimeout(() => {
                        setAlert('')
                    }, 2000);
                }
            }, 500)
        }
    }


    const getPseudo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(e.target.value)
    }

    const getPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }


    return (
        <div>
            {!token && !verifTokenBool ?
                <div className="container">
                    <h1 style={{ marginBottom: "10vh", marginTop: '5vh' }} className="title">Connexion admin</h1>
                    {alert &&
                        <div style={{ marginBottom: '35px' }} className="containerAlert">
                            <p className="text">{alert}</p>
                        </div>}
                    <form onSubmit={handleSubmit(validSub)} style={{ width: '250px' }} className="container">
                        <input maxLength={150} ref={register} onChange={getPseudo} style={{ marginBottom: "5vh" }} className="input" placeholder="pseudo" />
                        <input type="password" maxLength={25} ref={register} onChange={getPassword} className="input" placeholder="mot de passe" />
                        <div className="rowCenter">
                            <button onClick={validSub} type="submit" style={{ marginTop: "10vh" }} className="button">Connexion</button>
                        </div>
                    </form>
                </div>
                :
                <>
                <AddStar/>
                <AddDress/>
                <AddProduct tokenProps={token} verifToken={verifTokenBool} />
                </>}
        </div>
    )
}