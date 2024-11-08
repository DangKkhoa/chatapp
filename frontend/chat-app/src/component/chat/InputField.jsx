import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import ContentEditable from 'react-contenteditable'

const InputField = ({ sendFunction, userData, setUserData }) => {
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [isMessageTooLong, setIsMessageTooLong] = useState(false);
    const editableRef = useRef('');
    const MESSAGE_MAX_LENGTH = 250;
    const onEmojiClick = (emojiObject) => {
        editableRef.current += emojiObject.emoji;
        setUserData(prevUserData => ({...prevUserData, message: editableRef.current}));
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
        // const  el = editableRef.current;
        const htmlContent = e.target.value;
        // console.log(htmlContent);
        const textContent = htmlContent.replace(/<\/div>/g,'').replace(/<div>/g,'\n');

            
        console.log(textContent);
        editableRef.current = textContent;
        setUserData(prevUserData => ({...prevUserData, message: textContent}))
        
    
    }

    const handleEnterKey = (e) => {
        if(e.key === "Enter") {
            sendMessage();
        }
    }

    const sendMessage = () => {
        if(userData.message.length > MESSAGE_MAX_LENGTH) {
            setIsMessageTooLong(true);
            return ; 
        }

        const formattedMessage = userData.message
                                    .replace(/<\/div>/g,'')
                                    .replace(/<div>/g,'\n')
                                    .replace(/<br>/g, '\n')
                                    .replace(/&nbsp;/g, '')
                                    .trim();

        sendFunction(formattedMessage);
        
        if(editableRef.current) {
            editableRef.current = ""
            // editableRef.current.style.height = "auto";
        }
    }

    // useEffect(() => {
    //     if(editableRef.current) {
    //         editableRef.current.innerText += userData.message;
    //     }
    // }, [userData.message])

    return(
        <div className="send-message-container">
            {isMessageTooLong && <div className="long-message-alert">Your message is too long (250 words only)</div>}
            <div className="send-message">
                            
                {emojiPickerVisible && <EmojiPicker className="emoji-picker" onEmojiClick={onEmojiClick}/>}
                <button className="emoji-toggle" onClick={emojiPickerClick}><i className="fa-regular fa-face-smile " ></i></button>
                <ContentEditable 
                    className="input-message" 
                    // name="message"
                    placeholder="Message..."
                    // value={userData.message}
                    html={editableRef.current}
                    onChange={(e) => handleInputMessage(e)}
                    // contentEditable="true"
                    // ref={editableRef} 
                    />
                    
                
                                  
                <button type='button' className='send-button' onClick={sendMessage} style={{color: userData.avatarColor}}>
                    {userData.message && <i className="fa-solid fa-paper-plane"></i>}
                    {!userData.message && <i className="fa-regular fa-heart"></i>}
                </button>
                                                
            </div>
            

        </div>
    );
}

export default InputField;
