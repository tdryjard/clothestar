import React, {useState, useEffect} from 'react'
import { Progress } from 'antd';
import url from '../../api/url'

export const VoteStar = () => {
    const [voting, setVoting] = useState<any>(false)
    const [preVoting, setPreVoting] = useState<any>([])
    const [votes, setVotes] = useState<any>([])
    const [email, setEmail] = useState('')

    useEffect(() => {
        getVote()
    }, [])

    const headerReq : any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
    }

    const getVote = async () => {
        const res = await fetch(`${url}/votes`)
        const resJson = await res.json()
        setVotes(resJson)
    }

    const sendVote = async (index : any) => {
        const res = await fetch(`${url}/votes/send`, {
            method: 'POST',
            credentials: 'include',
            headers: headerReq,
            body: JSON.stringify({
                email: email
            })
        })
        if(res) {
            preVoting.map((value : any, indexVote : any) => {
                if(value === index) setPreVoting([...preVoting.splice(indexVote)])
            })
            setVoting([...voting, index])
        }
    }



    return(
        <div className="containerVoteStar">
            {votes.map((vote : any, index : any) => {
            <div className="contentStarVote">
            <img alt={vote.name} src={`../images${vote.rate}`} className="imgDressVote"/>
                <p className="text">{vote.name}</p>
                <Progress percent={vote.percent} status="active" />
                {voting.includes(index) ?
                <p className="isVote">Voté !</p> :
                !preVoting.includes(index) ?
                <button onClick={() => setPreVoting([...preVoting, index])} className="buttonPreVote">Voter</button>
                :
                <div className="contentPreVoteStar">
                    <p className="text">Entrez votre adress email, puis votez !</p>
                    <div className="containerInputPreVote">
                    <input onChange={(e) => setEmail(e.target.value)} className="inputEmailVote" placeholder="email"/>
                <button onClick={() => sendVote(index)} className="buttonVote">Voter</button>
                </div>
                </div>}
            </div>
            })}
        </div>
    )
}