import { useContext, useEffect } from "react"
import AuthContext from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Logout() {

    const { setAuth } = useContext(AuthContext);
    setAuth(null);
    let navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    })
}

