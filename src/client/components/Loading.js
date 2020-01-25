import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Loading = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <LinearProgress mode='indeterminate' />
    </div>
  );
}

export default Loading;
