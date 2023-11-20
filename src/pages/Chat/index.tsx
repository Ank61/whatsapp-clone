import { useState } from "react"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Avatar from '@mui/material/Avatar';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';

export default function SingleChat() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [chatInput, setChatInput] = useState<any>("")
    const [senderChat, setSenderChat] = useState<any>([])
    const openChat = Boolean(anchorEl);
    const handleClickChat = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseChat = () => {
        setAnchorEl(null);
    };
    const handleChatSubmit = () => {
        setSenderChat([...senderChat, chatInput])
        setChatInput("");
    }
    const handleInputChange = (event : any) => {
        const newValue = event.target.value;
        const formattedValue = newValue.replace(/\n/g, ' ');
        setChatInput(formattedValue);
      };
    return (
        <div className="bg-gray-800 w-screen h-screen">
            <Box sx={{ flexGrow: 1 }} className="bg-gray-800">
                <AppBar position="static" className='bg-gray-800 py-1.5'>
                    <Toolbar>
                        <IconButton
                            size="medium"
                            edge="start"
                            color='inherit'
                            aria-label="ChatMenu"
                            sx={{ mr: 2 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Avatar />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='px-4 text-base'>
                            Jack
                        </Typography>
                        <Button color="inherit"><VideocamIcon /></Button>
                        <Button color="inherit"><CallIcon className='text-xl' /></Button>
                        <Button
                            className="p-0"
                            color="inherit"
                            id="basic-button"
                            aria-controls={openChat ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openChat ? 'true' : undefined}
                            onClick={handleClickChat}
                        >
                            <MoreVertIcon />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openChat}
                            onClose={handleCloseChat}
                            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                        >
                            <MenuItem onClick={handleCloseChat} className="text-sm">View Contact</MenuItem>
                            <MenuItem onClick={handleCloseChat} className="text-sm">Clear Conversation</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
            <div className="text-slate-200 bg-gray-800">
                {senderChat?.map((item: String, index: Number) => {
                     const shouldBreak = item.length > 10;
                     const formattedItem = shouldBreak ? item.replace(/(.{20})/g, "$1\n") : item;
                    return (
                        <div className="w-full h-max mt-2 ml-2 text-left text-right pr-5">
                            <span className="w-max" style={{ whiteSpace: 'pre-line' }}>{formattedItem}</span>
                        </div>
                    )
                })}
            </div>
            <div style={{ position: 'fixed', right: '2%', bottom: '1.4%', left: '1%' }} className="flex">
                <input type="text" style={{ paddingLeft: 16, borderRadius: 20, backgroundColor: '#4b5563',marginRight: 5 }} className="w-screen focus:outline-none text-slate-100"
                    value={chatInput} onChange={handleInputChange} onKeyPress={(event) => {
                        if (event.key === 'Enter') { handleChatSubmit() }
                    }} />
                <IconButton className="bg-green-400 rounded-2xl text-xl" onClick={handleChatSubmit}>
                    <SendIcon className="text-gray-700 text-xl hover:text-gray-300" />
                </IconButton>
            </div>
        </div>
    )
}