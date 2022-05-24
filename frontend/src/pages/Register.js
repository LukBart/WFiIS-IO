import React, { useState } from "react"
import axios from 'axios'


export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRep, setPasswordRep] = useState('')

    const registerUser = async () => {
        const dataJson = JSON.stringify({
            username: username,
            password: password
        })
        const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/register', dataJson, {
            headers: { 'Content-Type': 'application/json' }
        }).catch((err) => { console.log('cant find API') })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // alert(username + '\n' + password + '\n' + passwordRep + '\n' + (password === passwordRep))
        if (password !== passwordRep) {
            alert('Podane hasła nie są jednakowe!')
        }
        else {
            registerUser()
        }
    }

    return (
        <form className="formReg" autoComplete="off" onSubmit={handleSubmit} >
            <div className="title">Załóż konto</div>
            <div className="subtitle">Podaj dane rejestracji</div>
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
                    Hasło
                </label>
            </div>
            <div className="input-container ic2">
                <input id="passwordRepeat" className="input" type="password" placeholder=" " onChange={(e) => { setPasswordRep(e.target.value) }} />
                <div className="cut cut-long"></div>
                <label htmlFor="passwordRepeat" className="placeholder">
                    Powtórz hasło
                </label>
            </div>
            <button type="text" className="submit">
                Zaloguj
            </button>
        </form>
    )
}
