import React from 'react';
import PropTypes from 'prop-types';

import {
  Paper, Box, Button,
  TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell
} from '@material-ui/core';


const emailHeaderValue = 'Email';

const DisplayTable = ({ data }) => {
  const headers = Object.keys(data[0]);
  const displayRow = data => headers.map((item, j) =>
    <TableCell key={j}>{data[item]}</TableCell>);

  return (
    <div>
      <h3 className="font-weight-600">List of the First Ten rows</h3>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key={0}>0</TableCell>
              { headers.map((item, i) =>
                <TableCell key={i+1}>{item}</TableCell>) }
            </TableRow>
          </TableHead>
          <TableBody>
            { data.slice(0, 10).map((row, i) =>
              <TableRow key={i}><TableCell key={i}>{i+1}</TableCell>{displayRow(row)}</TableRow >) }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DisplayTable;
