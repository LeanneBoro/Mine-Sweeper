'use strict'

const gLevel = { SIZE: 4, MINES: 2 }
const MINE = '💣'


function buildBoard() {

    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function setMineNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const count = findMineNegs(board, i, j)
            board[i][j].minesAroundCount = count
        }

    }
}
function findMineNegs(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine === true) count++
        }
    }
    return count
}

function addMines(row, col) {
    const indexes = findSpotsForMines(row, col)
    for (var i = 0; i < indexes.length; i++) {
        var currIdx = indexes[i]
        gBoard[currIdx.i][currIdx.j].isMine = true
    }
}


function findSpotsForMines(row, col) {
    var isFound
    const indexes = []

    for (var i = 0; i < gLevel.MINES; i++) {
        
        while (!isFound) {
            var randI = getRandomInt(0, gLevel.SIZE)
            var randJ = getRandomInt(0, gLevel.SIZE)
            if (randI !== row && randJ !== col) {
                indexes.push({ i: randI, j: randJ })
                if (indexes.length > 1) {
                    if (indexes[i].i === indexes[i-1].i && indexes[i].j === indexes[i-1].j)
                    return
                }
                isFound = true
            }
        }
        isFound = false
    }
    return indexes
}
