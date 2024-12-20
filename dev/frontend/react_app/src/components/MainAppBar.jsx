import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { Avatar } from '@mui/material';

export default function MainAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  // ポップオーバーが開くかどうかを管理する
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // ポップオーバーを閉じる
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ポップオーバーが開いているかどうかを確認
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: 'rgba(27, 129, 241, 0.9)' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            DiscussPlanner
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="account"
            sx={{ mr: 2 }}
            onClick={handleClick} // クリック時にポップオーバーを開く
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

      {/* ポップオーバーの実装 */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{
          p: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1,
          width: 300,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{
            color: '#202124',
            fontWeight: '500',
            fontSize: '18px',
            marginBottom: 2
          }}>
            ユーザー情報
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 2
          }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: '0.9rem',
                backgroundColor: 'rgb(34, 102, 235)'
              }}
            >
              田中
            </Avatar>
          </Box>

          <Typography sx={{
            fontSize: '14px',
            color: '#5f6368',
            marginBottom: 1
          }}>
            ユーザー名: <span style={{ fontWeight: 'bold' }}>田中 太郎</span>
          </Typography>

          <Typography sx={{
            fontSize: '14px',
            color: '#5f6368',
            marginBottom: 2
          }}>
            メールアドレス: <span style={{ fontWeight: 'bold' }}>example@example.com</span>
          </Typography>
          <Button variant="outlined" sx={{ fontSize: '14px', color: '#1a73e8' }}>
            切り替え
          </Button>
        </Box>


      </Popover>
    </Box>
  );
}
