import { useEffect, useRef, useState } from "react";
import { connectWS } from "./ws";
import ChatUI from "./ChatUI";

export default function ChatContainer() {
  const timer = useRef(null);
  const socket = useRef(null);

  const [userName, setUserName] = useState("");
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [inputName, setInputName] = useState("");
  const [typers, setTypers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.current = connectWS();

    socket.current.on("connect", () => {
      socket.current.on("roomNotice", (userName) => {
        console.log(`${userName} joined to group!`);
      });

      socket.current.on("chatMessage", (msg) => {
        // push to existing messages list
        console.log("msg", msg);
        setMessages((prev) => [...prev, msg]);
      });

      socket.current.on("typing", (userName) => {
        setTypers((prev) => {
          const isExist = prev.find((typer) => typer === userName);
          if (!isExist) {
            return [...prev, userName];
          }

          return prev;
        });
      });

      socket.current.on("stopTyping", (userName) => {
        setTypers((prev) => prev.filter((typer) => typer !== userName));
      });
    });

    return () => {
      socket.current.off("roomNotice");
      socket.current.off("chatMessage");
      socket.current.off("typing");
      socket.current.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    if (!text) return;

    socket.current.emit("typing", userName);
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      socket.current.emit("stopTyping", userName);
    }, 1000);

      return () => { clearTimeout(timer.current); }
  }, [text, userName]);

  function handleNameSubmit(e) {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;

    // join room
    socket.current.emit("joinRoom", trimmed);

    setUserName(trimmed);
    setShowNamePopup(false);
  }

  // SEND MESSAGE FUNCTION
  function sendMessage() {
    const t = text.trim();
    if (!t) return;

    // USER MESSAGE
    const msg = {
      id: Date.now(),
      sender: userName,
      text: t,
      ts: Date.now(),
    };

    setMessages((m) => [...m, msg]);
    // emit
    socket.current.emit("chatMessage", msg);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <ChatUI
      userName={userName}
      showNamePopup={showNamePopup}
      inputName={inputName}
      setInputName={setInputName}
      typers={typers}
      messages={messages}
      text={text}
      setText={setText}
      handleNameSubmit={handleNameSubmit}
      sendMessage={sendMessage}
      handleKeyDown={handleKeyDown}
    />
  );
}
