import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import EmojiPicker from "emoji-picker-react";
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
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userNameGlobal } from "@/Helper/recoilState";
import { useRouter } from "next/router";
import { privateUser } from "@/Helper/recoilState";
import axios from "axios";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import backgroundImage from "../../Images/back.jpg";
import Modal from "@mui/material/Modal";
import { Input } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Tooltip from "@mui/material/Tooltip";
import Zoom from '@mui/material/Zoom';

const socket = io("http://localhost:8080");

export default function SingleChat() {
  const router = useRouter();
  const { id } = router.query;
  const divRef = useRef<HTMLDivElement>(null);
  const { selectedId, selectedName } = useRecoilValue(privateUser);
  const privateUserName = selectedName;
  const { loggedInUser, chats, userName } = useRecoilValue(userNameGlobal);
  const globalUserName = loggedInUser;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatInput, setChatInput] = useState<any>("");
  const [emojiTouched, setEmojiTouched] = useState(false);
  const [senderChat, setSenderChat] = useState<any>([]);
  const openChat = Boolean(anchorEl);
  const [receiver, setReceiver] = useState("");
  const [typingmessage, setTypingMessage] = useState("");
  const [videoSharing, setVideoSharing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [oppositeUser, setOppositeUser] = useState(false);
  const videoRef: any = useRef(null);
  const oppositeRef: any = useRef(null);
  const [totalTime, setTotalTime] = useState(null);
  const [currentTime, setCurrentTime] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [responseVideoSharing, setResponseVideoSharing] = useState("");
  const [requestIncoming, setRequestIncoming] = useState(false);
  const [waitingActive, setWaitingActive] = useState(false);
  const [suggestionsFetched, setSuggestionsFecthed] = useState("");
  const [suggest, setSuggest] = useState(false);
  const [suggestPresent, setSuggestPresent] = useState("");
  // if (videoReady) {
  //   setTimeout(() => {
  //     debugger;
  //     socket.emit("matchTime", {
  //       to: id,
  //       from: globalUserName,
  //       time : currentTime,
  //     })
  //   }, 2500);
  // }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
  };

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
      const fetchData = {
        chatId: chats,
      };
      await axios
        .post("http://localhost:8080/chat/fetch", fetchData)
        .then((response) => {
          setSenderChat(response?.data?.messages);
        })
        .catch((error) => console.log("Error occurded fetching", error));
    }
  }

  useEffect(() => {
    socket.on("message recieved", async (newMessageRecieved) => {
      if (globalUserName || globalUserName === newMessageRecieved.to) {
        setReceiver(newMessageRecieved.id);
        checkExecution();
        setSenderChat([
          ...senderChat,
          { id: newMessageRecieved.to, message: newMessageRecieved.message },
        ]);
      }
    });
    socket.on("typed message", async (typingMessage) => {
      if (typingMessage.message === "done") {
        setTypingMessage("");
      } else {
        setTypingMessage(typingMessage.message);
      }
    });
    socket.on("requestVideoShare", async (requestInfo) => {
      if (globalUserName || globalUserName === requestInfo.to) {
        //Ask for the video sharing
        setRequestIncoming(true);
      }
    });
    socket.on("acceptVideoRequest", async (acceptInfo) => {
      if (globalUserName || globalUserName === acceptInfo.to) {
        //On Accept
        debugger;
        setResponseVideoSharing("accept");
      }
    });
    socket.on("declineVideoRequest", async (declineInfo) => {
      if (globalUserName || globalUserName === declineInfo.to) {
        //On decline
        setResponseVideoSharing("decline");
        setVideoSharing(false);
      }
    });
    socket.on("playVideo", async (videoStart) => {
      if (globalUserName || globalUserName === videoStart.to) {
        //On decline
        debugger;
        setOppositeUser(true);
        setVideoReady(true);
        setFileName(videoStart.videoName);
      }
    });
    socket.on("matchTime", async (matchTime) => {
      if (
        (globalUserName && matchTime.time !== null) ||
        (globalUserName === matchTime.to && matchTime.time !== null)
      ) {
        if (oppositeRef.current) {
          oppositeRef.current.currentTime = matchTime.time;
        }
      }
    });
    socket.on("playPausedVideo", async (videoInfo) => {
      if (
        (globalUserName && oppositeRef.current !== null) ||
        (globalUserName === videoInfo.to && oppositeRef.current !== null)
      ) {
        oppositeRef.current.play();
      }
    });
  });

  useEffect(() => {
    checkExecution();
    socket.emit("setup", { user: globalUserName });
  }, []);

  useLayoutEffect(() => {
    if (divRef.current) {
      const { scrollHeight, clientHeight } = divRef.current;
      divRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [divRef.current, senderChat, chatInput]);

  useEffect(() => {
    const videoPlayer = videoRef.current;
    const handleLoadedMetadata = () => {
      setTotalTime(videoPlayer.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(videoPlayer.currentTime);
    };
    videoPlayer?.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoPlayer?.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoPlayer?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoPlayer?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

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
    setChatInput("");
    socket.emit("typing", {
      to: id,
      message: "done",
      from: globalUserName,
      messageId: null,
    });
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

  function debounce<T extends Function>(
    func: T,
    delay: number
  ): (...args: any[]) => void {
    let timerId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Example usage:
  function handleSuggestionAPI() {
    console.log("Scrolled!");
    //Call API to fetch suggestions
    //Dummy suggestions
    const sugestions = "Thanks for the help";
    setSuggest(true);
    setSuggestionsFecthed(sugestions);
  }

  const debouncedScrollHandler = debounce(handleSuggestionAPI, 2000);

  const handleInputChange = (event: any) => {
    event.preventDefault();
    const newValue = event.target.value;
    const formattedValue = newValue.replace(/\n/g, " ");
    setChatInput(formattedValue);
    socket.emit("typing", {
      to: id,
      message: chatInput.length <= 1 ? "done" : chatInput,
      from: globalUserName,
      messageId: null,
    });
  };

  const handleEmojiChange = (emoji: any) => {
    setChatInput(chatInput + emoji.emoji);
    setEmojiTouched(false);
  };

  const handleClose = () => {
    setVideoSharing(false);
  };

  const handleVideoSharing = () => {
    debugger;
    setWaitingActive(true);
    setVideoSharing(true);
    socket.emit("requestVideoShare", {
      to: id,
      from: globalUserName,
    });
  };

  const handleUpload = async () => {
    debugger;
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("video", selectedFile);
    try {
      const response = await fetch("http://localhost:8080/video/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        debugger;
        socket.emit("playVideo", {
          to: id,
          from: globalUserName,
          videoName: fileName,
        });
        setVideoReady(true);
        setVideoSharing(false);
      } else {
        console.error(response);
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleFileChange = (event: any) => {
    debugger;
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleAcceptRequest = () => {
    debugger;
    socket.emit("acceptVideoRequest", {
      to: id,
      from: globalUserName,
    });
    setRequestIncoming(false);
    setVideoSharing(false);
  };

  const handleDeclineRequest = () => {
    socket.emit("declineVideoRequest", {
      to: id,
      from: globalUserName,
    });
    setRequestIncoming(false);
  };

  const handleMatchTime = () => {
    debugger;
    console.log(
      videoRef.current?.currentTime,
      oppositeRef.current?.currentTime
    );
    if (videoRef.current !== null) {
      socket.emit("matchTime", {
        to: id,
        from: globalUserName,
        time: videoRef.current.currentTime,
      });
    }
  };

  const handlePlayForUser = () => {
    debugger;
    // socket.emit("playPausedVideo", {
    //   to: id,
    //   from: globalUserName,
    //   play : true,
    // });
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
              <span
                style={{
                  position: "absolute",
                  bottom: typingmessage.length > 0 ? "-5px" : "-19px",
                  right: "27.5%",
                  width: "100%",
                  textAlign: "center",
                  transition: "bottom 0.3s ease",
                }}
              >
                {typingmessage.length > 1 && (
                  <span style={{ color: "#a6afb3", fontSize: 11 }}>Typing</span>
                )}
              </span>
            </Typography>
            <Button color="inherit" onClick={handleVideoSharing}>
              <OndemandVideoIcon />
            </Button>
            <Modal
              open={videoSharing}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              {responseVideoSharing === "accept" ? (
                <Box sx={style}>
                  <Typography
                    align="center"
                    id="modal-modal-title"
                    variant="body1"
                    component="p"
                    color={"#18534e"}
                    fontSize={17}
                  >
                    <b>Upload video to share</b>
                  </Typography>
                  <Input
                    style={{
                      color: "#18534e",
                      marginTop: "8%",
                      width: "80%",
                      marginLeft: "10%",
                      marginRight: "3%",
                      fontSize: 12,
                    }}
                    type="file"
                    onChange={handleFileChange}
                  />
                  <Button
                    style={{
                      marginLeft: "40%",
                      fontSize: 11,
                      marginTop: "10%",
                      backgroundColor: "#18534e",
                    }}
                    variant="contained"
                    size="small"
                    type="submit"
                    onClick={handleUpload}
                  >
                    Upload
                  </Button>
                </Box>
              ) : (
                <Box sx={style}>
                  <Typography
                    align="center"
                    id="modal-modal-title"
                    variant="body1"
                    component="p"
                    color={"black"}
                    fontSize={16}
                    marginTop={"5%"}
                  >
                    <b>
                      Waiting for {privateUserName} to accept Co-Watch
                      invitation
                    </b>
                  </Typography>
                  <div className="spinner">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </Box>
              )}
            </Modal>
            {/* Modal for request Video sharing */}
            <Modal
              open={requestIncoming}
              onClose={() => {
                setRequestIncoming(false);
                handleDeclineRequest;
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  align="center"
                  id="modal-modal-title"
                  variant="body1"
                  component="p"
                  color={"#18534e"}
                  fontSize={17}
                >
                  <b> {privateUserName} is inviting you for Co-Watch</b>
                </Typography>
                <Button
                  style={{
                    marginLeft: "26%",
                    fontSize: 11,
                    marginTop: "10%",
                    color: "#18534e",
                    border: "1px solid #18534e ",
                  }}
                  variant="outlined"
                  size="small"
                  type="submit"
                  onClick={handleAcceptRequest}
                >
                  Accept
                </Button>
                <Button
                  style={{
                    marginLeft: "10%",
                    fontSize: 11,
                    marginTop: "10%",
                  }}
                  variant="outlined"
                  color="error"
                  size="small"
                  type="submit"
                  onClick={handleDeclineRequest}
                >
                  Reject
                </Button>
              </Box>
            </Modal>

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
      <div
        ref={divRef}
        className="text-slate-100 "
        style={{
          position: "relative",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          // backgroundColor: "#1e292e",
          height: "72%",
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
        {/* <p>
          Current Time:{" "}
          {currentTime !== null
            ? `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)
                .toString()
                .padStart(2, "0")}`
            : "Loading..."}
        </p> */}
        {videoReady ? (
          <div
            style={{
              position: "fixed",
              top: "12.5%",
              left: "10%",
              width: "100%",
              zIndex: 999,
              transition: "top 0.5s ease",
            }}
          >
            <video
              id="videoPlayer"
              width="78%"
              controls
              muted
              autoPlay
              ref={oppositeUser ? oppositeRef : videoRef}
              onSeeked={handleMatchTime}
              onPlay={handlePlayForUser}
            >
              <source
                src={`http://localhost:8080/video/stream/${fileName}`}
                type="video/mp4"
              />
            </video>
          </div>
        ) : null}
        <div
          style={{ position: "absolute", top: "325%", left: 8, width: "60%" }}
        >
          {emojiTouched && (
            <EmojiPicker
              width={"50%"}
              height={340}
              style={{
                minWidth: "30%",
                minHeight: "20vh",
                marginLeft: "1%",
                fontSize: 10,
              }}
              onEmojiClick={handleEmojiChange}
              open={emojiTouched}
              searchDisabled={true}
            />
          )}
        </div>
        {/* {typingmessage.length > 1 ? (
          <div className="chat-bubble">
            <div className="typing">
              {typingmessage}
              <div className="dot" style={{ marginLeft: 4 }}></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        ) : null} */}
      </div>
      <div
        style={{ position: "fixed", right: "2%", bottom: "1.4%", left: "1%" }}
        className="flex"
      >
        <IconButton
          className="bg-green-400 rounded-2xl text-xl"
          onClick={() => setEmojiTouched(!emojiTouched)}
        >
          <MoodIcon
            className="text-gray-700 text-xl"
            style={{ color: "gray" }}
          />
        </IconButton>
        <input
          type="text"
          style={{
            paddingLeft: 16,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: "#4b5563",
          }}
          placeholder="Type a message"
          className={`${!suggest ? `inputSuggestionon`: `inputSuggestion`} w-screen focus:outline-none text-slate-100`}
          value={chatInput}
          onChange={(event: any) => {
            handleInputChange(event);
            debouncedScrollHandler();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleChatSubmit();
            }
          }}
        />
        <Tooltip title="Text Suggestions" arrow TransitionComponent={Zoom} >
          <AutoAwesomeIcon
          style={{
            paddingTop:5,
            paddingLeft:5,
            paddingRight:14,
            paddingBottom:5,
            width : 40,
            height : 40,
            borderBottomRightRadius: 20,
            borderTopRightRadius : 20,
            backgroundColor: "#4b5563",
          }}
            onClick={() => setSuggest(!suggest)}
            className={`${suggest ? `inputSuggestionRight`: `inputSuggestion`} cursor-pointer text-xl ${
          suggest ? `text-green-400` : `text-gray-400`
            }`}
          />
        </Tooltip>
        <IconButton
          className="bg-green-400 rounded-2xl text-xl"
          onClick={handleChatSubmit}
        >
          <SendIcon
            className="text-gray-700 text-xl"
            style={{ color: "gray" }}
          />
        </IconButton>
      </div>
    </div>
  );
}
