import { Fragment } from "react"
import Button from "./Button"
import { Grid } from "@mui/material"

const Controls = (props) => {

    const { onRotateCallback } = props

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
            <Grid item onClick={() => onRotateCallback()}>
                <Button text={"rotate"}/>
            </Grid>
            <Grid item>
                <Button text={"enter"} />
            </Grid>
        </Grid>
    )
}

export default Controls