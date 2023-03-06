import Grid from "@mui/material/Grid";
import configAttributes from "../config/attributes";
import Row from "./Row";

const calcRowHeight = () => ( configAttributes.cell_height )

const Section = props => {
    const {onClickCallback, sectionIdx, section, width, height} = props;

   const { baseWidth, marginRight } = width
   const { baseHeight, marginBottom } = height
        
    const sectionWidth = baseWidth
    const sectionHeight = baseHeight

    console.log("section", sectionIdx, "section height", sectionHeight + marginBottom)
    console.log("section", sectionIdx, "section width", sectionWidth + marginRight)

    return (
        <Grid 
            data_class={"section-container"}
            container
            item
            sx={{
                border: "1px solid black",
                borderRadius: "15%",
                width: sectionWidth + 'px',
                height: sectionHeight + 'px',
                mr: marginRight + 'px',
                padding: "4px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
                // mb: marginBottom + 'px'
                // marginRight: marginRight,
                // marginBottom: marginBottom
            }}
        >
            {/* <Grid
                data_class={'section'}
                container
                sx={{
                    border: "1px solid black",
                    borderRadius: "15px",
                    // padding: "1px",
                    // margin: "5px",
                    display: "inherit",
                    justifyContent: 'center',
                    alignItems: "center"
                }}
            > */}
            {
                section.map((row, idx) => (
                    <Row 
                        width={sectionWidth}
                        height={calcRowHeight()}
                        key={idx}
                        sectionIdx={sectionIdx}
                        row={row}
                        rowIdx={idx}
                        onClickCallback={(colIdx, rowIdx, sectionIdx) => onClickCallback(colIdx, rowIdx, sectionIdx)}
                    />
                ))
            }
            {/* </Grid> */}
        </Grid>
    )
}

export default Section