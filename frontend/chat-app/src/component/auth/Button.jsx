import axios from "axios";
import { useState } from "react";
import "../../style/auth.css";
import { replace, useNavigate } from "react-router-dom";
import ErrorBox from "./ErrorBox";

const Button = (props) => {
    const [error, setError] = useState();
    const [isClicked, setIsClicked] = useState(false);
    
    const navigate = useNavigate();

    

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post(`http://localhost:8080/auth/${props.type}`, props.userData);
            const responseData = response.data;
            console.log(responseData);
            console.log(responseData.userSessionDTO);
            if(responseData.code != 1) {
                console.log(responseData);
                setError(responseData.message);
            }
            else {
                if(props.type == "login") {
                    if(props.isRememberLoginChecked) {
                        localStorage.setItem("jwtToken", responseData.message);
                    }
                    else {
                        sessionStorage.setItem("jwtToken", responseData.message);
                    }
                    setIsClicked(true);
                    
                    navigate("/", { replace: true });
                }
                else {
                    setIsClicked(true);
                    props.setIsSuccess(true);
                    //navigate("/auth/login", { replace: true });
                }
                
            }
        }
        catch(error) {
            console.error(error);
            console.log("Internal server error");
            
        }
        
        
    }

    return(
        <>
            <ErrorBox message={error}/>
            <button type="submit" className={`btn ${props.type === "login" ? "submit-btn" : "register-btn"}`} onClick={handleSubmit}>
                {!isClicked && (props.type == "login" ? "Login" : "Register")}
                {isClicked && (props.type == "login" ? "Logging in..." : "Redirecting...")}
            </button>
        </>
    );

}

export default Button;