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
                        localStorage.setItem("user", JSON.stringify(responseData.userSessionDTO));
                    }
                    else {
                        sessionStorage.setItem("jwtToken", responseData.message);
                        sessionStorage.setItem("user", JSON.stringify(responseData.userSessionDTO));
                    }
                    
                    
                    navigate("/")
                }
                else {
                    navigate("/auth/login");
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
            <button type="submit" className={`btn ${props.type === "login" ? "submit-btn" : "register-btn"}`} onClick={handleSubmit}>{props.type == "login" ? "Login" : "Register"}</button>
        </>
    );

}

export default Button;