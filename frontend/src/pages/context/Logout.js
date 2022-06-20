import { useContext, useEffect } from "react"
import AuthContext from "./AuthProvider";
import SkinContext from "./SkinContext";
import { useNavigate } from "react-router-dom";
import '../../App.css'
export default function Logout() {
    const { setAuth } = useContext(AuthContext);
    const { setSelectedColor, setSelectedFont } = useContext(SkinContext);
    setAuth(null);
    let navigate = useNavigate();
    useEffect(() =>{
        setSelectedColor('#f6e9f6');
        setSelectedFont('sans-serif');
    },[]);

    useEffect(() => {
        navigate("/login");
    })
}

