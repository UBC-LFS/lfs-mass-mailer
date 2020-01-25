import React from 'react';
import PropTypes from 'prop-types';

const Preview = ({ headers, data, emailHeader, writeTemplate, backToUpload, selectEmail, emailHeaderValue }) => {

  const displayRow = data =>
    headers.map((item, i) => <td key={i}>{ data[item] }</td>);

  return (
    <div>
      <h3>Preview of the First Ten Rows</h3>

      <table>
        <thead>
          <tr>
            { headers.map((item, i) => <th key={i} >{ item }</th>) }
          </tr>
        </thead>
        <tbody>
          { data.slice(0, 10).map((row, i) => <tr key={i}>{ displayRow(row) }</tr >) }
        </tbody>
      </table>


      <div className="text-center">
        <select value={ emailHeaderValue } onChange={ selectEmail }>
          {headers.map((item, i) =>
            <option key={i} value={ item }>{ item }</option>)}
        </select>
      </div>

      <div className="text-center">
        <button onClick={ backToUpload }>Back</button>
        <button onClick={ writeTemplate }>Next</button>
      </div>
    </div>
  );
}

Preview.propTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  emailHeader: PropTypes.string,
  writeTemplate: PropTypes.func.isRequired,
  backToUpload: PropTypes.func.isRequired,
  selectEmail: PropTypes.func.isRequired,
  emailHeaderValue: PropTypes.string,
};

export default Preview;
