import Typography from '@mui/material/Typography'
import Box from "@mui/material/Box";

const TopMessage = (props) => {

    const { haveAWinner, haveADraw, nextColor, winnerColor, phase, reset, topMessage } = props

    // if(!haveAWinner) {
    //     // ? = is it defined
    //     // stops from crashing
    //     // const playerColor = nextColor?.charAt(0).toUpperCase() + nextColor.slice(1);
    //     return <Box
    //                 sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}
    //            >
    //                 <Typography variant='h5' textAlign='center'>
    //                   {/* {playerColor} {phase}s next */}
    //                   {topMessage}
    //                 </Typography>
    //         </Box>;
    // }
    if (haveAWinner || haveADraw) {
        let message = ""
        if (haveAWinner) {
            const winnerColorForRender = winnerColor.charAt(0).toUpperCase() + winnerColor.slice(1);
            message = `${winnerColorForRender} Wins. Game Over`
        }
        else {
            message = "Draw"
        }

        return <Box sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}>
                <Typography variant='h5' textAlign='center'>
                    {message}
                </Typography>
                <button align="center" onClick={() => reset()}>Reset?</button>
            </Box>
    }
    return (
        <Box
            sx={{display: 'flex', flexDirection: 'column', height: 100, alignContent: 'center'}}
        >
            <Typography variant='h5' textAlign='center'>
            {/* {playerColor} {phase}s next */}
            {topMessage}
            </Typography>
        </Box>
    )
};

export default TopMessage