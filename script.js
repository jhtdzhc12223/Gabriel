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
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '0';
            this.shouldResetDisplay = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0') {
            this.currentOperand = number === '.' ? '0.' : number;
        } else {
            this.currentOperand += number;
        }
        
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === '0') return;
        
        if (this.previousOperand !== '' && this.operation && !this.shouldResetDisplay) {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    compute() {
        if (this.operation === undefined || this.previousOperand === '') return;

        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = this.currentOperand ? parseFloat(this.currentOperand) : 0;

        if (isNaN(prev)) return;

        try {
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
                    if (current === 0) {
                        throw new Error('Divisão por zero');
                    }
                    computation = prev / current;
                    break;
                case 'x^y':
                case '^':
                    computation = Math.pow(prev, current);
                    break;
                case 'mod':
                    computation = prev % current;
                    break;
                case 'x²':
                    computation = Math.pow(prev, 2);
                    break;
                case 'x!':
                    computation = this.factorial(Math.floor(prev));
                    break;
                case '√':
                    if (prev < 0) {
                        throw new Error('Raiz de número negativo');
                    }
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

            if (isNaN(computation) || !isFinite(computation)) {
                throw new Error('Operação inválida');
            }

            const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand !== '' ? this.currentOperand : ''}`.trim();
            this.addToHistory(expression, computation);

            this.currentOperand = this.formatResult(computation);
            this.operation = undefined;
            this.previousOperand = '';
            this.shouldResetDisplay = true;

        } catch (error) {
            this.displayError(error.message);
            return;
        }

        this.updateDisplay();
    }

    formatResult(number) {
        if (typeof number !== 'number' || !isFinite(number)) {
            return 'Erro';
        }

        // Para números muito grandes ou muito pequenos, usar notação científica
        if (Math.abs(number) > 1e12 || (Math.abs(number) < 1e-6 && number !== 0)) {
            return number.toExponential(6);
        }

        // Para números inteiros, mostrar sem casas decimais
        if (Number.isInteger(number)) {
            return number.toString();
        }

        // Para números decimais, limitar para 10 casas
        return parseFloat(number.toFixed(10)).toString();
    }

    displayError(message) {
        this.currentOperand = 'Erro';
        this.previousOperand = message;
        this.operation = undefined;
        this.shouldResetDisplay = true;
        this.currentOperandElement.classList.add('error');
        this.updateDisplay();
        
        setTimeout(() => {
            this.currentOperandElement.classList.remove('error');
        }, 2000);
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        this.currentOperandElement.classList.remove('error');

        if (this.operation) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = this.previousOperand;
        }
    }

    setupEventListeners() {
        // Números
        document.querySelectorAll('[data-action="number"]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
            });
        });

        // Operações básicas
        document.querySelectorAll('[data-action="operation"]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.innerText);
            });
        });

        // Igual
        document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
            this.compute();
        });

        // Limpar
        document.querySelector('[data-action="clear"]').addEventListener('click', () => {
            this.clear();
        });

        // Deletar
        document.querySelector('[data-action="delete"]').addEventListener('click', () => {
            this.delete();
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
            } else if (e.key === '+') {
                this.chooseOperation('+');
            } else if (e.key === '-') {
                this.chooseOperation('-');
            } else if (e.key === '*') {
                this.chooseOperation('×');
            } else if (e.key === '/') {
                e.preventDefault();
                this.chooseOperation('÷');
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.compute();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                this.delete();
            } else if (e.key === 'Escape') {
                this.clear();
            }
        });
    }

    setupModeButtons() {
        document.querySelectorAll('.mode-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Atualizar botões de modo
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Esconder todos os modos
                document.querySelectorAll('.buttons:not(.mode-selector)').forEach(mode => {
                    mode.classList.add('hidden');
                });
                
                // Mostrar modo selecionado
                const selectedMode = document.querySelector(`.${button.dataset.mode}-mode`);
                if (selectedMode) {
                    selectedMode.classList.remove('hidden');
                }

                // Mostrar/ocultar histórico baseado no modo
                const historyContainer = document.querySelector('.history-container');
                if (button.dataset.mode === 'basic') {
                    historyContainer.classList.remove('hidden');
                } else {
                    historyContainer.classList.add('hidden');
                }

                this.currentMode = button.dataset.mode;
                this.clear();
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

        const container = document.querySelector('.scientific-mode');
        container.innerHTML = ''; // Limpar container primeiro
        
        // Primeira linha
        const firstRow = document.createElement('div');
        firstRow.className = 'scientific-row';
        firstRow.style.display = 'grid';
        firstRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
        firstRow.style.gap = '1px';
        
        scientificButtons.slice(0, 8).forEach(text => {
            firstRow.appendChild(this.createScientificButton(text));
        });
        
        // Segunda linha
        const secondRow = document.createElement('div');
        secondRow.className = 'scientific-row';
        secondRow.style.display = 'grid';
        secondRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
        secondRow.style.gap = '1px';
        secondRow.style.marginTop = '1px';
        
        scientificButtons.slice(8).forEach(text => {
            secondRow.appendChild(this.createScientificButton(text));
        });

        container.appendChild(firstRow);
        container.appendChild(secondRow);
    }

    createScientificButton(text) {
        const button = document.createElement('button');
        button.innerText = text;
        button.setAttribute('data-action', 'scientific');
        button.addEventListener('click', () => this.handleScientificButton(text));
        return button;
    }

    initializeProgrammerButtons() {
        const programmerButtons = [
            'HEX', 'DEC', 'OCT', 'BIN',
            'AND', 'OR', 'XOR', 'NOT',
            '<<', '>>', 'A', 'B',
            'C', 'D', 'E', 'F'
        ];

        const container = document.querySelector('.programmer-mode');
        container.innerHTML = '';
        
        programmerButtons.forEach((text, index) => {
            if (index % 4 === 0) {
                const row = document.createElement('div');
                row.style.display = 'grid';
                row.style.gridTemplateColumns = 'repeat(4, 1fr)';
                row.style.gap = '1px';
                if (index > 0) row.style.marginTop = '1px';
                container.appendChild(row);
            }
            
            const lastRow = container.lastChild;
            const button = this.createProgrammerButton(text);
            lastRow.appendChild(button);
        });
    }

    createProgrammerButton(text) {
        const button = document.createElement('button');
        button.innerText = text;
        button.setAttribute('data-action', 'programmer');
        button.addEventListener('click', () => this.handleProgrammerButton(text));
        return button;
    }

    handleScientificButton(operation) {
        try {
            let result;
            const current = parseFloat(this.currentOperand);

            if (isNaN(current) && !['π', 'e'].includes(operation)) {
                return;
            }

            switch (operation) {
                case 'sin':
                    result = Math.sin(current * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(current * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(current * Math.PI / 180);
                    break;
                case 'log':
                    if (current <= 0) throw new Error('Log de número não positivo');
                    result = Math.log10(current);
                    break;
                case 'ln':
                    if (current <= 0) throw new Error('Ln de número não positivo');
                    result = Math.log(current);
                    break;
                case '√':
                    if (current < 0) throw new Error('Raiz de número negativo');
                    result = Math.sqrt(current);
                    break;
                case 'x²':
                    result = Math.pow(current, 2);
                    break;
                case 'x^y':
                    this.chooseOperation('x^y');
                    return;
                case 'π':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                case '10^x':
                    result = Math.pow(10, current);
                    break;
                case 'x!':
                    if (current < 0 || !Number.isInteger(current)) {
                        throw new Error('Fatorial requer inteiro não negativo');
                    }
                    result = this.factorial(current);
                    break;
                case 'mod':
                    this.chooseOperation('mod');
                    return;
                case 'EE':
                    this.chooseOperation('EE');
                    return;
                default:
                    return;
            }

            this.addToHistory(`${operation}(${this.currentOperand})`, result);
            this.currentOperand = this.formatResult(result);
            this.shouldResetDisplay = true;
            this.updateDisplay();

        } catch (error) {
            this.displayError(error.message);
        }
    }

    handleProgrammerButton(operation) {
        try {
            let currentValue = parseInt(this.currentOperand) || 0;

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
                case 'OR':
                case 'XOR':
                    this.chooseOperation(operation);
                    return;
                case 'NOT':
                    this.currentOperand = (~currentValue >>> 0).toString(10);
                    break;
                case '<<':
                    this.currentOperand = (currentValue << 1).toString(10);
                    break;
                case '>>':
                    this.currentOperand = (currentValue >> 1).toString(10);
                    break;
                case 'A': case 'B': case 'C': case 'D': case 'E': case 'F':
                    this.appendNumber(operation);
                    return;
                default:
                    return;
            }

            this.updateDisplay();

        } catch (error) {
            this.displayError('Erro de conversão');
        }
    }

    factorial(n) {
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
                <div>${item.expression}</div>
                <div>= ${this.formatResult(parseFloat(item.result))}</div>
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
        const funcStr = this.functionInput.value.trim();
        if (!funcStr) return;
        
        try {
            const func = this.parseFunction(funcStr);
            this.drawGraph(func);
        } catch (error) {
            alert('Erro ao plotar: ' + error.message);
        }
    }

    parseFunction(funcStr) {
        return (x) => {
            try {
                // Substitui 'x' pelo valor numérico e avalia
                const expression = funcStr.replace(/x/g, `(${x})`);
                return eval(expression);
            } catch {
                return NaN;
            }
        };
    }

    drawGraph(func) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Limpar canvas
        this.ctx.fillStyle = '#1E1E1E';
        this.ctx.fillRect(0, 0, width, height);
        
        // Desenhar grade
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        // Grade vertical
        for (let x = 0; x <= width; x += width / 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        // Grade horizontal
        for (let y = 0; y <= height; y += height / 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Eixos
        this.ctx.strokeStyle = '#BB86FC';
        this.ctx.lineWidth = 2;
        
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
        
        // Gráfico
        this.ctx.strokeStyle = '#03DAC6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        const scale = 40;
        let isFirstPoint = true;
        
        for (let pixelX = 0; pixelX <= width; pixelX++) {
            const x = (pixelX - width/2) / scale;
            const y = -func(x) * scale + height/2;
            
            if (isNaN(y) || !isFinite(y)) {
                isFirstPoint = true;
                continue;
            }
            
            if (isFirstPoint) {
                this.ctx.moveTo(pixelX, y);
                isFirstPoint = false;
            } else {
                this.ctx.lineTo(pixelX, y);
            }
        }
        
        this.ctx.stroke();
    }

    clearGraph() {
        this.ctx.fillStyle = '#1E1E1E';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.functionInput.value = '';
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    
    if (previousOperandElement && currentOperandElement) {
        window.calculator = new Calculator(previousOperandElement, currentOperandElement);
    }
});
