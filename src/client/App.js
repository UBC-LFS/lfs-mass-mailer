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
  <div className="app">
    <AppBar position="static">
      <Container maxWidth="lg">
        <Box py={2}>
          <Typography variant="h5">LFS Mass Mailer</Typography>
        </Box>
      </Container>
    </AppBar>

    <main>
      <Container maxWidth="lg">
        <Main />
      </Container>
    </main>

    <footer>
      <Container maxWidth="md">
        <div className="footer-item">
          <div>The University of British Columbia</div>
          <div>Faculty of Land and Food Systems</div>
        </div>
        <div className="footer-item">
          <div>For assistance contact:</div>
          <div><a href='mailto:it@landfood.ubc.ca' target='_top'>it@landfood.ubc.ca</a></div>
        </div>
      </Container>
    </footer>
  </div>
);

export default App;
