import {Fragment, useState} from 'react';
import Stack from "@mui/material/Stack";

import TopMessage from './TopMessage'
import Row from './Row'

import doWeHaveAWinner from "./doWeHaveAWinner"
import configAttributes from "../config/attributes"

const advanceColor = color =>  color === 'red' ? 'blue' : 'red';

const createInitialBoard = () => {
    let board = Array(configAttributes.num_rows).fill(Array(configAttributes.num_columns).fill({color: "white", isOccupied: false}));
    return board.map((row, rowIdx) => row.map( (col, colIdx) => {
        return {...board[rowIdx][colIdx], row: rowIdx, column: colIdx }
    }));
}

const createSection = () => {
    let section = Array(configAttributes.num_rows / 2).fill(Array(configAttributes.num_columns / 2).fill({ color: 'white', isOccupied: false }))
    return section.map((row, rowIdx) => row.map((col, colIdx) => ({...section[rowIdx][colIdx], row: rowIdx, column: colIdx})))
}

export default function Board(props) {
    const [board, setBoard] = useState(createInitialBoard);
    
    const [haveAWinner, setHaveAWinner] = useState(false);
    const [nextColor, setNextColor] = useState('blue');
    const [winnerColor, setWinnerColor] = useState(undefined);

    const [firstAvailableIndex, setFirstAvailableIndex] =
        useState(() => Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));

    const reset = () => {
        setBoard(createInitialBoard());
        setHaveAWinner(false);
        setNextColor('blue');
        setFirstAvailableIndex(Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));
    };

    function onClickCallback(colIdx) {
        if( haveAWinner )
            return;

        let rowIdx = firstAvailableIndex[colIdx];
        console.log(`rowIdx = ${rowIdx}, colIdx = ${colIdx}`);
        if( rowIdx <  0)
            return;

        const availableIndex = firstAvailableIndex.slice();
        availableIndex[colIdx] -= 1;
        setFirstAvailableIndex(availableIndex);

        let affectedRow = board[rowIdx].slice();
        affectedRow[colIdx] = {
            ...affectedRow[colIdx],
            color: nextColor,
            isOccupied: true
        };

        let newBoard = board.slice();
        newBoard[rowIdx] = affectedRow;

        setBoard(newBoard);
        setNextColor(advanceColor(nextColor));

        if( doWeHaveAWinner(rowIdx, colIdx, nextColor, newBoard) ) {
            setHaveAWinner(true);
            setWinnerColor(nextColor);
        }
    }

    const calcWidth = () => configAttributes.num_columns * configAttributes.cell_width +
        (configAttributes.num_columns - 1) * configAttributes.h_gap


    return (
        <Fragment>

            <Stack sx={{width: calcWidth(), m: 'auto', mt: 15 }}
            >
                <TopMessage nextColor={nextColor}
                            winnerColor={winnerColor}
                            haveAWinner={haveAWinner}
                            reset={reset} />
                {
                    board.map((row, rowIdx) =>
                        <Row key={rowIdx}
                             row={row}
                             rowIdx={rowIdx}
                             onClickCallback={(colIdx) => onClickCallback(colIdx)}
                        />
                    )
                }
            </Stack>

        </Fragment>
    );
}


