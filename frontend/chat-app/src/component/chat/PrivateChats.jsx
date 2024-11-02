import { useEffect, useState } from "react";
import ChatAcceptPending from "./ChatAcceptPending";

const PrivateChats = ({ 
        id, privateChats, userData, splitIntoLines, 
        onlineUsers, messageEndRef, emojiPickerVisible, emojiPickerClick, 
        onEmojiClick, sendPrivateMessage, handleValue, EmojiPicker,
        receiverData, systemMessage, accepted, deletedMessage,
        isDeleted }) => {
        
    const [status, setStatus] = useState();

    useEffect(() => {
        const isUserOnline = onlineUsers.some(user => user.id == id);
        
        setStatus(isUserOnline ? "Online" : "Offline");
    })
    

    return(
        <>
            <div className="chat-header">
                {receiverData.id != 0 && <div className="chat-information">
                    <div style={{backgroundColor: `${receiverData.avatarColor}`, width: "50px", height: "50px", borderRadius: "50%"}}></div>
                        
                    <div>
                        {receiverData.username && <div className="chat-name">{receiverData.username}</div>}
                        <div className="chat-status">{status}</div>
                    </div>
                </div>}
                <div className="chat-setting">
                
                </div>
            </div>
            <ul className="chat-messages" ref={messageEndRef}>
                
                {isDeleted && <h1>{deletedMessage}</h1>}
                {privateChats.get(`${id}`)  && (privateChats.get(`${id}`).map((chat, index) => (
                    <li className="message"  key={index+1}>
                        <div className={`${chat.senderId != userData.id ? "guest" : "self"}`}>
                            {chat.senderId != userData.id && <div className={`avatar guest`} style={{backgroundColor: chat.senderAvatarColor}}></div>}
                            <div className="message-data">
                                <div className="sender-name">{chat.senderName }</div>
                                {splitIntoLines(chat.message, 50)}
                            </div>
                            {chat.senderId == userData.id && <div className="avatar self" style={{backgroundColor: userData.avatarColor}}>{}</div>}
                        </div>
                        
                       
                    </li>

                )))}
                                


                {/* <div ref={messageEndRef} /> */}
            </ul>
            
        
            {/* {accepted.has(userData.id) && console.log(accepted)} */}
            {accepted ? <div className="send-message">
            
                {emojiPickerVisible && <EmojiPicker className="emoji-picker" onEmojiClick={onEmojiClick}/>}
                <button className="emoji-toggle" onClick={emojiPickerClick}><i className="fa-regular fa-face-smile " ></i></button>
                <input 
                    type="text" 
                    className="input-message" 
                    name="message"
                    placeholder={`Message...`} 
                    value={userData.message}
                    onChange={handleValue}/>
                
                <button type='button' className='send-button' onClick={sendPrivateMessage} style={{color: userData.avatarColor}}>
                    {userData.message && <i className="fa-solid fa-paper-plane"></i>}
                    {!userData.message && <i className="fa-regular fa-heart"></i>}
                </button>
                
            </div>
            :
            <ChatAcceptPending isDeleted={isDeleted} />
            }
        </>
    );
}

export default PrivateChats;
