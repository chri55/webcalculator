const display = document.querySelector('.displayText');
const buttons = document.querySelectorAll('.button p');

let operands = [];
let currOperand = '';
let operators  = [];
let postFix = [];
let result = null;
let error = false;
let toBeCleared = false;
let decimal = false;
let decimalButton = null;

function add(a, b) {
  return a+b;
}
function subtract(a, b) {
  return a-b;
}
function multiply(a, b) {
  return a*b;
}
function divide(a, b) {
  return a/b;
}

/**
* Handles output based on what button is clicked.
*
* @param e: Event from where this function was called
* @param result: {number} || string with error msg.
*/
function updateDisplay(e, result=null) {
  if (result && !e) {
    if (result == 'Error ZDIV') {
      display.innerHTML = 'Nice try ;)';
      error = true;
      return;
    }
    else if (result == 'Error') {
      display.innerHTML = 'Error, please clear.';
      error = true;
      return;
    }
    display.innerHTML = parseFloat(result).toFixed(2);
    return;
  }
  if (e.target.innerHTML == 'C' || toBeCleared) {
    display.innerHTML = '';
    error = false;
    if (!toBeCleared) {
      return;
    }
  }

  if (e.target.classList == 'num' && !error) {
    display.innerHTML += e.target.innerHTML;
  }
  else if (e.target.classList == 'op' && !error) {
    //display.innerHTML = '';
    display.innerHTML += ' ' + e.target.innerHTML;
  }
}

/**
* Creates postfix notation array to be operated on when the
* user clicks '='
*
* @param e: {Event} from which the function was called.
*/
function operate(e) {
  if (e.target.innerHTML == 'C' || toBeCleared) {
    operands = [];
    currOperand = '';
    operators  = [];
    postFix = [];
    result = null;
    error = false;
    toBeCleared = false;
    if (decimalButton) {
      decimalButton.style.backgroundColor = 'hsla(150, 50%, 30%, 1)';
      decimalButton.childNodes[0].addEventListener('click', run);
    }

  }

  if (error) return;

  if (e.target.innerHTML == '=') {
    if (decimalButton) {
      decimalButton.style.backgroundColor = 'hsla(150, 50%, 30%, 1)';
      decimalButton.childNodes[0].addEventListener('click', run);
    }
    postFix.push(currOperand);
    while (operators.length > 0) {
      postFix.push(operators.pop());
    }
    updateDisplay(null, result=calculateResult());
    toBeCleared = true;
    return;
  }



  if (e.target.classList == 'num') {
    if (e.target.innerHTML == '.') {
      decimalButton = e.target.parentNode;
      decimalButton.style.backgroundColor = 'grey';
      decimalButton.childNodes[0].removeEventListener('click', run);
    }
    currOperand += e.target.innerHTML;
  }
  else if (e.target.classList == 'op') {
    if (decimalButton) {
      decimalButton.style.backgroundColor = 'hsla(150, 50%, 30%, 1)';
      decimalButton.childNodes[0].addEventListener('click', run);
    }
    operands.push(currOperand);
    postFix.push(currOperand);
    currOperand = '';

    const operator = e.target.innerHTML;
    if ("+-".includes(e.target.innerHTML) &&
    "*/".includes(operators[operators.length - 1])) {
      postFix.push(operators.pop());
      operators.push(operator);
    }
    else {
      operators.push(operator);
    }
    //postFix.push(operator);

  }
}

function run(e) {
  updateDisplay(e);
  operate(e);
}

function calculateResult() {
  let stack = [];
  for (var i = 0; i < postFix.length; i++) {
    if ("+-*/".includes(postFix[i]) && i >= 2) {
      let b = stack.pop();
      let a = stack.pop();

      switch(postFix[i]) {
        case '+':
          stack.push(add(a, b));
          break;
        case '-':
          stack.push(subtract(a, b));
          break;
        case '*':
          stack.push(multiply(a, b));
          break;
        case '/':
          if (b == 0) {
            return 'Error ZDIV';
          }
          stack.push(divide(a, b));
          break;
      }
    }
    else if ("+-*/".includes(postFix[i]) && i < 2) {
      return 'Error';
    }
    else {
      stack.push(parseFloat(postFix[i]));
    }
  }
  return stack[0];
}

buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    updateDisplay(e);
    operate(e);
  })
});
