import * as React from 'react';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import SettingsIcon from '@mui/icons-material/Settings';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import MicOffIcon from '@mui/icons-material/MicOff';


import { useMicContext } from './MicContext';
import { useDrawerContext } from './DrawerContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));


export default function ToolBar() {
    const { micmute, SetMute, toggleListening, transcript } = useMicContext();
    const { chatopen, toggleDrawer, responsecheck, SetResponseCheck} = useDrawerContext();
    const toggleMute = () => {
        SetMute((prev) => !prev);
    };
    toggleListening();
    return (
        <div>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}

                style={{ position: 'absolute', bottom: 10, right: 200, background: "linear-gradient(90deg, rgb(34, 102, 235) 0%, rgb(2, 203, 254) 100%)", borderRadius: 100 }}
            >
                <Item style={{ backgroundColor: 'transparent', boxShadow: 'None', marginLeft: '10px' }}><IconButton onClick={toggleMute}>
                    {micmute ?  <MicOffIcon style={{ color: 'white' }} /> : <MicIcon style={{ color: 'white' }} />}
                </IconButton></Item>
                <div
                    style={{
                        backgroundColor: 'white',
                        width: '2px', // 間隔の幅
                        marginTop: '12px',
                        marginBottom: '12px',
                        borderRadius: '100px',
                    }}
                />
                <Item style={{ backgroundColor: 'transparent', boxShadow: 'None' }}><IconButton onClick={toggleDrawer(true)}>
                    {chatopen ? <CommentsDisabledIcon style={{ color: 'white' }} /> : <CommentIcon style={{ color: 'white' }} />}
                </IconButton></Item>

                <div
                    style={{
                        backgroundColor: 'white',
                        width: '2px', // 間隔の幅
                        marginTop: '12px',
                        marginBottom: '12px',
                        borderRadius: '100px',
                    }}
                />
                <Item style={{ backgroundColor: 'transparent', boxShadow: 'None', marginRight: '10px' }}><IconButton>
                    <SettingsIcon style={{ color: 'white' }} />
                </IconButton></Item>
            </Stack>
            <p>{transcript}</p>
        </div>
    );
};