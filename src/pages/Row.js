import Grid from '@mui/material/Grid';
import Cell from './Cell';

import configAttributes from '../config/attributes';

const Row = (props) => {
  const { onClickCallback, row, rowIdx, sectionIdx, width } = props;

  return (
    <Grid
      data_class={'row'}
      row='true'
      container
      columns={configAttributes.num_columns / 2}
      columnGap={0.25}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //   width: width,
        //   height: configAttributes.cell_height
      }}
    >
      {row.map((cell, idx) => (
        <Grid
          data_class={'cell'}
          item
          key={idx}
          onClick={() => onClickCallback(idx, rowIdx, sectionIdx)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            // mb: 0.5,
          }}
        >
          <Cell cell={cell} colIdx={idx} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Row;
