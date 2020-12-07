import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';

import { Landing } from './components/template1/landing/Landing'
import { Admin } from './components/admin/Admin'
import {StarPlace} from './components/starPlace/StarPlace'
import {Shop} from './components/shop/Shop'
import {Panier} from './components/panier/Panier'
import {Contact} from './components/contact/Contact'
import {CGV} from './components/CGV/CGV'
import url from './api/url'
import './components/style.scss';


export function App() {
  const [products, setProducts] = useState([])
 
  const advancedMatching = { em: 'clothestar.shop@gmail.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
  const options = {
    autoConfig: true, // set pixel's autoConfig
    debug: false, // enable logs
  };
  
  useEffect(() => {
    GetProducts()
    initializeReactGA()
  }, [])
  
  ReactPixel.init('415291002935659', advancedMatching, options);
ReactPixel.pageView(); // For tracking page view
  
  const GetProducts = async () => {
    const res = await fetch(`${url}/product/find`)
    if (res) {
        const resJson = await res.json()
        if (resJson) setProducts(resJson)
    }
  }


  function initializeReactGA() {
    ReactGA.initialize('UA-144328716-1');
    ReactGA.pageview('/');
    ReactGA.pageview('/boutique');
    ReactGA.pageview('/panier');
    ReactGA.pageview('/contact');
    ReactGA.pageview('/conditions générales de vente');
    ReactGA.pageview('/stars');
    ReactGA.pageview('/admin');
  }

  useEffect(() => {

  }, [products])
  
  return (
    <>
    {products &&
    <Switch>
    <Route products={products} exact path="/" render={(props) => {
      return (<Landing {...props} products={products}/>)
    }} />
      <Route path="/admin" component={Admin} />
      <Route path="/stars" component={StarPlace} />
      <Route products={products} path="/boutique" render={(props) => {
        return (<Shop {...props} products={products}/>)
      }} />
      <Route products={products} path="/panier" render={(props) => {
        return (<Panier {...props} products={products}/>)
      }} />
      <Route path='/contact' component={Contact}/>
      <Route path='/conditions-generales-de-vente' component={CGV}/>
    </Switch>}
    </>
  );
}