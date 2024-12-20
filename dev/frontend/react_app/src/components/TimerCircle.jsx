import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function GradientCircularProgress(props) {
  return (
    <Box sx={{ position: '', top:500, left:100}}>
      {/* SVG でグラデーションを定義 */}
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="gradientColors" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#308fe8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>
      {/* 背景の円 */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={180}
        thickness={3}
        sx={{
          position:'absolute',
          left:0,
          color: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
        }}
      />
      {/* 動きのある円 */}
      <CircularProgress
        variant="indeterminate"
        disableShrink
        size={180}
        thickness={3}
        sx={{
          animationDuration: '800ms',
          position: 'absolute',
          left: 0,
          '& .MuiCircularProgress-circle': {
            stroke: 'url(#gradientColors)', // グラデーションを適用
          },
        }}
        {...props}
      />
    </Box>
  );
}
