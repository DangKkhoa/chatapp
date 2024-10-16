import { useState } from "react";
import "../../style/auth.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Register = () => {
    const backgroundColors = [
        "#fcba03", "#16f296", "#bce640",
        "#68cdf2", "#e386d0", "#e38699"
    ];

    const avatarColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    const [userData, setUserData] = useState({
        email: "",
        username: "",
        password: "",
        confirmedPassword: "",
        avatarColor: avatarColor,
    })
    const [error, setError] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(userData);

        const response = await axios.post("http://localhost:8080/auth/register", userData)
        const responseData = response.data;
        if(responseData.code != 1) {
            setError(responseData.message);
        }
        else {
            navigate("/auth/login");
        }
        
    }

    const handleValueChange = (event) => {
        const { name, value } = event.target;
        if(name == "email") {
            setUserData({...userData,[name]: value, username: value.split('@')[0]});
        }
        else {
            setUserData({...userData, [name]: value});
        }
    }
    return(
        <div className="container register" >
            <div id="logo" className="register">
                <h1 className="title">Messenger Clone</h1>
            </div>
            <form id="register-form">
                <h1>Create a new account</h1>
                <div className="form-group">
                    <label htmlFor="">Email</label><br/>
                    <input 
                        type="email" 
                        name="email" 
                        className="form-input" 
                        id="email"
                        placeholder="Enter your email address"
                        value={userData.email}
                        onChange={handleValueChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="">Username</label><br/>
                    <input 
                        type="text" 
                        name="username" 
                        className="form-input" 
                        id="username"
                        placeholder="Enter your username"
                        value={userData.username}
                        onChange={handleValueChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="">Password:</label><br/>
                    <input 
                        type="password" 
                        name="password" 
                        className="form-input" 
                        id="password"
                        placeholder="Confirm your password"
                        value={userData.password}
                        onChange={handleValueChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="">Confirm password:</label><br/>
                    <input 
                        type="password" 
                        name="confirmedPassword" 
                        className="form-input" 
                        id="confirm-password"
                        placeholder="Enter your password"
                        value={userData.confirmedPassword}
                        onChange={handleValueChange}/>
                </div>

                <Button type="register" userData={userData}/>
                <p>Already have an account? <a href="/auth/login" >Click here to login</a></p>
            </form>
        </div>
    );
}

export default Register;