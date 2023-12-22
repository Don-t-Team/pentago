import { useState } from 'react';
import { Box, Typography, Grid, Modal } from '@mui/material';
import grey from '@mui/material/colors/grey';
import { FaArrowRotateRight, FaArrowRotateLeft } from 'react-icons/fa6';

import configAttributes from '../config/attributes';

const CustomModal = (props) => {
  const { open, message: initialMessage, onModalClickCallback } = props;

  const [message, setMessage] = useState(initialMessage);
  const [rotateDirection, setRotateDirection] = useState(null);
  const [rotateSection, setRotateSection] = useState(null);

  const handleSectionClickCallback = (section) => {
    setRotateSection(section);
  };

  const handleDirectionClickCallback = (direction) => {
    onModalClickCallback(rotateSection, direction);
  };

  const sections = Array(4)
    .fill()
    .map((_, index) => index + 1);
  const options = [
    { name: 'Counter Clockwise', icon: <FaArrowRotateLeft /> },
    { name: 'Clockwise', icon: <FaArrowRotateRight /> },
  ];
  const textBackground = grey[100];

  return (
    <Modal
      sx={{
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        margin: 'auto',
        top: '85%',
        left: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '3px solid black',
        borderRadius: '25px',
        overflow: 'hidden',
      }}
      open={open}
      slotProps={{
        backdrop: {
          style: { backgroundColor: configAttributes.modal_background },
        },
      }}
      data_class='modal-container'
    >
      <Box
        sx={{
          height: '120px',
          width: '60%',
          position: 'absolute',
          backgroundColor: configAttributes.modal_innerBackground,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '15px',
        }}
        data_class='modal'
      >
        <Grid
          container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid item>
            <Typography>{message}</Typography>
          </Grid>
          <Grid
            container
            sx={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {sections.map((section, idx) => (
              <Grid
                item
                onClick={() => handleSectionClickCallback(section - 1)}
              >
                <Box
                  sx={{
                    // border: "1px solid black",
                    borderRadius: '5px',
                    width: '25px',
                    height: '25px',
                    textAlign: 'center',
                    backgroundColor: textBackground,
                  }}
                >
                  <Typography>{section}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {options.map((option) => (
              <Grid
                item
                onClick={() => handleDirectionClickCallback(option.name)}
              >
                <Box
                  sx={{
                    marginTop: '10px',
                    borderRadius: '5px',
                    backgroundColor: textBackground,
                    height: 'fit-content',
                    width: 'fit-content',
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {option.icon}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CustomModal;
