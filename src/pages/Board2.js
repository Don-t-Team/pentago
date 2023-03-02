import {Fragment, useState} from 'react';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid"

import TopMessage from './TopMessage'
import Section from "./Section"
import Controls from "./Controls"

import configAttributes from "../config/attributes"
import Modal from '../components/Modal';

const advanceColor = color =>  color === 'red' ? 'blue' : 'red';

// const createInitialBoard = () => {
//     const board = Array(configAttributes.num_rows).fill(Array(configAttributes.num_columns).fill({color: "white", isOccupied: false}));
//     const initialBoard = board.map((row, rowIdx) => row.map( (col, colIdx) => {
//         const sectionIdx = getSectionIndex(rowIdx, colIdx)
//         return {...board[rowIdx][colIdx], section: sectionIdx, row: rowIdx, column: colIdx }
//     }));
//     return initialBoard
// }

// const renderBoard = (board) => {
//     const getTopOrBottomSection = (start, end) => {
//         return board.slice(start, end)
//     }

//     const divideTopOrBottomSection = (section, startFirst, endFirst, startSecond, endSecond) => {
//         const first = section.map((row, _) => row.slice(startFirst, endFirst))
//         const second = section.map((row, _) => row.slice(startSecond, endSecond))
//         return [[...first], [...second]]
//     }

//     const topSection = getTopOrBottomSection(0, configAttributes.num_rows / 2)
//     const bottomSection = getTopOrBottomSection(configAttributes.num_rows / 2, configAttributes.num_rows)
//     const [topLeftSection, topRightSection] = divideTopOrBottomSection(topSection, 0, configAttributes.num_columns / 2, configAttributes.num_columns / 2, configAttributes.num_columns)
//     const [bottomLeftSection, bottomRightSection] = divideTopOrBottomSection(bottomSection, 0, configAttributes.num_columns / 2, configAttributes.num_columns / 2, configAttributes.num_columns)

//     const newBoard = [[...topLeftSection], [...topRightSection], [...bottomLeftSection], [...bottomRightSection]]

//     return newBoard
// }

const createInitialBoard2 = () => {
    const createInitalSection = (sectionIdx) => {
        const section = Array(configAttributes.num_rows / 2).fill(Array(configAttributes.num_columns / 2).fill({ color: "white", isOccupied: false }))
        const initialSection = section.map((row, rowIdx) => row.map((col, colIdx) => {
            return {...section[rowIdx][colIdx], section: sectionIdx, row: rowIdx, column: colIdx}
        }))
        return initialSection
    }

    const sectionsIdx = Array(configAttributes.num_sections).fill().map((_, index) => index)
    const initialBoard = sectionsIdx.map((idx, _) => createInitalSection(idx))

    return initialBoard
}

const getActiveSection = (activeSectionIdx, board) => {
    if (activeSectionIdx === 0) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index)
        const activeSection = activeRowsIdx.map(rowIdx => board[activeSectionIdx][rowIdx].slice(0, configAttributes.num_columns / 2))
        return activeSection
    }
    if (activeSectionIdx === 1) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index)
        const activeSection = activeRowsIdx.map(rowIdx => board[activeSectionIdx][rowIdx].slice(configAttributes.num_columns / 2, configAttributes.num_columns))
        return activeSection
    }
    if (activeSectionIdx === 2) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index + configAttributes.num_rows / 2)
        const activeSection = activeRowsIdx.map(rowIdx => board[activeSectionIdx][rowIdx].slice(0, configAttributes.num_columns / 2))
        return activeSection
    }
    if (activeSectionIdx === 3) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index + configAttributes.num_rows / 2)
        const activeSection = activeRowsIdx.map(rowIdx => board[activeSectionIdx][rowIdx].slice(configAttributes.num_columns / 2, configAttributes.num_columns))
        return activeSection
    }
}

// const getSectionIndex = (rowIdx, colIdx) => {
//     const mid = configAttributes.num_rows / 2
//     if (rowIdx < mid && colIdx < mid) 
//         return 0
//     if (rowIdx < mid && colIdx >= mid)
//         return 1
//     if (rowIdx >= mid && colIdx < mid)
//         return 2
//     if (rowIdx >= mid && colIdx >= mid)
//         return 3
// }

const createInitialMoves = () => {
    return Array(2).fill(true).map(() => [])
}

const doWeHaveAWinner = (moves, player, board) => {
    const goalTest = (state) => {
        const diagonalCheck = () => {
            const rows = Object.fromEntries(state.map((cell) => [cell[0], cell[0]]))
            const cols = Object.fromEntries(state.map((cell) => [cell[1], cell[1]]))
            
            let start = state[0]
            let curRow = rows[start[0]]
            let curCol = cols[start[0]]
            // counting the start cell itself 
            let count = 1
            while (rows[curRow] != null && cols[curCol] != null) {
                const newRow = curRow + 1
                const newCol = curCol + 1
                curRow = newRow
                curCol = newCol
                if (rows[newRow] && cols[newCol])
                    count++
                // else
                //     break
            }

            if (count >= 5)
                return true

            start = state[0]
            curRow = rows[start[0]]
            curCol = cols[start[0]]

            while (rows[curRow] != null && cols[curCol] != null) {
                const newRow = curRow - 1
                const newCol = curCol - 1
                curRow = newRow
                curCol = newCol
                if (rows[newRow] && cols[newCol])
                    count++
                // else
                //     break
            }

            if (count >= 5)
                return true

            return false
        }

        const horizontalCheck = (mostOccCol, occurrences) => {
            if (occurrences < 5) {
                return false
            }
            const res = state.filter((curCell, _) => (curCell[1] === mostOccCol))
            return res.length >= configAttributes.num_columns - 1
        }

        const verticalCheck = (mostOccRow, occurrences) => (
            occurrences < 5
                ? false
                : state.filter((curCell, _) => (curCell[0] === mostOccRow)).length >= configAttributes.num_rows - 1
        )

        const mostOccIndex = () => {
            // Finds the cell with the most occurrences in a state
            // Returns the cell index and its occurrences
            const find = (obj) => {
                const cells = Object.keys(obj).map((el) => parseInt(el))
                const occurrences = Object.values(obj)
    
                const mostOccurred = occurrences.reduce((most, occ, idx) => (
                    occ > most[1]
                        ? [cells[idx], occ]
                        : [most[0], most[1]]
                ), [cells[0], occurrences[0]])
    
                return mostOccurred
            }

            let occRows = {}
            let occCols = {}
            state.map((cell, _) => {
                occRows[cell[0]] == null
                    ? occRows[cell[0]] = 1
                    : occRows[cell[0]]++
            })
            state.map((cell, _) => {
                occCols[cell[1]] == null
                    ? occCols[cell[1]] = 1
                    : occCols[cell[1]]++
            })

            const [mostOccRow, occRow] = find(occRows)
            const [mostOccCol, occCol] = find(occCols)

            return {
                mostOccRow, occRow,
                mostOccCol, occCol
            }
        }

        // const processedCheck = (cell) => {
        //     return processed[cell[0]][cell[1]]
        // }

        const nullCheck = () => {
            return state.some((cell, _) => cell == null)
        }

        if (nullCheck())
            return false

        const { mostOccRow, occRow, mostOccCol, occCol } = mostOccIndex()

        if (horizontalCheck(mostOccCol, occCol) || verticalCheck(mostOccRow, occRow) || diagonalCheck())
            return true

        return false
    }

    const nullCheck = (state) => {
        return state.every((cell, _) => cell !== null)
    }

    const getSuccessors = (state) => {
        const successors = []
        for (let i = -1; i <= 1; i++) {
            if (i === 0) continue;
                const newStateHorizontal = state.map((cell, _) => cell[0] + i < 0 || cell[0] + i === configAttributes.num_rows
                    ? null
                    : [cell[0] + i, cell[1]]
                ) 
                const newStateVertical = state.map((cell, _) => cell[1] + i < 0 || cell[1] + i === configAttributes.num_columns
                    ? null
                    : [cell[0], cell[1] + i]
                )  
                if (nullCheck(newStateHorizontal))
                    successors.push(newStateHorizontal)
                if (nullCheck(newStateVertical))
                    successors.push(newStateVertical)
        }
        return successors
    }

    const isUniqueState = (state) => {
        const key = state.reduce((sum, cell, cellIdx) => (sum + cell[0] + cell[1]), 0)
        if (uniqueStates[key] == null) {
            uniqueStates[key] = [state]
            return true
        }
        uniqueStates[key].push(state)
        return false
    }

    const mapStateCellsToBoardCells = (state) => {
        return state.map((cell) => {
            console.log("cell in state", cell)
            const [sectionIdx, rowIdx, colIdx] = cell
            const [boardRowIdx, boardColIdx] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
            return [boardRowIdx, boardColIdx]
        })
    } 


    const startState = mapStateCellsToBoardCells(moves)
    const frontier = [startState]
    const uniqueStates = {}

    while (frontier.length > 0) {
        const state = frontier.shift()
        if (isUniqueState(state)) {
            if (goalTest(state)) {
                console.log("winning state", state)
                return true
            }
            const successors = getSuccessors(state)
            successors.forEach((successor) => {
                    frontier.push(successor)
            })
        }
    }
    return false
}

const mapSectionCellToBoardCell = (rowIdx, colIdx, sectionIdx) => {
    if (sectionIdx === 0) {
        return [rowIdx, colIdx]
    }
    if (sectionIdx === 1) {
        const newColIdx = configAttributes.num_columns / 2 + colIdx
        return [rowIdx, newColIdx]
    }
    if (sectionIdx === 2) {
        const newRowIdx = configAttributes.num_rows / 2 + rowIdx
        return [newRowIdx, colIdx]
    }
    if (sectionIdx === 3) {
        const newRowIdx = configAttributes.num_rows / 2 + rowIdx
        const newColIdx = configAttributes.num_columns / 2 + colIdx
        return [newRowIdx, newColIdx]
    }
}

export default function Board (props) {
    const [board, setBoard] = useState(createInitialBoard2);
    const [haveAWinner, setHaveAWinner] = useState(false);
    const [nextColor, setNextColor] = useState('blue');
    const [winnerColor, setWinnerColor] = useState(undefined);
    const [activeSectionIdx, setActiveSectionIdx] = useState(null)
    // const [rotateSectionIdx, setRotateSectionIdx] = useState(null)
    const [pick, setPick] = useState(true)
    const [rotate, setRotate] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    
    const [moves, setMoves] = useState(createInitialMoves)

    // const [firstAvailableIndex, setFirstAvailableIndex] =
    //     useState(() => Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));

    const reset = () => {
        setBoard(createInitialBoard2());
        setMoves(createInitialMoves());
        setHaveAWinner(false);
        setNextColor('blue');
        setPick(true)
        // setFirstAvailableIndex(Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));
    };

    const getCurrentPlayer = () => (
        nextColor === 'blue' ? 0 : 1
    )

    function onClickCallback(colIdx, rowIdx, sectionIdx) {
        if( haveAWinner ) {
            return;
        }

        if (!pick) {
            return;
        }
        
        // const [row, col] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
        const activeSectionIdx = sectionIdx

        if (board[activeSectionIdx][rowIdx][colIdx].isOccupied)
            return

        const newBoard = board.slice()
        const newMoves = moves.slice()
        const currentPlayer = getCurrentPlayer()
        
        newBoard[activeSectionIdx][rowIdx][colIdx]["color"] = nextColor
        newBoard[activeSectionIdx][rowIdx][colIdx]["isOccupied"] = true
        newMoves[currentPlayer].push([sectionIdx, rowIdx, colIdx])

        // if (newMoves[currentPlayer].length >= 5 && doWeHaveAWinner(newMoves[currentPlayer], nextColor, newBoard)) {
        //     setHaveAWinner(true)
        //     setMoves(createInitialMoves)
        //     setWinnerColor(nextColor);
        // }
        
        setActiveSectionIdx(activeSectionIdx)
        setBoard(newBoard)
        setMoves(newMoves)
        setPick(false)
        setRotate(true)
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

    const rotateSection = (sectionIdx) => {

        console.log("rotating section", sectionIdx)

        const activeSection = board[sectionIdx].slice()
        const newMoves = moves.slice()
        const newColor = advanceColor(nextColor)
        
        // get index array of all cells in the active section
        const activeCellsIdx = activeSection.map((row) => row.map((_, cellIdx) => cellIdx))
        
        // create new active section with color set to white
        const newActiveSection = activeSection.map((row) => row.map(cell => {
            const newCell = {...cell}
            newCell['color'] = 'white'
            return newCell
        }))

        // keys are the moves in the state of blue player's moves
        const blueMovesToRotate = Object.fromEntries(newMoves[0].map((move, index) => {
            if (move[0] === sectionIdx) {
                return [[...move], index]
            }
            return undefined
        }).filter((move) => move != undefined))

        // keys are the moves in the state of red player's moves
        const redMovesToRotate = Object.fromEntries(newMoves[1].map((move, index) => {
            if (move[0] === sectionIdx) {
                return [[...move], index]
            }
            return undefined
        }).filter((move) => move != undefined))

         // rotate section 90 degrees clockwise
        activeCellsIdx.forEach((row, rowIdx) => row.forEach((colIdx, _) => {
            let oldRowIdx = rowIdx
            let oldColIdx = colIdx
            let newColIdx
            let newRowIdx = oldColIdx
            if (oldRowIdx === 0) newColIdx = 2
            if (oldRowIdx === 1) newColIdx = 1
            if (oldRowIdx === 2) newColIdx = 0
            newActiveSection[newRowIdx][newColIdx] = activeSection[oldRowIdx][oldColIdx]

            const newBlueMoveIdx = blueMovesToRotate[[sectionIdx, oldRowIdx, oldColIdx]]
            const newRedMoveIdx = redMovesToRotate[[sectionIdx, oldRowIdx, oldColIdx]]

            if (newBlueMoveIdx != null) {
                newMoves[0][newBlueMoveIdx] = [sectionIdx, newRowIdx, newColIdx]
                console.log("old blue move", [sectionIdx, oldRowIdx, oldColIdx])
                console.log("new blue move", [sectionIdx, newRowIdx, newColIdx])
            }
            if (newRedMoveIdx != null) {
                newMoves[1][newRedMoveIdx] = [sectionIdx, newRowIdx, newColIdx]
                console.log("old red move", [sectionIdx, oldRowIdx, oldColIdx])
                console.log("new red move", [sectionIdx, newRowIdx, newColIdx])                
            }

            // const blueMoves = Object.fromEntries(newMoves[0].map((move, index) => [move[0], [move[1], move[2], index]]))
            // const redMoves = Object.fromEntries(newMoves[1].map((move, index) => [move[0], [move[1], move[2], index]]))

            // const cellColor = board[sectionIdx][oldRowIdx][oldColIdx]["color"]
            // if (cellColor === "blue") {
            //     const blueMove = blueMoves[sectionIdx]
            //     const blueMoveRowIdx = blueMove[0]
            //     const blueMoveColIdx = blueMove[1] 

            //     if (blueMoveRowIdx === oldRowIdx && blueMoveColIdx === oldColIdx) {
            //         var cellIdx = blueMove[2]
            //         newMoves[0][cellIdx] = [sectionIdx, newRowIdx, newColIdx]
            //         console.log("old blue move", [sectionIdx, oldRowIdx, oldColIdx])
            //         console.log("new blue move", [sectionIdx, newRowIdx, newColIdx])
            //     }
            // }
            // else if (cellColor === "red" && redMoves[sectionIdx]) {
            //     const redMove = redMoves[sectionIdx]
            //     const redMoveRowIdx = redMove[0]
            //     const redMoveColIdx = redMove[1]

            //     if (redMoveRowIdx === oldRowIdx && redMoveColIdx === oldColIdx) {
            //         var cellIdx = redMove[2]
            //         newMoves[1][cellIdx] = [sectionIdx, newRowIdx, newColIdx]
            //         console.log("old red move", [sectionIdx, oldRowIdx, oldColIdx])
            //         console.log("new red move", [sectionIdx, newRowIdx, newColIdx])
            //     }

            //     newMoves[1][cellIdx] = [sectionIdx, newRowIdx, newColIdx]
            // }
        }))

        // creates new board with the new active section
        // const newBoard = board.slice()
        // newActiveSection.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
        //     const [boardRowIdx, boardColIdx] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
        //     newBoard[sectionIdx][boardRowIdx][boardColIdx] = cell
        // }))
        const newBoard = board.slice()
        newBoard[sectionIdx] = newActiveSection

        const currentPlayer = getCurrentPlayer()
        const currentPlayerMoves = newMoves[currentPlayer].slice()

        if (currentPlayerMoves.length >= 5 && doWeHaveAWinner(currentPlayerMoves, nextColor, newBoard)) {
            setHaveAWinner(true)
            setWinnerColor(nextColor)
        }

        setBoard(newBoard)
        setMoves(newMoves)
        setNextColor(newColor)
        setRotate(false)
        setPick(true)

        // console.log("rotated section: ", sectionIdx)
        // console.log("new moves", newMoves)
    }

    const onRotateCallback = () => {
        if (!rotate) {
            return;
        }
        // prevents picking a new cell by setting rotate to false
        setRotate(true)
        setModalOpen(true)
        setModalMessage("Select a section to rotate")        
    }

    const onModalClickCallback = (sectionIdx) => {
        // console.log("section to rotate", sectionIdx)
        // console.log("rotating section: ", sectionIdx)
        rotateSection(sectionIdx)
        setModalOpen(false)
        setModalMessage("")
    }
    
    const width = calcWidth()


    return (
        <Fragment>
            <Stack
                data_class="stack" 
                sx={{ width: width, m: 'auto', mt: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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
                                    onClickCallback={(colIdx, rowIdx, sectionIdx) => onClickCallback(colIdx, rowIdx, sectionIdx)}
                                />
                            )
                        }
                    </Grid>
                }
                <Controls onRotateCallback={onRotateCallback}/>
                <Modal open={modalOpen} message={modalMessage} onModalClickCallback={onModalClickCallback}/>
            </Stack>
        </Fragment>
    );
}


