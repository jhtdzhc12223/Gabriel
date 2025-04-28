// NexusCalc - Advanced Scientific Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Calculator state
    const state = {
        currentValue: '0',
        previousValue: null,
        operation: null,
        memory: 0,
        isSecondFunction: false,
        isRadians: true,
        history: [],
        lastOperation: null
    };

    // DOM elements
    const mainDisplay = document.getElementById('main-display');
    const secondaryDisplay = document.getElementById('secondary-display');
    const memoryDisplay = document.getElementById('memory-display');
    const terminalOutput = document.getElementById('terminal-output');
    
    // Particle system for background effects
    initParticles();
    
    // Event listeners for all buttons
    document.querySelectorAll('.num-btn').forEach(button => {
        button.addEventListener('click', () => handleNumberInput(button.dataset.num));
    });
    
    document.querySelectorAll('.op-btn').forEach(button => {
        button.addEventListener('click', () => handleOperation(button.dataset.op));
    });
    
    document.querySelectorAll('.func-btn').forEach(button => {
        button.addEventListener('click', () => handleFunction(button.dataset.func));
    });
    
    document.querySelectorAll('.clear-btn').forEach(button => {
        button.addEventListener('click', () => handleClear(button.dataset.clear));
    });
    
    document.querySelectorAll('.mode-btn').forEach(button => {
        button.addEventListener('click', () => switchMode(button.dataset.mode));
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Update display
    updateDisplay();
    
    // Terminal initialization
    addTerminalMessage("> NexusCalc v3.14 inicializado");
    addTerminalMessage("> Sistema operacional: WebOS");
    addTerminalMessage("> CPU: Quantum 8-core @ 5.2GHz");
    addTerminalMessage("> Memória: 16GB DDR6");
    addTerminalMessage("> Pronto para cálculos complexos");
    
    // Core calculator functions
    function handleNumberInput(num) {
        if (state.currentValue === '0' && num !== '.') {
            state.currentValue = num;
        } else if (num === '.' && state.currentValue.includes('.')) {
            // Only allow one decimal point
            return;
        } else {
            state.currentValue += num;
        }
        
        // Limit display length
        if (state.currentValue.length > 15) {
            state.currentValue = state.currentValue.slice(0, 15);
            addTerminalMessage("> Aviso: Limite de dígitos excedido. Truncando valor.");
        }
        
        updateDisplay();
    }
    
    function handleOperation(op) {
        if (op === '±') {
            state.currentValue = (parseFloat(state.currentValue) * -1).toString();
            updateDisplay();
            return;
        }
        
        if (op === '=') {
            if (state.operation && state.previousValue !== null) {
                calculate();
                state.operation = null;
            }
        } else {
            if (state.currentValue !== '0') {
                if (state.operation && state.previousValue !== null) {
                    calculate();
                }
                state.previousValue = state.currentValue;
                state.currentValue = '0';
            }
            state.operation = op;
        }
        
        updateDisplay();
    }
    
    function handleFunction(func) {
        let result;
        const value = parseFloat(state.currentValue);
        
        switch(func) {
            case 'second':
                state.isSecondFunction = !state.isSecondFunction;
                updateFunctionButtons();
                addTerminalMessage(`> Funções secundárias ${state.isSecondFunction ? 'ativadas' : 'desativadas'}`);
                return;
                
            case 'sin':
                result = Math.sin(state.isRadians ? value : toRadians(value));
                if (state.isSecondFunction) result = Math.asin(value);
                break;
                
            case 'cos':
                result = Math.cos(state.isRadians ? value : toRadians(value));
                if (state.isSecondFunction) result = Math.acos(value);
                break;
                
            case 'tan':
                result = Math.tan(state.isRadians ? value : toRadians(value));
                if (state.isSecondFunction) result = Math.atan(value);
                break;
                
            case 'sinh':
                result = Math.sinh(value);
                if (state.isSecondFunction) result = Math.asinh(value);
                break;
                
            case 'cosh':
                result = Math.cosh(value);
                if (state.isSecondFunction) result = Math.acosh(value);
                break;
                
            case 'tanh':
                result = Math.tanh(value);
                if (state.isSecondFunction) result = Math.atanh(value);
                break;
                
            case 'log':
                result = Math.log10(value);
                if (state.isSecondFunction) result = Math.pow(10, value);
                break;
                
            case 'ln':
                result = Math.log(value);
                if (state.isSecondFunction) result = Math.exp(value);
                break;
                
            case 'exp':
                result = Math.exp(value);
                break;
                
            case 'pi':
                result = Math.PI;
                break;
                
            case 'e':
                result = Math.E;
                break;
                
            case '^':
                result = Math.pow(parseFloat(state.previousValue || '0'), value);
                break;
                
            case '√':
                result = Math.sqrt(value);
                if (state.isSecondFunction) result = Math.pow(value, 2);
                break;
                
            case '!':
                result = factorial(value);
                break;
                
            case 'abs':
                result = Math.abs(value);
                break;
                
            case 'floor':
                result = Math.floor(value);
                break;
                
            case 'ceil':
                result = Math.ceil(value);
                break;
                
            case 'rand':
                result = Math.random();
                break;
                
            case 'mod':
                result = parseFloat(state.previousValue || '0') % value;
                break;
                
            case 'gcd':
                result = gcd(parseFloat(state.previousValue || '0'), value);
                break;
                
            case 'lcm':
                result = lcm(parseFloat(state.previousValue || '0'), value);
                break;
                
            case '10^x':
                result = Math.pow(10, value);
                break;
                
            case 'deg':
                state.isRadians = !state.isRadians;
                addTerminalMessage(`> Modo ângulo: ${state.isRadians ? 'Radianos' : 'Graus'}`);
                return;
                
            case 'mem-clear':
                state.memory = 0;
                addTerminalMessage("> Memória limpa");
                break;
                
            case 'mem-recall':
                result = state.memory;
                break;
                
            case 'mem-add':
                state.memory += parseFloat(state.currentValue);
                addTerminalMessage(`> Valor adicionado à memória: ${state.currentValue}`);
                break;
                
            case 'mem-sub':
                state.memory -= parseFloat(state.currentValue);
                addTerminalMessage(`> Valor subtraído da memória: ${state.currentValue}`);
                break;
                
            case 'bin':
                result = parseInt(state.currentValue).toString(2);
                addTerminalMessage(`> Conversão para binário: ${result}`);
                break;
                
            case 'hex':
                result = parseInt(state.currentValue).toString(16).toUpperCase();
                addTerminalMessage(`> Conversão para hexadecimal: ${result}`);
                break;
                
            case 'oct':
                result = parseInt(state.currentValue).toString(8);
                addTerminalMessage(`> Conversão para octal: ${result}`);
                break;
                
            default:
                return;
        }
        
        if (result !== undefined) {
            state.lastOperation = {
                function: func,
                input: state.currentValue,
                output: result.toString(),
                isSecond: state.isSecondFunction
            };
            
            state.history.push(state.lastOperation);
            state.currentValue = result.toString();
            state.isSecondFunction = false;
            updateFunctionButtons();
            updateDisplay();
        }
    }
    
    function handleClear(clearType) {
        if (clearType === 'C') {
            state.currentValue = '0';
            state.previousValue = null;
            state.operation = null;
            addTerminalMessage("> Calculadora reiniciada");
        } else if (clearType === 'CE') {
            state.currentValue = '0';
        }
        updateDisplay();
    }
    
    function calculate() {
        let result;
        const prev = parseFloat(state.previousValue);
        const current = parseFloat(state.currentValue);
        
        switch(state.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        state.lastOperation = {
            operation: state.operation,
            operand1: prev,
            operand2: current,
            result: result
        };
        
        state.history.push(state.lastOperation);
        state.currentValue = result.toString();
        state.previousValue = null;
        
        // Add to terminal
        addTerminalMessage(`> Cálculo: ${prev} ${state.operation} ${current} = ${result}`);
    }
    
    function updateDisplay() {
        mainDisplay.textContent = state.currentValue;
        
        if (state.operation && state.previousValue !== null) {
            secondaryDisplay.textContent = `${state.previousValue} ${state.operation}`;
        } else {
            secondaryDisplay.textContent = '';
        }
        
        memoryDisplay.textContent = state.memory !== 0 ? `MEM: ${state.memory}` : '';
    }
    
    function updateFunctionButtons() {
        document.querySelectorAll('.func-btn').forEach(btn => {
            if (state.isSecondFunction) {
                // Show second functions
                switch(btn.dataset.func) {
                    case 'sin': btn.textContent = 'sin⁻¹'; break;
                    case 'cos': btn.textContent = 'cos⁻¹'; break;
                    case 'tan': btn.textContent = 'tan⁻¹'; break;
                    case 'sinh': btn.textContent = 'sinh⁻¹'; break;
                    case 'cosh': btn.textContent = 'cosh⁻¹'; break;
                    case 'tanh': btn.textContent = 'tanh⁻¹'; break;
                    case 'log': btn.textContent = '10^x'; break;
                    case 'ln': btn.textContent = 'e^x'; break;
                    case '√': btn.textContent = 'x²'; break;
                    default: break;
                }
            } else {
                // Show primary functions
                switch(btn.dataset.func) {
                    case 'sin': btn.textContent = 'sin'; break;
                    case 'cos': btn.textContent = 'cos'; break;
                    case 'tan': btn.textContent = 'tan'; break;
                    case 'sinh': btn.textContent = 'sinh'; break;
                    case 'cosh': btn.textContent = 'cosh'; break;
                    case 'tanh': btn.textContent = 'tanh'; break;
                    case 'log': btn.textContent = 'log'; break;
                    case 'ln': btn.textContent = 'ln'; break;
                    case '√': btn.textContent = '√x'; break;
                    default: break;
                }
            }
        });
    }
    
    function switchMode(mode) {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // In a full implementation, this would switch calculator modes
        addTerminalMessage(`> Modo alterado para: ${mode.toUpperCase()}`);
    }
    
    function handleKeyboardInput(e) {
        const key = e.key;
        
        if (/[0-9]/.test(key)) {
            handleNumberInput(key);
        } else if (key === '.') {
            handleNumberInput('.');
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            handleOperation(key);
        } else if (key === 'Enter' || key === '=') {
            handleOperation('=');
        } else if (key === 'Escape') {
            handleClear('C');
        } else if (key === 'Backspace') {
            state.currentValue = state.currentValue.slice(0, -1) || '0';
            updateDisplay();
        } else if (key === 'm') {
            handleFunction('mem-add');
        } else if (key === 'r') {
            handleFunction('mem-recall');
        } else if (key === 's') {
            handleFunction('sin');
        } else if (key === 'c') {
            handleFunction('cos');
        } else if (key === 't') {
            handleFunction('tan');
        }
    }
    
    // Helper functions
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }
    
    function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }
    
    // Terminal functions
    function addTerminalMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        terminalOutput.appendChild(messageElement);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Particle system for background effects
    function initParticles() {
        const container = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 3 + 1;
            
            // Random animation duration
            const duration = Math.random() * 20 + 10;
            
            // Random color (purple or blue)
            const colors = ['rgba(138, 43, 226, 0.7)', 'rgba(0, 191, 255, 0.7)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                box-shadow: 0 0 ${size * 2}px ${size}px ${color};
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: float-${i} ${duration}s linear infinite;
            `;
            
            // Create unique animation
            const keyframes = `
                @keyframes float-${i} {
                    0% {
                        transform: translate(0, 0);
                        opacity: ${Math.random() * 0.5 + 0.1};
                    }
                    50% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                        opacity: ${Math.random() * 0.5 + 0.1};
                    }
                    100% {
                        transform: translate(0, 0);
                        opacity: ${Math.random() * 0.5 + 0.1};
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
            
            container.appendChild(particle);
        }
    }
});
