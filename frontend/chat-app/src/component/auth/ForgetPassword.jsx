import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../../style/forgetPassword.css";

const ForgetPassword = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const urlEmail = searchParams.get("email");
    console.log(urlEmail);

    const navigate = useNavigate();

    const forgetPasswordStyle = {
        width: "50%",
        margin: "auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContents: "center",
        alignItems: "center"
        
    }

    const submitChangePassword = () => {
        if(password !== confirmPassword) {
            alert("Passwords do not match!");
            return ;
        }
        if(password.length < 8) {
            alert("Password must be at least 8 characters!");
            return ;
        }

        axios.post("http://localhost:8080/auth/forget-password", {
            email: urlEmail,
            password: password,
            confirmPassword: confirmPassword
        })
        .then(response => {
            const responseData = response.data;
            if(responseData.code == 1) {
                alert("Password change successfully");
                navigate("/chat");
            }
            else {
                alert(responseData.message);
            }
        })
        .catch(error => {
            alert(error.message);
        }) 
    }

    return(
        

        <div className="forget-password-container" style={forgetPasswordStyle}>
            <h1 style={{fontSize: "1.8rem", alignSelf: "flex-start"}}>Foget password</h1>
            {!urlEmail && <div style={{width: "100%"}}>
                <input 
                    type="email" 
                    placeholder="Your email address..." 
                    value={userEmail} 
                    required={true}
                    onChange={(e) => setUserEmail(e.target.value)}/>
                <a href={`/forget-password?email=${userEmail}`} style={{float: "right", padding: "10px"}}>Confirm</a>
            </div>}
            {urlEmail && <div style={{width: "100%"}}>
                
                <h2>Email: <span style={{textDecoration: "underline"}}>{urlEmail}</span></h2>
                <div style={{marginBottom: "10px"}}>
                    <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div style={{marginBottom: "10px"}}>
                    <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                <button 
                    style={{padding: "10px", float: "right", borderRadius: "5px", border: "none", background: "#0866ff", color: "white"}} 
                    onClick={submitChangePassword}>
                        Change
                </button>
            </div>}
        </div>
    );
}

export default ForgetPassword;