import React, {useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import AuthContext from "./context/AuthProvider"

export default function Login(props) {

    const { auth, setAuth } = useContext(AuthContext);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    let navigate = useNavigate();

    useEffect(() => {
            if(auth)
            {
               navigate("/")
            }
        },[auth])

    const logInUser = async () => {

        const dataJson = JSON.stringify({
            username: username,
            password: password
        })
        //!!!
        try{
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/login', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })/*.catch((err) => { console.log('cant find API') })*/
            console.log(JSON.stringify(res.data))

            if(res)
            {
                setAuth(true)
            }
        }
        catch (err) { alert("Zły login lub hasło!") }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        logInUser()
    }


    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="title">Witaj</div>
            <div className="subtitle">Podaj dane logowania</div>
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
                    Hasło
                </label>
            </div>
            <button type="text" className="submit">
                Zaloguj
            </button>
        </form>
    )
}
