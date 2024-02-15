import React, { useState } from "react";
import css from "./Home.module.css";
import Footer from "./Footer";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

console.log(process.env.REACT_APP_BACKEND_URL);

const Home = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  return (
    <div className={css.containerWrapper}>
      {!showChat ? (
        <div className={css.container}>
          <h3>Join chat</h3>
          <input type="text" placeholder="John...." onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Room ID...." onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

      <Footer />
    </div>
  );
};

export default Home;
