import Typography from '@mui/material/Typography'
import Box from "@mui/material/Box";

const TopMessage = (props) => {

    const { haveAWinner, nextColor, winnerColor, curState, reset } = props

    if(!haveAWinner) {
        // ? = is it defined
        // stops from crashing
        const playerColor = nextColor?.charAt(0).toUpperCase() + nextColor.slice(1);
        return <Box
                    sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}
               >
                    <Typography variant='h5' textAlign='center'>
                      {playerColor} {curState}s next
                    </Typography>
                    {/* <Typography variant='h5' textAlign='center'>
                      {curState} next
                    </Typography> */}
            </Box>;
    }

    const winnerColorForRender = winnerColor.charAt(0).toUpperCase() + winnerColor.slice(1);
    return <Box sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}>
            <Typography variant='h5' textAlign='center'>
                {winnerColorForRender} Wins. Game Over.
            </Typography>
            <button align="center" onClick={() => reset()}>Reset?</button>
        </Box>
};

export default TopMessage