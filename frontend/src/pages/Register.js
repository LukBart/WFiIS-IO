import React, { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"


export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRep, setPasswordRep] = useState('')

    const navigate = useNavigate()

    const registerUser = async () => {
        const dataJson = JSON.stringify({
            username: username,
            password: password
        })
        try {
            const res = await axios.post(("https://stt-wfiis-backend.herokuapp.com" || "http://localhost:3001") + '/api/register', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                document.getElementById("email").value = ""
                document.getElementById("password").value = ""
                document.getElementById("passwordRepeat").value = ""
                alert("Registration successful. You will be moved to the Log in panel.")
                navigate("/login")
            }

        }
        catch (err) {
            document.getElementById("email").value = ""
            document.getElementById("password").value = ""
            document.getElementById("passwordRepeat").value = ""
            alert("Nickname already exist!")
        }
    }

    const createUserData = async () => {
        const dataJson = JSON.stringify({
            username: username,
            level: 1,
            experience: 0,
        })
        try {
            const res = await axios.post(("https://stt-wfiis-backend.herokuapp.com" || "http://localhost:3001") + '/api/createUserData', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            console.log(res)
        }
        catch (err) {
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== passwordRep) {
            document.getElementById("password").value = ""
            document.getElementById("passwordRepeat").value = ""
            alert('Passwords do not match!')
        }
        else {
            registerUser()
            createUserData()
        }
    }

    return (
        <form className="formReg" autoComplete="off" onSubmit={handleSubmit} >
            <div className="title">Create account</div>
            <div className="subtitle">Please enter your details</div>
            <div className="input-container ic1">
                <input id="email" className="input" type="nickname" placeholder=" " role="presentation" autoComplete="off" onChange={(e) => { setUsername(e.target.value) }} />
                <div className="cut"></div>
                <label htmlFor="email" className="placeholder">
                    Nickname
                </label>
            </div>
            <div className="input-container ic2">
                <input id="password" className="input" type="password" placeholder=" " onChange={(e) => { setPassword(e.target.value) }} />
                <div className="cut cut-short"></div>
                <label htmlFor="password" className="placeholder">
                    Password
                </label>
            </div>
            <div className="input-container ic2">
                <input id="passwordRepeat" className="input" type="password" placeholder=" " onChange={(e) => { setPasswordRep(e.target.value) }} />
                <div className="cut cut-long"></div>
                <label htmlFor="passwordRepeat" className="placeholder">
                    Confirm password
                </label>
            </div>
            <button id="register" type="text" className="submit">
                Sign up
            </button>
        </form>
    )
}
