import { useContext } from "react";
import { useLocation, Outlet, Navigate} from "react-router-dom";
import AuthContext from "./AuthProvider";


const RequireAuth = () => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();
    return(
        auth?
            ( <Outlet /> )
                : <Navigate to = "/login" state={{from :location}} replace />
    );
}

export default RequireAuth;