import {Fragment, useState} from 'react';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid"

import TopMessage from './TopMessage'
import Section from "./Section"

import doWeHaveAWinner from "./doWeHaveAWinner"
import configAttributes from "../config/attributes"
import { color } from '@mui/system';

const advanceColor = color =>  color === 'red' ? 'blue' : 'red';

const createInitialBoard = () => {
    let board = Array(configAttributes.num_rows).fill(Array(configAttributes.num_columns).fill({color: "white", isOccupied: false}));
    return board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
}

const createInitialBoard2 = () => {
    let board = new Array(4).fill(createInitialSection())
    return board.map((section, sectionIdx) => section.map((row, rowIdx) => row.map((col, colIdx) => {
        return {...section[rowIdx][colIdx], section: sectionIdx, row: rowIdx, col: colIdx}
    })))
}

const createInitialSection = () => {
    let section = Array(configAttributes.num_rows / 2).fill(Array(configAttributes.num_columns / 2).fill({ color: 'white', isOccupied: false }))
    return section.map((row, rowIdx) => row.map((col, colIdx) => ({...section[rowIdx][colIdx], row: rowIdx, column: colIdx})))
}

const mapSectionCellToBoardCell = (colIdx, rowIdx, sectionIdx) => {
    if (sectionIdx === 0) {
        return [rowIdx, colIdx]
    }
    if (sectionIdx === 1) {
        const newColIdx = configAttributes.num_columns / 2 - 1 + colIdx
        return [rowIdx, newColIdx]
    }
    if (sectionIdx === 2) {
        const newRowIdx = configAttributes.num_rows / 2 - 1 + rowIdx
        return [newRowIdx, colIdx]
    }
    if (sectionIdx === 3) {
        const newRowIdx = configAttributes.num_rows / 2 - 1 + rowIdx
        const newColIdx = configAttributes.num_cols / 2 - 1 + colIdx
        return [newRowIdx, newColIdx]
    }
}


export default function Board(props) {
    const [board, setBoard] = useState(createInitialBoard2);
    const [haveAWinner, setHaveAWinner] = useState(false);
    const [nextColor, setNextColor] = useState('blue');
    const [winnerColor, setWinnerColor] = useState(undefined);
    
    const [moves, setMoves] = useState(Array(2).fill(Array(5).fill([])))

    const [firstAvailableIndex, setFirstAvailableIndex] =
        useState(() => Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));

    const reset = () => {
        setBoard(createInitialBoard());
        setHaveAWinner(false);
        setNextColor('blue');
        setFirstAvailableIndex(Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));
    };

    function onClickCallback(colIdx, rowIdx, sectionIdx) {
        if( haveAWinner )
            return;
        
        const [row, col] = mapSectionCellToBoardCell(colIdx, rowIdx, sectionIdx)
        const newBoard = board.slice()
        const newColor = advanceColor(nextColor)

        newBoard[row][col] = nextColor

        
        const nextColorIdx = nextColor === "blue" ? 0 : 1
        const newMoves = moves.slice()
        newMoves[nextColorIdx].push([row, col])
        
        setBoard(newBoard)
        setNextColor(newColor)
        setMoves(newMoves)


        // let rowIdx = firstAvailableIndex[colIdx];
        // console.log(`rowIdx = ${rowIdx}, colIdx = ${colIdx}`);
        // if( rowIdx <  0)
        //     return;

        // const availableIndex = firstAvailableIndex.slice();
        // availableIndex[colIdx] -= 1;
        // setFirstAvailableIndex(availableIndex);

        // let affectedRow = board[rowIdx].slice();
        // affectedRow[colIdx] = {
        //     ...affectedRow[colIdx],
        //     color: nextColor,
        //     isOccupied: true
        // };

        // let newBoard = board.slice();
        // newBoard[rowIdx] = affectedRow;

        // setBoard(newBoard);
        // setNextColor(advanceColor(nextColor));

        // if( doWeHaveAWinner(rowIdx, colIdx, nextColor, newBoard) ) {
        //     setHaveAWinner(true);
        //     setWinnerColor(nextColor);
        // }
    }

    const calcWidth = () => { 
        return configAttributes.num_columns * configAttributes.cell_width +
        (configAttributes.num_columns - 1) * configAttributes.h_gap + 
        configAttributes.s_gap
    }

    
    const calcSectionWidth = (sectionIdx) => {
        const num_cols = configAttributes.num_columns / 2
        const marginRight = sectionIdx % 2 === 0 ? configAttributes.s_gap : 0
        return num_cols * configAttributes.cell_width +
        (num_cols - 1) * configAttributes.h_gap + marginRight
    }
    
    const calcSectionHeight = (sectionIdx) => {
        const num_rows = configAttributes.num_rows / 2
        const marginBottom = sectionIdx < configAttributes.num_sections / 2 ? configAttributes.s_gap : 0
        return num_rows * configAttributes.cell_height +
        (num_rows - 1) * configAttributes.h_gap + marginBottom
    }
    
    const width = calcWidth()

    return (
        <Fragment>
            <Stack
                data_class="stack" 
                sx={{ width: width, m: 'auto', mt: 15 }}>
                <TopMessage nextColor={nextColor}
                            winnerColor={winnerColor}
                            haveAWinner={haveAWinner}
                            reset={reset} />
                {
                    <Grid 
                        data_class={"board"}
                        container 
                        columns={configAttributes.num_columns}                
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            mb: 0.5,
                        }}
                    >
                        {
                            board.map((section, sectionIdx) => 
                                <Section 
                                    data_class="section"
                                    width={calcSectionWidth(sectionIdx)}
                                    height={calcSectionHeight(sectionIdx)}
                                    key={sectionIdx}
                                    section={section}
                                    sectionIdx={sectionIdx}
                                    onClickCallback={(colIdx) => onClickCallback(colIdx)}
                                />
                            )
                        }
                    </Grid>
                }
            </Stack>
        </Fragment>
    );
}


