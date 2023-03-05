import {Fragment, useState} from 'react';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid"

import TopMessage from './TopMessage'
import Section from "./Section"
import Controls from "./Controls"

import configAttributes from "../config/attributes"
import Modal from '../components/Modal';

const changeColor = color =>  color === 'red' ? 'blue' : 'red';

const createInitialCell = () => (
    { color: "white", isOccupied: false }
)

const advanceState = (curState) => {
    return (curState + 1) % 2
}

const rollbackState = (curState) => {
    return (curState - 1) < 0 ? 1 : curState - 1
}

const createInitialBoard2 = () => {
    const createInitalSection = (sectionIdx) => {
        const section = Array(configAttributes.num_rows / 2).fill(Array(configAttributes.num_columns / 2).fill(createInitialCell()))
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
            }

            if (count >= 5)
                return true

            return false
        }

        // a helper function for vertical and horizontal goal checks
        const winConditionCheck = (winCondition, mostOccRowOrCol, direction) => {
            const win = state.reduce((connected, curCell) => {
                const [curCellRow, curCellCol] = curCell
                const rowOrColToCheck = direction === "horizontal" ? curCellRow : curCellCol
                const rowOrColToSlide = direction === "horizontal" ? curCellCol : curCellRow
                if (rowOrColToCheck === mostOccRowOrCol && winCondition[rowOrColToSlide] != null) {
                    delete winCondition[rowOrColToSlide]
                    return [...connected, curCell.slice()]
                }
                return connected
            }, []) 

            return Object.keys(winCondition).length === 0
        }

        const verticalCheck = (mostOccCol, occurrences) => {
            if (occurrences < 5) {
                return false
            }

            // a list of horizontal index from 0 to 5
            const conditionOne = Object.fromEntries(Array(5).fill().map((_, index) => [index, index]))
            // a list of horizontal index from 1 to 6
            const conditionTwo = Object.fromEntries(Array(5).fill().map((_, index) => [index + 1, index + 1]))

            const winsInConditionOne = winConditionCheck(conditionOne, mostOccCol, "vertical")
            if (winsInConditionOne)
                return true

            const winsInConditionTwo = winConditionCheck(conditionTwo, mostOccCol, "vertical")
            return winsInConditionTwo
        }

        const horizontalCheck = (mostOccRow, occurrences) => {
            if (occurrences < 5) {
                return false
            }

            // a list of vertical index from 0 to 5
            const conditionOne = Object.fromEntries(Array(5).fill().map((_, index) => [index, index]))
            // a list of vertical index from 1 to 6
            const conditionTwo = Object.fromEntries(Array(5).fill().map((_, index) => [index + 1, index + 1]))

            const winsInConditionOne = winConditionCheck(conditionOne, mostOccRow, "horizontal")
            if (winsInConditionOne)
                return true

            const winsInConditionTwo = winConditionCheck(conditionTwo, mostOccRow, "horizontal")
            return winsInConditionTwo
        }

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

            // need to check for multiple most occurred rows and columns
            const [mostOccRow, occRow] = find(occRows)
            const [mostOccCol, occCol] = find(occCols)

            return {
                mostOccRow, occRow,
                mostOccCol, occCol
            }
        }

        const nullCheck = () => {
            return state.some((cell, _) => cell == null)
        }

        if (nullCheck())
            return false

        const { mostOccRow, occRow, mostOccCol, occCol } = mostOccIndex()

        if (verticalCheck(mostOccCol, occCol) || horizontalCheck(mostOccRow, occRow) || diagonalCheck())
            return true

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

    const state = mapStateCellsToBoardCells(moves)
    if (goalTest(state)) {
        console.log("winning state", state)
        return true
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
    const [moves, setMoves] = useState(createInitialMoves)
    const [lastRotateDirection, setLastRotateDirection] = useState(null)
    const [lastRotateSectionIdx, setLastRotateSectionIdx] = useState(null)

    const [states, setStates] = useState(["click", "rotate"])
    const [curState, setCurState] = useState(0)
    const [showUndoButton, setShowUndoButton] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    const reset = () => {
        setBoard(createInitialBoard2());
        setMoves(createInitialMoves());
        setHaveAWinner(false);
        setNextColor('blue');
        setCurState(0)
    };

    const getCurrentPlayer = () => (
        nextColor === 'blue' ? 0 : 1
    )

    function onClickCallback(colIdx, rowIdx, sectionIdx) {
        if( haveAWinner ) {
            return;
        }

        if (states[curState] !== 'click') {
            return;
        }

        const activeSectionIdx = sectionIdx

        if (board[activeSectionIdx][rowIdx][colIdx].isOccupied)
            return

        const newBoard = board.slice()
        const newMoves = moves.slice()
        const currentPlayer = getCurrentPlayer()
        const newState = advanceState(curState)
        
        newBoard[activeSectionIdx][rowIdx][colIdx]["color"] = nextColor
        newBoard[activeSectionIdx][rowIdx][colIdx]["isOccupied"] = true
        newMoves[currentPlayer].push([sectionIdx, rowIdx, colIdx])
        
        setActiveSectionIdx(activeSectionIdx)
        setBoard(newBoard)
        setMoves(newMoves)
        setCurState(newState)
        setShowUndoButton(true)
    }

    const calcWidth = () => { 
        return configAttributes.num_columns * configAttributes.cell_width +
        (configAttributes.num_columns - 1) * configAttributes.h_gap + 
        configAttributes.s_gap
    }

    const calcBoardHeight = () => {
        return configAttributes.num_columns * configAttributes.cell_width +
        (configAttributes.num_columns - 1) * configAttributes.h_gap + 
        configAttributes.s_gap
    }

    
    const calcSectionWidth = (sectionIdx) => {
        const num_cols = configAttributes.num_columns / 2
        // const marginRight = sectionIdx % 2 === 0 ? configAttributes.s_gap : 0
        const marginRight = configAttributes.s_gap
        return num_cols * configAttributes.cell_width +
        (num_cols - 1) * configAttributes.h_gap + marginRight
    }
    
    const calcSectionHeight = (sectionIdx) => {
        const num_rows = configAttributes.num_rows / 2
        // const marginBottom = sectionIdx < configAttributes.num_sections / 2 ? configAttributes.s_gap : 0
        const marginBottom = configAttributes.s_gap
        return num_rows * configAttributes.cell_height +
        (num_rows - 1) * configAttributes.h_gap + marginBottom
        // (num_rows - 1) * configAttributes.h_gap
    }

    const rotateSection = (sectionIdx, direction) => {

        console.log("rotating section", sectionIdx)

        const activeSection = board[sectionIdx].slice()
        const newMoves = moves.slice()
        
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
            const dim = configAttributes.num_rows / 2
            let oldRowIdx = rowIdx
            let oldColIdx = colIdx
            let newColIdx
            let newRowIdx

            if (direction === "Clockwise") {
                newRowIdx = oldColIdx
                newColIdx = dim - 1 - oldRowIdx
            }
            else if (direction === "Counter Clockwise") {
                newColIdx = oldRowIdx
                newRowIdx = dim - 1 - oldColIdx
            }

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
        }))

        const newBoard = board.slice()
        const currentPlayer = getCurrentPlayer()
        const newState = advanceState(curState)

        newBoard[sectionIdx] = newActiveSection
        const currentPlayerMoves = newMoves[currentPlayer].slice()

        if (currentPlayerMoves.length >= 5 && doWeHaveAWinner(currentPlayerMoves, nextColor, newBoard)) {
            setHaveAWinner(true)
            setWinnerColor(nextColor)
        }

        setBoard(newBoard)
        setMoves(newMoves)
        setCurState(newState)
        setShowUndoButton(true)
        setLastRotateSectionIdx(sectionIdx)
        setLastRotateDirection(direction)
        // console.log("rotated section: ", sectionIdx)
        // console.log("new moves", newMoves)
    }

    const undoClick = () => {
        const currentPlayer = getCurrentPlayer()
        const prevMoves = moves.slice()
        const prevState = rollbackState(curState)
        const [lastSectionIdx, lastRowIdx, lastColIdx] = prevMoves[currentPlayer].pop()
        const prevBoard = board.map((section, sectionIdx) => section.map((row, rowIdx) => row.map((cell, colIdx) => {
            if (sectionIdx === lastSectionIdx && rowIdx === lastRowIdx && colIdx === lastColIdx) {
                const newCell = {...cell}
                newCell["color"] = "white"
                newCell["isOccupied"] = false
                return newCell
            }
            return {...cell}
        })))
        setBoard(prevBoard)
        setMoves(prevMoves)
        setCurState(prevState)
        setShowUndoButton(false)    
    }

    const undoRotate = () => {
        if (lastRotateDirection === "Clockwise") {
            rotateSection(lastRotateSectionIdx, "Counter Clockwise")
        }
        else if (lastRotateDirection === "Counter Clockwise") {
            rotateSection(lastRotateSectionIdx, "Clockwise")
        }
    }

    const onUndoCallback = () => {
        const prevState = rollbackState(curState)
        if (states[prevState] === "click") {
            undoClick()
            const prevState = rollbackState(curState)
            setCurState(prevState)
        }
        else if (states[prevState] === "rotate") {
            // Because a change of player color happens after a rotation,
            // undoing a rotation requires an change of player color to the
            // previous state
            const newColor = changeColor(nextColor)
            setNextColor(newColor)
            // don't need to roll back state because a rotation moves to the next state
            // which is also the previous state
            undoRotate()
        }
    }
    
    const onRotateCallback = () => {
        if (states[curState] !== 'rotate') {
            return;
        }
        setModalOpen(true)
        setModalMessage("Select a section to rotate")      
    }

    const onModalClickCallback = (sectionIdx, direction) => {
        rotateSection(sectionIdx, direction)
        const newColor = changeColor(nextColor)
        setNextColor(newColor)
        setModalOpen(false)
        setModalMessage("")
    }
    
    const width = calcWidth()
    const boardHeight = calcBoardHeight()

    return (
        <Fragment>
            <Stack
                data_class="stack" 
                sx={{ width: width, m: 'auto', mt: 15, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <TopMessage nextColor={nextColor}
                            winnerColor={winnerColor}
                            haveAWinner={haveAWinner}
                            curState={states[curState]}
                            reset={reset} />
                {
                    <Grid 
                        data_class={"board"}
                        container 
                        columns={configAttributes.num_columns}                
                        sx={{
                            height: boardHeight,
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
                <Controls onRotateCallback={onRotateCallback} showUndoButton={showUndoButton} onUndoCallback={onUndoCallback}/>
                <Modal open={modalOpen} message={modalMessage} onModalClickCallback={onModalClickCallback}/>
            </Stack>
        </Fragment>
    );
}


