import { Fragment } from "react"
import Button from "./Button"
import { Grid } from "@mui/material"

const Controls = (props) => {

    const { onRotateCallback, onUndoCallback, showUndoButton } = props

    const getButtons = () => {
        const buttons = ['rotate', 'undo'] 
        return buttons.map((button, index) => {
            let content
            if (index === 0) {
                content = 
                    <Grid item onClick={() => onRotateCallback()} >
                        <Button text={button} />
                    </Grid>
            }
            else if (showUndoButton) {
                content = 
                    <Grid item onClick={() => onUndoCallback()} >
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
                height: "30px",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "50px"
            }}
            container 
            data_class="controllers">
            {/* <Grid item onClick={() => onRotateCallback()}>
                <Button text={"rotate"}/>
            </Grid>
            <Grid item>
                <Button text={"enter"} />
            </Grid> */}
            {
                getButtons()
            }
        </Grid>
    )
}

export default Controls