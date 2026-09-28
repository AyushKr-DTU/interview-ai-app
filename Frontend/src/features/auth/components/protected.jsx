import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import LoadingScreen from "../../../components/LoadingScreen";

const Protected = ({children}) => {
    const {user,loading} = useAuth();

    if(loading){
        return (
            <LoadingScreen
                title="Just a moment"
                subtitle="Connecting to the server…"
            />
        );
    }
    if(!user){
        return <Navigate to={"/login"} /> ;
    }

    return children ;
}

export default Protected;
