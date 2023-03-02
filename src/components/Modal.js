import { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import Modal from "@mui/material/Modal"
import orange from "@mui/material/colors/orange";
import grey from "@mui/material/colors/grey"

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
    const innerModalBackground = orange[300]
    const modalBackground = grey[400]
    const textBackground = grey[100]

    return (
            <Modal
                sx={{
                    // opacity: "80%",
                    transform: "translate(-50%, -50%)",
                    position: "absolute",
                    margin: "auto",
                    top: "85%",
                    left: "50%",
                    color: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "3px solid black",
                    borderRadius: "25px",
                    bgcolor: modalBackground,
                    overflow: "hidden"
                }} 
                open={open} 
                data_class="modal-container"
            >
                <Box
                    sx={{
                        height: "120px",
                        width: "50%",
                        position: "absolute",
                        backgroundColor: innerModalBackground,
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
                                        // onClick={() => onModalClickCallback(idx)}
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