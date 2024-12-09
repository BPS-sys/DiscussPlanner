import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function GradientCircularProgress(props) {
  return (
    <Box sx={{ position: 'relative', top:430, left:-670}}>
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
        size={200}
        thickness={3}
        sx={{
          position:'relative',
          left:200,
          color: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
        }}
      />
      {/* 動きのある円 */}
      <CircularProgress
        variant="indeterminate"
        disableShrink
        size={200}
        thickness={3}
        sx={{
          animationDuration: '800ms',
          position: 'relative',
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
