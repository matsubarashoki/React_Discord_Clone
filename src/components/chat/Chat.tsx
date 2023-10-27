import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./Chat.scss";
import ChatHeader from "./ChatHeader";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GifIcon from "@mui/icons-material/Gif";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ChatMessage from "./ChatMessage";
import { useAppSelecter } from "../../app/hooks";
import { db } from "../../firebase";
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import useSubCollection from "../../hooks/useSubCollection";

const Chat = () => {
  const [inputText, setInputText] = useState<string>("");
  const channelId = useAppSelecter((state) => state.channel.channelId);
  const channelName = useAppSelecter((state) => state.channel.channelName);
  const loginUser = useAppSelecter((state) => state.user.user);
  const { subDocuments: messages } = useSubCollection("channels", "messages");
  console.log("renderingされた");

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 以下はtypescriptの書き方。jsの場合は
    // if(scrollBottomRef && scrollBottomRef.current) {
    //   scrollBottomRef.current.scrollIntoView()
    // }
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // channelコレクションの中にあるmessagesコレクションの中にメッセージ情報を入れる
    const collectionRef: CollectionReference<DocumentData> = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );
    const docRef: DocumentData = await addDoc(collectionRef, {
      message: inputText,
      timestamp: serverTimestamp(),
      user: loginUser,
    });
    setInputText("");
  };
  return (
    <div className="chat">
      {/* chatHeader */}
      <ChatHeader channelName={channelName} />
      {/* chatMessage */}
      <div className="chatMessage">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            timestamp={message.timestamp}
            user={message.user}
          />
        ))}
        <div ref={scrollBottomRef} />
      </div>
      {/* chatInput */}
      <div className="chatInput">
        <AddCircleOutlineIcon />
        <form>
          <input
            type="text"
            placeholder="#Udemyへメッセージを送信"
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputText(e.target.value);
            }}
          />
          <button
            type="submit"
            className="chatInputButton"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              sendMessage(e);
            }}
          ></button>
        </form>

        <div className="chatInputIconts">
          <CardGiftcardIcon />
          <GifIcon />
          <EmojiEmotionsIcon />
        </div>
      </div>
    </div>
  );
};

export default Chat;
