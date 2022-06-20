import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import AuthContext from "./context/AuthProvider"


export default function Login(props) {

    const { auth, setAuth } = useContext(AuthContext);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    let navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate("/")
        }
    }, [auth, navigate])

    const logInUser = async () => {

        const dataJson = JSON.stringify({
            username: username,
            password: password
        })
        //!!!
        try {
            const res = await axios.post(("https://stt-wfiis-backend.herokuapp.com" || "http://localhost:3001") + '/api/login', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })/*.catch((err) => { console.log('cant find API') })*/
            // console.log(JSON.stringify(res.data.token))

            if (res) {
                setAuth(res.data.user)
            }
        }
        catch (err) { alert("Wrong login or password!") }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        logInUser()
    }


    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="title">Hello!</div>
            <div className="subtitle">Sign in to your account</div>
            <div className="input-container ic1">
                <input id="email" className="input" type="text" placeholder=" " role="presentation" autoComplete="off" onChange={(e) => { setUsername(e.target.value) }} />
                <div className="cut"></div>
                <label htmlFor="emailLog" className="placeholder">
                    Nickname
                </label>
            </div>
            <div className="input-container ic2">
                <input id="passwordLog" className="input" type="password" placeholder=" " autoComplete="off" onChange={(e) => { setPassword(e.target.value) }} />
                <div className="cut cut-short"></div>
                <label htmlFor="passwordLog" className="placeholder">
                    Password
                </label>
            </div>
            <button id="login" type="text" className="submit">
                Log in
            </button>
        </form>
    )
}
