import Grid from "@mui/material/Grid";
import Cell from "./Cell"

import configAttributes from "../config/attributes"

const Row = props => {
    const {onClickCallback, row} = props;

    console.log("row", row)

    return (
        <Grid 
              data_class={"row"}
              row
              container 
              width={"100%"}
              columns={configAttributes.num_columns / 2}
              sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: "center",
                  mb: 0.5,
                  height: configAttributes.cell_height
              }}
        >
            {
                row.map((cell, idx) =>
                    <Grid 
                        data_class={"cell"}
                        item 
                        // xs={1} 
                        key={idx} 
                        onClick={() => onClickCallback(idx)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            mb: 0.5,
                        }}
                    >
                        <Cell cell={cell}
                              colIdx={idx}/>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default Row