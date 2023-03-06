import { grey, red } from "@mui/material/colors"

const gameBackground = grey[100]
const boardBackground = grey[200]
const sectionBackground = red[900]
const cellBackground = red[800]

const configAttributes = {
    gameBackground,
    boardBackground,
    sectionBackground,
    cellBackground,
    width: 600,
    height: 600,
    num_rows: 6,
    num_columns: 6,
    num_sections: 4,
    h_gap: 2,
    cell_width: 50,
    cell_height: 50,
    cell_border_width: 1,
    section_gap: 10,
    section_border_width : 1,
    section_padding: 10,
    board_border_width: 5,
}

export default configAttributes