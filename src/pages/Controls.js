import Button from "./Button"
import { Grid } from "@mui/material"
import configAttributes from "../config/attributes"

const buttonStyle = {
    height: "100%",
    width: configAttributes.button_width
}

const Controls = (props) => {
    const { phase, onRotateCallback, onUndoCallback, showUndoButton } = props

    const getButtons = () => {
        const buttons = ['rotate?', 'undo'] 
        if (phase !== 'rotate') buttons.shift()
        if (!showUndoButton) buttons.pop()
        return buttons.map((button, index) => {
            let content
            if (button === 'rotate?') {
                content = 
                    <Grid style={buttonStyle} item onClick={() => onRotateCallback()} >
                        <Button text={button} />
                    </Grid>
            }
            else if (button="undo") {
                content = 
                    <Grid style={buttonStyle} item onClick={() => onUndoCallback()} >
                        <Button text={button} />
                    </Grid>
            }
            return content
        })
    }

    return (
        <Grid
            columns={12} 
            sx={{            
                height: configAttributes.controls_height,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "50px"
            }}
            container 
            data_class="controllers">
            {
                getButtons()
            }
        </Grid>     
    )
}

export default Controls