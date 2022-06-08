import { useState, useEffect, useRef, useContext } from 'react'
import randomWords from 'random-words'
import * as FiIcons from "react-icons/fi"
import { IconContext } from "react-icons"
import io from "socket.io-client"
import "./GamePanel.css"
// import user from '../../../backend/actions/api/user'

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
    const [correct, setCorrect] = useState(1)
    const [incorrect, setIncorrect] = useState(0)
    const [status, setStatus] = useState("waiting")
    const textInput = useRef(null)
    
    const [playersWords, setPlayersWords] = useState(new Map())
    const [room, setRoom] = useState()
    const [prevRoom, setPrevRoom] = useState(false)
    const [players, setPlayers] = useState([])
    const isAdmin = useRef(false)

    var playersAccuracy = new Map()

    const { auth } = useContext(AuthContext);
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
        if (status === "started") {
            textInput.current.focus()
        }
    }, [status])

    useEffect(() => {
        socket.on("player_words_count", (usr, wrd, acc) => {
            let pw = playersWords
            pw.set(usr, wrd)
            playersAccuracy.set(usr, acc)
            setPlayersWords(pw)
        })

        socket.on("new_users", (data, id) => {
            setPlayers(data)
            var pw = playersWords
            pw.set(data, 1)
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

    const sendWordsCount = () => {
        socket.emit("send_words_count", correct, Math.round(((correct) / ((correct) + incorrect)) * 100))
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
            setWords(generateWords())
            setCurrWordIndex(0)
            setCorrect(1)
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
                        sendWordsCount()
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
            sendWordsCount()
            /* const element = document.getElementById("myBar") 
            let width = 0

            if (width < 100) {
                element.style.width = ((currWordIndex+1)/NUMBER_OF_WORDS)*100 + '%'
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

    function generateNewGame() {
        isAdmin.current = true
        setWords(generateWords())
        setPrevRoom(room)
        setRoom(Math.random().toString(36).slice(2))
        setStatus("adminRoom")
    }

    function preparePlayersWords(){
        var pw = new Map()
        players.forEach((p) => {
            if (p !== auth.username){
                pw.set(p, 1)
                playersAccuracy.set(p, 0)
            }
        })
        setPlayersWords(pw)
    }

    function GeneratePlayersTable() {
        const listItems = players.map((usr, idx) => <li key={idx}> {usr} </li>)
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
            if (usr !== auth.username){
                return <div className = {"p" + toString(index)}> {usr}: {playersWords.get(usr)}</div>
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
                        {Math.round((correct-1) / (TIME / 60))}
                    </p>
                </div>
                <div>
                    <div></div>
                    <p>Accuracy:</p>
                    {(correct-1) !== 0 ? (
                        <p>
                            {Math.round(((correct-1) / ((correct-1) + incorrect)) * 100)}%
                        </p>
                    ) : (
                        <p>0%</p>
                    )}
                </div>
            </div>
        
        const playersResult = players.map((usr, index) => {
            if (usr !== auth.username){
                return (
                    <div className= {"player" + toString(index)}>
                        <div>
                            <h3>{usr} results</h3>
                            <p>Words per minute:</p>
                            <p>
                                {Math.round((playersWords.get(usr) - 1) / (TIME / 60))}
                            </p>
                        </div>
                        <div>
                            <div></div>
                            <p>Accuracy:</p>
                            {(correct-1) !== 0 ? (
                                <p>
                                    {playersAccuracy.get(usr)}%
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
                        {/* <h3>Press play when you are ready to start</h3>
                        <button className='replay' onClick={start}> */}
                            {/* Start */}
                            {/* <FiIcons.FiPlay />
                        </button> */}
                        <h3>Press button to create new room</h3>
                        <button onClick={generateNewGame}> Create New Room</button>
                        <input
                            placeholder="Room Number..."
                            onChange={(event) => {
                            setRoom(event.target.value)
                            }}
                        />
                        <button onClick={joinRoom}> Join Room</button>
                    </div>
                )}
                {status === "adminRoom" && (
                    <div className="section">
                        <h3>To play with friends send them this code:</h3>
                        <h2>{room}</h2>
                        <h3>Current players:</h3>
                        <GeneratePlayersTable />
                        <button onClick={beginGame}> <FiIcons.FiPlay /></button>
                    </div>
                )}
                {status === "waitingRoom" && (
                    <div className="section">
                    <h3>To play with frinds send them this code:</h3>
                    <h2>{room}</h2>
                    <h3>Current players:</h3>
                    <GeneratePlayersTable />
                    <h3>Waiting for start</h3>
                </div>
                )}
                {status === "started" && (
                    <div className="section">
                        {/* <div id="myBar"></div> */}
                        <div class="container">
                            {/* <div class="Player 1">{Math.round((playersWords/correct) * 100)}%</div> */}
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
                    </div>
                )}
            </IconContext.Provider>
        </div>
    )
}

export default SpeedTypingTestMultiplayer