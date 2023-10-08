import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { randomSudoku } from "./GridGenerator";
import { Timer } from "../timer/Timer";
import { login } from "../../features/user";
import "./SudokuBoard.css";

const initialGrid = randomSudoku;

const TheGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getTime = useSelector((state) => state.timer?.time);
  const { userId } = useParams();
  const registrationToken = localStorage.getItem("registrationToken");
  const [isStop, setIsStop] = useState();
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
  const timeExpiration = Date.now() > token?.expiresAt;

  useEffect(() => {
    !token && navigate("/");
    if (isReady.isComplate && isSolved) {
      !isStop && alert("Great, you solved!");
      setIsStop(true);
      buttonRef.current.click(); // Triger getTimeScore function
    }
    if (timeExpiration) {
      alert("Your session has been expired!");
      navigate("/");
    }
  }, [
    isReady.isComplate,
    isSolved,
    isStop,
    navigate,
    registrationToken,
    timeExpiration,
    token,
  ]);

  const getTimeScore = (theTime) => {
    const existingData = JSON.parse(localStorage.getItem("userData"));
    const userTimeScore = existingData[userId]?.timeScore;

    // check for if user has time score and update for the best scored time
    if (
      userTimeScore === undefined ||
      userTimeScore === "" ||
      (theTime < userTimeScore) & (theTime !== "")
    ) {
      theTime && (existingData[userId].timeScore = theTime);
      localStorage.setItem("userData", JSON.stringify(existingData));

      if (
        theTime < "00:00:05" &&
        theTime !== "" &&
        !existingData[userId].discount
      ) {
        existingData[userId].discount = true;
        localStorage.setItem("userData", JSON.stringify(existingData));
        dispatch(login({ arrData: existingData, data: existingData[userId] }));
        alert(
          "You solve it under 1:30min, so you win 20% discount of all products"
        );
      }
    }
  };

  return (
    <div>
      <table>
        <tbody className="sudoku-board">
          <button ref={buttonRef} onClick={getTimeScore(getTime)} />
          <button
            className={!isStop ? "" : "go-back-green"}
            onClick={() => navigate(`/profile/${userId}`)}
          >
            Go back
          </button>
          <Timer isRunning={!isStop} />

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
