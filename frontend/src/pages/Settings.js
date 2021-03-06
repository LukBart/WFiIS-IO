import { useEffect, useRef, useContext, useState } from 'react'
import '../App.css'
import SkinContext from './context/SkinContext'
import './Settings.css'
import AuthContext from "../pages/context/AuthProvider"
import axios from 'axios'

export default function Settings() {
    const { auth } = useContext(AuthContext)
    const level = useRef(0)
    const [loading, setLoading] = useState(true)
    const experience = useRef(0)
    const { selectedColor, setSelectedColor } = useContext(SkinContext)
    const { selectedFont, setSelectedFont } = useContext(SkinContext)
    const { selectedLanguage, setSelectedLanguage } = useContext(SkinContext)

    const languageOptions = [
        { value: 'en', text: "English" },
        { value: 'pl', text: "Polish" },
    ]
    const colorOptions = [
        { value: '#f6e9f6', text: 'Default' },
        { value: '#D8BFD8', text: 'Thistle' },
        { value: '#F08080', text: 'Froly' },
        { value: '#AFEEEE', text: 'Blizzard Blue' },
        { value: '#87CEFA', text: 'Malibu' },
        { value: '#B0C4DE', text: 'Pigeon Post' },
        { value: '#FFE4E1', text: 'Pippin' },
        { value: '#2F4F4F', text: 'Spectra' },
        { value: '#696969', text: 'Dove Gray' },
        { value: '#A9A9A9', text: 'Silver Chalice' },
    ]
    const fontOptions = [
        { value: 'sans-serif', text: 'Default' },
        { value: 'Monospace', text: 'Monospace' },
        { value: 'Lucida ', text: 'Lucida ' },
        { value: 'Console ', text: 'Console ' },
        { value: 'Monospace ', text: 'Monospace ' },
        { value: 'Monaco ', text: 'Monaco ' },
        { value: 'Fantasy ', text: 'Fantasy ' },
        { value: 'Papyrus ', text: 'Papyrus ' },
        { value: 'Serif ', text: 'Serif ' },
        { value: 'Garamond ', text: 'Garamond ' }
    ]

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 100)
    }, [])

    function createLanguageSelect() {
        let lang = []
        for (let i = 0; i < languageOptions.length; i++) {
            lang.push(<option key={languageOptions[i].text} value={languageOptions[i].value}>{languageOptions[i].text}</option>)
        }
        return lang
    }
    function createFontsSelect() {
        let fonts = []
        for (let i = 0; i < level.current; i++) {
            fonts.push(<option key={fontOptions[i].text} value={fontOptions[i].value}>{fontOptions[i].text}</option>)
        }
        return fonts
    }

    function createColorsSelect() {
        let colors = []
        for (let i = 0; i < level.current; i++) {

            colors.push(<option key={colorOptions[i].text} value={colorOptions[i].value}
            >{colorOptions[i].text}</option >)
        }
        return colors
    }

    useEffect(() => {
        getUserData()
    })

    const handleChangeColor = event => {
        setSelectedColor(event.target.value)
    }

    const handleChangeFont = event => {
        setSelectedFont(event.target.value)
    }

    const handleLanguageChange = event => {
        setSelectedLanguage(event.target.value)
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
                level.current = res.data.user.level
                experience.current = res.data.user.experience
            }
        }
        catch (err) {
        }
    }

    if (loading) {
    }


    return (
        <>
            <div className='gamePanel'>
                <div className='settingsPanel'>
                    <div className='text'><h3>User:</h3></div>
                    <div className='userData'>
                        {auth.username}
                    </div>
                    <div className='text'><h3>Level:</h3></div>
                    <div className='userData'>
                        {level.current}
                    </div>
                    <div className='text'><h3>Experience:</h3></div>
                    <div className='userData'>
                        {Math.round(experience.current*100)/100 + " XP"}
                    </div>
                    <div className='text'><h3>Selected language:</h3></div>
                        <select value={selectedLanguage} onChange={handleLanguageChange} className="mySelect">{createLanguageSelect()}</select>
                    <div className='text'><h3>Selected color:</h3></div>
                        <select value={selectedColor} onChange={handleChangeColor} className="mySelect">
                            {createColorsSelect()}
                        </select>
                    <div className='text'><h3>Selected font:</h3></div>
                        <select value={selectedFont} onChange={handleChangeFont} className="mySelect">
                            {createFontsSelect()}
                        </select>

                </div>
            </div >
        </>
    )
}
