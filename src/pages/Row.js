import Grid from "@mui/material/Grid";
import Cell from "./Cell"

import configAttributes from "../config/attributes"

const Row = props => {
    const {onClickCallback, row, width} = props;

    console.log("row", row)
    console.log("rowWidth", width)

    return (
        <Grid 
              data_class={"row"}
              row
              container 
              columns={configAttributes.num_columns / 2}
              sx={{
                  width: "100%",
                  display: 'flex',
                  flexDirection: 'row',
                  mb: 0.5,
                  height: configAttributes.cell_height
              }}
              xs={3}
        >
            {
                row.map((cell, idx) =>
                    <Grid 
                        data_class={"cell"}
                        item 
                        xs={1} 
                        key={idx} 
                        onClick={() => onClickCallback(idx)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
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