import React, { Component } from 'react';
import ReactQuill from 'react-quill';

import {
  Box,
  Button,
  Grid,
  Switch,
  TextField,
  Paper
} from '@material-ui/core';

class Write extends Component {
  state = {
    email: {
      subject: '',
      rawMessage: `Hi %FIRST_NAME%,`,
      htmlMessage: `<p>Hi %FIRST_NAME%,</p>`
      //htmlMessage: `<p>Hi ${this.props.data[0]['First Name']},</p>`
    },
    rawTextType: false,
    errors: {
      subject: null,
      rawMessage: null,
      htmlMessage: null
    }
  }


  handleRawTextType = event => {
    this.setState({ rawTextType: event.target.checked });
  }

  handleEmail = e => {
    let name = '';
    let value = '';

    if (e.target === undefined) {
      name = 'htmlMessage';
      value = e;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    if (name === 'rawMessage' && this.state.rawTextType) {
      value = value.replace('\\n', '\n');
    }

    this.setState({
      email: { ...this.state.email, [name]: value },
      errors: { ...this.state.errors, [name]: null }
    });
  }

  validation = () => {
    const { rawTextType, email } = this.state;
    let errors = {};

    errors.subject = (email.subject.length === 0) ? 'This field is required' : null;
    errors.rawMessage = (rawTextType && email.rawMessage.length === 0) ? 'This field is required' : null;
    errors.htmlMessage = (!rawTextType && email.htmlMessage.length === 0) ? 'This field is required' : null;

    this.setState({ errors });
    return errors.subject !== null || errors.rawMessage !== null || errors.htmlMessage !== null;
  }

  confirm = e => {
    e.preventDefault();
    const error = this.validation();
    if (error) return;

    this.props.send({
      rawTextType: this.state.rawTextType,
      email: this.state.email
    });
  }

  render() {
    const { status } = this.props;
    const { email, rawTextType, errors } = this.state;

    const preview= () => {
      let message = '';
      if (rawTextType) {
        message = email.rawMessage.replace(/(?:\r\n|\r|\n)/g, '<br />');
      } else {
        message = email.htmlMessage.replace(new RegExp('<p><br></p>', 'g'), '<br />');
        message = message.replace(new RegExp('<p>', 'g'), '<div>');
        message = message.replace(new RegExp('</p>', 'g'), '</div>');
      }
      return message;
    }

    return (
      <Grid container>
        <Grid item md={6} className="grid-p2">

          <h3 className="text-info font-weight-600">Write Your Email</h3>

          <form onSubmit={ this.confirm }>

            <TextField
              fullWidth={true}
              name="subject"
              label="Subject"
              value={ email.subject }
              onChange={ this.handleEmail }
              error={ errors.subject !== null }
              helperText={ errors.subject } />

            <div>
              <Box my={2}>
                <span className="font-weight-500">Use Raw HTML:</span>
                <Switch
                  checked={ rawTextType }
                  onChange={ this.handleRawTextType }
                  color="primary" />
              </Box>

              { rawTextType
                ? <div>
                    <TextField
                      value={ email.rawMessage }
                      onChange={ this.handleEmail }
                      name="rawMessage"
                      label="Message"
                      multiline
                      fullWidth={true}
                      rows="10"
                      variant="outlined"
                      error={ errors.rawMessage !== null }
                      helperText={ errors.rawMessage } />
                  </div>
                : <div>
                    <div className="font-weight-500">Message:</div>
                    <ReactQuill
                      value={ email.htmlMessage }
                      onChange={ this.handleEmail }
                      name="htmlMessage"
                      style={{ height: "250px", marginBottom: "60px" }} />
                  </div> }

              { !!errors.htmlMessage && <Box color="error.main">{ errors.htmlMessage }</Box> }
            </div>

            <Box mt={2}>
              { status.isSending
                ? <Button variant="contained" color="primary" type="submit" disabled>Sending...</Button>
                : <Button variant="contained" color="primary" type="submit">Send</Button> }
            </Box>
          </form>

          <p className="text-gray my-3">It will take some time. Please wait until it is finished.</p>

        </Grid>
        <Grid item md={6} className="grid-p2">
          <h3 className="text-info font-weight-600">Preview of Email</h3>

          <Paper elevation={3}>
            <Box py={2} px={3}>
              <h3 className="mb-3">{ email.subject }</h3>
              <div dangerouslySetInnerHTML={{__html: preview() }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default Write;
