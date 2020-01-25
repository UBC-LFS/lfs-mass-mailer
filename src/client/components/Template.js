import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Template extends Component {

  state = {
    text: `<p>Hello %${this.props.headers[0]}%</p>`,
    rawHTML: ``,
    subject: '',
    error: 'This field is required',
    useRawHTML: false
  }

  dropText = head => {
    this.setState({ text: this.state.text.concat(head) });
  }

  handleSubject = event => {
    if (event.target.value === '') {
      this.setState({
        subject: event.target.value,
        error: 'This field is required'
      });
    } else {
      this.setState({
        subject: event.target.value,
        error: ''
      });
    }
  }

  handleRawHTML = event => {
    this.setState({ rawHTML: event.target.value });
  }

  handleText = event => {
    this.setState({ text: event.target.value });
  }

  handleRawHTMLToggle = event => {
    console.log(event.target.checked);
    this.setState({ useRawHTML: event.target.checked });
  }

  replaceAll = ({ str, find, replace }) => {
    return str.replace(new RegExp(find, 'ig'), replace);
  }




  render () {
    const { data, headers, backToContactPrev, confirmSend } = this.props;
    const { text, rawHTML, subject, error, useRawHTML } = this.state;

    console.log("useRawHTML", useRawHTML);

    const getPreview = () => {
      const { data, headers } = this.props;
      const { useRawHTML, rawHTML, text } = this.state;
      let preview = useRawHTML ? rawHTML : text;

      headers.forEach(head => {
        preview = this.replaceAll({
          str: preview,
          find: `%${head}%`,
          replace: data[0][head]
        });
      });

      console.log("preview", preview);
      return preview.replace(new RegExp('<p><br></p>', 'ig'), '<br>');
    }

    console.log(text);

    return (
      <div>
        <h3>Click on or Type the Following Identifiers:</h3>

        <div>
          {headers.map((head, i) =>
            <button key={i} onClick={() => this.dropText(`%${head}%`)}>{`%${head}%`}</button>)}
        </div>

        <h3>Write Your Template</h3>
        <input
          type="text"
          placeholder="Subject"
          value={ subject }
          onChange={ this.handleSubject } />

        <div>
          User Raw HTML:
          <input
            type="checkbox"
            checked={ useRawHTML }
            onChange={ this.handleRawHTMLToggle } />
        </div>

        {useRawHTML
          ? <textarea
              value={ rawHTML }
              rows="10"
              cols="10"
              onChange={ this.handleRawHTML } />
          : <textarea
              value={ text }
              rows="10"
              cols="10"
              onChange={ this.handleText } />}


        <h3>Live Preview</h3>

        <div className='preview'>

        </div>

        <div className='text-center'>
          <button type="button" onClick={ backToContactPrev }>Back</button>
          <button type="button" onClick={() => confirmSend({ subject: subject, body: useRawHTML ? rawHTML : text })}>Send</button>
        </div>

      </div>
    );
  }
}

export default Template;
