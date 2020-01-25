import React from 'react';
import PropTypes from 'prop-types';


const Alert = ({ title, msg, open, handleClose, closeAndSend }) => {

  return (
    <div>
      <div>Title: { title }</div>
      <div>Open: { open }</div>
      <div>Message: { msg }</div>
      <div>
        Actions:
        <button type="button" onClick={ handleClose }>Dismiss</button>
        {title === 'Confirmation' &&
          <button type="button" onClick={ closeAndSend }>Send</button>}

      </div>
      <button type="button" onClick={ handleClose }>Close</button>
    </div>
  );
}

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  closeAndSend: PropTypes.func.isRequired
};

export default Alert;
