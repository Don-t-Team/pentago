import Box from "@mui/material/Box";
import configAttributes from "../config/attributes"

const Cell = (props) => {

    const {cell} = props;

    return (
        <Box sx={{
            width: configAttributes.cell_width,
            height: configAttributes.cell_height,
            backgroundColor: cell['color'],
            border: 1,
            borderColor: 'black',
            borderRadius: '50%'}}
        />
    );
}

export default Cell