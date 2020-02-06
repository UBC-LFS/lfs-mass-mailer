import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse';

import {
  Grid,
  Button,
  Box,
  Paper,
  Card,
  CardContent
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import Upload from './Upload';
import DisplayTable from './DisplayTable';
import Write from './Write';

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
    fileSummary: {},
    status: {
      isSending: false,
      isDone: false
    }
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
        errors: { failure: "File does not contain an Email column. Please check headers and columns" }
      });
      return;
    } else if ( !headers.includes(FIRST_NAME_HEADER) ) {
      this.setState({
        files: null,
        errors: { failure: "File does not contain a First Name column. Please check headers and columns" }
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

  send = emailData => {
    const { data } = this.state;

    console.log("send", emailData);
    console.log("data", data[0]);

    this.setState({ status: { isSending: false, isDone: true }});

    const html = (emailData.rawTextType == true) ? emailData.rawMessage : emailData.htmlMessage;
    const headers = Object.keys(data[0]);
    const subject = emailData.subject;
    const body = {
      data: data,
      emailID: 'Email',
      headers: headers,
      subject: subject,
      html: html
    };

    console.log("body", body);

    fetch('/api/send-email', {
      method: "POST",
      headers: {
        "Accpet": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => {
      console.log("res", res);
      return res;
    })
    .then(result => {
      console.log("result", result);
      this.setState({ status: { isSending: false, isDone: true }});
    });
  }

  render() {
    const { data, files, errors, fileSummary, status } = this.state;

    return (
      <div>
        <Grid container>
          <Grid item md={4} className="grid-p2">

            <Upload
              handleUpload={ this.handleUpload }
              handleFileSelect={ this.handleFileSelect }
            />

            { files && <Box color="success.main" mt={1}>File selected successfully.</Box> }
            { errors.failure && <Box color="error.main" mt={1}>{ errors.failure }</Box> }

            { data &&
              <Card variant="outlined" style={{ marginTop: '50px', backgroundColor: '#bbdefb' }}>
                <CardContent style={{ padding: '0 20px' }}>
                  <h4>
                    <Box color="info.dark">Summary of Uploaded File</Box>
                  </h4>
                  <table>
                    <tr>
                      <td>Total rows:</td>
                      <td>{ data.length }</td>
                    </tr>
                    <tr>
                      <td>Valid Emails:</td>
                      <td>{ data.length - fileSummary.invalidEmails.length }</td>
                    </tr>
                    <tr>
                      <td>Invalid Emails:</td>
                      <td>{fileSummary.invalidEmails.length > 0 ? fileSummary.invalidEmails : "None" }
                      </td>
                    </tr>
                    <tr>
                      <td>Missing First Names:</td>
                      <td>{ fileSummary.missingFirstNames.length > 0 ? fileSummary.missingFirstNames : "None" }
                      </td>
                    </tr>
                  </table>

                  <Box my={3} p={2} style={{ backgroundColor: '#fff' }}>
                    <InfoIcon className="material-icons" /> Please scroll down to write an Email.
                  </Box>
                </CardContent>
              </Card> }
          </Grid>
          <Grid item md={8} className="grid-p2">
            { data != null && <DisplayTable data={ data } /> }
          </Grid>
        </Grid>

        { data && <Write data={ data } send={ this.send } status={ status } /> }
      </div>
    );
  }
}


export default Main;
