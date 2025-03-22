

// Step 1: Select key elements from the DOM
const inputValue = document.getElementById('user-input'); // Display element
const numberButtons = document.querySelectorAll('.numbers'); // Number buttons (0-9, .)
const operationButtons = document.querySelectorAll('.operator'); // Operation buttons (AC, DEL, %, /, *, -, +, =)

// Step 2: Define variables for state management
let currentInput = '0'; // Current input displayed on the screen
let previousInput = ''; // Previous input for calculations
let selectedOperation = null; // Selected operation (+, -, *, /)

// Step 3: Write utility functions
function updateDisplay() {
  inputValue.innerText = currentInput; // Update the display with the current input
}

function clearCalculator() {
  currentInput = '0'; // Reset current input
  previousInput = ''; // Reset previous input
  selectedOperation = null; // Reset selected operation
  updateDisplay(); // Update the display
}

function deleteLastCharacter() {
  currentInput = currentInput.slice(0, -1); // Remove the last character
  if (currentInput === '') {
      currentInput = '0'; // Reset to "0" if the display is empty
  }
  updateDisplay(); // Update the display
}

function performCalculation() {
  const expression = currentInput; // Get the current input as the expression
    const operators = ['+', '-', '*', '/', '%']; // Supported operators

    // Split the expression into numbers and operators
    const tokens = expression.split(/([\+\-\*\/%])/).filter(token => token.trim() !== '');

    // Initialize the result with the first number
    let result = parseFloat(tokens[0]);

    // Define an object that maps operators to their corresponding functions
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => {
            if (b === 0) return 'Error'; // Handle divide-by-zero
            return a / b;
        },
        '%': (a, b) => a % b,
    };

    // Iterate through the tokens and perform the calculations
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = parseFloat(tokens[i + 1]);

        if (isNaN(nextNumber)) {
            currentInput = 'NaN'; // Handle invalid numbers
            updateDisplay();
            return;
        }

        // Check if the operator exists in the operations object
        if (operations[operator]) {
            const operationResult = operations[operator](result, nextNumber);
            if (operationResult === 'Error') {
                currentInput = 'Error'; // Handle divide-by-zero error
                updateDisplay();
                return;
            }
            result = operationResult; // Update the result
        } else {
            currentInput = 'NaN'; // Handle invalid operators
            updateDisplay();
            return;
        }
    }

    // Update the display with the result
    currentInput = result.toString();
    updateDisplay();

}

// Step 4: Define button handlers
function handleNumberInput(number) {
  if (number === '.' && currentInput.includes('.')) return; // Prevent multiple decimals
  if (currentInput === '0' && number !== '.') {
      currentInput = number.toString(); // Replace '0' with the new number
  } else {
      currentInput += number.toString(); // Concatenate the current input with the new number
  }
  updateDisplay(); // Update the display
}

function handleOperationInput(operation) {
  const lastChar = currentInput.slice(-1); // Get the last character in the display

  // Handle AC (All Clear)
  if (operation === 'AC') {
      clearCalculator();
  }

  // Handle DEL (Delete)
  else if (operation === 'DEL') {
      deleteLastCharacter();
  }

  // Handle = (Calculate)
  else if (operation === '=') {
      performCalculation();
  }

  // Handle operators (+, -, *, /, %)
  else if (['+', '-', '*', '/', '%'].includes(operation)) {
      if (!isNaN(lastChar)) { // Only add an operator if the last character is a number
          currentInput += operation;
          updateDisplay(); // Update the display
      }
  }
}

// Step 5: Add event listeners
// Add event listeners to number buttons
numberButtons.forEach(button => {
  button.addEventListener('click', () => handleNumberInput(button.innerText));
});

// Add event listeners to operation buttons
operationButtons.forEach(button => {
  button.addEventListener('click', () => handleOperationInput(button.innerText.trim()));
});