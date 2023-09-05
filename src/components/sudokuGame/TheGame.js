import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { randomSudoku } from "./GridGenerator";
import { Timer } from "../timer/Timer";
import "./SudokuBoard.css";

const initialGrid = randomSudoku;

const TheGame = () => {
  const navigate = useNavigate();
  const getTime = useSelector((state) => state.timer?.time);
  const user = useSelector((state) => state.user?.value);
  const registrationToken = localStorage.getItem("registrationToken");
  const [isStop, setIsStop] = useState(true);
  const [isSolved, setIsSolved] = useState(true);
  const buttonRef = useRef(null);

  // create a deep copy of an array
  const getDeepCopy = (arr) => JSON.parse(JSON.stringify(arr));
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initialGrid));

  const onInputChange = (e, row, col) => {
    const value = parseInt(e.target.value) || -1;
    const grid = getDeepCopy(sudokuArr);
    if ((value === -1) | (value >= 1) && value <= 9) {
      grid[row][col] = value;
    }
    setSudokuArr(grid); // update the value in the grid
  };

  const checkRow = (grid, row, num) => {
    return grid[row].indexOf(num) === -1;
  };

  const checkCol = (grid, col, num) => {
    return grid.map((row) => row[col]).indexOf(num) === -1;
  };

  const checkBox = (grid, row, col, num) => {
    let boxArr = [],
      rowStart = row - (row % 3),
      colStart = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxArr.push(grid[rowStart + i][colStart + j]);
      }
    }
    return boxArr.indexOf(num) === -1;
  };

  const checkValid = (grid, row, col, num) => {
    if (
      checkRow(grid, row, num) &&
      checkCol(grid, col, num) &&
      checkBox(grid, row, col, num)
    ) {
      return true;
    }
    return false;
  };

  // move to the next row or column if they are not the last ones.
  const getNext = (row, col) => {
    return col !== 8 ? [row, col + 1] : row !== 8 ? [row + 1, 0] : [0, 0];
  };

  // recursive function to solve the game
  const solver = (grid, row = 0, col = 0) => {
    if (grid[row][col] !== -1) {
      //check if it's last cell
      let isLast = row >= 8 && col >= 8;
      if (!isLast) {
        let [newRow, newCol] = getNext(row, col);
        return solver(grid, newRow, newCol);
      }
    }
    // try to add a valid number to the cell
    for (let num = 1; num <= 9; num++) {
      if (checkValid(grid, row, col, num)) {
        grid[row][col] = num;
        let [newRow, newCol] = getNext(row, col);

        if (!newRow && !newCol) {
          return true;
        }
        if (solver(grid, newRow, newCol)) {
          return true;
        }
      }
    }
    //if number not valid, set the cell to -1
    grid[row][col] = -1;
    return false;
  };

  const compareSudokus = (currentSudoku, solvedSudoku) => {
    const res = {
      isComplate: true,
      isSolvable: true,
    };
    // Compare each cell of the grids
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentSudoku[i][j] !== solvedSudoku[i][j]) {
          if (currentSudoku[i][j] !== -1) {
            res.isSolvable = false;
          }
          res.isComplate = false;
        }
      }
    }
    return res;
  };

  const checkSudoku = () => {
    let sudoku = getDeepCopy(initialGrid);
    solver(sudoku);
    const compare = compareSudokus(sudokuArr, sudoku);

    if (compare.isComplate) {
      alert("It's solved!");
    } else if (compare.isSolvable) {
      alert("Keep going!");
    } else {
      alert("Failed, try again");
    }
  };

  const solveSudoku = () => {
    setIsSolved(false);
    let sudoku = getDeepCopy(initialGrid);
    solver(sudoku);
    setSudokuArr(sudoku); // update grid state
  };

  const resetSudoku = () => {
    setIsSolved(true);
    let sudoku = getDeepCopy(initialGrid);
    setSudokuArr(sudoku); // update grid to initial one
  };

  let sudoku = getDeepCopy(initialGrid);
  solver(sudoku);
  const isReady = compareSudokus(sudokuArr, sudoku);
  const token = JSON.parse(registrationToken);
  const timeExpiration = Date.now() > token.expiresAt;

  useEffect(() => {
    if (isReady.isComplate && isSolved) {
      setIsStop(false);
      buttonRef.current.click(); // Triger getTimeScore function
      alert("Great, you solved!");
    }
    if (timeExpiration) {
      alert("Your session has been expired!");
      navigate("/");
    }
  }, [isReady.isComplate, isSolved, navigate, registrationToken, timeExpiration]);

  const getTimeScore = (theTime) => {
    const existingData = JSON.parse(localStorage.getItem("userData"));
    const userId = existingData.findIndex((data) => data?.name === user?.name);
      // check for if user has time score and update for the best scored time
      if (
        existingData[userId]?.timeScore > theTime ||
        existingData[userId]?.timeScore === '' ||
        !existingData[userId]?.timeScore
      ) {
        existingData[userId].timeScore = theTime;
        localStorage.setItem("userData", JSON.stringify(existingData));
      }
  };

  return (
    <div>
      <table>
        <tbody className="sudoku-board">
          <button ref={buttonRef} onClick={getTimeScore(getTime)} />
          <button
            className={isStop ? "" : "go-back-green"}
            onClick={() => navigate("/profile")}
          >
            Go back
          </button>
          <Timer isRunning={isStop} />

          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={(row + 1) % 3 === 0 ? "bRow row" : "row"}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={(col + 1) % 3 === 0 ? "rCell cell" : "cell"}
                >
                  <input
                    onChange={(e) => onInputChange(e, row, col)}
                    value={
                      sudokuArr[row][col] === -1 ? "" : sudokuArr[row][col]
                    }
                    className="cell"
                    disabled={initialGrid[row][col] !== -1}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-container">
        <button className="check-button" onClick={checkSudoku}>
          Check
        </button>
        <button className="solve-button" onClick={solveSudoku}>
          Solve
        </button>
        <button className="reset-button" onClick={resetSudoku}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default TheGame;
