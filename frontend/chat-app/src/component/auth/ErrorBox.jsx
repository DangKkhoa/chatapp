import { useState } from "react"
import { useNavigate } from "react-router-dom";
// import "../../auth.css"

const ErrorBox = ({message}) => {
    const style = {
        display: !message ? "none" : "block",
        backgroundColor: "#FFEBE9",
        textAlign: "center",
        border: "1px solid red",
        padding: "15px",
        margin: "10px 0 0 0",
        maxWidth: "100%",
        fontSize: "1rem",
        borderRadius: "5px"
    }

    return(
        <div className="error-message" style={style}>{message}</div>
    );
}

export default ErrorBox;