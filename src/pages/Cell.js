import Box from "@mui/material/Box";
import configAttributes from "../config/attributes"

const Cell = (props) => {

    const {cell} = props;

    return (
        <Box sx={{
                width: configAttributes.cell_width - 1,
                height: configAttributes.cell_height - 1,
                backgroundColor: cell['color'],
                border: 1,
                borderColor: 'black',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // mb: 0.5,
            }}
        />
    );
}

export default Cell