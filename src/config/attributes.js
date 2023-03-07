import { grey, red, orange } from "@mui/material/colors"

const stack_background = grey[100]
const boardBackground = grey[200]
const sectionBackground = grey[500]
const cellBackground = orange[400]
const modal_background = grey[200]
const modal_innerBackground = orange[300]

const board_border_color = grey[200]
const stack_border_color = "black"

const configAttributes = {
    stack_background,
    boardBackground,
    sectionBackground,
    cellBackground,
    modal_background,
    modal_innerBackground,
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
    board_border_color,
    stack_border_color,
    controls_height: 60,
    button_width: 60,
}

export default configAttributes