import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@material-ui/core';

const Upload = ({ handleUpload, handleFileSelect }) => (
  <div>
    <div>
      <span className="font-weight-600">Please upload a properly formatted .csv file.</span>
      <ul>
        <li>
          Files must be under <span className="text-error font-weight-600">10MB</span>.
        </li>
        <li>All other file types are rejected.</li>
        <li>A file must contain headers:
          <ul className="font-weight-600">
            <li>First Name</li>
            <li>Last Name</li>
            <li>Email</li>
          </ul>
        </li>
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
