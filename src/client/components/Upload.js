import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

const Upload = ({ handleUpload, handleFileSelect, handleCancel, file, errors }) => (
  <div>
    <div>
      <span className="font-weight-600">Please upload a properly formatted .csv file.</span>
      <ul className="line-height-lg">
        <li>
          Files must be under <span className="text-error font-weight-600">10MB</span>.
        </li>
        <li>All other file types are rejected.</li>
        <li>
          A file must contain <span className="text-error font-weight-600">Email or email</span> in headers
        </li>
        <li>
          A template .CSV file can be found <a href='/public/template.csv'>here</a>
        </li>
      </ul>
    </div>

    <form onSubmit={ handleUpload }>
      <input type='file' name='file' onChange={ handleFileSelect } />

      { file && errors.file === undefined
        ? <p className="text-success my-2"><CheckIcon className="material-icons" /> File selected successfully.</p> : '' }
      { errors.file && <p className="text-error my-2">{ errors.file }</p> }

      <div className="my-2">
        <Button variant="outlined" type="button" onClick={ handleCancel }>Cancel</Button>
        <Button variant="contained" color="primary" type="submit">Upload</Button>
      </div>
    </form>
  </div>
);

Upload.propTypes = {
  handleUpload: PropTypes.func.isRequired,
  handleFileSelect: PropTypes.func.isRequired
};

export default Upload;
