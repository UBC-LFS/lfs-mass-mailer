import React, { Component } from 'react';
import Papa from 'papaparse';
import {
  Box
} from '@material-ui/core';

import Upload from '../components/Upload';
import Preview from '../components/Preview';
import Template from '../components/Template';
import Error from '../components/Error';
import Success from '../components/Success';
import Footer from '../components/Footer';
import Alert from '../components/Alert';

// import Loading from '../components/Loading';




import {
  showPreview,
  showTemplate,
  findEmails,
  getValidEmails,
  getInvalidEmails
} from '../scripts/util.js';

export default class Controller extends Component {

  state = {
    view: 'upload',
    data: null,
    headers: null,
    emailHeader: null,
    validEmail: [],
    subject: '',
    body: '',
    loading: false,
    title: '',
    msg: '',
    open: false,
    emailHeaderValue: 'Email'
  };

  /** ===== Form.js Functions ===== */

  getHeaders = data => {
    Array.isArray(data) && this.setState({ headers: Object.keys(data[0]) });
  }

  loadOn = () => {
    this.setState({ loading: true });
  }


  /** ===== Preview.js Functions ===== */

  selectEmail = event => {
    console.log(event.target.value);
    this.setState({ emailHeader: event.target.value });
  }

  writeTemplate = () => {
    const { data, emailHeader } = this.state;

    if (this.state.emailHeader) {
      const emails = getValidEmails({ data, emailHeader });

      if (emails.length === data.length) {
        this.setState({
          view: 'write',
          validEmail: emails
        });

      } else {
        const errorRow = getInvalidEmails({ data, emailHeader });
        const errorNumber = errorRow.length;

        this.setState({
          title: 'Error',
          open: true,
          msg: `Invalid Email Identifier. Number of row errors ${errorNumber}: ${JSON.stringify(errorRow[0])}`
        });
      }

    } else {
      this.setState({
        title: 'Error',
        open: true,
        msg: 'Please Select an Identifier'
      });
    }
  }

  backToUpload = () => {
    this.setState({
      view: 'upload',
      data: null,
      headers: null,
      emailHeader: null
    });
  }


  /** ===== Template.js Functions ===== */

  backToContactPrev = () => {
    console.log("backToContactPrev");
    this.setState({
      view: 'preview',
      validEmail: null
    });
  }

  confirmSend = ({ subject, body }) => {
    console.log(subject, body);
    if (subject === '') {
      this.setState({
        title: 'Error',
        msg: 'Subject is required!',
        open: true
      });
    } else {
      this.setState({
        title: 'Confirmation',
        msg: 'Are you sure you want to send this email?',
        open: true,
        body: body,
        subject: subject
      });
    }
  }

  sendEmail = () => {
    console.log("sendEmail");
    const { data, emailHeader, headers, subject, body } = this.state;

    this.loadOn();
    const json = {
      data: data,
      emailID: emailHeader,
      headers: headers,
      subject: subject,
      html: body
    };

    console.log(json);

    fetch('/api/send-email', {
      method: "POST",
      headers: {
        "Accpet": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: data,
        emailID: emailHeader,
        headers: headers,
        subject: subject,
        html: body
      })
    })
    .then(res => {
      console.log("res", res);
      return res;
    })
    .then(user => {
      console.log("user", user);
      this.setState({ username: user.username });
    });
  }

  /** ===== Alert.js Functions ===== */

  handleClose = () => {
    this.setState({
      title: '',
      msg: '',
      open: false
    });
  }

  closeAndSend = e => {
    event.preventDefault();
    this.setState({
      loading: true,
      title: '',
      msg: '',
      open: false
    });
    this.sendEmail();
  }

  reset = () => {
    this.setState({
      view: 'upload',
      body: '',
      data: null,
      emailHeader: null,
      headers: null,
      subject: '',
      validEmail: null
    });
  }

  render() {
    const { errors, view, headers, data, emailHeader, emailHeaderValue, loading, success, error, title, msg, open } = this.state;
    console.log(errors);

    return (
      <div>
        <h2 className="text-center">Please be Patient and Do Not Refresh the Browser!</h2>

        <Upload headers={headers} />

        { showPreview({ data, view, headers })
          ? <Preview
              headers={ headers }
              data={ data }
              emailHeader={ emailHeader }
              writeTemplate={ this.writeTemplate }
              backToUpload={ this.backToUpload }
              selectEmail={ this.selectEmail }
              emailHeaderValue={ emailHeaderValue }
            />
          : null }

        {showTemplate({ data, view, headers, emailHeader })
          ? <Template
              data={ data }
              headers={ headers }
              backToContactPrev={ this.backToContactPrev }
              confirmSend={ this.confirmSend }
            />
          : null}

        {loading === true && "Loading..."}
        {view === 'error' && "Error"}
        {view === 'success' && "Success"}

        <Footer />

        {title === 'Confirmation'
          && <div>
              <h3>{ title }</h3>
              <h5>{ msg }</h5>
              <button type="button" onClick={ this.handleClose }>Dismiss</button>
              <button type="button" onClick={ this.closeAndSend }>Send</button>
            </div>}
      </div>
    );
  }
}
