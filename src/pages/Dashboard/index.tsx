import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { green } from "@mui/material/colors";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Fab from "@mui/material/Fab";
import MessageIcon from "@mui/icons-material/Message";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userNameGlobal } from "@/Helper/recoilState";
import axios from "axios";
import { useRecoilState } from "recoil";
import { privateUser } from "@/Helper/recoilState";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = ({ value, index, children }: TabPanelProps) => {
  return value === index ? <div>{children}</div> : null;
};
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTouched, setSearchTouched] = useState<Boolean>(false);
  const { loggedInUser, chats, userName } = useRecoilValue(userNameGlobal);
  const globalUserName = loggedInUser;
  const [friends, setfriends] = useState([]);
  const [savedState, setSavedState] = useRecoilState(privateUser);

  useEffect(() => {
    axios
      .post("http://localhost:8080/friendRequest/fetch", {
        userId: globalUserName,
      })
      .then((response) => {
        setfriends(response.data);
      })
      .catch((error) => console.log("Error while fetching friends", error));
  }, []);

  const dummyData = [
    { name: "Jake" },
    { name: "Ankit" },
    { name: "Amit" },
    { name: "Roonie" },
    { name: "John" },
  ];
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSearchTouched(!searchTouched);
  };

  return (
    <div className="w-screen h-screen bg-gray-800">
      <div className="bg-gray-800 h-14">
        <div className="flex text-slate-100 py-3">
          <div className="flex-auto w-60 px-4 text-2xl">
            <a className="underline decoration-green-600">Informally</a>
          </div>
          <div className="w-40 ">
            <div className="flex">
              {searchTouched ? (
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="standard"
                  size="small"
                  InputProps={{
                    style: {
                      color: "#ecf0f4",
                      borderBottom: "1px solid white",
                    },
                    placeholder: "Search",
                    inputProps: { style: { color: "#ecf0f4" } },
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <Button
            style={{ color: "white", padding: 0 }}
            onClick={handleSearchClick}
          >
            <SearchIcon />
          </Button>
          <div>
            <Button
              style={{ color: "white", padding: 0 }}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <Box className="bg-gray-800">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            className="bg-gray-800 text-slate-200"
            aria-label="basic tabs example"
          >
            <Tab
              label="Chats"
              {...a11yProps(0)}
              className="text-xs" style={{color : 'white'}}
            />
            <Tab
              label="Updates"
              {...a11yProps(1)}
              className="text-xs" style={{color : 'white'}}
            />
            <Tab
              label="Calls"
              {...a11yProps(2)}
              className="text-xs" style={{color : 'white'}}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <List className="bg-gray-800 text-white text-xs">
            {friends.length > 0 ? (
              friends.map((item: any, index) => {
                const updatedString =
                  item.username.charAt(0).toUpperCase() +
                  item.username.slice(1);
                return (
                  <ListItem
                    key={index}
                    disablePadding
                    onClick={() => {
                      setSavedState((prev) => ({
                        ...prev,
                        selectedName: updatedString,
                        selectedId: item._id,
                      }));
                      router.push("/Chat/[id]", `/Chat/${item._id}`);
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Avatar />
                      </ListItemIcon>
                      <ListItemText primary={updatedString} />
                    </ListItemButton>
                  </ListItem>
                );
              })
            ) : (
              <h6>Add Friends</h6>
            )}
          </List>
          <Fab
            size="medium"
            style={{ position: "fixed", bottom: "6%", right: "7%",backgroundColor : "transparent" }}
            aria-label="newMessage"
          >
            <MessageIcon style={{color : '#2ac54a' }}/>
          </Fab>
        </CustomTabPanel>
        ;
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </div>
  );
}
