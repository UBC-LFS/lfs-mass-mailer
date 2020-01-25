import React from 'react';
import PropTypes from 'prop-types';

const createMarkup = (props) => ({__html: props.success});

const Success = (props) => (
  <div>
    <img className='center-img' alt='Success!' src='/success.svg' />

    <div>
      <div dangerouslySetInnerHTML={ createMarkup(props) } />
    </div>

    <div className='text-center'>
      <button type="button" href='https://secure.landfood.ubc.ca/Shibboleth.sso/Logout?return=https://lc.landfood.ubc.ca/'>Logout</button>
      <button type="button" onClick={ props.reset }>Send Another Email</button>
    </div>
  </div>
);

Success.propTypes = {
  success: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired
};

export default Success;
