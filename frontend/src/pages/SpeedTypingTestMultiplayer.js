import { useState, useEffect, useRef } from 'react'
import randomWords from 'random-words'
import * as FiIcons from "react-icons/fi"
import { IconContext } from "react-icons"
import io from "socket.io-client"
import "./GamePanel.css"
const NUMBER_OF_WORDS = 200
const TIME = 20.0

const socket = io.connect("http://localhost:3002");

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
    
    const [player2WPM, setPlayer2WPM] = useState(0)
    const [room, setRoom] = useState("");

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

    useEffect(() => {
        socket.on("player_words_count", (data) => {
            console.log(data);
            setPlayer2WPM(data);
        });

        socket.on("get_username", () => {
            socket.emit("give_username", "tutaj ma byc login")
        });
    }, [socket]);


    const sendWPM = () => {
        socket.emit("send_WPM", correct*60/(TIME - countDown))
    }

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
      };

    function generateWords() {
        return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords())
    }

    function waitingRoom() {

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
            var startTime = new Date();
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
                            , ms = timeElapsed.getUTCMilliseconds();
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
            sendWPM()
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
                        <input
                            placeholder="Room Number..."
                            onChange={(event) => {
                            setRoom(event.target.value);
                            }}
                        />
                        <button onClick={joinRoom}> Join Room</button>
                    </div>
                )}
                {status === "started" && (
                    <div className="section">
                        {/* <div id="myBar"></div> */}
                        <div class="container">
                            <div class="Player 1">{Math.round(((TIME - countDown) * player2WPM/ 60 / correct) * 100)}%</div>
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

export default SpeedTypingTestMultiplayer