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
        
    // const sectionHeight = height - marginBottom
    const sectionHeight = height
    marginBottom += 'px'

    // console.log("section height", sectionHeight)
    // console.log("margin bottom", marginBottom)

    return (
        <Grid 
            data_class={"section-container"}
            container
            item
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: width,
                height: sectionHeight,
            }}
            xs={6}
        >
            <Grid
                data_class={'section'}
                container
                sx={{
                    border: "1px solid black",
                    borderRadius: "15px",
                    padding: "5px",
                    margin: "5px",
                    display: "inherit",
                    justifyContent: 'center',
                    alignItems: "center"
                }}
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
        </Grid>
    )
}

export default Section