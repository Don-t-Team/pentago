import Grid from "@mui/material/Grid";
import Row from "./Row";

import configAttributes from "../config/attributes";

const Section = props => {
    const {onClickCallback, section, width} = props;

    console.log("section", section)

    return (
        <Grid 
            data_class={"section"}
            container
             
            sx={{
                display: 'flex',
                flexDirection: 'row',
                mb: 0.5, 
            }}
            xs={6}
        >
            {
                section.map((row, idx) => (
                    <Row 
                        width={width}
                        key={idx}
                        row={row}
                        rowIdx={idx}
                        onClickCallback={(colIdx) => onClickCallback(colIdx)}
                    />
                ))
            }
        </Grid>
    )
}

export default Section