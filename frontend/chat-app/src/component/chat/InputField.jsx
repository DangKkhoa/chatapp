import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import ContentEditable from 'react-contenteditable'

import "../../style/InputField.css"

const InputField = ({ sendFunction, userData, setUserData }) => {
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [isMessageTooLong, setIsMessageTooLong] = useState(false);
    const editableRef = useRef('');
    const MESSAGE_MAX_LENGTH = 250;
    const onEmojiClick = (emojiObject) => {
        editableRef.current.innerText += emojiObject.emoji;
        setUserData(prevUserData => ({...prevUserData, message: editableRef.current.innerText}));
    }

    const emojiPickerClick = () => {
        if(emojiPickerVisible) {
            setEmojiPickerVisible(false);
        }
        else {
            setEmojiPickerVisible(true);
        }
        
    }

    const handleInputMessage = (e) => {
        if(e.shiftKey && e.key == "Enter") {
            e.preventDefault(); // Prevent default behavior

            // Insert a new <div><br></div> at the cursor position
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            // Create a new line element
            const newLine = document.createElement("div");
            newLine.innerHTML = "<br>"; // Ensure it renders a visible line break

            range.insertNode(newLine); // Insert the new line into the DOM

            // Move the cursor after the inserted <div>
            range.setStartAfter(newLine);
            range.setEndAfter(newLine);
            selection.removeAllRanges();
            selection.addRange(range);

            // Update the state with the new message content
            setUserData((prevUserData) => ({
                ...prevUserData,
                message: editableRef.current.innerHTML, // Persist the new HTML content
            }));

            return;
        }
        const htmlContent = e.target.value;
        console.log(htmlContent)

        const textContent = editableRef.current.innerText || "";
        console.log(editableRef.current.innerText);
        console.log(userData.message);
        setUserData(prevUserData => ({...prevUserData, message: textContent}))

        
    
    }

    useEffect(() => {
        if(editableRef.current) {
            setUserData(prev => ({...prev, message: editableRef.current.innerText}));
        }
    }, [editableRef.current.innerText])

    const sendMessageByEnter = (evt) => {
        console.log(evt.shiftKey)
        if(evt.shiftKey && evt.key == "Enter") {
            evt.preventDefault(); // Prevent default behavior

            // Insert a new <div><br></div> at the cursor position
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            // Create a new line element
            const newLine = document.createElement("div");
            newLine.innerHTML = "<br>"; // Ensure it renders a visible line break

            range.insertNode(newLine); // Insert the new line into the DOM

            // Move the cursor after the inserted <div>
            range.setStartAfter(newLine);
            range.setEndAfter(newLine);
            selection.removeAllRanges();
            selection.addRange(range);

            // Update the state with the new message content
            setUserData((prevUserData) => ({
                ...prevUserData,
                message: editableRef.current.innerHTML, // Persist the new HTML content
            }));

            return;
        }
        if(evt.key == "Enter") {
            evt.preventDefault();
            console.log(editableRef.current.innerText);
            sendFunction(editableRef.current.innerText);
        }
        
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter" && e.shiftKey) {
            if(e.shiftKey) {
                e.stopPropagation();
            }
            
        }
        if(e.key === "Enter") {
            e.preventDefault();
            sendFunction(editableRef.current.innerText);
        }
    }


    const sendMessage = () => {
        
        if(userData.message.length > MESSAGE_MAX_LENGTH) {
            setIsMessageTooLong(true);
            return ; 
        }

        const formattedMessage = editableRef.current.innerText
                                    // .replace(/<\/div>/g,'')
                                    // .replace(/<div>/g,'\n')
                                    // .replace(/<br>/g, '\n')
                                    // .replace(/&nbsp;/g, '')
                                    // .trim();
        console.log(formattedMessage);

        sendFunction(formattedMessage);
        
        if(editableRef.current) {
            editableRef.current.innerText = ""
            setUserData(prev => ({...prev, message: ""}))
            // editableRef.current.style.height = "auto";
        }
    }

    return(
        <div className="send-message-container">
            {isMessageTooLong && <div className="long-message-alert">Your message is too long (250 words only)</div>}
            <div className="send-message">
                            
                {emojiPickerVisible && <EmojiPicker className="emoji-picker" onEmojiClick={onEmojiClick}/>}
                <button className="emoji-toggle" onClick={emojiPickerClick}><i className="fa-regular fa-face-smile " ></i></button>
                <ContentEditable 
                    className="input-message" 
                    // name="message"
                    placeholder={userData.message != "" ? "" : "Message..."}
                    // value={userData.message}
                    html={userData.message}
                    onChange={handleInputMessage}
                    onKeyDown={sendMessageByEnter}
                    contentEditable="true"
                    innerRef={editableRef} 
                    />
                    
                
                                  
                <button type='button' className='send-button' onClick={sendMessage} style={{color: userData.avatarColor}}>
                    {console.log(userData.message)}
                    {userData.message && <i className="fa-solid fa-paper-plane"></i>}
                    {!editableRef.current.innerText && <i className="fa-regular fa-heart"></i>}
                </button>
                                                
            </div>
            

        </div>
    );
}

export default InputField;
