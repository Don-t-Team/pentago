import Grid from "@mui/material/Grid";
import Row from "./Row";

import configAttributes from "../config/attributes";
import { margin } from "@mui/system";

const Section = props => {
    const {onClickCallback, sectionIdx, section, width, height} = props;

    // console.log("section index", index, "section width", width, "section height", height)

    let marginBottom = sectionIdx <= configAttributes.num_sections / 2
        ? configAttributes.s_gap
        : 0
        
    const sectionHeight = height - marginBottom
    marginBottom += 'px'

    // console.log("section height", sectionHeight)
    // console.log("margin bottom", marginBottom)

    return (
        <Grid 
            data_class={"section"}
            container
            item
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
                        sectionIdx={sectionIdx}
                        row={row}
                        rowIdx={idx}
                        onClickCallback={(colIdx, rowIdx, sectionIdx) => onClickCallback(colIdx, rowIdx, sectionIdx)}
                    />
                ))
            }
        </Grid>
    )
}

export default Section