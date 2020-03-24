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
  validateEmail
} from '../scripts/util.js';


class Main extends Component {
  state = {
    data: null,
    file: null,
    errors: {},
    fileSummary: {},
    status: {
      isSending: false,
      isDone: false,
      message: null,
      receivers: []
    }
  };

  resetState = () => {
    this.setState({
      data: null,
      file: null,
      errors: {},
      fileSummary: {},
      status: {
        isSending: false,
        isDone: false,
        message: null,
        receivers: []
      }
    });
  }

  handleFileSelect = event => {
    this.setState({
      file: event.target.files[0],
      errors: {}
    });
  }

  handleCancel = e => {
    const form = e.target.parentNode.parentNode.parentNode;
    const input = form.querySelector('input[type=file]');
    input.value = '';
    this.resetState();
  }

  handleRefresh = e => {
    const form = e.target.parentNode.parentNode.parentNode.parentNode;
    const input = form.querySelector('input[type=file]');
    input.value = '';
    this.resetState();
  }

  formValidation = file => {
    let error = null;
    if (file === null) {
      error = 'Please select your CSV file.';
    } else if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      error = 'File type is invalid. Please check file type.';
    } else if (file.size > MAX_FILE_SIZE) {
      error = 'File size is invalid. Please check file size.';
    }
    return error;
  }

  fileContentValidation = rows => {
    let headers = Object.keys(rows[0]);

    let EMAIL_HEADER = null;
    let EMAIL_INDEX = -1;

    let emailUpper = headers.indexOf('Email');
    if (emailUpper > -1) {
      EMAIL_HEADER = headers[emailUpper];
      EMAIL_INDEX = emailUpper;
    }

    let emailLower = headers.indexOf('email');
    if (emailLower > -1) {
      EMAIL_HEADER = headers[emailLower];
      EMAIL_INDEX = emailLower;
    }

    let errors = []
    if (emailUpper === -1 && emailLower === -1) errors.push('EMAIL');

    if (errors.length > 0) return {
      errors: 'Invalid headers found - A file must contain Email or email in headers.'
    };

    let invalidEmails = [];
    for (let i = 0; i < rows.length; i++) {
      if ( !validateEmail(rows[i][EMAIL_HEADER]) ) invalidEmails.push(i + 1);
    }

    if (invalidEmails.length > 0) {
      return { errors: 'Invalid emails found' };
    }

    return {
      headers,
      EMAIL_HEADER,
      invalidEmails
    };
  }

  handleUpload = event => {
    event.preventDefault();

    const error = this.formValidation(this.state.file);
    if (error !== null) {
      this.setState({ errors: { file: error } });
      return;
    }

    Papa.parse(this.state.file, {
      delimiter: ',',
      header: true,
      skipEmptyLines: true,
      complete: (results, file) => {
        const data = results.data;

        if (data.length > 0) {
          const fileSummary = this.fileContentValidation(data);

          if (fileSummary.errors === undefined) {
            this.setState({ data, fileSummary });
          } else {
            this.setState({
              ...this.state,
              data: null,
              errors: { file: 'Please check your file: ' + fileSummary.errors }
            });
          }

        } else {
          this.setState({ errors: { file: "File is empty." } });
        }
      },
      error: (error, file) => {
        this.setState({ errors: { file: "Parse library error occured." } });
      }
    });
  }

  send = emailData => {
    const { data, fileSummary } = this.state;

    this.setState({
      status: { ...this.state.status, isSending: true, isDone: false }
    });

    const html = (emailData.rawTextType == true) ? emailData.email.rawMessage : emailData.email.htmlMessage;
    const headers = Object.keys(data[0]);
    const subject = emailData.email.subject;
    const body = {
      data: data,
      fileSummary: fileSummary,
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
      this.setState({
        data: null,
        file: null,
        errors: {},
        fileSummary: {},
        status: {
          isSending: false,
          isDone: true,
          message: result.message,
          receivers: result.receivers
        }
      });
    });
  }

  render() {
    const { data, file, errors, fileSummary, status } = this.state;

    let statusBox = null;
    if (status.isSending === false && status.isDone === true) {
      const receivers = status.receivers.map((user, i) => <li key={i}>{ user }</li>);

      if (status.message === 'Success') {
          statusBox = (<div className="bg-light-gray my-3 p-3">
                        <h4 className="text-success font-weight-600 mb-3">
                          <ThumbUpIcon className="material-icons" /> Sent { status.receivers.length } email(s) successfully.
                        </h4>
                        <div>
                          Please check receivers below.
                          <ol>{ receivers }</ol>
                        </div>
                        <div>
                          Please click on
                          <button className="mx-1" type="button" onClick={ this.handleRefresh }>Refresh</button>
                          button to reset this page.
                        </div>
                      </div>);
      } else {
        statusBox = (<div className="bg-light-gray my-3 p-3">
                      <h4 className="text-error font-weight-600 mb-3">
                        <ThumbUpIcon className="material-icons" /> Failed to send emails.
                      </h4>
                      { status.receivers.length > 0
                        ? <div>
                            Sent { status.receivers.length } email(s) partially. Please check receivers below.
                            <ol>{ receivers }</ol>
                          </div>
                        : <div>Sorry, we cannot send any emails.</div>
                      }
                      <div>
                        Please click on
                        <button className="mx-1" type="button" onClick={ this.handleRefresh }>Refresh</button>
                        button to reset this page.
                      </div>
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
              handleCancel={ this.handleCancel }
              file={ file }
              errors={ errors }
            />

            { data && errors.file === undefined ?
              (<div className="bg-light-gray mt-4 p-3">
                <h4 className="text-info">
                  <InfoIcon className="material-icons" /> Summary of Uploaded File
                </h4>

                <table className="custom-table my-3">
                  <tbody>
                    <tr>
                      <td>Total rows:</td>
                      <td>{ data.length }</td>
                    </tr>
                    <tr>
                      <td>Headers:</td>
                      <td>{ fileSummary.headers.join(', ') }</td>
                    </tr>
                    <tr>
                      <td>Valid Emails:</td>
                      <td>{ data.length - fileSummary.invalidEmails.length }</td>
                    </tr>
                    <tr>
                      <td>Invalid Emails:</td>
                      <td>{fileSummary.invalidEmails.length > 0 ? fileSummary.invalidEmails.length : "None" }
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-5">Please scroll down or click <a href="#write">write an email</a>.</p>
              </div>) : '' }
          </Grid>
          <Grid item md={7} className="grid-p2">
            { data && errors.file === undefined ? <DisplayTable data={ data } /> : '' }
            { statusBox }
          </Grid>
        </Grid>

        { data && errors.file === undefined ? <Write data={ data } send={ this.send } status={ status } headers={ fileSummary.headers } /> : '' }
      </div>
    );
  }
}


export default Main;
