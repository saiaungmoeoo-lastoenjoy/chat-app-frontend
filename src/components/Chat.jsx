import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import css from "./Chat.module.css";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
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
        <p>Live Chat</p>
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
                <span className={css.meta}>{list.author}</span>
                <p>{list.message}</p>
                <span>{list.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={css.footer}>
        <input type="text" value={currentMessage} placeholder="hey..." onChange={(e) => setCurrentMessage(e.target.value)} onKeyDown={handleKeyDown} />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
