import {Fragment, useReducer} from 'react';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid"

import TopMessage from './TopMessage'
import Section from "./Section"
import Controls from "./Controls"
import configAttributes from "../config/attributes"

import { rotationNoEffectMessage, nextPhaseMessage, reportLastActionMessage, reportUndoMessage } from '../config/messages'
import Modal from '../components/Modal';

import { reducer, initialState } from '../reducers';

const changeColor = color =>  color === 'white' ? 'black' : 'white';

const advanceState = (phase) => {
    return (phase + 1) % 2
}

const rollbackState = (phase) => {
    return (phase - 1) < 0 ? 1 : phase - 1
}

// checks if the player that started the game occupied half of the board
const checkDraw = (numCurrentPlayerMoves) => {
    const totalNumAvailMoves = configAttributes.num_rows * configAttributes.num_columns
    if (numCurrentPlayerMoves === totalNumAvailMoves / 2) {
        return true
    }
    return false
}

const doWeHaveAWinner = (moves, player, board) => {
    const goalTest = (state, board) => {
            const diagonalCheck = (board, player) => {
                const conditionCheck = (curRow, curCol) => (
                    curRow >= 0 && curRow < configAttributes.num_rows
                        && curCol >= 0 && curCol < configAttributes.num_columns
                        && board[curRow][curCol]['color'] === player
                )

                const mainDiagonalCheck = (startRow, startCol) => {
                    let count = 1
                    let curRow = startRow + 1
                    let curCol = startCol + 1
                    while(conditionCheck(curRow, curCol)) {
                            count++
                            curRow++
                            curCol++
                    }
                    curRow = startRow - 1
                    curCol = startCol - 1
                    while(conditionCheck(curRow, curCol)) {
                            count++
                            curRow--
                            curCol--
                    }
                    return count >= 5
                }

                const subDiagonalCheck = (startRow, startCol) => {
                    let count = 1
                    let curRow = startRow + 1
                    let curCol = startCol - 1
                    while(conditionCheck(curRow, curCol)) {
                            count++
                            curRow++
                            curCol--
                    }
                    curRow = startRow - 1
                    curCol = startCol + 1
                    while(conditionCheck(curRow, curCol)) {
                            count++
                            curRow--
                            curCol++
                    }
                    return count >= 5
                }

                return state.some((cell) => (
                    mainDiagonalCheck(cell[0], cell[1]) || subDiagonalCheck(cell[0], cell[1])
                ))
            }
        

        // a helper function for vertical and horizontal goal checks
        // mostOccRowOrCol is the either the row or column in the board that has the most occupied cells
        // winCondition is a array of length 6 either from 0 to 5 or 1 to 6 and represents the two presets
        // of winning positions horizontally or vertically
        // rowOrColToCheck is either the row or column index of a cell in the state of moves of the current player
        // rowOrColToSlide is either the column or row index of a cell in the state of moves of the current player
        // if rowOrColToCheck is the same as the row or column with the largest number of occupied cells, then the 
        // rowOrColToSlide is checked to see if it exists in the winning preset passed in as an argument
        // In other words, if the row index of a cell is the same as the index of the row with the most occupied cells
        // and corresponding column index is either in the array from 0 to 5 or from 1 to 6, then the cell is considered
        // connected to other cells that pass the same condition check
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
            // obj is an Object containing each row and the number of times it has been filled
            // in the board
            // Finds the cell with the most occurrences in a state
            // Returns the cell index and its occurrences
            const find = (obj) => {
                const cells = Object.keys(obj).map((el) => parseInt(el))
                const occurrences = Object.values(obj)
                
                // loops through each key/value pair in obj and finds the pair with the 
                // largest value
                const mostOccurred = occurrences.reduce((most, occ, idx) => (
                    occ > most[1]
                        ? [cells[idx], occ]
                        : [most[0], most[1]]
                ), [cells[0], occurrences[0]])
    
                return mostOccurred
            }

            const findOccurrences = (state) => {
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
                return [occRows, occCols]
            }

            const [rowOccurrences, colOccurrences] = findOccurrences(state)

            const [mostOccurredRow, rowOccurrence] = find(rowOccurrences)
            const [mostOccurredCol, colOccurrence] = find(colOccurrences)

            return {
                mostOccurredRow, rowOccurrence,
                mostOccurredCol, colOccurrence
            }
        }

        const nullCheck = () => {
            return state.some((cell, _) => cell == null)
        }

        if (nullCheck())
            return false

        const { mostOccurredRow, rowOccurrence, mostOccurredCol, colOccurrence } = mostOccIndex()

        if (verticalCheck(mostOccurredCol, colOccurrence) || horizontalCheck(mostOccurredRow, rowOccurrence) || diagonalCheck(board, player))
            return true

        return false
    }

    const mapStateCellsToBoardCells = (state) => {
        return state.map((cell) => {
            // console.log("cell in state", cell)
            const [sectionIdx, rowIdx, colIdx] = cell
            const [boardRowIdx, boardColIdx] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
            return [boardRowIdx, boardColIdx]
        })
    } 

    let state = mapStateCellsToBoardCells(moves)
    //convert board from 4 x 3 x 3 to 6 x 6 representation
    const fullBoard = sectionsToBoard(board)

    if (goalTest(state, fullBoard)) {
        console.log("winning state", state)
        return true
    }
    return false
}

const sectionsToBoard = (prevBoard) => {
    const num_rows = configAttributes.num_rows
    const num_cols = configAttributes.num_columns
    const newBoard = Array(num_rows).fill().map(() => Array(num_cols).fill(true).map(el => el))
    prevBoard.map((section, sectionIdx) => section.map((row, rowIdx) => row.map((cell, colIdx) => {
        const [boardRow, boardCell] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
        newBoard[boardRow][boardCell] = {...cell}
    })))
    return newBoard
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

// Checks if a section has no cells or only one cell clicked
const isRotateSkippable = (board, sectionIdx) => {
    const section = board[sectionIdx]
    const numUnoccupiedCells = section.reduce((sum, row, rowIdx) => {
        const unOccupiedCellsInRow = row.reduce((sum, cell, colIdx) => {
            if (cell['color'] === 'black' || cell['color'] === 'white') {
                return sum += 1
            }
            return sum
        }, 0)
        return sum + unOccupiedCellsInRow

    }, 0)

    return numUnoccupiedCells === 0 || numUnoccupiedCells === 1
}

export default function Board (props) {
    const states = ["click", "rotate"]
    const [state, dispatch] = useReducer(reducer, initialState)
    const { board, moves, phase, nextColor, winnerColor, haveAWinner,
        haveADraw, lastRotateDirection, lastRotateSectionIdx, showUndoButton,
        modalOpen, modalMessage, undo, topMessage } = state

    const reset = () => {
        dispatch({
            type: 'RESET GAME'
        })
    };

    const getCurrentPlayer = () => (
        nextColor === 'black' ? 0 : 1
    )

    function onClickCallback(colIdx, rowIdx, sectionIdx) {
        if( haveAWinner || haveADraw ) {
            return;
        }

        if (states[phase] !== 'click') {
            return;
        }

        const activeSectionIdx = sectionIdx

        if (board[activeSectionIdx][rowIdx][colIdx].isOccupied)
            return

        const newBoard = board.slice()
        const newMoves = moves.slice()
        const currentPlayer = getCurrentPlayer()
        const newState = advanceState(phase)
        
        newBoard[activeSectionIdx][rowIdx][colIdx]["color"] = nextColor
        newBoard[activeSectionIdx][rowIdx][colIdx]["isOccupied"] = true
        newMoves[currentPlayer].push([sectionIdx, rowIdx, colIdx])
        
        dispatch({
            type: "UPDATE STATE AFTER PHASE",
            newState: {
                board: newBoard,
                moves: newMoves,
                phase: newState,
                showUndoButton: true,
                undo: true,
                // topMessage: `${nextColor} clicked block ${sectionIdx + 1}`
                topMessage: reportLastActionMessage(nextColor, "click", sectionIdx + 1)
            }
        })
    }

    const calcBoardHeight = () => {
        const cellBorder = configAttributes.cell_border_width * 2
        const cellHeight = configAttributes.cell_height + cellBorder
        const heightGap = configAttributes.h_gap
        const numRows = configAttributes.num_rows
        const sectionGap = configAttributes.section_gap
        const sectionBorder = configAttributes.section_border_width * 2
        const sectionPadding = configAttributes.section_padding * 2
        const boardBorder = configAttributes.board_border_width * 2
        return numRows * cellHeight + (numRows - 1) * heightGap + sectionBorder + sectionGap + sectionPadding + boardBorder

    }

    const calcBoardWidth = () => {
        const cellBorder = configAttributes.cell_border_width * 2
        const cellWidth = configAttributes.cell_width + cellBorder
        const widthGap = configAttributes.h_gap
        const numCols = configAttributes.num_columns
        const sectionGap = configAttributes.section_gap
        const sectionBorder = configAttributes.section_border_width * 2
        const sectionPadding = configAttributes.section_padding * 2
        const boardBorder = configAttributes.board_border_width * 2
        return numCols * cellWidth + (numCols - 1) * widthGap + sectionBorder + sectionGap + sectionPadding + boardBorder
    }

    const calcSectionWidth = (boardWidth, sectionIdx) => {
        const sectionGap = configAttributes.section_gap
        const sectionBorder = configAttributes.section_border_width * 2
        const boardBorder = configAttributes.board_border_width * 2
        if (sectionIdx % 2 === 0) {
            return { baseWidth: (boardWidth - sectionGap - sectionBorder - boardBorder) / 2, marginRight: sectionGap }
        }
        return { baseWidth: (boardWidth - sectionGap - sectionBorder - boardBorder) / 2, marginRight: 0 }
    }

    const calcSectionHeight = (boardHeight, sectionIdx) => {
        const sectionGap = configAttributes.section_gap
        const sectionBorder = configAttributes.section_border_width * 2
        const boardBorder = configAttributes.board_border_width * 2
        if (sectionIdx < configAttributes.num_sections / 2) {
            return { baseHeight: (boardHeight - sectionGap - sectionBorder - boardBorder) / 2, marginBottom: sectionGap }
        }
        return { baseHeight: (boardHeight - sectionGap - sectionBorder - boardBorder) / 2, marginBottom: 0 }
    }

    const rotateSection = (sectionIdx, option) => {

        // console.log("rotating section", sectionIdx)

        if (option === 'skip' || isRotateSkippable(board, sectionIdx)) {
            const newPhase = advanceState(phase)
            const newNextColor = changeColor(nextColor)
            const currentPlayer = getCurrentPlayer()
            const currentPlayerMoves = moves[currentPlayer].slice()
            if (currentPlayerMoves.length >= 5 && doWeHaveAWinner(currentPlayerMoves, nextColor, board)) {
                dispatch({
                    type: "UPDATE WINNER",
                    winnerColor: nextColor
                })
            }
            else {
                dispatch({
                    type: "UPDATE STATE AFTER PHASE",
                    newState: {
                        ...state,
                        phase: newPhase,
                        nextColor: newNextColor,
                        undo: false,
                        showUndoButton: false,
                        // topMessage: `Rotation has no effect on block ${sectionIdx + 1}`,
                        topMessage: rotationNoEffectMessage(sectionIdx + 1) + ' ' + nextPhaseMessage(newNextColor, states[newPhase]),
                        lastRotateSectionIdx: sectionIdx,
                        lastRotateDirection: option,
                        modalOpen: false,
                        modalMessage: ''
                    }
                })
            }
            return
        }

        const direction = option

        const activeSection = board[sectionIdx].slice()
        const newMoves = moves.slice()
        // Because a change of player color happens after a rotation,
        // undoing a rotation requires an change of player color to the
        // previous state
        const newColor = changeColor(nextColor)
        
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
                // console.log("old blue move", [sectionIdx, oldRowIdx, oldColIdx])
                // console.log("new blue move", [sectionIdx, newRowIdx, newColIdx])
            }
            if (newRedMoveIdx != null) {
                newMoves[1][newRedMoveIdx] = [sectionIdx, newRowIdx, newColIdx]
                // console.log("old red move", [sectionIdx, oldRowIdx, oldColIdx])
                // console.log("new red move", [sectionIdx, newRowIdx, newColIdx])                
            }
        }))

        const newBoard = board.slice()
        const currentPlayer = getCurrentPlayer()
        const newPhase = advanceState(phase)

        newBoard[sectionIdx] = newActiveSection
        const currentPlayerMoves = newMoves[currentPlayer].slice()

        if (currentPlayerMoves.length >= 5 && doWeHaveAWinner(currentPlayerMoves, nextColor, newBoard)) {
            dispatch({
                type: 'UPDATE WINNER',
                winnerColor: nextColor
            })
            return
        }
        
        if (checkDraw(currentPlayerMoves.length)) {
            dispatch({
                type: "UPDATE DRAW"
            })
        }

        const topMessage = reportLastActionMessage(nextColor, "rotate", sectionIdx + 1)
                    + "\n" + nextPhaseMessage(newColor, states[newPhase])

        return {newBoard, newMoves, newPhase, lastRotateSectionIdx: sectionIdx, lastRotateDirection: direction, topMessage}

        // dispatch({
        //     type: "UPDATE STATE AFTER PHASE",
        //     newState: {
        //         ...state,
        //         board: newBoard,
        //         moves: newMoves,
        //         phase: newPhase,
        //         showUndoButton: true,
        //         lastRotateSectionIdx: sectionIdx,
        //         lastRotateDirection: direction,
        //         undo: true,
        //         showUndoButton: true,
        //         nextColor: newColor,
        //         topMessage: reportLastActionMessage(nextColor, "rotate", sectionIdx + 1)
        //             + "\n" + nextPhaseMessage(newColor, states[newPhase])
        //     }
        // })

        // console.log("rotated section: ", sectionIdx)
        // console.log("new moves", newMoves)
    }

    const undoClick = () => {
        const currentPlayer = getCurrentPlayer()
        const prevMoves = moves.slice()
        const prevState = rollbackState(phase)
        const [lastSectionIdx, lastRowIdx, lastColIdx] = prevMoves[currentPlayer].pop()
        const prevBoard = board.map((section, sectionIdx) => section.map((row, rowIdx) => row.map((cell, colIdx) => {
            if (sectionIdx === lastSectionIdx && rowIdx === lastRowIdx && colIdx === lastColIdx) {
                const newCell = {...cell}
                newCell["color"] = configAttributes.cellBackground
                newCell["isOccupied"] = false
                return newCell
            }
            return {...cell}
        })))

        dispatch({
            type: "UPDATE STATE AFTER PHASE",
            newState: {
                board: prevBoard,
                moves: prevMoves,
                phase: prevState,
                showUndoButton: false
            }
        })   
    }

    const undoRotate = () => {

        if (lastRotateDirection === "Clockwise") {
            return rotateSection(lastRotateSectionIdx, "Counter Clockwise")
        }
        else if (lastRotateDirection === "Counter Clockwise") {
            return rotateSection(lastRotateSectionIdx, "Clockwise")
        }

    }

    const updateStateAfterUndoClick = (newState) => {
        dispatch({
            type: "UPDATE STATE AFTER PHASE",
            newState: newState
        })
    }

    const updateStateAftreUndoRotate = (newState) => {
        const {newBoard, newMoves, newPhase, nextColor, lastRotateSectionIdx, lastRotateDirection, topMessage} = newState

        dispatch({
            type: "UPDATE STATE AFTER PHASE",
            newState: {
                ...state,
                board: newBoard,
                moves: newMoves,
                phase: newPhase,
                showUndoButton: true,
                lastRotateSectionIdx,
                lastRotateDirection,
                undo: false,
                showUndoButton: false,
                nextColor,
                topMessage,
                modalOpen: false,   
                modalMessage: '',
                topMessage: topMessage 
            }
        })

    }

    const onUndoCallback = () => {
        if (!undo) {
            return
        }

        let action = ""
        let prevColor = nextColor
        let prevPhase = rollbackState(phase)

        if (states[prevPhase] === "click") {
            undoClick()
            action = "click"
            const newState = {
                undo: false,
                showUndoButton: false,
                phase: prevPhase,
                nextColor: prevColor,
                topMessage: reportUndoMessage(prevColor, action) 
            }
            updateStateAfterUndoClick(newState)
        }
        else if (states[prevPhase] === "rotate") {
            // don't need to roll back state because a rotation moves to the next state
            // which is also the previous state
            action = "rotate"
            prevColor = changeColor(nextColor)
            const newState = undoRotate()
            newState.newPhase = prevPhase
            newState.nextColor = prevColor
            newState.topMessage = reportUndoMessage(prevColor, action)
            updateStateAftreUndoRotate(newState)
        }

        // dispatch({
        //     type: "UPDATE STATE AFTER PHASE",
        //     newState: {
        //         undo: false,
        //         showUndoButton: false,
        //         phase: prevPhase,
        //         nextColor: prevColor,
        //         topMessage: reportUndoMessage(prevColor, action) 
        //     }
        // })
    }
    
    const onRotateCallback = () => {
        if (states[phase] !== 'rotate') {
            return;
        }

        dispatch({
            type: 'UPDATE MODAL',
            modalOpen: true,
            modalMessage: 'Select a section to rotate'
        })
    }

    const onModalClickCallback = (sectionIdx, option) => {
        const res = rotateSection(sectionIdx, option)
        const newNextColor = changeColor(nextColor)

        const {newBoard, newMoves, newPhase, lastRotateSectionIdx, lastRotateDirection, topMessage} = res

        dispatch({
            type: "UPDATE STATE AFTER PHASE",
            newState: {
                ...state,
                board: newBoard,
                moves: newMoves,
                phase: newPhase,
                showUndoButton: true,
                lastRotateSectionIdx,
                lastRotateDirection,
                undo: true,
                showUndoButton: true,
                nextColor,
                topMessage,
                nextColor: newNextColor,
                modalOpen: false,
                modalMessage: '' 
            }
        })



        // dispatch({
        //     type: 'UPDATE STATE AFTER MODAL CLICK',
        //     newState: {
        //         nextColor: newNextColor,
        //         modalOpen: false,
        //         modalMessage: ''
        //     }
        // })
    }
    
    const boardwidth = calcBoardWidth()
    const boardHeight = calcBoardHeight()

    const sectionWidths = Array(4).fill().map((_, index) => calcSectionWidth(boardwidth, index))
    const sectionHeights = Array(4).fill().map((_, index) => calcSectionHeight(boardHeight, index))

    return (
        <Fragment>
            <Stack
                data_class="stack" 
                sx={{ 
                    border: `6px solid ${configAttributes.stack_border_color}`,
                    borderRadius: "25px",
                    backgroundColor: configAttributes.stack_background,
                    width: configAttributes.width,
                    height: configAttributes.height, 
                    m: 'auto', 
                    mt: 15, 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center" 
                }}>
                <TopMessage nextColor={nextColor}
                            winnerColor={winnerColor}
                            haveAWinner={haveAWinner}
                            phase={states[phase]}
                            reset={reset}
                            topMessage={topMessage}
                            />
                {
                    <Grid 
                        data_class={"board"}
                        container 
                        columns={configAttributes.num_columns}                
                        sx={{
                            border: `6px solid ${configAttributes.board_border_color}`,
                            borderRadius: "15px",
                            backgroundColor: configAttributes.boardBackground,
                            width: boardwidth,
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
                                    width={sectionWidths[sectionIdx]}
                                    height={sectionHeights[sectionIdx]}
                                    key={sectionIdx}
                                    section={section}
                                    sectionIdx={sectionIdx}
                                    onClickCallback={(colIdx, rowIdx, sectionIdx) => onClickCallback(colIdx, rowIdx, sectionIdx)}
                                />
                            )
                        }
                    </Grid>
                }
                <Controls phase={states[phase]} onRotateCallback={onRotateCallback} showUndoButton={showUndoButton} onUndoCallback={onUndoCallback}/>
                <Modal open={modalOpen} message={modalMessage} onModalClickCallback={onModalClickCallback}/>
            </Stack>
        </Fragment>
    );
}


