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
import ThumbUpIcon from '@material-ui/icons/ThumbUp';


import Upload from './Upload';
import DisplayTable from './DisplayTable';
import Write from './Write';

import {
  MAX_FILE_SIZE,
  EMAIL_HEADER,
  FIRST_NAME_HEADER,
  LAST_NAME_HEADER,
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
      isDone: false,
      message: null,
      receivers: []
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
    } else if ( !headers.includes(LAST_NAME_HEADER) ) {
      this.setState({
        files: null,
        errors: { failure: "File does not contain a Last Name column. Please check headers and columns" }
      });
      return;
    }

    let missingFirstNames = [];
    let missingLastNames = [];
    let invalidEmails = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][FIRST_NAME_HEADER].length === 0) {
        missingFirstNames.push(i + 1);
      }
      if (rows[i][LAST_NAME_HEADER].length === 0) {
        missinglastNames.push(i + 1);
      }
      if (!validateEmail(rows[i][EMAIL_HEADER])) {
        invalidEmails.push(i + 1);
      }
    }

    return {
      missingFirstNames,
      missingLastNames,
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

    this.setState({
      status: { ...this.state.status, isSending: true, isDone: false }
    });

    const html = (emailData.rawTextType == true) ? emailData.email.rawMessage : emailData.email.htmlMessage;
    const headers = Object.keys(data[0]);
    const subject = emailData.email.subject;
    const body = {
      data: data,
      subject: subject,
      html: (emailData.rawTextType == true) ? null : emailData.email.htmlMessage,
      text: (emailData.rawTextType == true) ? emailData.email.rawMessage : null
    };

    fetch('/api/send-email', {
      method: "POST",
      headers: {
        "Accpet": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(result => {
      if (result.message === 'Success') {
        this.setState({
          data: null,
          files: null,
          errors: {},
          fileSummary: {},
          status: {
            isSending: false,
            isDone: true,
            message: result.message,
            receivers: result.receivers
          }
        });
      } else {
        this.setState({
          status: {
            ...this.state.status,
            isSending: false,
            isDone: true,
            message: result.message,
            receivers: result.receivers
          }
        });
      }

    });
  }

  render() {
    const { data, files, errors, fileSummary, status } = this.state;

    let statusBox = null;
    if (status.isSending === false && status.isDone === true) {
      const receivers = status.receivers.map((user, i) => <li key={i}>{ user }</li>);

      if (status.message === 'Success') {
          statusBox = (<div className="bg-light-gray my-3 p-3">
                        <h4 className="text-success font-weight-600 mb-3">
                          <ThumbUpIcon className="material-icons" /> Sent { status.receivers.length } email(s) successfully.
                        </h4>
                        <p>
                          Please check receivers below.
                          <ol>{ receivers }</ol>
                        </p>

                      </div>);
      } else {
        statusBox = (<div className="bg-light-gray my-3 p-3">
                      <h4 className="text-error font-weight-600 mb-3">
                        <ThumbUpIcon className="material-icons" /> Failed to send emails.
                      </h4>
                      { status.receivers.length > 0
                        ? <p>
                            Sent { status.receivers.length } email(s) partially. Please check receivers below.
                            <ol>{ receivers }</ol>
                          </p>
                        : <p>Sorry, we cannot send any emails.</p>
                      }
                    </div>);
      }
    }

    return (
      <div>
        <h2 className="text-info text-center">Please be Patient and Do Not Refresh the Browser!</h2>

        <Grid container>
          <Grid item md={5} className="grid-p2">

            <Upload
              handleUpload={ this.handleUpload }
              handleFileSelect={ this.handleFileSelect }
            />

            { files && <p className="text-success my-2">File selected successfully.</p> }

            { errors.failure && <p className="text-error my-2">{ errors.failure }</p> }

            { data &&
              <div className="bg-light-gray mt-4 p-3">
                <h4 className="text-info">
                  <InfoIcon className="material-icons" /> Summary of Uploaded File
                </h4>

                <table className="custom-table my-3">
                  <tr>
                    <td>Total rows:</td>
                    <td>{ data.length }</td>
                  </tr>
                  <tr>
                    <td>Missing First Names:</td>
                    <td>{ fileSummary.missingFirstNames.length > 0 ? fileSummary.missingFirstNames : "None" }
                    </td>
                  </tr>
                  <tr>
                    <td>Missing Last Names:</td>
                    <td>{ fileSummary.missingLastNames.length > 0 ? fileSummary.missingLastNames : "None" }
                    </td>
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
                </table>

                <p className="mt-5">Please scroll down or click <a href="#write">write an email</a>.</p>
              </div> }
          </Grid>
          <Grid item md={7} className="grid-p2">
            { data != null && <DisplayTable data={ data } /> }
            { statusBox }
          </Grid>
        </Grid>

        { data && <Write data={ data } send={ this.send } status={ status } /> }
      </div>
    );
  }
}


export default Main;
