import {Fragment, useState} from 'react';
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid"

import TopMessage from './TopMessage'
import Section from "./Section"
import Controls from "./Controls"

import configAttributes from "../config/attributes"
import Modal from '../components/Modal';

const advanceColor = color =>  color === 'red' ? 'blue' : 'red';

const createInitialBoard = () => {
    const board = Array(configAttributes.num_rows).fill(Array(configAttributes.num_columns).fill({color: "white", isOccupied: false}));
    const initialBoard = board.map((row, rowIdx) => row.map( (col, colIdx) => {
        const sectionIdx = getSectionIndex(rowIdx, colIdx)
        return {...board[rowIdx][colIdx], section: sectionIdx, row: rowIdx, column: colIdx }
    }));
    return initialBoard
}

const renderBoard = (board) => {
    const getTopOrBottomSection = (start, end) => {
        return board.slice(start, end)
    }

    const divideTopOrBottomSection = (section, startFirst, endFirst, startSecond, endSecond) => {
        const first = section.map((row, _) => row.slice(startFirst, endFirst))
        const second = section.map((row, _) => row.slice(startSecond, endSecond))
        return [[...first], [...second]]
    }

    const topSection = getTopOrBottomSection(0, configAttributes.num_rows / 2)
    const bottomSection = getTopOrBottomSection(configAttributes.num_rows / 2, configAttributes.num_rows)
    const [topLeftSection, topRightSection] = divideTopOrBottomSection(topSection, 0, configAttributes.num_columns / 2, configAttributes.num_columns / 2, configAttributes.num_columns)
    const [bottomLeftSection, bottomRightSection] = divideTopOrBottomSection(bottomSection, 0, configAttributes.num_columns / 2, configAttributes.num_columns / 2, configAttributes.num_columns)

    const newBoard = [[...topLeftSection], [...topRightSection], [...bottomLeftSection], [...bottomRightSection]]

    return newBoard
}

const getActiveSection = (activeSectionIdx, board) => {
    if (activeSectionIdx === 0) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index)
        const activeSection = activeRowsIdx.map(rowIdx => board[rowIdx].slice(0, configAttributes.num_columns / 2))
        return activeSection
    }
    if (activeSectionIdx === 1) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index)
        const activeSection = activeRowsIdx.map(rowIdx => board[rowIdx].slice(configAttributes.num_columns / 2, configAttributes.num_columns))
        return activeSection
    }
    if (activeSectionIdx === 2) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index + configAttributes.num_rows / 2)
        const activeSection = activeRowsIdx.map(rowIdx => board[rowIdx].slice(0, configAttributes.num_columns / 2))
        return activeSection
    }
    if (activeSectionIdx === 3) {
        const activeRowsIdx = Array(3).fill().map((_, index) => index + configAttributes.num_rows / 2)
        const activeSection = activeRowsIdx.map(rowIdx => board[rowIdx].slice(configAttributes.num_columns / 2, configAttributes.num_columns))
        return activeSection
    }
}

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

const createInitialMoves = () => {
    return Array(2).fill(true).map(() => [])
}

const doWeHaveAWinner = (moves, player, board) => {
    const startState = moves.slice()
    const frontier = [startState]
    const processed = Array(board.length).fill(Array(board[0].length).fill(false))

    const goalTest = (state) => {
        const diagonalCheck = () => {
            const rows = Object.fromEntries(state.map((cell) => [cell[0], cell[0]]))
            const cols = Object.fromEntries(state.map((cell) => [cell[1], cell[1]]))
            
            let start = state[0]
            let curRow = rows[start[0]]
            let curCol = cols[start[0]]
            let count = 0
            while (rows[curRow] != null && cols[curCol] != null) {
                const newRow = curRow + 1
                const newCol = curCol + 1
                if (rows[newRow] && cols[newCol])
                    count++
                curRow = newRow
                curCol = newCol
            }

            if (count >= 5)
                return true

            start = state[0]
            curRow = rows[start[0]]
            curCol = cols[start[0]]

            while (rows[curRow] != null && cols[curCol] != null) {
                const newRow = curRow - 1
                const newCol = curCol - 1
                if (rows[newRow] && cols[newCol])
                    count++
                curRow = newRow
                curCol = newCol
            }

            return count >= 5
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

        const processedCheck = (cell) => {
            return processed[cell[0]][cell[1]]
        }

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

export default function Board(props) {
    const [board, setBoard] = useState(createInitialBoard);
    const [haveAWinner, setHaveAWinner] = useState(false);
    const [nextColor, setNextColor] = useState('blue');
    const [winnerColor, setWinnerColor] = useState(undefined);
    const [activeSectionIdx, setActiveSectionIdx] = useState(null)
    const [rotateSectionIdx, setRotateSectionIdx] = useState(null)
    const [pick, setPick] = useState(true)
    const [rotate, setRotate] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    
    const [moves, setMoves] = useState(createInitialMoves)

    // const [firstAvailableIndex, setFirstAvailableIndex] =
    //     useState(() => Array(configAttributes.num_columns).fill(configAttributes.num_rows - 1));

    const reset = () => {
        setBoard(createInitialBoard());
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
        
        const [row, col] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
        const activeSectionIdx = getSectionIndex(row, col)

        if (board[row][col].isOccupied)
            return

        const newBoard = board.slice()
        
        const newColor = advanceColor(nextColor)
        newBoard[row][col]["color"] = nextColor
        newBoard[row][col]["isOccupied"] = true
        
        const currentPlayer = getCurrentPlayer()
        const newMoves = moves.slice()
        newMoves[currentPlayer].push([row, col])
        if (newMoves[currentPlayer].length >= 5 && doWeHaveAWinner(newMoves[currentPlayer], nextColor, board)) {
            setHaveAWinner(true)
            setMoves(createInitialMoves)
            setWinnerColor(nextColor);
        }
        
        setActiveSectionIdx(activeSectionIdx)
        setBoard(newBoard)
        setNextColor(newColor)
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

        // const rotateMovesInRotatedSection = () => {
            
        // }

        const activeSection = getActiveSection(sectionIdx, board)
        const newMoves = moves.slice()
        
        // get index array of all cells in the active section
        const activeCellsIdx = activeSection.map((row) => row.map((_, cellIdx) => cellIdx))
        
        // create new active section with color set to white
        const newActiveSection = activeSection.map((row) => row.map(cell => {
            const newCell = {...cell}
            newCell['color'] = 'white'
            return newCell
        }))

         // rotate section 90 degrees clockwise
        activeCellsIdx.forEach((row, rowIdx) => row.forEach((colIdx, _) => {
            let newColIdx
            let newRowIdx = colIdx
            if (rowIdx === 0) newColIdx = 2
            if (rowIdx === 1) newColIdx = 1
            if (rowIdx === 2) newColIdx = 0
            newActiveSection[newRowIdx][newColIdx] = activeSection[rowIdx][colIdx]
            const [oldBoardRowIdx, oldBoardColIdx] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
            const [newBoardRowIdx, newBoardColIdx] = mapSectionCellToBoardCell(newRowIdx, newColIdx, sectionIdx)
            
            // get the color of player move in the section to rotate
            const playerColor = board[oldBoardRowIdx][oldBoardColIdx]["color"]
            let player
            if (playerColor !== "white" && playerColor === "blue")
                player = 0
            else if (playerColor === "red")
                player = 1

            // get the moves of the player if the cell is not occupied
            if (player === 0 || player === 1) {
                const playerMoves = newMoves[player].slice()
                // rotates the moves the player have made if the move is in the section
                // to rotate
                // [oldBoardRowIdx, oldBoardColIdx] is the cell to be rotated and is in
                // the array of moves the player has made
                // [newBoardRowIdx, newBoardColIdx] is the new cell in the array of moves
                // of the player
                const newPlayerMoves = playerMoves.map((move) => {
                    if (move[0] === oldBoardRowIdx && move[1] === oldBoardColIdx)
                        return [newBoardRowIdx, newBoardColIdx]
                    else
                        move.slice()
                })
                if (newPlayerMoves != null)
                    newMoves[player] = newPlayerMoves
            }
        }))

        // creates new board with the new active section
        const newBoard = board.slice()
        newActiveSection.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
            const [boardRowIdx, boardColIdx] = mapSectionCellToBoardCell(rowIdx, colIdx, sectionIdx)
            newBoard[boardRowIdx][boardColIdx] = cell
        }))

        const currentPlayer = getCurrentPlayer()
        const currentPlayerMoves = newMoves[currentPlayer].slice()

        if (currentPlayerMoves.length >= 5 && doWeHaveAWinner(currentPlayerMoves, nextColor, newBoard))
            setHaveAWinner(nextColor)
            setWinnerColor(nextColor)

        setBoard(newBoard)
        setMoves(newMoves)
        setRotate(false)
        setPick(true)
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
        console.log("section to rotate", sectionIdx)
        rotateSection(sectionIdx)
        setModalOpen(false)
        setModalMessage("")
    }
    
    const width = calcWidth()

    console.log("moves", moves)

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
                <Controls onRotateCallback={onRotateCallback}/>
                <Modal open={modalOpen} message={modalMessage} onModalClickCallback={onModalClickCallback}/>
            </Stack>
        </Fragment>
    );
}


