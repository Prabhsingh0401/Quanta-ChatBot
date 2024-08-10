'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { keyframes } from '@emotion/react';

const swipeIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      position="fixed"
      bottom={5}
      right={10}
      width="400px"
      height="630px"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.2)',  // Semi-transparent background
        backdropFilter: 'blur(10px)',        // Blur effect for glassmorphism
        boxShadow: 3,
        p: 2,
        zIndex: 1000,
        borderRadius: '16px',                // Rounded corners
        border: '1px solid rgba(255, 255, 255, 0.3)',  // Light border for effect
        animation: `${swipeIn} 0.5s ease-out`, // Swipe-in animation
      }}
    >
      <Stack
        direction={'column'}
        height="100%"
        justifyContent="space-between"
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                    message.role === 'assistant'
                      ? 'rgba(128, 128, 128, 0.8)' // Change assistant message background color to greyish
                      : 'rgba(128, 128, 128, 0.8)' // Change user message background color to greyish
                  }
                  color="none"
                  borderRadius={16}
                  p={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
        <TextField
        label="Message"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        sx={{
            bgcolor: 'rgba(255, 255, 255, 0.3)',  // Semi-transparent input
            backdropFilter: 'blur(5px)',          // Blur effect for input
            borderRadius: '12px',                 // Rounded corners for input
            '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)', // Label color
            fontWeight: 600,                    // Bold label text
            },
            '& .MuiInputBase-input': {
            color: 'white',                     // Text color
            },
            '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)', // Placeholder color
            },
            '& .MuiInputBase-input:focus::placeholder': {
            color: 'rgba(255, 255, 255, 1)',   // Placeholder color on focus
            },
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',                  // Remove the border
            },
            '&:hover fieldset': {
                border: 'none',                  // Ensure no border on hover
            },
            '&.Mui-focused fieldset': {
                border: 'none',                  // Ensure no border when focused
            },
            },
        }}
        />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              bgcolor: 'rgba(128, 128, 128, 0.8)', // Grey background for the button
              borderRadius: '8px',                  // Less round shape
              '&:hover': {
                bgcolor: 'rgba(128, 128, 128, 1)', // Darker grey on hover
              },
              px: 3, // Adjust padding for a rounder look
              py: 1,
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
        <Button
  onClick={onClose}
  sx={{
    mt: 2,
    color: 'white',                        // Font color
    bgcolor: 'rgba(128, 128, 128, 0.8)',  // Grey background
    '&:hover': {
      bgcolor: 'rgba(128, 128, 128, 1)',  // Darker grey on hover
    },
    borderRadius: '8px',                  // Adjust border-radius if needed
  }}
>
  Close
</Button>
      </Stack>
    </Box>
  );
};

export default Chatbot;
