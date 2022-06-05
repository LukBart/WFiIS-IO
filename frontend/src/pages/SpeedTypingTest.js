import { useState, useEffect, useRef, useContext } from 'react'
import randomWords from 'random-words'
import * as FiIcons from "react-icons/fi"
import { IconContext } from "react-icons"
import AuthContext from "../pages/context/AuthProvider";
import "./GamePanel.css"
import axios from 'axios'
const NUMBER_OF_WORDS = 200
const TIME = 20.0


function SpeedTypingTest(props) {
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
    const { auth } = useContext(AuthContext);
    const level = useRef(0)
    const experience = useRef(0);
    const requiredExperience = [{ level: 1, exp: 0 }, { level: 2, exp: 300 }, { level: 3, exp: 713 }, { level: 4, exp: 200 }, { level: 5, exp: 1741 }, { level: 6, exp: 2326 }, { level: 7, exp: 2947 }, { level: 8, exp: 3600 }, { level: 9, exp: 4279 }, { level: 10, exp: 4982 }]
    /* const refreshPage = () => {
        setStatus('waiting')
        setWords(generateWords())
        setCurrWordIndex(0)
        setCorrect(0)
        setIncorrect(0)
        setCurrCharIndex(-1)
        setCurrChar("")
    } */

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
        getUserData()
        if (status === "finished") {
            calculateUserData()
            updateUserData()
            setWords(generateWords())
            setCurrWordIndex(0)
            setCorrect(0)
            setIncorrect(0)
            setCurrCharIndex(-1)
            setCurrChar("")
        }
        if (status !== "started") {
            setStatus("started")
            var startTime = new Date();
            let interval = setInterval(() => {
                setCountDown((prevCountDown) => {
                    if (prevCountDown <= 0.001) {

                        setStatus("finished")
                        clearInterval(interval)
                        setCurrInput("")
                        return TIME.toFixed(3)
                    }
                    else {
                        var currentTime = new Date()
                            , timeElapsed = new Date(currentTime - startTime)
                            , min = timeElapsed.getUTCMinutes()
                            , sec = timeElapsed.getUTCSeconds()
                            , ms = timeElapsed.getUTCMilliseconds();
                        return (TIME - (min * 60) - sec - (ms / 1000)).toFixed(3)
                    }
                })
            })


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
            /* const element = document.getElementById("myBar"); 
            let width = 0;

            if (width < 100) {
                element.style.width = ((currWordIndex+1)/NUMBER_OF_WORDS)*100 + '%';
            } */

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
                return 'background-good'
            } else {
                return 'background-wrong'
            }
        } else if (wordIndex === currWordIndex && currCharIndex >= words[currWordIndex].length) {
            return 'background-wrong'
        } else {
            return ''
        }
    }
    const getUserData = async () => {
        const dataJson = JSON.stringify({
            username: auth.username,
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/getUserData', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                level.current = res.data.user.level;
                experience.current = res.data.user.experience
            }
        }
        catch (err) {
        }
    }
    const updateUserData = async () => {
        const dataJson = JSON.stringify({
            username: auth.username,
            level: level.current,
            experience: experience.current,
        })

        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/updateUserData', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
            }
        }
        catch (err) {
        }
    }


    function calculateUserData() {
        var accuracy = correct / (correct + incorrect)
        var wordsPerMinute = (correct / (TIME / 60))
        var accuracyBonus = 1.0

        switch (true) {
            case accuracy > 0.0 && accuracy <= 0.2:
                accuracyBonus = 0.8
                break;
            case accuracy > 0.2 && accuracy <= 0.5:
                accuracyBonus = 1.0
                break;
            case accuracy > 0.5 && accuracy <= 0.7:
                accuracyBonus = 1.5
                break;
            case accuracy > 0.7 && accuracy <= 0.9:
                accuracyBonus = 2.0
                break;
            case accuracy > 0.9 && accuracy <= 1.0:
                accuracyBonus = 3.0
                break;
            default:
                break;

        }
        var experienceGained = wordsPerMinute * accuracyBonus
        experience.current += experienceGained
        checkIfLeveledUp()
    }

    function checkIfLeveledUp() {
        var experienceNeeded
        var expectedLevel
        for (let index = 0; index < requiredExperience.length; index++) {

            if (requiredExperience[index].level === level.current) {
                experienceNeeded = requiredExperience[index + 1].exp
                expectedLevel = requiredExperience[index + 1].level
                break;
            }
        }
        if (experience.current >= experienceNeeded) {
            level.current = expectedLevel
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
                        {/* <div id="myBar"></div> */}
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
                            <div>
                                <div>
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
                        <div>
                            <div>
                                <h3>Results</h3>
                                <p>Words per minute:</p>
                                <p>
                                    {Math.round(correct / (TIME / 60))}
                                </p>
                            </div>
                            <div>
                                <div></div>
                                <p>Accuracy:</p>
                                {correct !== 0 ? (
                                    <p>
                                        {Math.round((correct / (correct + incorrect)) * 100)}%
                                    </p>
                                ) : (
                                    <p>0%</p>
                                )}
                            </div>
                        </div>
                        <div className="section">
                            <button className='replay' onClick={start}>
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