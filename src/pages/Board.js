import {Fragment, useState} from 'react';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid"

import TopMessage from './TopMessage'
import Section from "./Section"

import configAttributes from "../config/attributes"
import { render } from '@testing-library/react';

const advanceColor = color =>  color === 'red' ? 'blue' : 'red';

const createInitialBoard = () => {
    const board = Array(configAttributes.num_rows).fill(Array(configAttributes.num_columns).fill({color: "white", isOccupied: false}));
    const initialBoard = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        const sectionIdx = getSectionIndex(rowIdx, colIdx)
        return {...board[rowIdx][colIdx], section: sectionIdx, row: rowIdx, column: colIdx }
    }));
    // const boardforRender = renderBoard(initialBoard)
    return initialBoard
}

const renderBoard = (board) => {
    const getTopOrBottomSection = (start, end) => {
        return board.slice(start, end)
    }

    const divideTopOrBottomSection = (section, startFirst, endFirst, startSecond, endSecond) => {
        const first = section.map((row, rowIdx) => row.slice(startFirst, endFirst))
        const second = section.map((row, rowIdx) => row.slice(startSecond, endSecond))
        return [[...first], [...second]]
    }

    const topSection = getTopOrBottomSection(0, configAttributes.num_rows / 2)
    const bottomSection = getTopOrBottomSection(configAttributes.num_rows / 2, configAttributes.num_rows)
    const [topLeftSection, topRightSection] = divideTopOrBottomSection(topSection, 0, configAttributes.num_columns / 2, configAttributes.num_columns / 2, configAttributes.num_columns)
    const [bottomLeftSection, bottomRightSection] = divideTopOrBottomSection(bottomSection, 0, configAttributes.num_columns / 2, configAttributes.num_columns / 2, configAttributes.num_columns)

    const newBoard = [[...topLeftSection], [...topRightSection], [...bottomLeftSection], [...bottomRightSection]]


    console.log('newBoard', newBoard)

    return newBoard
}

// const createBoardForRender = (board) => {
//     const sectionsIdx = Array(4).fill(true).map((_, index) => index)
//     const newBoard = Array(4).fill(true).map(el => el)

//     board.filter((row, rowIdx) => row.map((col, colIdx) => {
//                if (board[rowIdx][colIdx]["section"] === String(0)) {
//                     console.log(rowIdx, colIdx, board[rowIdx][colIdx]["section"])
//                }
//     }))

    // sectionsIdx.map((sectionIdx, _) => {
    //     const section = board.filter((row, rowIdx) => row.map((col, colIdx) => (
    //         board[rowIdx][colIdx]["section"] === sectionIdx
    //     )))
    //     newBoard[sectionIdx] = section
    // })
    // return newBoard
// }

const getSectionIndex = (rowIdx, colIdx) => {
    const mid = configAttributes.num_rows / 2
    if (rowIdx < mid && colIdx < mid) 
        return 0
    if (rowIdx < mid && colIdx >= mid)
        return 1
    if (rowIdx >= mid && colIdx < mid)
        return 2
    if (rowIdx >= mid && colIdx >= mid)
        return 3
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

const doWeHaveAWinner = (moves, player, board) => {
    const startState = moves.slice()
    const frontier = [startState]
    const processed = Array(board.length).fill(Array(board[0].length).fill(false))

    const goalTest = (state) => {
        const diagonalCheck = (curCell, nextCell) => {
             (Math.abs(curCell[0] - nextCell[0]) < 1 && Math.abs(curCell[1] - nextCell[1] < 1))

            for (let i = -1; i <= 1; i++) {
                if (i === 0)
                    continue
                if (curCell[0] - nextCell[0] === i && curCell[1] - nextCell[1] === -i)
                    return true
            }
            return false
        }

        if (state.every((cell, idx) => cell[0] === state[0][0]))
            return true
        
        if (state.every((cell, idx) => cell[1] === state[0][1]))
            return true

        const curIdx = 0
        const nextIdx = 1
        const count = 0
        while (nextIdx < state.length && !processed[state[curIdx][0]][state[curIdx][1]] && diagonalCheck(state[curIdx], state[nextIdx])) {
            curIdx = nextIdx
            nextIdx++
            count++
        }

        return count === 5
    }

    const getSuccessors = (state) => {
        const successors = []
        for (let cell of state) {
            for (let i = -1; i <= 1; i++) {
                if (i === 0) continue;
                const newRow = cell[0] + i
                const newCol = cell[1] + i
                if (!processed[newRow][newCol])
                    successors.push([newRow, newCol])
            }
        }
        return successors
    }

    while (frontier.length > 0) {
        const state = frontier.shift()
        if (goalTest(state)) return true
        const successors = getSuccessors(state)
        for (let i in successors) 
            frontier.push(successors[i])
    }

    return false
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
    const [board, setBoard] = useState(createInitialBoard);
    // const [boardForRender, setBoardForRender] = useState(() => renderBoard(board))
    const [haveAWinner, setHaveAWinner] = useState(false);
    const [nextColor, setNextColor] = useState('blue');
    const [winnerColor, setWinnerColor] = useState(undefined);
    
    const [moves, setMoves] = useState(Array(2).fill([]))

    const [firstAvailableIndex, setFirstAvailableIndex] =
        useState(() => Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));

    const reset = () => {
        setBoard(createInitialBoard());
        setHaveAWinner(false);
        setNextColor('blue');
        setFirstAvailableIndex(Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));
    };

    function onClickCallback(colIdx, rowIdx, sectionIdx) {

        const mergeSections = (board) => {
            // [[0, 1],
            // [[2, 3]]
            const newSectionIdx = [
                Array(configAttributes.num_sections / 2).fill(true).map((_, index) => index),
                Array(configAttributes.num_sections / 2).fill(true).map((_, index) => index + configAttributes.num_sections / 2)
            ]

            // [[0, 1], 
            // [2, 3]] 
            //  => [[0], 
            //      [1]]
            const mergedSections = newSectionIdx.map((horizontalSectionIdx, _) => {
                // horizontalSectionIdx = [0, 1, ...]
                const quarterIdx = horizontalSectionIdx[0]
                let quarterAcc = board[quarterIdx].slice()

                const remainingQuarterIdx = horizontalSectionIdx.slice(1)
                remainingQuarterIdx.map((quarterIdx, _) => {
                    const quarter = board[quarterIdx].slice()
                    quarter.map((row, rowIdx) => {
                        let rowAcc = quarterAcc[rowIdx].slice()
                        rowAcc = [...rowAcc, ...row]
                        quarterAcc[rowIdx] = rowAcc
                    })
                })
                return quarterAcc
            })

            // const newTopSection = board[0].map((row, rowIdx) => (
            //     [...board[0][rowIdx], ...board[1][rowIdx]]
            // ))
            // const newBottomSection = board[2].map((row, rowIdx) => (
            //     [...board[2][rowIdx], ...board[3][rowIdx]]
            // ))

            console.log("mergedSections", mergedSections)
            return mergedSections
        }

        if( haveAWinner ) {
            return;
        }
        
        const [row, col] = mapSectionCellToBoardCell(colIdx, rowIdx, sectionIdx)
        const newColor = advanceColor(nextColor)

        const newBoard = mergeSections(board)
        newBoard[row][col]["color"] = nextColor
        
        const currentPlayer = nextColor === 'blue' ? 0 : 1
        const newMoves = moves.slice()
        newMoves[currentPlayer].push([row, col])
        if (newMoves.length === 5 && doWeHaveAWinner(newMoves[currentPlayer])) {
            setHaveAWinner(true)
            setWinnerColor(nextColor);
        }
        
        setBoard(newBoard)
        setNextColor(newColor)
        setMoves(newMoves)
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
                            renderBoard(board).map((section, sectionIdx) => 
                                <Section 
                                    data_class="section"
                                    width={calcSectionWidth(sectionIdx)}
                                    height={calcSectionHeight(sectionIdx)}
                                    key={sectionIdx}
                                    section={section}
                                    sectionIdx={sectionIdx}
                                    onClickCallback={(colIdx, rowIdx, sectionIdx) => onClickCallback(colIdx, rowIdx, sectionIdx)}
                                />
                            )
                        }
                    </Grid>
                }
            </Stack>
        </Fragment>
    );
}


