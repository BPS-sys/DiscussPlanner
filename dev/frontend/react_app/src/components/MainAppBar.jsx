import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";

import { useUserAuthContext } from './UserAuthContext';

export default function MainAppBar() {
  const navigate = useNavigate();
  const GotoHomePage = () => {
    navigate("/");
};
  const { loginUser, logout } = useUserAuthContext();

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="fixed" style={{ background: '#2463eb', zIndex:30 }}>
        <Toolbar>
          <img src="/DPlogo.svg" alt="DiscussPlanner Logo" height="40" onClick={GotoHomePage}/>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'left', color: '#eeeeee' }}>
            DiscussPlanner
          </Typography>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={logout}
          >
            <AccountCircleIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
