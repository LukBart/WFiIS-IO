import { useEffect, useRef, useContext } from 'react'
import '../App.css'
import SkinContext from './context/SkinContext';
import './Settings.css';
import AuthContext from "../pages/context/AuthProvider";
import axios from 'axios'

export default function Settings() {
    const { auth } = useContext(AuthContext);
    const level = useRef(0)
    const experience = useRef(0);


    const colorOptions = [
        { value: 'rgb(246, 233, 246)', text: 'Default' },
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

    function createFontsSelect() {
        let fonts = []
        for (let i = 0; i < level.current; i++) {
            fonts.push(<option key={fontOptions[i].value}>{fontOptions[i].text}</option>)
        }
        return fonts
    }
    function createColorsSelect() {
        let colors = []
        for (let i = 0; i < level.current; i++) {

            colors.push(<option key={colorOptions[i].value}>{colorOptions[i].text}</option>)
        }
        return colors
    }

    useEffect(() => {
        getUserData()
    });

    const { selectedColor, setSelectedColor } = useContext(SkinContext);
    const { selectedFont, setSelectedFont } = useContext(SkinContext);

    const handleChangeColor = event => {
        setSelectedColor(event.target.value);
    };

    const handleChangeFont = event => {
        setSelectedFont(event.target.value);
    };

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


    return (
        <>
            <div className='gamePanel'>
                <div className='settingsPanel'>
                    <p>Użytkownik</p>
                    <p className='userData'>
                        {auth.username}
                    </p>
                    <p>Poziom</p>
                    <p className='userData'>
                        {level.current}
                    </p>
                    <p>Doświadczenie</p>
                    <p className='userData'>
                        {experience.current}
                    </p>
                    <p className='SkinList'>
                        <label>Kolor </label>
                        <select value={selectedColor} onChange={handleChangeColor}>
                            {createColorsSelect()}
                        </select>
                    </p>
                    <p className='SkinList'>
                        <label>Font </label>
                        <select value={selectedFont} onChange={handleChangeFont}>
                            {createFontsSelect()}
                        </select>
                    </p>
                </div>
            </div>
        </>
    )
}
