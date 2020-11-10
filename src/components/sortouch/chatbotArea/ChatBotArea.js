import React, { useState, useEffect } from 'react'
import Questionchat from '../questionBlock/QuestionChat';
import cross from './cross.png'
import logo from './logo.png'
import reload from './reload.png'
import back from './back.png'
import { useForm } from "react-hook-form";
import './FormContact.css'
import './ChatBotArea.css'

const ChatBotArea = (props) => {
    const [containers, setContainers] = useState([])
    const [cardsQuest, setCardsQuest] = useState([])
    const [cardsRes, setCardsRes] = useState([])
    const [cardsCategory, setCardsCategory] = useState([])
    const [responseSelect, setResponseSelect] = useState(0)
    const [storageContainers, setStorageContainers] = useState()
    const [responseSelected, setResponseSelected] = useState([])
    const [pair, setPair] = useState(false)
    const [cardsQuestFilter, setCardsQuestFilter] = useState([])
    const [chatActive, setChatActive] = useState(true)
    const [textIcon, setTextIcon] = useState(true)
    const [posted, setPosted] = useState(false)
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [load, setLoad] = useState(false)
    const [color, setColor] = useState()
    const [lastResponse, setLastResponse] = useState()
    const [beforeSelect, setBeforeSelect] = useState([])
    const [search, setSearch] = useState([])

    const { send, handleSubmit } = useForm()

    function validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const validatePhone = (phone) => {
        let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        return re.test(phone)
    }

    const takePhone = (event) => {
        setPhone(event.target.value)
    }

    const takeEmail = (event) => {
        setEmail(event.target.value)
    }

    function getCurrentDate(separator) {

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
    }

    useEffect(() => {
        if (props.active) setChatActive(true)
    }, [props.active])

    const searching = (e) => {
        let word = e.target.value
        let wordSplit = word.toLowerCase().split('')
        let resReturn = []
        if (wordSplit.length > 2) {
            fetch(`https://sortouch-back.herokuapp.com/api/chatbot/response/findAll/${props.userId}/${props.modelId}`)
                .then(res => res.json())
                .then(res => {
                    for (let i = 0; i < res.length; i++) {
                        let resSplit = res[i].content.split('')
                        let nbEgale = 0
                        let nbLetter = 0
                        for (let iWord = 0; iWord < wordSplit.length; iWord++) {
                            for (let iRes = 0; iRes < resSplit.length; iRes++) {
                                if (wordSplit[iWord] === resSplit[iRes]) {
                                    nbLetter++
                                    iWord++
                                    if (nbLetter > 3) resReturn.push(res[i])
                                } else {
                                    if (nbLetter > 0) iRes--
                                    nbLetter = 0
                                }
                            }
                        }
                        if (nbEgale > 0 && (resReturn[resReturn.length - 1].id !== res[i].id)) resReturn.push(res[i])
                        nbEgale = 0
                    }
                    let sortResult = resReturn.filter(function (item, pos) {
                        return resReturn.indexOf(item) == pos;
                    })
                    if (resReturn.length > 0) setSearch(sortResult)
                })
        }
        if (wordSplit.length === 0) setSearch([])
    }

    const sendMail = async (categoryId) => {
        let date = getCurrentDate(' ')
        const dateChar = date.toString()
        if (!validateEmail(email)) {
            alert('email non valide')
        } else if (!validatePhone(phone)) {
            alert('numéro de téléphone non valide')
        } else {
            const result = await fetch(`https://sortouch-back.herokuapp.com/api/chatbot/mail/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Acces-Control-Allow-Origin': { origin }
                },
                body: JSON.stringify({
                    phone: phone,
                    email: email,
                    message: message,
                    category_id: categoryId,
                    model_id: props.modelId,
                    user_id: props.userId,
                    view: 0,
                    date: dateChar
                })
            });
            const result2 = await fetch(`https://sortouch-back.herokuapp.com/api/chatbot/contact/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Acces-Control-Allow-Origin': { origin }
                },
                body: JSON.stringify({
                    phone: phone,
                    email: email,
                    category_id: categoryId,
                    model_id: props.modelId,
                    user_id: props.userId
                })
            });
            if (result && result2) {
                setPosted(true)
                setTimeout(() => {
                    reloadFunction(true)
                }, 4000)
            }
        }
    }

    const getMessage = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {
        if (props.userId && props.modelId) {
            printContainers()
        }
    }, [props.userId, props.modelId, responseSelect, chatActive])

    useEffect(() => {
        setTimeout(() => {
            setTextIcon(false)
        }, 6000)
    }, [])


    const printContainers = async () => {
        if (lastResponse !== responseSelect) {
            try {
                fetch(`https://sortouch-back.herokuapp.com/api/chatbot/container/findAll/${props.userId}/${responseSelect}/${props.modelId}`)
                    .then(res => res.json())
                    .then(res => {
                        if ((containers.length > 0) && beforeSelect[0] !== 0) {
                            if (beforeSelect[0] === 0) setBeforeSelect([])
                            let resResult = res.filter(res => res.response_id !== null)
                            setContainers(resResult)
                            takeCard(resResult)
                        } else {
                            if (beforeSelect[0] === 0) setBeforeSelect([])
                            setContainers(res)
                            takeCard(res)
                        }
                    })
                setLastResponse(responseSelect)

            } catch (error) {
                console.log(error)
            }
        }
    }

    const takeCard = async (res) => {
        let stock = []
        for (let i = 0; i < res.length + 3; i++) {
            if (res[i]) {
                let result = []
                if (res[i].content_type === "question") {
                    const resNoJson = await fetch(`https://sortouch-back.herokuapp.com/api/chatbot/relation/findCardQuestion/${res[i].id}/${props.userId}/${props.modelId}`)
                    result = await resNoJson.json()
                }
                else result = { none: `pas de question container id ${i}` }
                stock = [...stock, result]
                setCardsQuest(stock)
            }
        }
        let stockRes = []
        for (let i = 0; i < res.length + 3; i++) {
            if (res[i]) {
                let result = []
                if (res[i].content_type === "response") {
                    const resNoJson = await fetch(`https://sortouch-back.herokuapp.com/api/chatbot/relation/findCardResponse/${res[i].id}/${props.userId}/${props.modelId}`)
                    result = await resNoJson.json()
                }
                else result = { none: `pas de réponse container id ${i}` }
                stockRes = [...stockRes, result]
                setCardsRes(stockRes)
            }
        }
        let stockCategory = []
        for (let i = 0; i < res.length + 3; i++) {
            if (res[i]) {
                let result = []
                if (res[i].content_type === "category") {
                    const resNoJson = await fetch(`https://sortouch-back.herokuapp.com/api/chatbot/relation/findCardCategory/${res[i].id}/${props.userId}/${props.modelId}`)
                    result = await resNoJson.json()
                }
                else result = { none: `pas de categorie container id ${i}` }
                stockCategory = [...stockCategory, result]
                setCardsCategory(stockCategory)
            }
        }
        setLoad(false)
    }

    const selectResponse = async function (cardId, index, search) {
        if (search) setSearch([])
        setPair(!pair)
        const stockContainers = containers
        const numberCard = cardId
        const containerIndex = index + 1
        const stockSelect = [...beforeSelect, numberCard]
        setBeforeSelect(stockSelect)
        setResponseSelect(numberCard)



        responseSelected.length = cardId
        stockContainers.length = containerIndex


        let stockResponseSelected = ([...responseSelected, numberCard])

        for (let a = 0; a < cardsRes.length; a++) {
            if (cardsRes[a].length) {
                for (let b = 0; b < cardsRes[a].length; b++) {
                    for (let c = 0; c < stockResponseSelected.length; c++) {
                        const nbRes = cardsRes[a].filter(card => stockResponseSelected.includes(card.id))
                        if (nbRes.length > 1) {
                            for (let i = 0; i < stockResponseSelected.length; i++) {
                                for (let a = 0; a < nbRes.length - 1; a++) {
                                    if (nbRes[a].id === (stockResponseSelected[i])) {
                                        stockResponseSelected.splice(i, 1)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        setResponseSelected(stockResponseSelected)

        setStorageContainers(stockContainers)

        if (stockContainers) {
            printContainers()
        }
    }


    const activeChat = () => {
        setChatActive(true)
    }

    const reloadFunction = (isPost) => {
        if ((responseSelect && responseSelect !== 0) || search.length > 0) {
            setContainers([])
            setCardsQuest([])
            setCardsRes([])
            setCardsCategory([])
            setResponseSelect(0)
            setStorageContainers()
            setResponseSelected([])
            setCardsQuestFilter([])
            setSearch([])
        }
        if (isPost === true) setPosted(false)
    }



    const getColor = async () => {
        const resFind = await fetch(`https://sortouch-back.herokuapp.com/api/model/findAll/${props.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Acces-Control-Allow-Origin': { origin },
                'authorization': props.token
            }
        })
        const resFindJson = await resFind.json()
        if (resFindJson.length > 0) {
            const resFindSort = await resFindJson.filter(res => res.id === parseInt(props.modelId))
            if (resFindSort) {
                setColor(resFindSort[0].color)
            }
        }
    }

    useEffect(() => {

    }, [color])

    let width = '90%'
    let height = '93%'
    let bottom = '2.5%'
    if (window.innerWidth > 1000) {
        width = '420px'
        height = '75%'
        bottom = '8%'
    }

    let containerChatbot = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        height: height,
        width: width,
        position: 'fixed',
        bottom: bottom,
        right: '4%',
        borderRadius: '15px',
        boxShadow: '0px 0px 15px #b8b8b8',
        background: 'rgb(255, 255, 255)',
        zIndex: '1000'
    }

    const backResponse = () => {
        setResponseSelect(beforeSelect[beforeSelect.length - 2])
        const stockSelect = beforeSelect
        let res = stockSelect.slice(0, -1)
        if (res.length === 0) res[0] = 0
        setBeforeSelect(res)
    }


    return (
        <div className={!chatActive && "containerIconChat"} style={chatActive ? containerChatbot : null}>
            {chatActive &&
                <div className="headChatbot">
                    <img onClick={() => { setChatActive(!chatActive) }} alt="close sortouch" src={cross} className="crossChatbot" />
                    <img onClick={reloadFunction} alt="reload sortouch" src={reload} className="reloadChatbot" />
                    <img src={back} className="backIconSortouch" onClick={backResponse} />
                    <a target="__blank" href="https://sortouch.co" className="sortouch">Sortouch</a>
                </div>}
            {!load && !(search.length > 0) ?
                <div className={chatActive ? "contentChatbot" : "contentIcon"}>
                    <div className={chatActive && "divRelativeSortouch"}>
                        {!chatActive ?
                            <div className="contentIcon">
                                {textIcon &&
                                    <div className="contentTextIconChat">
                                        <p onClick={activeChat} className="textIconCard"><Questionchat text={"Aidez moi à vous guider !"} /></p>
                                    </div>}
                                <img alt="icon chat" onClick={activeChat} src={logo} className="iconChat" />
                            </div>
                            : chatActive && posted === false &&
                            Array.isArray(containers) &&
                            containers.map((container, index) => {
                                return (
                                    <div className={container.content_type === "question" ? "contentLittleQuestChat" : container.content_type === "response" ? "contentResponseChat" : "contentLittleDestinationChat"}>
                                        {Array.isArray(cardsQuest[index]) && container.content_type === "question" &&
                                            cardsQuest[index].map(card => {
                                                return (
                                                    Array.isArray(cardsQuest[cardsQuest.length - 2]) && cardsQuest[cardsQuest.length - 2][0].id === card.id ?
                                                        <div id={`questionSortouch${index}`} className="contentQuestChat">
                                                            <img alt="sortouch" src={logo} className="logoChat" />
                                                            <Questionchat text={card.content} />
                                                        </div>
                                                        :
                                                        <div id={`questionSortouch${index}`} className="contentQuestChat">
                                                            <img alt="sortouch" src={logo} className="logoChat" />
                                                            <p className="textQuest">{card.content}</p>
                                                        </div>
                                                )
                                            })}
                                        {Array.isArray(cardsRes[index]) && container.content_type === "response" &&
                                            cardsRes[index].map(card => {
                                                return (
                                                    <div onClick={() => { selectResponse(card.id, index); setLoad(true) }} className='containerCardResponse'>
                                                        <p id={`container${index}`} className="textCardResChat">{card.content}</p>
                                                    </div>)
                                            })
                                        }
                                        {Array.isArray(cardsCategory[index]) && container.content_type === "category" &&
                                            cardsCategory[index].map(card => {
                                                return (
                                                    <form onSubmit={handleSubmit(() => { sendMail(card.id) })} className="containerLittleFormChatbot">
                                                        <input ref={send} onChange={takeEmail} type="text" className="inputFormChat" placeholder="email" />
                                                        <input ref={send} onChange={takePhone} type="text" className="inputFormChat" placeholder="numéro de téléphone" />
                                                        <textarea ref={send} className="inputMessageFormChatbot" placeholder="message" onChange={getMessage} />
                                                        <button type="submit" className="sendFormChatbot">Envoyer !</button>
                                                    </form>
                                                )
                                            })}
                                    </div>
                                )
                            })}
                        {posted &&
                            <div className="containerTextePosted">
                                <p className="textPosted">Merci !</p>
                            </div>}
                    </div>
                </div>
                : load ?
                    <div className={chatActive ? "contentChatbot" : "contentIcon"}>
                        {!chatActive ?
                            <div className="contentIcon">
                                {textIcon &&
                                    <div className="contentTextIconChat">
                                        <p onClick={activeChat} className="textIconCard"><Questionchat text={"Prenez contact avec moi !"} /></p>
                                    </div>}
                                <img alt="icon chat" onClick={activeChat} src={logo} className="iconChat" />
                            </div>
                            : chatActive && posted === false &&
                            <div className="containerChargementSortouch">
                                <span className="pointChargementSortouch" />
                                <span className="pointChargementSortouch2" />
                                <span className="pointChargementSortouch3" />
                            </div>}
                    </div>
                    : search.length > 0 &&
                    <div className={chatActive ? "contentChatbot" : "contentIcon"}>
                        {search.map((response, index) => {
                            return (
                                <div onClick={() => { selectResponse(response.id, index, true); setLoad(true) }} className='containerCardResponse'>
                                    <p id={`container${index}`} className="textCardResChat">{response.content}</p>
                                </div>)
                        })}
                    </div>}
            {chatActive && containers[containers.length - 1] && containers[containers.length - 1].content_type !== "category" &&
                <input placeholder="Rechercher" className="inputSearchSortouch" onChange={searching} />}
        </div >
    )
}

export default ChatBotArea