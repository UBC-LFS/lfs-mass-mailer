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
  const displayRow = data =>
    headers.map((item, i) => <TableCell key={i}>{ data[item] }</TableCell>);

  return (
    <div>
      <h3>Preview of the First Ten Rows</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key={0}>0</TableCell>
              { headers.map((item, i) => <TableCell key={i+1}>{ item }</TableCell>) }
            </TableRow>
          </TableHead>
          <TableBody>
            { data.slice(0, 10).map((row, i) =>
              <TableRow key={i}>
                <TableCell key={i}>{ i + 1 }</TableCell>
                { displayRow(row) }
              </TableRow >) }
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="text-center" mt={3}>
        <Button variant="contained" color="primary">Write</Button>
      </Box>
    </div>
  );
}

export default DisplayTable;
