import React, { Component } from 'react';
import Papa from 'papaparse';
import {
  Grid,
  Button,
  Box,
  Paper
} from '@material-ui/core';

import Upload from './Upload';
import DisplayTable from './DisplayTable';

import {
  MAX_FILE_SIZE,
  FIRST_NAME_HEADER,
  EMAIL_HEADER,
  validateEmail
} from '../scripts/util.js';




class Main extends Component {
  state = {
    data: null,
    files: null,
    errors: {},
    fileSummary: {}
  };

  handleFileSelect = event => {
    this.setState({
      files: event.target.files[0],
      errors: {}
    });
  }

  formValidation = files => {
    let error = null;
    if (files === null) {
      error = 'Please select your CSV file.';
    } else if (files.type !== 'text/csv' && files.type !== 'application/vnd.ms-excel') {
      error = 'File type is invalid. Please check file type.';
    } else if (files.size > MAX_FILE_SIZE) {
      error = 'File size is invalid. Please check file size.';
    }
    return error;
  }

  fileContentValidation = rows => {
    const headers = Object.keys(rows[0]);

    if ( !headers.includes(EMAIL_HEADER) ) {
      this.setState({
        files: null,
        errors: { failure: "File does not contains an Email column. Please check headers and columns" }
      });
      return;
    }

    let missingFirstNames = [];
    let invalidEmails = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][FIRST_NAME_HEADER].length === 0) {
        missingFirstNames.push(i + 1);
      }
      if (!validateEmail(rows[i][EMAIL_HEADER])) {
        invalidEmails.push(i + 1);
      }
    }

    return {
      missingFirstNames,
      invalidEmails
    };
  }

  handleUpload = event => {
    event.preventDefault();

    const error = this.formValidation(this.state.files);
    if (error !== null) {
      this.setState({ errors: { failure: error } });
      return;
    }

    Papa.parse(this.state.files, {
      delimiter: ',',
      header: true,
      skipEmptyLines: true,
      complete: (results, file) => {
        const data = results.data;

        if (data.length > 0) {
          const fileSummary = this.fileContentValidation(data);

          this.setState({
            data,
            files: null,
            fileSummary
          });
        } else {
          this.setState({ errors: { failure: "File parse error occured." } });
        }
      },
      error: (error, file) => {
        this.setState({ errors: { failure: "Parse library error occured." } });
      }
    });
  }

  render() {
    const { data, files, errors, fileSummary } = this.state;

    // console.log("data",data);
    // console.log("emailHeader", emailHeader);


    return (
      <div>
        <Grid container>
          <Grid item md={4}>

            <Upload
              handleUpload={ this.handleUpload }
              handleFileSelect={ this.handleFileSelect }
            />

            { files &&
              <Box color="success.main" mt={1}>File selected successfully.</Box> }
            { errors.failure && <Box color="error.main" mt={1}>{ errors.failure }</Box> }

            {data &&
              <div>
                <h5>Uploaded File Summary</h5>
                <table>
                  <tr>
                    <td>Total rows:</td>
                    <td>{ data.length }</td>
                  </tr>
                  <tr>
                    <td>Number of Valid Emails:</td>
                    <td>{ data.length - fileSummary.invalidEmails.length }</td>
                  </tr>
                  <tr>
                    <td>List of missing first name rows:</td>
                    <td>{ fileSummary.missingFirstNames.length > 0
                          ? fileSummary.missingFirstNames
                          : "None"}
                    </td>
                  </tr>
                  <tr>
                    <td>List of invalid Email rows:</td>
                    <td>{fileSummary.invalidEmails.length > 0
                          ? fileSummary.invalidEmails
                          : "None"}
                    </td>
                  </tr>
                </table>
              </div>}

          </Grid>
          <Grid item md={8}>
            {data != null &&
              <DisplayTable
                data={ data } />}


          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Main;
