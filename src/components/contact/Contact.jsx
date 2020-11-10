import React from 'react'
import Chatbot from '../sortouch/chatbotArea/ChatBotArea'
import {Navbar} from '../navbar/Navbar'
import {Footer} from '../footer/Footer'
import './Contact.scss'

export const Contact = () => {
    return(
        <div className="containerContact">
        <head>
            <title>Clothestar : contact</title>
        </head>
            <Navbar/>
                <Chatbot userId={411} modelId={501}/>
            <Footer/>
        </div>
    )
}