import { Fragment } from 'react';
import Box from '@mui/material/Box';
import MUIButton from '@mui/material/Button';
import { Typography, styled } from '@mui/material';
import configAttributes from '../config/attributes';

const Button = (props) => {
  const { text } = props;

  return (
    <MUIButton
      item={'true'}
      xs={6}
      sx={{
        backgroundColor: configAttributes.cellBackground,
        // borderWidth: '1px',
        // borderStyle: 'solid',
        // borderColor: 'black',
        // borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      <Typography
        color={'black'}
        sx={{
          textAlign: 'center',
          fontFamily: 'monospace',
          fontWeight: 'bolder',
        }}
      >
        {text}
      </Typography>
    </MUIButton>
  );
};

export default Button;
