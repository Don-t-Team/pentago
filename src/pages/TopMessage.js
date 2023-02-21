import Typography from '@mui/material/Typography'
import Box from "@mui/material/Box";

const TopMessage = (props) => {

    if( ! props.haveAWinner) {
        // ? = is it defined
        // stops from crashing
        const playerColor = props.nextColor?.charAt(0).toUpperCase() + props.nextColor.slice(1);
        return <Box
                    sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}
               >
                    <Typography variant='h5' textAlign='center'>
                      {playerColor} plays next
                    </Typography>
            </Box>;
    }

    const winnerColor = props.winnerColor.charAt(0).toUpperCase() + props.winnerColor.slice(1);
    return <Box sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}>
            <Typography variant='h5' textAlign='center'>
                {winnerColor} Wins. Game Over.
            </Typography>
            <button align="center" onClick={() => props.reset()}>Reset?</button>
        </Box>
};

export default TopMessage