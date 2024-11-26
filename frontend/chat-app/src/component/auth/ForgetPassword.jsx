import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../../style/forgetPassword.css";

const ForgetPassword = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [userEmail, setUserEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const urlEmail = searchParams.get("email");
    const verify = searchParams.get("verify");
    console.log(urlEmail);
    console.log(verify)

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

    useEffect(() => {
        if(verify && urlEmail) {
            axios.post("http://localhost:8080/auth/forget-password/send-code", {
                email: urlEmail,
                verify: verify
            })
        }
    }, [verify, urlEmail])
    
    const verifyCode = () => {
        if(code.length <= 0) {
            alert("Please provide code!");
            return ;
        }

        axios.post("http://localhost:8080/auth/verify-code", {
            email: urlEmail,
            code: code
        })
        .then(response => {
            const responseData = response.data;
            if(responseData.code == 1) {
                alert("Code verified.");
                navigate(`/forget-password?email=${urlEmail}&code=${code}`, { replace: true });
            }
            else {
                alert(responseData.message);
            }
        })
        .catch(error => {
            alert(error.message);
        }) 
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
            confirmPassword: confirmPassword,
            code: code
        })
        .then(response => {
            const responseData = response.data;
            if(responseData.code == 1) {
                alert("Password change successfully");
                navigate("/chat", { replace: true });
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
            {urlEmail && verify && (<div style={{width: "100%"}}>
                <label htmlFor="code">Enter your code: </label>
                <input 
                    type="text" 
                    placeholder="XXXXXX" 
                    value={code} 
                    required={true}
                    onChange={(e) => setCode(e.target.value)}/>
                <span>Code has been sent to <b>{urlEmail}</b></span>
                <button style={{float: "right", padding: "10px"}} onClick={verifyCode}>Verify</button>
            </div>)}
            {!urlEmail && !verify && (<div style={{width: "100%"}}>
                <input 
                    type="email" 
                    placeholder="Your email address..." 
                    value={userEmail} 
                    required={true}
                    onChange={(e) => setUserEmail(e.target.value)}/>
                <a href={`/forget-password?verify=true&email=${userEmail}`} style={{float: "right", padding: "10px"}}>Confirm</a>
            </div>)}
            {urlEmail && !verify && (<div style={{width: "100%"}}>
                
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
            </div>)}
        </div>
    );
}

export default ForgetPassword;