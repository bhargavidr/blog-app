import React from 'react'
import {Container, Box, Typography, Paper} from '@mui/material'

export default function Footer() {
    return (
      <Paper sx={{
      width: '100%',
      position: 'static',
      marginTop:5,
      bottom: 0,
      }} component="footer" square variant="outlined">
        <Container maxWidth="lg">
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              my:1
            }}
          >
          </Box>
  
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              mb: 2,
            }}
          >
            <Typography variant="caption" color="initial">
              Copyright ©2024. bharggez 
            </Typography>
          </Box>
        </Container>
      </Paper>
    );
  }