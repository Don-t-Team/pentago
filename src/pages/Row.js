import Grid from "@mui/material/Grid";
import Cell from "./Cell"

import configAttributes from "../config/attributes"

const Row = props => {
    const {onClickCallback, row} = props;

    return (
        <Grid container columns={configAttributes.num_columns}
              sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  mb: 0.5,
              }}
        >
            {
                row.map((cell, idx) =>
                    <Grid item xs={1} key={idx} onClick={() => onClickCallback(idx)}>
                        <Cell cell={cell}
                              colIdx={idx}/>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default Row