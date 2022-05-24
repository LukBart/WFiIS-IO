import { useState, useEffect, useRef } from 'react'
import randomWords from 'random-words'
import * as FiIcons from "react-icons/fi"
import { IconContext } from "react-icons"

import "./GamePanel.css"
const NUMBER_OF_WORDS = 200
const TIME = 2.0


function SpeedTypingTest() {
    const [words, setWords] = useState([])
    const [countDown, setCountDown] = useState(TIME.toFixed(2))
    const [currInput, setCurrInput] = useState("")
    const [prevInput, setPrevInput] = useState("")
    const [currWordIndex, setCurrWordIndex] = useState(0)
    const [currCharIndex, setCurrCharIndex] = useState(-1)
    const [currChar, setCurrChar] = useState("")
    const [correct, setCorrect] = useState(0)
    const [incorrect, setIncorrect] = useState(0)
    const [status, setStatus] = useState("waiting")
    const textInput = useRef(null)

    const refreshPage = () => {
        setStatus('waiting')
    }

    useEffect(() => {
        setWords(generateWords())
    }, [])

    useEffect(() => {
        if (status === "started") {
            textInput.current.focus()
        }
    }, [status])

    function generateWords() {
        return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords())
    }

    function start() {

        if (status === "finished") {
            setWords(generateWords())
            setCurrWordIndex(0)
            setCorrect(0)
            setIncorrect(0)
            setCurrCharIndex(-1)
            setCurrChar("")
        }
        if (status !== "started") {
            setStatus("started")
            let interval = setInterval(() => {
                setCountDown((prevCountDown) => {
                    if (prevCountDown < 0.01) {
                        clearInterval(interval)
                        setStatus("finished")
                        setCurrInput("")
                        return TIME.toFixed(2)
                    }
                    else {
                        return (Math.round((prevCountDown - 0.01) * 100) / 100).toFixed(2)
                    }
                })
            }, 10)
        }
    }

    function handleKeyDown({ keyCode, key }) {
        //space
        if (keyCode === 32 && prevInput !== " ") {
            checkMatch()
            setPrevInput(" ")
            setCurrInput("")
            setCurrWordIndex(currWordIndex + 1)
            setCurrCharIndex(-1)
        } else if (keyCode === 32) {
            setPrevInput(" ")
            setCurrInput("")
            //backspace
        } else if (keyCode === 8) {
            if (currCharIndex >= 0) {
                setCurrCharIndex(currCharIndex - 1)
                setCurrChar("")
            }
        } else {
            setCurrCharIndex(currCharIndex + 1)
            setPrevInput(currChar)
            setCurrChar(key)
        }
    }

    function checkMatch() {
        const wordToCompare = words[currWordIndex]
        const doesItMatch = wordToCompare === currInput.trim()
        if (doesItMatch) {
            setCorrect(correct + 1)
        }
        else {
            setIncorrect(incorrect + 1)
        }
    }

    function getCharClass(wordIndex, charIndex, char) {
        if (wordIndex === currWordIndex && charIndex === currCharIndex && currChar && status !== "finished") {
            if (char === currChar) {
                return 'has-background-success'
            } else {
                return 'has-background-danger'
            }
        } else if (wordIndex === currWordIndex && currCharIndex >= words[currWordIndex].length) {
            return 'has-background-danger'
        } else {
            return ''
        }
    }

    return (
        <div className='gamePanel'>
            <IconContext.Provider value={{ color: "rgb(246, 233, 246)", size: "50px" }}>
                {status === "waiting" && (
                    <div className="section">
                        <h3>Press play when you are ready to start</h3>
                        <button className='replay' onClick={start}>
                            {/* Start */}
                            <FiIcons.FiPlay />
                        </button>
                    </div>
                )}
                {status === "started" && (
                    <div className="section">
                        <div className="countDown">
                            <h2>{countDown}</h2>
                        </div>
                        <div className="input-container ic1" >
                            <input ref={textInput} disabled={status !== "started"} placeholder=" " type="text" className="input input-game" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)} />
                            <div className="cut cut-game"></div>
                            <label htmlFor="emailLog" className="placeholder placeholder-game">
                                {words[currWordIndex]}
                            </label>
                        </div>
                        <div className="card">
                            <div className="card-content">
                                <div className="content">
                                    {words.map((word, i) => (
                                        <span key={i}>
                                            <span>
                                                {word.split("").map((char, j) => (
                                                    <span className={getCharClass(i, j, char)} key={j}>{char}</span>
                                                ))}
                                            </span>
                                            <span> </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {status === "finished" && (
                    <div className="section">
                        <div className="columns">
                            <div className="column has-text-centered">
                                <h3>Results</h3>
                                <p className="is-size-5">Words per minute:</p>
                                <p className="has-text-primary is-size-1">
                                    {Math.round(correct / (TIME / 60))}
                                </p>
                            </div>
                            <div className="column has-text-centered">
                                <div className="is-size-5"></div>
                                <p className="is-size-5">Accuracy:</p>
                                {correct !== 0 ? (
                                    <p className="has-text-info is-size-1">
                                        {Math.round((correct / (correct + incorrect)) * 100)}%
                                    </p>
                                ) : (
                                    <p className="has-text-info is-size-1">0%</p>
                                )}
                            </div>
                        </div>
                        <div className="section">
                            <button className='replay' onClick={refreshPage}>
                                {/* Zagraj ponownie */}
                                <FiIcons.FiRotateCcw />
                            </button>
                        </div>
                    </div>
                )}
            </IconContext.Provider>
        </div>
    )
}

export default SpeedTypingTest