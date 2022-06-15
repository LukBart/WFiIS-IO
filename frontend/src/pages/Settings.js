import React, { useContext } from "react";
import '../App.css'
import SkinContext from './context/SkinContext';
import './Settings.css';

export default function Settings() {

    const colorOptions = [
        {value: 'rgb(246, 233, 246)', text: 'Default'},
        {value: '#D8BFD8', text: 'new1'},
        {value: '#F08080', text: 'new2'},
        {value: '#AFEEEE', text: 'new3'},
        {value: '#87CEFA', text: 'new4'},
        {value: '#B0C4DE', text: 'new5'},
        {value: '#FFE4E1', text: 'new6'},
        {value: '#2F4F4F', text: 'new7'},
        {value: '#696969', text: 'new8'},
        {value: '#A9A9A9', text: 'new9'},
        {value: '#C0C0C0', text: 'new10'}
    ]
    const fontOptions = [
        {value: 'sans-serif', text: 'Default'},
        {value: 'Monospace', text: 'Monospace'},
        {value: 'Lucida ', text: 'Lucida '},
        {value: 'Console ', text: 'Console '},
        {value: 'Monospace ', text: 'Monospace '},
        {value: 'Monaco ', text: 'Monaco '},
        {value: 'Fantasy ', text: 'Fantasy '},
        {value: 'Papyrus ', text: 'Papyrus '},
        {value: 'Serif ', text: 'Serif '},
        {value: 'Garamond ', text: 'Garamond '}
    ]
    const {selectedColor, setSelectedColor} = useContext(SkinContext);
    const {selectedFont, setSelectedFont} = useContext(SkinContext);

    const handleChangeColor = event => {
        console.log(event.target.value);
        setSelectedColor(event.target.value);
    };

    const handleChangeFont = event => {
        console.log(event.target.value);
        setSelectedFont(event.target.value);
    };

    return (
        <>
            <div className='gamePanel'>
                <div className='settingsPanel'>
                    <p className='userData'>
                        username
                    </p>
                    <p className='userData'>
                        Level
                    </p>
                    <p className='userData'>
                        Exp
                    </p>
                    <p className='SkinList'>
                        <label>Kolor </label>
                        <select value={selectedColor} onChange={handleChangeColor}>
                            {colorOptions.map(colorOptions => (
                                <option key={colorOptions.value} value={colorOptions.value}>
                                    {colorOptions.text}
                                </option>
                            ))}
                        </select>
                    </p>
                    <p className='SkinList'>
                    <label>Font </label>
                    <select value={selectedFont} onChange={handleChangeFont}>
                        {fontOptions.map(fontOptions => (
                            <option key={fontOptions.value} value={fontOptions.value}>
                                {fontOptions.text}
                            </option>
                        ))}
                    </select>
                    </p>
                </div>
            </div>
        </>
    )
}
