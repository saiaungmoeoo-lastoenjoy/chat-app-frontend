import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Picker from "emoji-picker-react";
import css from "./Chat.module.css";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const messagesRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: username,
        room: room,
        message: currentMessage,
        date: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    socket.on("join_room", (data) => {
      return toast.success(`${data.username} joined this room id ${data.room}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  }, [socket]);

  return (
    <div className={css.container}>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme="light" />
      <div className={css.header}>
        <p>
          {username}'s chat at room {room}
        </p>
      </div>
      <div className={css.chatbody} ref={messagesRef}>
        {messageList.map((list, i) => (
          <div key={i} className={css.message}>
            <div>
              <div
                className={css.content}
                style={{
                  flexDirection: username === list.author ? "row-reverse" : "row",
                  marginLeft: username === list.author ? "auto" : "0",
                }}
              >
                <span className={css.meta}>{list.author.slice(0, 5)}</span>
                <p>{list.message}</p>
                <span>{list.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={css.footer}>
        <div className={css.inputContainer}>
          {showPicker && (
            <Picker
              onEmojiClick={(emojiObject) => {
                setCurrentMessage((prevMsg) => prevMsg + emojiObject.emoji);
                setShowPicker(false);
              }}
              className={css.emoji}
            />
          )}
          <input type="text" value={currentMessage} placeholder="hey..." onChange={(e) => setCurrentMessage(e.target.value)} onKeyDown={handleKeyDown} />
          <img className={css.icon} src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker((val) => !val)} alt="" />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
