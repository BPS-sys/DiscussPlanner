import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function MainAppBar() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="fixed" style={{ background: '#2463eb', zIndex:30 }}>
        <Toolbar>
          <img src="/DPlogo.svg" alt="DiscussPlanner Logo" height="40" />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'left', color: '#eeeeee' }}>
            DiscussPlanner
          </Typography>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
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
