import React, {useEffect, useState} from 'react'

const Questionchat = (props) => {
    const [totalQuestion, setTotalQuestion] = useState([])
    

    useEffect(() => {
        printText(props.text)
    }, [props.text])


    const printText = (text) => {
        if(props.text){
            let index = 0
            let question = text.split('')
            let stockQuestion = []
            const questionPrint = setInterval(() => {
                stockQuestion = [...stockQuestion, question[index]]
                setTotalQuestion([...totalQuestion, stockQuestion])
                index++
                if(index === question.length){
                    clearInterval(questionPrint)
                    return(true)
                }
            }, 30)
        }
    }

    return(
        <div>
            <p className="questionPrint">{totalQuestion}</p>
        </div>
    )
}

export default Questionchat