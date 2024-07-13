"use client";
import React, { useState, useEffect, useRef } from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { getShippers } from "src/store/managerShipper/orderSlice";
import { getDetailUser } from "src/store/user/userSlice";
import { getChatUserById, setChatByUser } from "src/store/chat/chat";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { formatTimeChat } from "src/utils/format-time";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const profile = {
  id: "2" || 2,
  username: "ADMIN",
};
var stompClient: any = null;

export default function Message() {
  const [chooseShipper, setChooseShipper] = useState("21");
  const { shippers } = useAppSelector((state) => state.manageShipper);
  const { userWithId } = useAppSelector((state) => state.user);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const scrollViewRef: any = useRef(null);
  const emojiPickerRef: any = useRef(null); // Ref for emoji picker
  let { data } = useAppSelector((state) => state.chatShipper.chatByUser);

  const [userData, setUserData] = useState({
    username: "ADMIN",
    receivername: "",
    connected: true,
    message: "",
  });

  const dispatch = useAppDispatch();

  const userJoin = () => {
    var chatMessage = {
      senderName: "ADMIN",
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/user/" + "ADMIN" + "/private", onPrivateMessage);
    userJoin();
  };

  const onPrivateMessage = (payload: any) => {
    dispatch(setChatByUser(JSON.parse(payload.body)));
  };

  const connect = () => {
    let Sock = new SockJS("http://localhost:8081/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onError = (err: any) => {};

  useEffect(() => {
    setUserData({ ...userData, username: "ADMIN" });
    connect();
  }, []);

  useEffect(() => {
    dispatch(
      getShippers({
        params: { pageNumber: 0, pageSize: 100 },
      }),
    );
    dispatch(getDetailUser(Number(chooseShipper)));
    dispatch(getChatUserById(chooseShipper));
  }, [chooseShipper]);

  const sendPrivateValue = () => {
    if (message !== "" || selectedImage !== "") {
      const chatMessage = {
        senderId: profile.id,
        senderName: profile.username,
        receiverId: chooseShipper,
        receiverName: userWithId.fullName,
        message: message,
        date: new Date().toISOString(),
        status: "MESSAGE",
        attachmentUrl: selectedImage,
      };
      // Dispatch and send message logic here
      dispatch(setChatByUser(chatMessage));
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setMessage("");
      setSelectedImage("");
    }
  };

  const scrollToBottom = () => {
    scrollViewRef?.current?.scrollTo({
      top: 10000000,
      bottom: 0,
      left: 100,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
    scrollToBottom();
  }, [data]);

  const handleChange = (event: any) => {
    setChooseShipper(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendPrivateValue();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    console.log(emojiData);
    setUserData({ ...userData, message: emojiData?.emoji.toString() });
    setMessage((prevMessage) => prevMessage + emojiData?.emoji);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiSelector(false);
    }
  };

  useEffect(() => {
    if (showEmojiSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiSelector]);

  return (
    <div className="">
      <div>
        <InputLabel id="demo-simple-select-label">Chọn shipper</InputLabel>
        <Select
          placeholder="Chọn shipper"
          defaultValue={chooseShipper}
          style={{ width: 120 }}
          onChange={handleChange}
        >
          {shippers?.data?.data?.map((shipper) => {
            return (
              <MenuItem key={shipper.id} value={shipper.id.toString()}>
                {shipper.fullName}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <div
        className="flex flex-col w-full h-[65vh] top-5 overflow-scroll my-2"
        ref={scrollViewRef}
      >
        {[...data].reverse().map((item: any) => {
          return (
            <div
              key={item.id}
              className={`p-2 flex flex-col rounded w-fit mb-4 min-w-[30px] text-[20px]  ${
                item.senderId === "2" || item.senderId === 2
                  ? "flex justify-end  self-end bg-mainColor text-white "
                  : " bg-gray-200 text-black/70 "
              }`}
            >
              <div className="flex items-center justify-start mr-2">
                <span className="">{userWithId?.imageUrl}</span>
                {item.message && (
                  <p className="text-textMainNomal">{item.message}</p>
                )}
              </div>
              <p className=" text-end flex  text-[10px]">
                {formatTimeChat(item?.date)}
              </p>
              <p className=" text-end flex  items-end text-[10px]">
                {item.date.substring(0, 10)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="bottom-0  flex items-center p-2 border-t border-gray-300 ">
        <button
          onClick={() => setShowEmojiSelector(!showEmojiSelector)}
          className="mr-2"
        >
          😊
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded-full text-[16px] "
          placeholder="Nhập tin nhắn..."
          // onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendPrivateValue}
          className=" text-black px-4 py-2 text-[16px] rounded-full bg-blue-300 mx-2"
        >
          Gửi
        </button>
      </div>
      {showEmojiSelector && (
        <div
          ref={emojiPickerRef}
          style={{ position: "absolute", bottom: "60px", left: "center" }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}

