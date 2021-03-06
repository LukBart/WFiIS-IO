import { createContext, useState } from "react";
import { useEffect } from "react";

const SkinContext = createContext({});

export const Skin = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState('rgb(246, 233, 246)');
    const [selectedFont, setSelectedFont] = useState('sans-serif');
    const [selectedLanguage, setSelectedLanguage] = useState('en')

    useEffect(() => {
        document.documentElement.style.setProperty('--bg-color', selectedColor);
    }, [selectedColor]);

    useEffect(() => {
        document.documentElement.style.setProperty('--font', selectedFont);
    }, [selectedFont]);
    return (
        <SkinContext.Provider value={{ selectedColor, setSelectedColor, selectedFont, setSelectedFont, selectedLanguage, setSelectedLanguage }}>
            {children}
        </SkinContext.Provider>
    )
}

export default SkinContext;