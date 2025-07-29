class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.setupEventListeners();
        this.setupModeButtons();
        this.initializeScientificButtons();
        this.initializeProgrammerButtons();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupEventListeners() {
        const numberButtons = document.querySelectorAll('[data-action="number"]');
        const operationButtons = document.querySelectorAll('[data-action="operation"]');
        const equalsButton = document.querySelector('[data-action="calculate"]');
        const deleteButton = document.querySelector('[data-action="delete"]');
        const clearButton = document.querySelector('[data-action="clear"]');

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.innerText);
            });
        });

        equalsButton.addEventListener('click', () => {
            this.compute();
        });

        clearButton.addEventListener('click', () => {
            this.clear();
        });

        deleteButton.addEventListener('click', () => {
            this.delete();
        });
    }

    setupModeButtons() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        const calculatorModes = document.querySelectorAll('.buttons:not(.mode-selector)');

        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                modeButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Hide all calculator modes
                calculatorModes.forEach(mode => mode.classList.add('hidden'));
                
                // Show selected mode
                const selectedMode = document.querySelector(`.${button.dataset.mode}-mode`);
                if (selectedMode) {
                    selectedMode.classList.remove('hidden');
                }
            });
        });
    }

    initializeScientificButtons() {
        const scientificButtons = [
            'sin', 'cos', 'tan', 'log',
            'ln', '√', 'x²', 'x^y',
            'π', 'e', '(', ')',
            '10^x', 'x!', 'mod', 'EE'
        ];

        const scientificContainer = document.querySelector('.scientific-mode');
        
        // Clear existing buttons (keeping the first 20 which are basic)
        while (scientificContainer.children.length > 0) {
            scientificContainer.removeChild(scientificContainer.lastChild);
        }

        // Add scientific buttons
        scientificButtons.forEach(text => {
            const button = document.createElement('button');
            button.innerText = text;
            button.setAttribute('data-action', 'scientific');
            scientificContainer.appendChild(button);
            
            button.addEventListener('click', () => {
                this.handleScientificButton(text);
            });
        });
    }

    initializeProgrammerButtons() {
        const programmerButtons = [
            'HEX', 'DEC', 'OCT', 'BIN',
            'AND', 'OR', 'XOR', 'NOT',
            '<<', '>>', 'NAND', 'NOR',
            'XNOR', 'A', 'B', 'C',
            'D', 'E', 'F', 'RoL',
            'RoR', '~', '|', '^'
        ];

        const programmerContainer = document.querySelector('.programmer-mode');
        
        // Clear existing buttons
        while (programmerContainer.children.length > 0) {
            programmerContainer.removeChild(programmerContainer.lastChild);
        }

        // Add programmer buttons
        programmerButtons.forEach(text => {
            const button = document.createElement('button');
            button.innerText = text;
            button.setAttribute('data-action', 'programmer');
            programmerContainer.appendChild(button);
            
            button.addEventListener('click', () => {
                this.handleProgrammerButton(text);
            });
        });
    }

    handleScientificButton(operation) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        switch (operation) {
            case 'sin':
                this.currentOperand = Math.sin(current * Math.PI / 180).toString();
                break;
            case 'cos':
                this.currentOperand = Math.cos(current * Math.PI / 180).toString();
                break;
            case 'tan':
                this.currentOperand = Math.tan(current * Math.PI / 180).toString();
                break;
            case 'log':
                this.currentOperand = Math.log10(current).toString();
                break;
            case 'ln':
                this.currentOperand = Math.log(current).toString();
                break;
            case '√':
                this.currentOperand = Math.sqrt(current).toString();
                break;
            case 'x²':
                this.currentOperand = Math.pow(current, 2).toString();
                break;
            case 'x^y':
                this.operation = '^';
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                break;
            case 'π':
                this.currentOperand = Math.PI.toString();
                break;
            case 'e':
                this.currentOperand = Math.E.toString();
                break;
            case 'x!':
                this.currentOperand = this.factorial(current).toString();
                break;
            case 'mod':
                this.operation = 'mod';
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
                break;
            // Add more scientific operations as needed
        }
        
        this.updateDisplay();
    }

    handleProgrammerButton(operation) {
        // Implement programmer functions here
        console.log('Programmer function:', operation);
        // This would handle binary, hex, octal operations, bitwise operations, etc.
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);
