import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userNameGlobal } from "@/Helper/recoilState";
import { useRouter } from "next/router";
import { privateUser } from "@/Helper/recoilState";
import axios from "axios";

const socket = io("http://localhost:8080");

export default function SingleChat() {
  const router = useRouter();
  const { id } = router.query;
  const divRef = useRef<HTMLDivElement>(null);
  const { selectedId, selectedName } = useRecoilValue(privateUser);
  const privateUserName = selectedName;
  console.log("Grtting id", privateUserName);
  const { loggedInUser, chats, userName } = useRecoilValue(userNameGlobal);
  const globalUserName = loggedInUser;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatInput, setChatInput] = useState<any>({
    id: globalUserName,
    message: "",
  });
  const [senderChat, setSenderChat] = useState<any>([]);
  const openChat = Boolean(anchorEl);
  const [receiver, setReceiver] = useState("");

  async function checkExecution() {
    if (chats === "") {
      //Create new user
      const newUserData = {
        userId: globalUserName,
        connectingUser: selectedId,
        chatId: "",
      };
      await axios
        .post("http://localhost:8080/chat/insert", newUserData)
        .then((response) => console.log("Inserted", response.data))
        .catch((error) => console.log("Error in fecthing", error));
    } else {
      //Get intial Messages
      const fetchData = {
        chatId: chats,
      };
      await axios
        .post("http://localhost:8080/chat/fetch", fetchData)
        .then((response) => {
          console.log("Fetching result : ", response.data);
          setSenderChat(response?.data?.messages);
        })
        .catch((error) => console.log("Error occurded fetching", error));
    }
  }

  useEffect(() => {
    checkExecution();
    socket.emit("setup", { user: globalUserName });
  }, []);

  useLayoutEffect(() => {
    if (divRef.current) {
      const { scrollHeight, clientHeight } = divRef.current;
      divRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [divRef.current, senderChat]);

  useEffect(() => {
    socket.on("message recieved", async (newMessageRecieved) => {
      if (globalUserName || globalUserName === newMessageRecieved.to) {
        setReceiver(newMessageRecieved.id);
        setSenderChat([
          ...senderChat,
          { id: newMessageRecieved.to, message: newMessageRecieved.message },
        ]);
        //Insert the incoming message into the database
        //   const newUserData = {
        //     userId: globalUserName,
        //     connectingUser: selectedId,
        //     chatId: chats,
        //     incomingMessage: {
        //       id: newMessageRecieved.to,
        //       message: newMessageRecieved.message,
        //     },
        //   };
        //   await axios
        //     .post("http://localhost:8080/chat/insert", newUserData)
        //     .then((response) => console.log("Inserted Incoming", response.data))
        //     .catch((error) => console.log("Error in inserted incoming", error));
        // }
      }
      // );
    });
  });

  const handleClickChat = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseChat = () => {
    setAnchorEl(null);
  };
  const handleChatSubmit = async () => {
    setSenderChat([...senderChat, { id: globalUserName, message: chatInput }]);
    socket.emit("new message", {
      to: id,
      message: chatInput,
      from: globalUserName,
      messageId: null,
    });
    setChatInput({
      id: globalUserName,
      message: "",
    });
    ////Insert the outgoing message into the database
    const newUserData = {
      userId: globalUserName,
      connectingUser: selectedId,
      chatId: chats,
      incomingMessage: {
        id: globalUserName,
        message: chatInput,
      },
    };
    await axios
      .post("http://localhost:8080/chat/insert", newUserData)
      .then((response) => console.log("Inserted outgoing", response.data))
      .catch((error) => console.log("Error in inserted incoming", error));
  };
  const handleInputChange = (event: any) => {
    const newValue = event.target.value;
    const formattedValue = newValue.replace(/\n/g, " ");
    setChatInput(formattedValue);
  };
  return (
    <div className="w-screen h-screen" style={{ backgroundColor: "#1e292e" }}>
      <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#1f2c33" }}>
        <AppBar
          position="static"
          className="py-1.5"
          style={{ backgroundColor: "#1f2c33" }}
        >
          <Toolbar>
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="ChatMenu"
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className="px-4 text-base"
            >
              {privateUserName}
            </Typography>
            <Button color="inherit">
              <VideocamIcon />
            </Button>
            <Button color="inherit">
              <CallIcon className="text-xl" />
            </Button>
            <Button
              className="p-0"
              color="inherit"
              id="basic-button"
              aria-controls={openChat ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openChat ? "true" : undefined}
              onClick={handleClickChat}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openChat}
              onClose={handleCloseChat}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={handleCloseChat} className="text-sm">
                View Contact
              </MenuItem>
              <MenuItem onClick={handleCloseChat} className="text-sm">
                Clear Conversation
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="text-slate-100">
        Logged In : {JSON.stringify(globalUserName)}
      </div>
      <div className="text-slate-100">User : {JSON.stringify(privateUser)}</div>
      <div className="text-slate-100">
        {JSON.stringify(privateUserName)} : {JSON.stringify(receiver)}
      </div>
      <div
        ref={divRef}
        className="text-slate-100 "
        style={{
          backgroundColor: "#1e292e",
          height: "63%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* --- Chat Messages --- */}
        {senderChat?.map((item: any, index: any) => {
          const shouldBreak = item.length > 10;
          const date = new Date();
          const hour = date.getHours();
          const time = date.getMinutes();
          const formattedMinutes = String(time).padStart(2, "0");
          console.log(hour, time, formattedMinutes);
          const formattedItem = shouldBreak
            ? item.replace(/(.{20})/g, "$1\n")
            : item;
          return (
            <div
              key={index}
              className={`w-full h-max mt-2 ml-2 pr-10 mb-6 ${
                item.id !== globalUserName ? "text-left" : "text-right"
              }`}
            >
              <span
                className={`text-right rounded pl-2 pr-2 pt-1.5 pb-2 ${
                  item.id !== globalUserName ? "bg-[#424e54]" : "bg-[#0c5447]"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                <span>
                  {formattedItem.message}{" "}
                  <span className="text-slate-400" style={{ fontSize: 11 }}>
                    {hour}:{formattedMinutes}
                  </span>
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{ position: "fixed", right: "2%", bottom: "1.4%", left: "1%" }}
        className="flex"
      >
        <input
          type="text"
          style={{
            paddingLeft: 16,
            borderRadius: 20,
            backgroundColor: "#4b5563",
            marginRight: 5,
          }}
          className="w-screen focus:outline-none text-slate-100"
          value={chatInput.message}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleChatSubmit();
            }
          }}
        />
        <IconButton
          className="bg-green-400 rounded-2xl text-xl"
          onClick={handleChatSubmit}
        >
          <SendIcon className="text-gray-700 text-xl" />
        </IconButton>
      </div>
    </div>
  );
}
