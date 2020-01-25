import React from 'react';
import PropTypes from 'prop-types';

const Error = (props) => (
  <div>
    <img className='center-img' alt='Error!' src='/error.svg' />

    <div>
      {props.error}
    </div>

    <div className='text-center'>
      <button type="button" href='https://secure.landfood.ubc.ca/Shibboleth.sso/Logout?return=https://lc.landfood.ubc.ca/'>Logout</button>
      <button type="button" onClick={ props.reset }>Send Another Email</button>
    </div>
  </div>
);

Error.propTypes = {
  reset: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
};

export default Error;
