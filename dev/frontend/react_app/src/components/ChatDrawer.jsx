import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export default function ChatDrawer({ open, toggleDrawer }) {
  const DrawerList = (
    <Box sx={{ width: 550 }} role="presentation">
      
    </Box>
  );

  return (
    <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
      {DrawerList}
    </Drawer>
  );
}
