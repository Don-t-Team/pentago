import Grid from "@mui/material/Grid";
import Row from "./Row";

import configAttributes from "../config/attributes";

const Section = props => {
    const {onClickCallback, index, section, width} = props;

    // const marginBottom = index <= configAttributes.num_rows / 2
    //     ? configAttributes.s_gap
    //     : 0
    
    // const marginRight = index % 2 === 0 
    //     ? configAttributes.s_gap
    //     : 0

    // const rowWidth = width + marginRight

    console.log("section width", width)

    return (
        <Grid 
            data_class={"section"}
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                // mb: marginBottom,
                // mr: marginRight 
                width: width  
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