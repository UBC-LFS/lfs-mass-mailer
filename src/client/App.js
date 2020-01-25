import React, { Component } from 'react';
import {
  AppBar,
  Box,
  Typography,
  Container
} from '@material-ui/core';

import Main from './components/Main';
import './app.css';

const App = () => (
  <div>
    <AppBar position="static">
      <Container maxWidth="lg">
        <Box py={2}>
          <Typography variant="h5">LFS Mass Mailer</Typography>
        </Box>
      </Container>
    </AppBar>

    <Container maxWidth="lg">
      <h2 className="text-center">Please be Patient and Do Not Refresh the Browser!</h2>
      <Main />
    </Container>

    <footer></footer>
  </div>
);

export default App;
