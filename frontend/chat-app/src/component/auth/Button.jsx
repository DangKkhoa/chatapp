import axios from "axios";
import { useState } from "react";
import "../../style/auth.css";
import { useNavigate } from "react-router-dom";
import ErrorBox from "./ErrorBox";

const Button = (props) => {
    const [error, setError] = useState();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(userData);

        const response = await axios.post(`http://localhost:8080/auth/${props.type}`, props.loginUserData);
        const responseData = response.data;
        if(responseData.code != 1) {
            console.log(responseData);
            setError(responseData.message);
        }
        else {
            if(props.type == "login") {
                localStorage.setItem("jwtToken", responseData.message);
                console.log(JSON.parse(responseData.message.replace(/(\w+):/g, '"$1":')));
                // navigate("/")
            }
            else {
                navigate("/auth/login");
            }
            
        }
        
    }
    
    
    return(
        <>
            <ErrorBox message={error}/>
            <button type="submit" className="submit-btn" onClick={handleSubmit}>{props.type == "login" ? "Login" : "Register"}</button>
        </>
    );

}

export default Button;