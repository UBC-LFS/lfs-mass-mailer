import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@material-ui/core';

const Upload = ({ handleUpload, handleFileSelect }) => (
  <div>
    <h3>Upload Contacts via .CSV</h3>

    <div>
      Please upload a properly formatted .csv file.
      <ul>
        <li>Files must be under 10MB.</li>
        <li>All other file types are rejected.</li>
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
