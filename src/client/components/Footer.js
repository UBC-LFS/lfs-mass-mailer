import React from 'react';
import {
  Container,
  Box
} from '@material-ui/core';


const Footer = () => (
  <footer>
    <Container maxWidth="md">
      <Box justifyContent="center">
        <div>The University of British Columbia</div>
        <div>Faculty of Land and Food Systems</div>

        <div>
          For assistance contact:
          <a href='mailto:it@landfood.ubc.ca' target='_top'>it@landfood.ubc.ca</a>
        </div>
      </Box>
    </Container>
  </footer>
);

export default Footer;
