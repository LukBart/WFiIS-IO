import { useState, useEffect, useRef, useContext } from 'react'
import randomWords from 'random-words'
import * as FiIcons from "react-icons/fi"
import { TailSpin } from 'react-loader-spinner'
import { IconContext } from "react-icons"
import io from "socket.io-client"
import "./GamePanel.css"

import AuthContext from "../pages/context/AuthProvider"
const NUMBER_OF_WORDS = 200
const TIME = 20.0

const socket = io.connect("http://localhost:3002")

function SpeedTypingTestMultiplayer() {
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
    
    const [playersWords, setPlayersWords] = useState(new Map())
    const [room, setRoom] = useState()
    const [prevRoom, setPrevRoom] = useState(false)
    const [players, setPlayers] = useState([])
    const [value, setValue] = useState("")
    const isAdmin = useRef(false)

    //var playersAccuracy = new Map()
    const [playersIncWords, setIncPlayersWords] = useState(new Map())

    const { auth } = useContext(AuthContext)
    useEffect(() => {
        if (status === "started") {
            textInput.current.focus()
        }
    }, [status])

    useEffect(() => {
        socket.on("player_words_count", (usr, wrd, inc) => {
            let pw = playersWords
            let piw = playersIncWords
            pw.set(usr, wrd)
            piw.set(usr, inc)
            setPlayersWords(pw)
            setIncPlayersWords(piw)
        })

        socket.on("new_users", (data, id) => {
            setPlayers(data)
            var pw = playersWords
            pw.set(data, 0)
            if (isAdmin.current) {
                socket.emit("resend_data", id)
            }
        })

        socket.on("start", () => {
            start()
        })

        socket.on("resended_data", (wrd, usr) => {
            setWords(wrd)
            setPlayers(usr)
        })

        
    })

    useEffect(() => {
        socket.on("after_join", (usr, wrd) => {
            setWords(wrd)
            setPlayers(usr)
        })
    })

    useEffect(() => {
        socket.emit("give_username", auth.username)
        if (prevRoom){
            socket.emit("disconnect_room", prevRoom)
        }
        if (isAdmin.current){
            socket.emit("make_room", room, words)
        }
    }, [room, prevRoom])

    function playAgain() {
        setStatus('waiting')
        setCurrWordIndex(0)
        setCorrect(0)
        setIncorrect(0)
        setCurrCharIndex(-1)
        setCurrChar("")
        setValue("")
        setPlayers([])
        if (isAdmin.current){
            isAdmin.current = false
        }
    }

    const sendWordsCount1 = () => {
        socket.emit("send_words_count", correct+1, incorrect)
    }
    const sendWordsCount2 = () => {
        socket.emit("send_words_count", correct, incorrect+1)
    }

    const joinRoom = () => {
        isAdmin.current = false
        if (room !== "") {
            socket.emit("join_room", room)
        }
        setStatus("waitingRoom")
    }

    function generateWords() {
        return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords())
    }

    function start() {

        if (status === "finished") {
            setCurrWordIndex(0)
            setCorrect(0)
            setIncorrect(0)
            setCurrCharIndex(-1)
            setCurrChar("")
        }
        if (status !== "started") {
            setStatus("started")
            preparePlayersWords()
            var startTime = new Date()
            let interval =setInterval(() => {
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
                            , ms = timeElapsed.getUTCMilliseconds()
                        return (TIME - (min*60) - sec -(ms/1000)).toFixed(3)
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
        } else if (keyCode === 32) {
            setPrevInput(" ")
            setCurrInput("")
            //backspace
        } else if (keyCode === 8) {
            if (currCharIndex >= 0) {
                setCurrCharIndex(currCharIndex - 1)
                setCurrChar("")
            }
        } else if (keyCode >= 48 && keyCode <= 90) {
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
            sendWordsCount1()
        }
        else {
            setIncorrect(incorrect + 1)
            sendWordsCount2()
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

    function generateNewGame() {
        isAdmin.current = true
        setWords(generateWords())
        setPrevRoom(room)
        var rm = Math.random().toString(36).slice(2)
        while (rm.length <= 10 || rm.length >= 12){
            rm = Math.random().toString(36).slice(2)
        }
        setRoom(rm)
        setStatus("adminRoom")
    }

    function preparePlayersWords(){
        var pw = new Map()
        var piw = new Map()
        players.forEach((p) => {
            if (p !== auth.username){
                pw.set(p, 0)
                piw.set(p, 0)
            }
        })
        setPlayersWords(pw)
        setIncPlayersWords(piw)
    }

    function GeneratePlayersTable() {
        const listItems = players.map((usr, index) => <li key={index}> {usr} </li>)
        return (
            <><ul> {listItems} </ul></>
        )
    }

    function beginGame() {
        socket.emit("begin_game")
        start()
    }

    function GeneratePlayersWords() {
        const listItems = players.map((usr, index) => {
            if (usr === auth.username){
                return (<div key={index}><div key={"player" + index}>{usr}: {(correct+incorrect>0)?
                        Math.round(correct/(correct+incorrect)*100)+"%":
                        "0%"} 
                    </div>
                    <div key={"bar" + index} className={"bar" + index} style={{
                        backgroundColor: "red", width: ((correct) > 0) ?
                            ((correct / NUMBER_OF_WORDS) * 100 + '%') :
                            "0px", height: "20px"
                    }}> </div></div>)
            }
            else{
                return (<div key={index}><div key={"player" + index}> {usr}: {(playersWords.get(usr) + playersIncWords.get(usr) > 0) ?
                    Math.round(playersWords.get(usr) / (playersWords.get(usr) + playersIncWords.get(usr)) * 100) + "%" :
                    "0%"} 
                </div> 
                    <div key={"bar"+index} className={"bar" + index} style={{ backgroundColor: "#4CAF50", width: ((playersWords.get(usr)) > 0 )?
                        (((playersWords.get(usr)) / NUMBER_OF_WORDS) * 100 + '%'):
                    "0px" ,  height: "20px"}}> </div></div>)
            }
        })
        return (
            <>{listItems}</>  
        )
    }

    function GenerateResultScreen() {
        const yourResult =
            <div>
                <div>
                    <h3>Your results</h3>
                    <p>Words per minute:</p>
                    <p>
                        {Math.round((correct) / (TIME / 60))}
                    </p>
                </div>
                <div>
                    <div></div>
                    <p>Accuracy:</p>
                    {(correct) !== 0 ? (
                        <p>
                            {Math.round(((correct) / ((correct) + incorrect)) * 100)}%
                        </p>
                    ) : (
                        <p>0%</p>
                    )}
                </div>
            </div>
        
        const playersResult = players.map((usr, index) => {
            if (usr !== auth.username){
                return (
                    <div className={"player" + index} key={"player" + index}>
                        <div key={"wpm"+index}>
                            <h3>{usr} results</h3>
                            <p>Words per minute:</p>
                            <p>
                                {Math.round((playersWords.get(usr)) / (TIME / 60))}
                            </p>
                        </div>
                        <div key={"acc" + index}>
                            
                            <p>Accuracy:</p>
                            {(playersWords.get(usr)) !== 0 ? (
                                <p>
                                    {Math.round(((playersWords.get(usr)) / ((playersWords.get(usr)) + playersIncWords.get(usr))) * 100)}%
                                </p>
                            ) : (
                                <p>0%</p>
                            )}
                        </div>
                    </div>
                )
            }

        })
        return (
            <>{yourResult}{playersResult}</>  
        ) 
    }

    return (
        <div className='gamePanel'>
            <IconContext.Provider value={{ color: "rgb(246, 233, 246)", size: "50px" }}>
                {status === "waiting" && (
                    <div className="section">
                        <div className='newRoom'>
                            <h3>Press button to create new room:</h3>
                            <button className="multi" id="multi1" onClick={generateNewGame}> Create New Room</button>
                        </div>
                        <div className='pasteCode'>
                            <h3>Or paste code from your friend here:</h3>

                            <div className="input-container ic1">
                                <input className='codeInput' placeholder=" " autoComplete="off" id="codeInput"
                                    onChange={(event) => {
                                        setRoom(event.target.value)
                                        setValue(event.target.value)
                                    }}
                                />
                                <div className="cut"></div>
                                <label className="placeholder" htmlFor='codeInput'>Room code</label>
                            </div>


                            <button className="multi" id="multi2" onClick={joinRoom} disabled={!value}> Join Room</button>
                        </div>
                        
                        
                    </div>
                )}
                {status === "adminRoom" && (
                    <div className="section">
                        <h3>To play with friends send them this code:</h3>
                        <h2>{room}</h2>
                        <button className='replay' onClick={beginGame}> <FiIcons.FiPlay /></button>
                        <h3 className='players'>Current players:</h3>
                        <GeneratePlayersTable />
                    </div>
                )}
                {status === "waitingRoom" && (
                    <div className="section">
                    <h3>To play with friends send them this code:</h3>
                    <h2>{room}</h2>
                    <button className='wait'> <TailSpin color="white" height={50} width={50} /></button>
                    <br />
                    <h5>Wait for the start...</h5> 
                    <h3 className='players'>Current players:</h3>
                    <GeneratePlayersTable />
                </div>
                )}
                {status === "started" && (
                    <div className="section">
                        <div className ="container">
                            <GeneratePlayersWords />
                        </div>
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
                        <GenerateResultScreen />
                        <button className='replay' onClick={playAgain}>
                            {/* Zagraj ponownie */}
                            <FiIcons.FiRotateCcw />
                        </button>
                    </div>
                    
                )}
            </IconContext.Provider>
        </div>
    )
}

export default SpeedTypingTestMultiplayer