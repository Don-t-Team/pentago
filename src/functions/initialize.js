import configAttributes from '../config/attributes';

const createInitialBoard = () => {
  const sectionsIdx = Array(configAttributes.num_sections)
    .fill()
    .map((_, index) => index);
  const initialBoard = sectionsIdx.map((idx, _) => createInitalSection(idx));

  return initialBoard;
};

const createInitalSection = (sectionIdx) => {
  const section = Array(configAttributes.num_rows / 2).fill(
    Array(configAttributes.num_columns / 2).fill(createInitialCell())
  );
  const initialSection = section.map((row, rowIdx) =>
    row.map((col, colIdx) => {
      return {
        ...section[rowIdx][colIdx],
        section: sectionIdx,
        row: rowIdx,
        column: colIdx,
      };
    })
  );
  return initialSection;
};

const createInitialCell = () => ({
  color: configAttributes.cellBackground,
  isOccupied: false,
});

const createInitialMoves = () => {
  return Array(2)
    .fill(true)
    .map(() => []);
};

export {
  createInitialBoard,
  createInitalSection,
  createInitialCell,
  createInitialMoves,
};
