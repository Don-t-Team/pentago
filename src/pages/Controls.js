import { Fragment } from "react"
import Button from "./Button"
import { Grid } from "@mui/material"

const Controls = (props) => {


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
            <Button text={"rotate"} />
            <Button text={"enter"} />
        </Grid>
    )
}

export default Controls