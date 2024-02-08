'use strict'



function revealNeighs(elCell, rowIdx, colIdx) {

    if (gBoard[rowIdx][colIdx].minesAroundCount > 0) {
        elCell.innerHTML = gBoard[rowIdx][colIdx].minesAroundCount
        elCell.classList.remove('hidden')
        gBoard[rowIdx][colIdx].isShown = true
    } else {
        elCell.classList.remove('hidden')
        gBoard[colIdx][rowIdx].isShown = true
        expandShown(gBoard, rowIdx, colIdx)

    }
}

function expandShown(gBoard, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            gBoard[i][j].isShown = true
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            if (gBoard[i][j].isMine) elCell.innerHTML = MINE
            else if (gBoard[i][j].minesAroundCount !== 0) elCell.innerHTML = gBoard[i][j].minesAroundCount
            elCell.classList.remove('hidden')
        }
    }
}

function hideShown(gBoard, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            gBoard[i][j].isShown = false
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.innerHTML = " "
            elCell.classList.add('hidden')
        }
    }
    console.log('bye bye!')
}

function findAllMines() {
    var mineIdx = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                mineIdx.push({ i: i, j: j })
            }
        }
    }
    return mineIdx
}