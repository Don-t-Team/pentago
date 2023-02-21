import Grid from "@mui/material/Grid";
import Row from "./Row";

import configAttributes from "../config/attributes";
import { margin } from "@mui/system";

const Section = props => {
    const {onClickCallback, index, section, width, height} = props;

    console.log("section index", index, "section width", width, "section height", height)

    let marginBottom = index <= configAttributes.num_sections / 2
        ? configAttributes.s_gap
        : 0
        
    const sectionHeight = height - marginBottom
    marginBottom += 'px'
    
    console.log("section height", sectionHeight)
    console.log("margin bottom", marginBottom)


    return (
        <Grid 
            data_class={"section"}
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: width,
                height: sectionHeight,
                marginBottom: marginBottom
            }}
            xs={6}
        >
            {
                section.map((row, idx) => (
                    <Row 
                        width={width}
                        height={height}
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