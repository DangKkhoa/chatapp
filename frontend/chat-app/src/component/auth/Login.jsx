import { useEffect, useState } from "react";
import { replace, useNavigate } from 'react-router-dom';
import "../../style/auth.css"
import axios from "axios";
import Button from "./Button";
import chatLogo from "../../assets/chat.png";
import ToggleViewPassword from "./ToggleViewPassword";


const Login = () => {
    
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: "", 
        
    })

    useEffect(() => {
        document.title = "Login"
    }, [])


    const [isChecked, setIsChecked] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false) 

    const handleValueChange = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    }

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    }

    useEffect(() => {
        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
        verifyToken(token);
    },[])

    const verifyToken = (token) => {
        axios.get("http://localhost:8080/auth/jwt-verify", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                const responseData = response.data;
                if(responseData.code === 10) {                    
                    navigate("/chat", {replace: true});
                    
                }
                else {
                    // localStorage.clear();
                    navigate("/auth/login");
                }
            })
            .catch(err => {
                console.error(err);
                navigate("/auth/login");
            })
        
    }

    return(
        <div className="container login" >
            <div id="logo" className="login-logo">
                <h1 className="title">QuickChat</h1>
                <p className="sub-title">Connect and send messages to everyone with superior speed <span style={{color: "#f5c938"}}><i className="fa-solid fa-bolt"></i></span></p>
            </div>
            <form id="login-form" action="">
                <div className="form-group">
                    <input 
                        type="email" 
                        name="email" 
                        className="form-input"
                        id="email"
                        placeholder="Enter your email address"
                        value={userData.email}
                        onChange={handleValueChange}/>
                </div>

                <div className="form-group password">
                    <input 
                        type={passwordVisible ? "text" : "password"} 
                        name="password" 
                        className="form-input"
                        id="password"
                        placeholder="Enter your password"
                        value={userData.password}
                        onChange={handleValueChange}
                        
                        />
                    {/* <div onClick={toggleViewPassword} className={`toggle-password ${userData.password && "visible"}`}>
                        {passwordVisible ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                    </div> */}
                    <ToggleViewPassword 
                        passwordVisible={passwordVisible} 
                        setPasswordVisible={setPasswordVisible} 
                        userData={userData}/>
                </div>
                <div className="remember-login">
                    <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        />
                    Remember Login
                </div>
                <Button type="login" userData={userData} isRememberLoginChecked={isChecked}/>
                <a href="/forgot-password" className="reset-password-link">Forgot password ?</a>
                <hr/>
                <a href="/auth/register" id="register-btn" className="btn register-btn">Create new account</a>
            </form>
        </div>
    );
}

export default Login;