import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TopMessage = (props) => {
  const {
    haveAWinner,
    haveADraw,
    nextColor,
    winnerColor,
    phase,
    reset,
    topMessage,
  } = props;
  if (haveAWinner || haveADraw) {
    let message = '';
    if (haveAWinner) {
      const winnerColorForRender =
        winnerColor.charAt(0).toUpperCase() + winnerColor.slice(1);
      message = `${winnerColorForRender} Wins. Game Over`;
    } else {
      message = 'Draw';
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 100,
          alignContent: 'center',
        }}
      >
        <Typography variant='h5' textAlign='center'>
          {message}
        </Typography>
        <button align='center' onClick={() => reset()}>
          Reset?
        </button>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 100,
        alignContent: 'center',
      }}
    >
      <Typography
        variant='h5'
        textAlign='center'
        style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
      >
        {/* {playerColor} {phase}s next */}
        {topMessage}
      </Typography>
    </Box>
  );
};

export default TopMessage;
