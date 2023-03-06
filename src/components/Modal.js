import { useState } from "react";
import { Box, Typography, Grid, Modal } from "@mui/material";
import grey from "@mui/material/colors/grey"
import configAttributes from "../config/attributes";
import Dialog from "@mui/material/Dialog";
import Backdrop from "@mui/material/Backdrop";
import styled from "@emotion/styled";

const BackDropComponent = styled(Backdrop, {
    name: 'MuiModal',
    slot: 'Backdrop',
    overridesResolver: (props, styles) => {
        return styles.backdrop;
    },
})({zIndex: -1})

const CustomModal = (props) => {
    const {open, message : initialMessage, onModalClickCallback } = props

    const [message, setMessage] = useState(initialMessage)
    const [rotateDirection, setRotateDirection] = useState(null)
    const [rotateSection, setRotateSection] = useState(null)

    const handleSectionClickCallback = (section) => {
        setRotateSection(section)
    }

    const handleDirectionClickCallback = (direction) => {
        onModalClickCallback(rotateSection, direction)
    }

    const sections = Array(4).fill().map((_, index) => index)
    const directions = ["Clockwise", "Counter Clockwise"]
    const textBackground = grey[100]

    return (
            <Modal
                sx={{
                    transform: "translate(-50%, -50%)",
                    position: "absolute",
                    margin: "auto",
                    top: "85%",
                    left: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "3px solid black",
                    borderRadius: "25px",
                    overflow: "hidden"
                }} 
                open={open} 
                BackdropProps={{style: { backgroundColor: configAttributes.modal_background }}}
                data_class="modal-container"
            >
                    <Box
                        sx={{
                            height: "120px",
                            width: "50%",
                            position: "absolute",
                            backgroundColor: configAttributes.modal_innerBackground,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        data_class="modal"
                    >
                        <Grid 
                            container
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}    
                        >
                            <Grid item>
                                <Typography>
                                    {message}
                                </Typography>
                            </Grid>
                            <Grid 
                                container
                                sx={{
                                    marginTop: "10px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                }}
                            >
                                {
                                    sections.map((section, idx) => (
                                        <Grid 
                                            item
                                            onClick={() => handleSectionClickCallback(idx)}
                                        >
                                            <Box
                                                sx={{
                                                    border: "1px solid black",
                                                    borderRadius: "5px",
                                                    width: "25px",
                                                    height: "25px",
                                                    textAlign: "center",
                                                    backgroundColor: textBackground
                                                }}
                                            >
                                                <Typography>
                                                    {section}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                }}
                            >
                                {
                                    directions.map(direction => (
                                        <Grid
                                            item
                                            onClick={() => handleDirectionClickCallback(direction)}
                                        >
                                            <Box
                                                sx={{
                                                    marginTop: "10px",
                                                    border: "1px solid black",
                                                    borderRadius: "5px",
                                                    width: "200px",
                                                    height: "25px",
                                                    textAlign: "center",
                                                    backgroundColor: textBackground
                                                }}
                                            >
                                                <Typography>
                                                    {direction}
                                                </Typography>
                                            </Box>
                                        </Grid>   
                                    ))
                                    }
                            </Grid>
                        </Grid>
                    </Box>
            </Modal>
    )
}

export default CustomModal