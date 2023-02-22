import Grid from "@mui/material/Grid";
import Cell from "./Cell"

import configAttributes from "../config/attributes"

const Row = props => {
    const {onClickCallback, row, rowIdx, sectionIdx} = props;

    console.log("row", row)

    return (
        <Grid 
              data_class={"row"}
              row="true"
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
                        key={idx} 
                        onClick={() => onClickCallback(idx, rowIdx, sectionIdx)}
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