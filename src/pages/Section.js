import Grid from '@mui/material/Grid';
import configAttributes from '../config/attributes';
import Row from './Row';
import { animated } from '@react-spring/web';

const calcRowHeight = () => configAttributes.cell_height;

const Section = (props) => {
  const { onClickCallback, sectionIdx, section, width, height } = props;

  const { baseWidth, marginRight } = width;
  const { baseHeight, marginBottom } = height;

  const sectionWidth = baseWidth;
  const sectionHeight = baseHeight;
  const rotation = props.rotation ? props.rotation : `0deg`;
  return (
    <Grid
      data_class={'section-container'}
      container
      item
      sx={{
        backgroundColor: configAttributes.sectionBackground,
        border: `1px solid white`,
        borderRadius: '15%',
        width: sectionWidth + 'px',
        height: sectionHeight + 'px',
        mr: marginRight + 'px',
        mb: marginBottom + 'px',
        padding: '4px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {section.map((row, idx) => (
        <Row
          width={sectionWidth}
          height={calcRowHeight()}
          key={idx}
          sectionIdx={sectionIdx}
          row={row}
          rowIdx={idx}
          onClickCallback={(colIdx, rowIdx, sectionIdx) =>
            onClickCallback(colIdx, rowIdx, sectionIdx)
          }
        />
      ))}
    </Grid>
  );
};

export default Section;
