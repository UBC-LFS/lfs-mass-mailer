import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@material-ui/core';

const Upload = ({ handleUpload, handleFileSelect }) => (
  <div>
    <h3>
      <Box color="success.dark">Upload Contacts via .CSV</Box>
    </h3>

    <div>
      Please upload a properly formatted .csv file.
      <ul>
        <li>Files must be under 10MB.</li>
        <li>All other file types are rejected.</li>
        <li>A file must contain "Email", "First Name" and "Last Name" columns.</li>
        <li>
          An example .CSV file can be found <a href='/example.csv' target='_blank'>here</a>
        </li>
      </ul>
    </div>

    <form onSubmit={ handleUpload }>
      <input type='file' name='file' onChange={ handleFileSelect } />

      <Box my={1}>
        <Button variant="contained" color="primary" type="submit">Upload</Button>
      </Box>
    </form>
  </div>
);

Upload.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  handleFileSelect: PropTypes.func.isRequired
};

export default Upload;
