// if ture the num can be placed in a specific row of the grid
const checkRow = (grid, row, num) => {
  return grid[row].indexOf(num) === -1;
};

// if true the num can be placed in a specific col of the grid
const checkCol = (grid, col, num) => {
  return grid.map(row => row[col]).indexOf(num) === -1;
};

// check if the num can be placed in the box, if yes return true
const checkBox = (grid, row, col, num) => {
  const rowStart = Math.floor(row / 3) * 3;
  const colStart = Math.floor(col / 3) * 3;

  for (let i = rowStart; i < rowStart + 3; i++) {
    for (let j = colStart; j < colStart + 3; j++) {
      if (grid[i][j] === num) {
        return false;
      }
    }
  }
  return true;
};


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  for (let i =1; i < array.length; i++) {
    const j = getRandomNumber(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function generateRandomSudoku() {
  const gridSize = 9;
  const randomGrid = [];

  for (let row = 0; row < gridSize; row++) {
    const newRow = [];
    for (let col = 0; col < gridSize; col++) {
      newRow.push(0);
    }
    randomGrid.push(newRow);
  }

  const values = Array.from({ length: gridSize }, (_, i) => i + 1);

  // recursive function to fill the grid
  const fillGrid = (row, col) => {
    if (row === gridSize) {
      return true;
    }

    const nextRow = col === gridSize - 1 ? row + 1 : row;
    const nextCol = col === gridSize - 1 ? 0 : col + 1;

    shuffleArray(values);

    for (const value of values) {
      if (checkRow(randomGrid, row, value) && checkCol(randomGrid, col, value) && checkBox(randomGrid, row, col, value)) {
        randomGrid[row][col] = value; // adding the value to the input

        // if the grid can be filled from this point, return true
        if (fillGrid(nextRow, nextCol)) {
          return true;
        }
        
        randomGrid[row][col] = 0; // reset the value if the grid can't be filled
      }
    }

    return false; // No valid value can be placed, so we trigger checking loop again
  };

  fillGrid(0, 0); 
  
  const emptyCellProbability = 0.5;
  // Randomly convert some filled cells to empty cells based on probability
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (randomGrid[row][col] !== 0 && Math.random() < emptyCellProbability) {
        randomGrid[row][col] = -1; 
      }
    }
  }
  randomGrid[gridSize-1][gridSize-1] = -1;
  return randomGrid;
}

export const randomSudoku = generateRandomSudoku();