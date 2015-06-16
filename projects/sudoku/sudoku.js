var matrix = new Array(9)
var trivial = new Array(9)
var helperOn = false
var lastHighlight = ""

function genMatrix() {
    var matrix = new Array(9);
    for (var y = 0; y < 9; ++y) {
        matrix[y] = new Array(9)
        for (var x = 0; x < 9; ++x) {
            matrix[y][x] = ""
        }
    }
    return matrix
}    

function genBoard() {
    matrix = genMatrix()
    trivial = genMatrix()
    
    var result = "<table class='t'>";
    
    for (var a = 0; a < 3; ++a) {
        result += "<tr>"
        for (var b = 0; b < 3; ++b) {
            result += "<td><table class='x'>"
            for (var c = 0; c < 3; ++c) {
                result += "<tr>"
                for (var d = 0; d < 3; ++d) {
                    var cid = getCellId(a*3+c, b*3+d) 
                    result += "<td>"
                    result += "<input id='" + cid + "' class='x' type='text' maxlength='1' onfocus='helperRun(" + (a*3+c) + "," + (b*3+d) + ")' onkeyup='validate(" + (a*3+c) + "," + (b*3+d) + "); helperRun(" + (a*3+c) + "," + (b*3+d) + ")'></input>"
                    result += "</td>"
                }
                result += "</tr>"
            }
            result += "</table></td>"
        }
        result += "</tr>"
    }

    result += "</table>"
    board.innerHTML = result

    setTestBoard()
}

function genHelperBoard() {
    result = "<table class='t'><th><td>"
    result += "<table class='x'><th>"
    for (var i=1; i<=9; ++i) {
        result += "<td>"
        result += "<input id='h" + i + "' class='x h' readonly='readonly' type='text' maxlength='1' value='" + i + "' onfocus='showBoardHighlight(" + i + "); clearPossibleValues(" + i + "); showTrivial()'></input>"
        result += "</td>"
    }
    result += "</th></table>"                
    result += "</td></th></table>"
    
    return result
}    


function clearBoard() {
    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            document.getElementById(getCellId(y, x)).value = ""
            matrix[y][x] = ""
        }
    }
    
    statusBar.innerText = ""
}

function getCellId(y, x) {
    return ("y" + y + "x" + x)
}

function validate(y, x) {
    var v = document.getElementById(getCellId(y, x)).value
    if (matrix[y][x] == v) return true
    
    if ((v != "") && ((v < "1") || (v > "9"))) return invalidate(y, x, "You can leave it empty or you must put number between 1 and 9")

    if (v != "") {
        for (var i = 0; i < 9; ++i) {
            if (matrix[y][i] == v) return invalidate(y, x, "Value " + v + " is already present in this row", y, i) 
            if (matrix[i][x] == v) return invalidate(y, x, "Value " + v + " is already present in this column", i, x)
        }
    
        var y0 = Math.floor(y / 3) * 3
        var x0 = Math.floor(x / 3) * 3
    
        for (var j = 0; j < 3; ++j) {
            for (var i = 0; i < 3; ++i) {
                if (matrix[y0 + j][x0 + i] == v) return invalidate(y, x, "Value " + v + " is already present in this square", y0 + j, x0 + i)
            }
        }
    }
    
    matrix[y][x] = v
    return true 
}

function invalidate(y, x, msg, y1, x1) {
    var elm = document.getElementById(getCellId(y, x))
    var elm1 = document.getElementById(getCellId(y1, x1))

    var bc = elm.style.backgroundColor
    var c = elm.style.color 
    elm.style.backgroundColor = "red"
    elm.style.color = "white"

    var bc1 = elm1.style.backgroundColor
    var c1 = elm1.style.color 
    elm1.style.backgroundColor = "black"
    elm1.style.color = "white"

    alert(msg)

    elm.style.backgroundColor = bc
    elm.style.color = c
    elm1.style.backgroundColor = bc1
    elm1.style.color = c1
    
    elm.value = matrix[y][x]
    elm.focus()
    return false;     
}

function setTestBoard() {
    var testBoard = [
        [0,0,0, 0,0,0, 0,6,0],
        [2,8,0, 0,0,0, 0,0,4],
        [0,0,7, 0,0,5, 8,0,0],
    
        [5,0,0, 3,4,0, 0,2,0],
        [4,0,0, 5,0,1, 0,0,8],
        [0,1,0, 0,7,6, 0,0,3],
    
        [0,0,5, 1,0,0, 2,0,0],
        [3,0,0, 0,0,0, 0,8,1],
        [0,9,0, 0,0,0, 0,0,0]
    ]

    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            setValue(y, x, testBoard[y][x]);
        }
    }
}

function setValue(y, x, v) {
    document.getElementById(getCellId(y, x)).value = (v==0?"":v);
    validate(y, x)
}

function flipHelper() {
    helperOn = !helperOn
    helperButton.value = helperOn?"Helper Off":"Helper On"

    if (helperOn) {
        helpboard.innerHTML = genHelperBoard()
        showTrivial()
    } else {
        helpboard.innerHTML = ""
        clearBoardHighlight()
    } 
}

function helperRun(y, x) {
    if (helperOn) {
        if (matrix[y][x] == "") {
            if (trivial[y][x] == "") {
                showPossibleValues(y, x)
            } else {
                showPossibleValues(y, x, trivial[y][x])
            }
        } else {
            showBoardHighlight(matrix[y][x])
            clearPossibleValues()
        }
        showTrivial()
    }
}

function clearBoardHighlight() {
    lastHighlight = ""
    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            var elm = document.getElementById(getCellId(y, x))
            elm.className = "x normal"
        }
    }
}
 
function clearPossibleValues(v) {
    for (var i = 1; i <= 9; ++i) {
        var elm = document.getElementById("h" + i)
        elm.style.color = i==v?"black":"#BFBFBF"
    }
}

function showPossibleValues(y, x, k) {
    var possibleValues
    
    if (k) {
        possibleValues = new Array(9)
    } else {
        possibleValues = getPossibleValues(y, x)
    }
    
    for (var i = 1; i <= 9; ++i) {
        var elm = document.getElementById("h" + i)
        elm.style.color = (i==k || possibleValues[i - 1])?"black":"#BFBFBF"
    }
}

function getPossibleValues(y, x) {
    var result = new Array(9)
    for (var i = 1; i <= 9; ++i) {
        result[i - 1] = true 
    }
    
    var v = matrix[y][x]
    for (var i = 0; i < 9; ++i) {
        discard(result, matrix[y][i])
        discard(result, matrix[i][x])
    }
    
    var y0 = Math.floor(y / 3) * 3
    var x0 = Math.floor(x / 3) * 3

    for (var j = 0; j < 3; ++j) {
        for (var i = 0; i < 3; ++i) {
            discard(result, matrix[y0 + j][x0 + i])
        }
    }
    
    return result 
}

function discard(possibleValues, value) {
    if (value != "") possibleValues[value - 1] = false
}

function showBoardHighlight(v) {
    lastHighlight = v
    var possiblePlaces = getPossiblePlaces(v)
    
    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            var elm = document.getElementById(getCellId(y, x))
            elm.className = "x " + (possiblePlaces[y][x]?"normal":(matrix[y][x]==v?"highlight":"grayout")) 
        }
    }

    for (var i = 1; i <= 9; ++i) {
        var elm = document.getElementById("h" + i)
        elm.className = "x h " + (v==i?"highlight":"normal")
    }
}

function getPossiblePlaces(v) {
    var result = new Array(9)
    
    for (var y = 0; y < 9; ++y) {
        result[y] = new Array(9)
        for (var x = 0; x < 9; ++x) {
            result[y][x] = matrix[y][x] == ""
        }
    }
    
    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            if (matrix[y][x] == v) {
                for (var i = 0; i < 9; ++i) {
                    result[y][i] = false
                    result[i][x] = false
                }

                var y0 = Math.floor(y / 3) * 3
                var x0 = Math.floor(x / 3) * 3
            
                for (var j = 0; j < 3; ++j) {
                    for (var i = 0; i < 3; ++i) {
                        result[y0 + j][x0 + i] = false
                    }
                }
            }
            
        }
    }

    return result
}

function solve() {
    var tt = - new Date().getTime()
    if (findSolution(0, 0)) {
        tt += new Date().getTime()
        
        for (var y = 0; y < 9; ++y) {
            for (var x = 0; x < 9; ++x) {
                setValue(y, x, matrix[y][x]);
            }
        }
        
        statusBar.innerText = "Solved in " + tt + " ms."
    } else {
        alert("No solution found!")
    }
}

function findSolution(y, x) {
    if (y >= 9) {
        return true
    } else {
        var x1 = x>=8 ? 0 : x+1;
        var y1 = x1==0 ? y+1 : y;
        
        if (matrix[y][x] == "") {
            for (var k=1; k<=9; ++k) if (isLegal(y, x, k)) {
                matrix[y][x] = k
                if (findSolution(y1, x1)) return true
                matrix[y][x] = ""
            }
            
            return false
        } else {
            return findSolution(y1, x1)
        }
    }
}

function isLegal(y, x, k) {
    var x0 = Math.floor(x/3) * 3
    var y0 = Math.floor(y/3) * 3
        
    for (var i = 0; i < 9; ++i) {
        if ((matrix[i][x] == k) || (matrix[y][i] == k)
                || (matrix[y0 + Math.floor(i / 3)][x0 + i % 3] == k))
            return false
    }
        
    return true
}

function showTrivial() {
    trivial = genMatrix()

    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            if (matrix[y][x] == "") {
                var onlyPossibleValue = getSingle(getPossibleValues(y, x)) + 1
                if (onlyPossibleValue > 0) {
                    setTrivial(y, x, onlyPossibleValue)
                }
            }
        }
    }

    for (var i = 0; i < 9; ++i) {
        var x0 = Math.floor(i / 3) * 3
        var y0 = (i % 3) * 3
                
        for (var k = 1; k <= 9; ++k) {
            var cx = 0, cy = 0, cz = 0
            var x1 = 0, y1 = 0, z1 = 0
 
            for (var j = 0; j < 9; ++j) {
                if ((matrix[j][i] == "") && (isLegal(j, i, k))) {
                    ++cy
                    y1 = j
                }
                
                if ((matrix[i][j] == "") && (isLegal(i, j, k))) {
                    ++cx
                    x1 = j
                }
                
                if ((matrix[y0 + Math.floor(j / 3)][x0 + j % 3] == "") && 
                   (isLegal(y0 + Math.floor(j / 3), x0 + j % 3, k))) {
                    
                    ++cz
                    z1 = j
                }
                
            }
            
            if (cy == 1) setTrivial(y1, i, k)
            if (cx == 1) setTrivial(i, x1, k)
            if (cz == 1) setTrivial(y0 + Math.floor(z1 / 3), x0 + z1 % 3, k)
        }
    }
}

function getSingle(a) {
    var v = -1;
    for (var i = 0; i < a.length; ++i) {
        if (a[i]) {
            if (v == -1) {
                v = i
            } else {
                return -1;
            }
        }
    }
    return v;
}

function setTrivial(y, x, k) {
    var elm = document.getElementById(getCellId(y, x))
    elm.className = "x trivial"
    trivial[y][x] = k 
}

function solveTrivial() {
    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            if (trivial[y][x] != "") {
                setValue(y, x, trivial[y][x]) 

                var elm = document.getElementById(getCellId(y, x))
                elm.className = lastHighlight==trivial[y][x]?"x highlight":"x grayout"
            }
        }
    }
    showTrivial()
}

function saveBoard() {
    result = ""
    
    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            result += matrix[y][x]==""?0:matrix[y][x]
        }
        if (y < 8) result += '\n'
    }
    
    storage.value = result
}

function loadBoard() {
    clearBoard()
    flipHelper()    

    for (var y = 0; y < 9; ++y) {
        for (var x = 0; x < 9; ++x) {
            var k = storage.value[y*10+x]
            if (k > 0) setValue(y, x, k)
        }
    }

    flipHelper()    
}

