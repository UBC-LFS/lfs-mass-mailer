/* global XMLHttpRequest, FormData */
import React, { Component } from 'react'
import Form from '../components/Form'
import Preview from '../components/Preview'
import Template from '../components/Template'
import Success from '../components/Success'
import Loading from '../components/Loading'
import Footer from '../components/Footer'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

export default class Controller extends Component {
  constructor (props) {
    super(props)
    this.state = {
      view: 'upload',
      headers: null,
      emailHeader: null,
      tempHeaders: null,
      data: null,
      template: null,
      loading: false,
      open: false,
      errormsg: '',
      validateEmail: [],
      confirm: false,
      body: '',
      subject: ''
    }
    this.getHeaders = this.getHeaders.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.closeAndSend = this.closeAndSend.bind(this)
    this.cancelSend = this.cancelSend.bind(this)
    this.loadOn = this.loadOn.bind(this)
  }

  reset () {
    this.setState({ view: 'upload', body: '', data: null, emailHeader: null, headers: null, subject: '', validateEmail: null })
  }

  sendEmail () {
    this.loadOn()
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'api/send-email', true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.response)
        if (xhr.status === 200) {
          console.log(response)
          this.setState({ view: 'success', loading: false })
        } else if (xhr.status === 404) {
          console.log(response)
          this.setState({ loading: false })
        }
      }
    }
    xhr.send(JSON.stringify({ data: this.state.data, emailID: this.state.emailHeader, headers: this.state.headers, subject: this.state.subject, html: this.state.body }))
  }

  /**
   * Form.js Functions
   * ============
  */

  getHeaders (data) {
    Array.isArray(data) && this.setState({ headers: Object.keys(data[0]) })
  }

  loadOn () {
    this.setState({ loading: true })
  }

  handleUpload (state) {
    return event => {
      event.preventDefault()
      this.loadOn()
      const xhr = new XMLHttpRequest()
      let FD = new FormData()
      for (let name in state) {
        FD.append(name, state[name])
      }
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          const response = JSON.parse(xhr.response)
          if (xhr.status === 200) {
            this.getHeaders(response.csv)
            this.setState({ view: 'preview', data: response.csv, loading: false })
          } else if (xhr.status === 404) {
            this.setState({ open: true, errormsg: response.msg, loading: false })
          }
        }
      }
      xhr.open('POST', 'api/form')
      xhr.send(FD)
    }
  }

  /** ============ */

  /**
   * Preview.js Functions
   * ============
  */

  validateEmail (email) {
    const verify = /\S+@\S+\.\S+/
    return verify.test(email)
  }

  writeTemplate () {
    if (!this.state.emailHeader) {
      this.setState({ open: true, errormsg: 'Please Select an Identifier' })
    } else {
      const emails = []
      const invalidEmails = []
      this.state.data.forEach(row => {
        this.validateEmail(row[this.state.emailHeader]) ? emails.push(row[this.state.emailHeader]) : invalidEmails.push(row[this.state.emailHeader])
      })
      if (emails.length !== this.state.data.length) {
        invalidEmails.length === this.state.data.length ? this.setState({ open: true, errormsg: `Invalid Email Identifier: All rows are invalid` }) : this.setState({ open: true, errormsg: 'Invalid Email Identifier: Make sure all rows are filled with valid emails!' })
      } else {
        this.setState({ view: 'write', validateEmail: emails })
      }
    }
  }

  backToUpload () {
    this.setState({ view: 'upload', data: null, headers: null, emailHeader: null })
  }

  selectEmail (event, index, value) {
    this.setState({emailHeader: value})
  }

  /** ============ */

  /**
   * Template.js Functions
   * ============
  */

  backToContactPrev () {
    this.setState({ view: 'preview', emailHeader: null, validateEmail: null })
  }

  handleTemplate (text, headers) {
    this.setState({ view: 'write', template: text, tempHeaders: headers })
  }

  /** ============ */

  /**
   * Error Dialog
   * ============
  */

  handleClose () {
    this.setState({open: false})
  }

  /** ============ */

  /**
   * Send Dialog
   * ============
  */

  closeAndSend () {
    this.setState({ loading: true, confirm: false }, this.sendEmail())
  }

  confirmSend (text, subject) {
    subject === '' ? this.setState({ open: true, errormsg: 'Subject is required!' }) : this.setState({ confirm: true, body: text, subject: subject })
  }

  cancelSend () {
    this.setState({ confirm: false })
  }

  /** ============ */

  render () {
    const actions = [
      <FlatButton
        label='Dismiss'
        primary
        onClick={this.handleClose}
      />
    ]
    const send = [
      <FlatButton
        label='Cancel'
        primary
        onClick={this.cancelSend}
        />,
      <FlatButton
        label='Send'
        primary
        onClick={this.closeAndSend}
        />]
    return (
      <div className='app-container'>
        <h1 style={{ textAlign: 'center' }}> Mass Mailer </h1>
        <br /><br />
        {this.state.view === 'upload' ? <Form handleUpload={this.handleUpload.bind(this)} /> : null}
        {(Array.isArray(this.state.data) && this.state.view === 'preview')
        ? <Preview
          writeTemplate={this.writeTemplate.bind(this)}
          backToUpload={this.backToUpload.bind(this)}
          selectEmail={this.selectEmail.bind(this)}
          emailHeader={this.state.emailHeader}
          headers={this.state.headers}
          data={this.state.data}
        /> : null}
        {this.state.view === 'write'
          ? <Template
            data={this.state.data}
            handleTemplate={this.handleTemplate.bind(this)}
            backToContactPrev={this.backToContactPrev.bind(this)}
            confirmSend={this.confirmSend.bind(this)}
            headers={this.state.headers}
          /> : null}
        {this.state.loading === true ? <Loading /> : null}
        {this.state.view === 'success' ? <Success reset={this.reset.bind(this)} /> : null}
        <Footer />
        <Dialog
          title='Error'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          {this.state.errormsg}
        </Dialog>
        <Dialog
          title='Confirmation'
          actions={send}
          modal={false}
          open={this.state.confirm}
          onRequestClose={this.cancelSend}>
          Are you sure you want to send this email?
          </Dialog>
      </div>
    )
  }
}
