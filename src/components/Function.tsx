import React from 'react'
import url from '../api/url'

export const GetProducts = async () => {
    const res = await fetch(`${url}/product/find`)
    if(res){
        const resJson = await res.json()
        if(resJson) return(await resJson)
    }
}