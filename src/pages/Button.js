import { Fragment } from "react"
import Box from "@mui/material/Box"

const Button = (props) => {
    const { text, styles } = props

    return (
        <Box 
            item={"true"}
            xs={6} 
            sx={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: "5px"
            }}
        >
            {text}
        </Box>
    )
}

export default Button