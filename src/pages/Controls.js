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
        return buttons.map((button, index) => {
            let content
            if (index === 0) {
                content = 
                    <Grid style={buttonStyle} item onClick={() => onRotateCallback()} >
                        <Button text={button} />
                    </Grid>
            }
            else if (showUndoButton) {
                content = 
                    <Grid style={buttonStyle} item onClick={() => onUndoCallback()} >
                        <Button text={button} />
                    </Grid>
            }
            return content
        })
    }

    return (
             phase == 'rotate' &&
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