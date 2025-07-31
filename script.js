class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.currentMode = 'basic';
        this.memory = 0;
        this.history = [];
        this.clear();
        this.setupEventListeners();
        this.setupModeButtons();
        this.initializeScientificButtons();
        this.initializeProgrammerButtons();
        this.setupMemoryButtons();
        this.setupHistoryButtons();
        this.initGraph();
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
        if (isNaN(prev) return;

        if (isNaN(current) && this.operation !== 'x!' && this.operation !== '10^x') {
            return;
        }

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
            case '^':
            case 'x^y':
                computation = Math.pow(prev, current);
                break;
            case 'mod':
                computation = prev % current;
                break;
            case 'x²':
                computation = Math.pow(prev, 2);
                break;
            case 'x!':
                computation = this.factorial(prev);
                break;
            case '√':
                computation = Math.sqrt(prev);
                break;
            case '10^x':
                computation = Math.pow(10, prev);
                break;
            case 'EE':
                computation = prev * Math.pow(10, current);
                break;
            default:
                return;
        }

        const expression = `${this.previousOperand} ${this.operation || ''} ${this.currentOperand}`;
        this.addToHistory(expression, computation);

        if (String(computation).length > 12) {
            this.currentOperand = computation.toExponential(5);
        } else {
            this.currentOperand = computation.toString();
        }
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    formatNumber(number) {
        if (number === '') return '';
        const num = parseFloat(number);
        if (isNaN(num)) return number;
        
        if (String(num).length > 12) {
            return num.toExponential(5);
        }
        return number;
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

        // Teclado físico
        document.addEventListener('keydown', (e) => {
            if (/[0-9.]/.test(e.key)) {
                this.appendNumber(e.key);
            } else if (/[+\-*/]/.test(e.key)) {
                this.chooseOperation(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                this.compute();
            } else if (e.key === 'Backspace') {
                this.delete();
            } else if (e.key === 'Escape') {
                this.clear();
            }
        });
    }

    setupModeButtons() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        const calculatorModes = document.querySelectorAll('.buttons:not(.mode-selector)');

        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                calculatorModes.forEach(mode => mode.classList.add('hidden'));
                
                const selectedMode = document.querySelector(`.${button.dataset.mode}-mode`);
                if (selectedMode) {
                    selectedMode.classList.remove('hidden');
                }

                this.currentMode = button.dataset.mode;
                this.updateDisplay();
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
        if (isNaN(current) && operation !== 'π' && operation !== 'e') return;

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
                this.operation = 'x²';
                this.previousOperand = this.currentOperand;
                this.compute();
                return;
            case 'x^y':
                this.chooseOperation('x^y');
                return;
            case 'π':
                this.currentOperand = Math.PI.toString();
                break;
            case 'e':
                this.currentOperand = Math.E.toString();
                break;
            case 'x!':
                this.operation = 'x!';
                this.previousOperand = this.currentOperand;
                this.compute();
                return;
            case 'mod':
                this.chooseOperation('mod');
                return;
            case '10^x':
                this.operation = '10^x';
                this.previousOperand = this.currentOperand;
                this.compute();
                return;
            case 'EE':
                this.chooseOperation('EE');
                return;
        }
        
        this.updateDisplay();
    }

    handleProgrammerButton(operation) {
        let currentValue;
        
        try {
            if (this.currentOperand === '') {
                currentValue = 0;
            } else {
                // Tenta determinar a base atual
                if (this.currentOperand.match(/^[0-9]+$/)) {
                    currentValue = parseInt(this.currentOperand, 10);
                } else if (this.currentOperand.match(/^[0-9A-F]+$/)) {
                    currentValue = parseInt(this.currentOperand, 16);
                } else {
                    currentValue = 0;
                }
            }
        } catch {
            currentValue = 0;
        }

        switch(operation) {
            case 'HEX':
                this.currentOperand = currentValue.toString(16).toUpperCase();
                break;
            case 'DEC':
                this.currentOperand = currentValue.toString(10);
                break;
            case 'OCT':
                this.currentOperand = currentValue.toString(8);
                break;
            case 'BIN':
                this.currentOperand = currentValue.toString(2);
                break;
            case 'AND':
                this.chooseOperation('AND');
                break;
            case 'OR':
                this.chooseOperation('OR');
                break;
            case 'XOR':
                this.chooseOperation('XOR');
                break;
            case 'NOT':
                this.currentOperand = (~currentValue >>> 0).toString(10);
                break;
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
                this.appendNumber(operation);
                return;
        }
        
        this.updateDisplay();
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

    setupMemoryButtons() {
        document.querySelector('[data-action="memory-clear"]').addEventListener('click', () => {
            this.memory = 0;
        });

        document.querySelector('[data-action="memory-recall"]').addEventListener('click', () => {
            this.currentOperand = this.memory.toString();
            this.updateDisplay();
        });

        document.querySelector('[data-action="memory-add"]').addEventListener('click', () => {
            const current = parseFloat(this.currentOperand) || 0;
            this.memory += current;
        });

        document.querySelector('[data-action="memory-subtract"]').addEventListener('click', () => {
            const current = parseFloat(this.currentOperand) || 0;
            this.memory -= current;
        });
    }

    addToHistory(expression, result) {
        this.history.unshift({
            expression,
            result: result.toString()
        });
        
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>${item.expression} =</div>
                <div><strong>${this.formatNumber(item.result)}</strong></div>
            `;
            
            historyItem.addEventListener('click', () => {
                this.currentOperand = item.result;
                this.updateDisplay();
            });
            
            historyList.appendChild(historyItem);
        });
    }

    setupHistoryButtons() {
        document.querySelector('[data-action="clear-history"]').addEventListener('click', () => {
            this.history = [];
            this.updateHistoryDisplay();
        });
    }

    initGraph() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.functionInput = document.getElementById('functionInput');
        
        document.querySelector('[data-action="plot"]').addEventListener('click', () => {
            this.plotGraph();
        });
        
        document.querySelector('[data-action="clear-graph"]').addEventListener('click', () => {
            this.clearGraph();
        });
    }

    plotGraph() {
        const funcStr = this.functionInput.value;
        if (!funcStr) return;
        
        try {
            const func = this.parseFunction(funcStr);
            this.drawGraph(func);
        } catch (e) {
            alert('Função inválida: ' + e.message);
        }
    }

    parseFunction(funcStr) {
        // Implementação simplificada - na prática use uma biblioteca como math.js
        return (x) => {
            try {
                return eval(funcStr.replace(/x/g, `(${x})`));
            } catch {
                return NaN;
            }
        };
    }

    drawGraph(func) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);
        
        // Desenhar eixos
        this.ctx.strokeStyle = '#BB86FC';
        this.ctx.lineWidth = 1;
        
        // Eixo X
        this.ctx.beginPath();
        this.ctx.moveTo(0, height/2);
        this.ctx.lineTo(width, height/2);
        this.ctx.stroke();
        
        // Eixo Y
        this.ctx.beginPath();
        this.ctx.moveTo(width/2, 0);
        this.ctx.lineTo(width/2, height);
        this.ctx.stroke();
        
        // Desenhar gráfico
        this.ctx.strokeStyle = '#03DAC6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const scale = 50;
        const step = 0.1;
        
        for (let x = -width/2/scale; x <= width/2/scale; x += step) {
            const y = -func(x) * scale + height/2;
            const px = x * scale + width/2;
            
            if (isNaN(y)) continue;
            
            if (x === -width/2/scale) {
                this.ctx.moveTo(px, y);
            } else {
                this.ctx.lineTo(px, y);
            }
        }
        
        this.ctx.stroke();
    }

    clearGraph() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.functionInput.value = '';
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);
