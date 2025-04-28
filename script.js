// NexusCalc Quantum - Advanced Scientific Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Estado da calculadora
    const state = {
        currentValue: '0',
        previousValue: null,
        operation: null,
        memory: 0,
        isSecondFunction: false,
        isRadians: true,
        history: [],
        lastOperation: null,
        currentMode: 'scientific'
    };

    // Elementos DOM
    const mainDisplay = document.getElementById('main-display');
    const secondaryDisplay = document.getElementById('secondary-display');
    const memoryDisplay = document.getElementById('memory-display');
    const modeDisplay = document.getElementById('mode-display');
    const terminalOutput = document.getElementById('terminal-output');
    const calculationHistory = document.getElementById('calculation-history');
    const commandInput = document.querySelector('.command-input');
    
    // Inicializar partículas
    initParticles();
    
    // Adicionar listeners de eventos
    setupEventListeners();
    
    // Atualizar display
    updateDisplay();
    
    // Mensagens iniciais do terminal
    addTerminalMessage("> Inicializando módulos matemáticos...", "system");
    setTimeout(() => addTerminalMessage("> Carregando funções trigonométricas...", "system"), 500);
    setTimeout(() => addTerminalMessage("> Funções científicas carregadas com sucesso", "success"), 1000);
    setTimeout(() => addTerminalMessage("> Sistema pronto para operação", "success"), 1500);
    setTimeout(() => addTerminalMessage("> _", "prompt"), 2000);
    
    // Configurar listeners de eventos
    function setupEventListeners() {
        // Botões numéricos
        document.querySelectorAll('.num-btn').forEach(button => {
            button.addEventListener('click', () => handleNumberInput(button.dataset.num));
        });
        
        // Botões de operação
        document.querySelectorAll('.op-btn').forEach(button => {
            button.addEventListener('click', () => handleOperation(button.dataset.op));
        });
        
        // Botões de função
        document.querySelectorAll('.func-btn').forEach(button => {
            button.addEventListener('click', () => handleFunction(button.dataset.func));
        });
        
        // Botões de limpar
        document.querySelectorAll('.clear-btn').forEach(button => {
            button.addEventListener('click', () => handleClear(button.dataset.clear));
        });
        
        // Botões de modo
        document.querySelectorAll('.mode-btn').forEach(button => {
            button.addEventListener('click', () => switchMode(button.dataset.mode));
        });
        
        // Botão de enviar comando
        document.querySelector('.send-btn').addEventListener('click', handleCommand);
        
        // Input de comando (tecla Enter)
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand();
        });
        
        // Botão de limpar histórico
        document.querySelector('.history-btn.clear').addEventListener('click', clearHistory);
        
        // Suporte a teclado
        document.addEventListener('keydown', handleKeyboardInput);
    }
    
    // Manipulador de entrada numérica
    function handleNumberInput(num) {
        if (state.currentValue === '0' && num !== '.') {
            state.currentValue = num;
        } else if (num === '.' && state.currentValue.includes('.')) {
            return;
        } else {
            state.currentValue += num;
        }
        
        if (state.currentValue.length > 15) {
            state.currentValue = state.currentValue.slice(0, 15);
            addTerminalMessage("> Aviso: Limite de dígitos excedido. Valor truncado.", "system");
        }
        
        updateDisplay();
    }
    
    // Manipulador de operações
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
    
    // Manipulador de funções
    function handleFunction(func) {
        let result;
        const value = parseFloat(state.currentValue);
        
        switch(func) {
            case 'second':
                state.isSecondFunction = !state.isSecondFunction;
                updateFunctionButtons();
                addTerminalMessage(`> Funções secundárias ${state.isSecondFunction ? 'ativadas' : 'desativadas'}`, "system");
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
                addTerminalMessage(`> Modo ângulo alterado para: ${state.isRadians ? 'Radianos' : 'Graus'}`, "system");
                modeDisplay.textContent = `MODO: ${state.currentMode.toUpperCase()} | ${state.isRadians ? 'RAD' : 'DEG'}`;
                return;
                
            case 'mem-clear':
                state.memory = 0;
                addTerminalMessage("> Memória limpa", "system");
                break;
                
            case 'mem-recall':
                result = state.memory;
                break;
                
            case 'mem-add':
                state.memory += parseFloat(state.currentValue);
                addTerminalMessage(`> Valor adicionado à memória: ${state.currentValue}`, "system");
                break;
                
            case 'mem-sub':
                state.memory -= parseFloat(state.currentValue);
                addTerminalMessage(`> Valor subtraído da memória: ${state.currentValue}`, "system");
                break;
                
            case 'bin':
                result = parseInt(state.currentValue).toString(2);
                addTerminalMessage(`> Conversão para binário: ${result}`, "system");
                break;
                
            case 'hex':
                result = parseInt(state.currentValue).toString(16).toUpperCase();
                addTerminalMessage(`> Conversão para hexadecimal: 0x${result}`, "system");
                break;
                
            case 'oct':
                result = parseInt(state.currentValue).toString(8);
                addTerminalMessage(`> Conversão para octal: 0o${result}`, "system");
                break;
                
            default:
                return;
        }
        
        if (result !== undefined) {
            state.lastOperation = {
                function: func,
                input: state.currentValue,
                output: result.toString(),
                isSecond: state.isSecondFunction,
                timestamp: new Date()
            };
            
            state.history.push(state.lastOperation);
            addToHistory(state.lastOperation);
            
            state.currentValue = result.toString();
            state.isSecondFunction = false;
            updateFunctionButtons();
            updateDisplay();
        }
    }
    
    // Manipulador de limpeza
    function handleClear(clearType) {
        if (clearType === 'C') {
            state.currentValue = '0';
            state.previousValue = null;
            state.operation = null;
            addTerminalMessage("> Calculadora reiniciada", "system");
        } else if (clearType === 'CE') {
            state.currentValue = '0';
        }
        updateDisplay();
    }
    
    // Realizar cálculo
    function calculate() {
        let result;
        const prev = parseFloat(state.previousValue);
        const current = parseFloat(state.currentValue);
        
        if (isNaN(prev) {
            addTerminalMessage("> Erro: Valor anterior inválido", "error");
            return;
        }
        
        if (isNaN(current)) {
            addTerminalMessage("> Erro: Valor atual inválido", "error");
            return;
        }
        
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
                if (current === 0) {
                    addTerminalMessage("> Erro: Divisão por zero", "error");
                    return;
                }
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
            result: result,
            timestamp: new Date()
        };
        
        state.history.push(state.lastOperation);
        addToHistory(state.lastOperation);
        
        state.currentValue = result.toString();
        state.previousValue = null;
        
        addTerminalMessage(`> Cálculo: ${prev} ${state.operation} ${current} = ${result}`, "success");
    }
    
    // Atualizar display
    function updateDisplay() {
        mainDisplay.textContent = state.currentValue;
        
        if (state.operation && state.previousValue !== null) {
            secondaryDisplay.textContent = `${state.previousValue} ${state.operation}`;
        } else {
            secondaryDisplay.textContent = '';
        }
        
        memoryDisplay.textContent = state.memory !== 0 ? `MEM: ${state.memory}` : '';
    }
    
    // Atualizar botões de função
    function updateFunctionButtons() {
        document.querySelectorAll('.func-btn').forEach(btn => {
            const func = btn.dataset.func;
            const primarySpan = btn.querySelector('.func-primary');
            const secondarySpan = btn.querySelector('.func-secondary');
            
            if (!primarySpan || !secondarySpan) return;
            
            if (state.isSecondFunction) {
                // Mostrar funções secundárias
                switch(func) {
                    case 'sin': 
                        primarySpan.textContent = 'sin⁻¹';
                        secondarySpan.textContent = 'asin';
                        break;
                    case 'cos': 
                        primarySpan.textContent = 'cos⁻¹';
                        secondarySpan.textContent = 'acos';
                        break;
                    case 'tan': 
                        primarySpan.textContent = 'tan⁻¹';
                        secondarySpan.textContent = 'atan';
                        break;
                    case 'sinh': 
                        primarySpan.textContent = 'sinh⁻¹';
                        secondarySpan.textContent = 'asinh';
                        break;
                    case 'cosh': 
                        primarySpan.textContent = 'cosh⁻¹';
                        secondarySpan.textContent = 'acosh';
                        break;
                    case 'tanh': 
                        primarySpan.textContent = 'tanh⁻¹';
                        secondarySpan.textContent = 'atanh';
                        break;
                    case 'log': 
                        primarySpan.textContent = '10^x';
                        secondarySpan.textContent = 'antilog';
                        break;
                    case 'ln': 
                        primarySpan.textContent = 'e^x';
                        secondarySpan.textContent = 'exp';
                        break;
                    case '√': 
                        primarySpan.textContent = 'x²';
                        secondarySpan.textContent = 'sqr';
                        break;
                    default: 
                        break;
                }
            } else {
                // Mostrar funções primárias
                switch(func) {
                    case 'sin': 
                        primarySpan.textContent = 'sin';
                        secondarySpan.textContent = 'sin⁻¹';
                        break;
                    case 'cos': 
                        primarySpan.textContent = 'cos';
                        secondarySpan.textContent = 'cos⁻¹';
                        break;
                    case 'tan': 
                        primarySpan.textContent = 'tan';
                        secondarySpan.textContent = 'tan⁻¹';
                        break;
                    case 'sinh': 
                        primarySpan.textContent = 'sinh';
                        secondarySpan.textContent = 'sinh⁻¹';
                        break;
                    case 'cosh': 
                        primarySpan.textContent = 'cosh';
                        secondarySpan.textContent = 'cosh⁻¹';
                        break;
                    case 'tanh': 
                        primarySpan.textContent = 'tanh';
                        secondarySpan.textContent = 'tanh⁻¹';
                        break;
                    case 'log': 
                        primarySpan.textContent = 'log';
                        secondarySpan.textContent = '10^x';
                        break;
                    case 'ln': 
                        primarySpan.textContent = 'ln';
                        secondarySpan.textContent = 'e^x';
                        break;
                    case '√': 
                        primarySpan.textContent = '√x';
                        secondarySpan.textContent = 'x²';
                        break;
                    default: 
                        break;
                }
            }
        });
    }
    
    // Mudar modo da calculadora
    function switchMode(mode) {
        state.currentMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        modeDisplay.textContent = `MODO: ${mode.toUpperCase()} | ${state.isRadians ? 'RAD' : 'DEG'}`;
        addTerminalMessage(`> Modo alterado para: ${mode.toUpperCase()}`, "system");
    }
    
    // Manipulador de entrada por teclado
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
        } else if (key === 'p') {
            handleFunction('pi');
        } else if (key === 'e') {
            handleFunction('e');
        } else if (key === 'a') {
            handleFunction('abs');
        } else if (key === 'l') {
            handleFunction('log');
        } else if (key === 'n') {
            handleFunction('ln');
        } else if (key === 'd') {
            handleFunction('deg');
        } else if (key === '²') {
            handleFunction('√');
        }
    }
    
    // Manipulador de comandos do terminal
    function handleCommand() {
        const command = commandInput.value.trim();
        if (!command) return;
        
        addTerminalMessage(`> ${command}`, "prompt");
        commandInput.value = '';
        
        // Processar comando
        processCommand(command);
    }
    
    // Processar comandos do terminal
    function processCommand(command) {
        const cmd = command.toLowerCase();
        
        switch(cmd) {
            case 'help':
                addTerminalMessage("> Comandos disponíveis:", "system");
                addTerminalMessage("> help - Mostra esta ajuda", "system");
                addTerminalMessage("> clear - Limpa o terminal", "system");
                addTerminalMessage("> history - Mostra histórico de cálculos", "system");
                addTerminalMessage("> mode [basic|scientific|programmer|graph] - Muda modo", "system");
                addTerminalMessage("> rad - Muda para radianos", "system");
                addTerminalMessage("> deg - Muda para graus", "system");
                break;
                
            case 'clear':
                clearTerminal();
                break;
                
            case 'history':
                showHistory();
                break;
                
            case 'rad':
                state.isRadians = true;
                modeDisplay.textContent = `MODO: ${state.currentMode.toUpperCase()} | RAD`;
                addTerminalMessage("> Modo ângulo alterado para radianos", "system");
                break;
                
            case 'deg':
                state.isRadians = false;
                modeDisplay.textContent = `MODO: ${state.currentMode.toUpperCase()} | DEG`;
                addTerminalMessage("> Modo ângulo alterado para graus", "system");
                break;
                
            default:
                if (cmd.startsWith('mode ')) {
                    const mode = cmd.split(' ')[1];
                    if (['basic', 'scientific', 'programmer', 'graph'].includes(mode)) {
                        switchMode(mode);
                    } else {
                        addTerminalMessage("> Erro: Modo inválido. Use basic, scientific, programmer ou graph", "error");
                    }
                } else {
                    addTerminalMessage("> Erro: Comando não reconhecido. Digite 'help' para ajuda", "error");
                }
        }
    }
    
    // Limpar terminal
    function clearTerminal() {
        terminalOutput.innerHTML = '';
        addTerminalMessage("> Terminal limpo", "system");
    }
    
    // Mostrar histórico no terminal
    function showHistory() {
        if (state.history.length === 0) {
            addTerminalMessage("> Nenhum cálculo no histórico", "system");
            return;
        }
        
        addTerminalMessage("> Histórico de cálculos:", "system");
        state.history.slice().reverse().forEach((op, index) => {
            if (index >= 10) return; // Limitar a 10 itens
            
            if (op.operation) {
                addTerminalMessage(`> ${op.operand1} ${op.operation} ${op.operand2} = ${op.result}`, "system");
            } else if (op.function) {
                addTerminalMessage(`> ${op.function}(${op.input}) = ${op.output}`, "system");
            }
        });
    }
    
    // Adicionar mensagem ao terminal
    function addTerminalMessage(message, type = "system") {
        const messageElement = document.createElement('div');
        messageElement.className = `terminal-line ${type}`;
        messageElement.textContent = message;
        terminalOutput.appendChild(messageElement);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Adicionar ao histórico de cálculos
    function addToHistory(operation) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let expression = '';
        let result = '';
        
        if (operation.operation) {
            expression = `${operation.operand1} ${operation.operation} ${operation.operand2}`;
            result = operation.result;
        } else if (operation.function) {
            expression = `${operation.function}(${operation.input})`;
            result = operation.output;
        }
        
        const timeString = operation.timestamp.toLocaleTimeString();
        
        historyItem.innerHTML = `
            <span class="history-expression">${expression}</span>
            <span class="history-result">= ${result}</span>
            <span class="history-time">${timeString}</span>
        `;
        
        calculationHistory.prepend(historyItem);
        
        // Limitar histórico a 50 itens
        if (calculationHistory.children.length > 50) {
            calculationHistory.removeChild(calculationHistory.lastChild);
        }
    }
    
    // Limpar histórico
    function clearHistory() {
        calculationHistory.innerHTML = '';
        state.history = [];
        addTerminalMessage("> Histórico de cálculos limpo", "system");
    }
    
    // Funções auxiliares matemáticas
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
    
    // Sistema de partículas para efeitos de fundo
    function initParticles() {
        const container = document.getElementById('particles');
        const particleCount = 80;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posição aleatória
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Tamanho aleatório
            const size = Math.random() * 4 + 1;
            
            // Duração da animação aleatória
            const duration = Math.random() * 25 + 15;
            const delay = Math.random() * 5;
            
            // Cor aleatória (roxo ou azul)
            const colors = [
                'rgba(138, 43, 226, 0.7)', 
                'rgba(0, 191, 255, 0.7)',
                'rgba(211, 0, 255, 0.7)',
                'rgba(0, 247, 255, 0.7)'
            ];
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
                animation: float-${i} ${duration}s linear ${delay}s infinite;
                z-index: -1;
            `;
            
            // Criar animação única
            const keyframes = `
                @keyframes float-${i} {
                    0% {
                        transform: translate(0, 0);
                        opacity: ${Math.random() * 0.5 + 0.1};
                    }
                    25% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 50 - 25}px);
                        opacity: ${Math.random() * 0.5 + 0.1};
                    }
                    50% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                        opacity: ${Math.random() * 0.5 + 0.1};
                    }
                    75% {
                        transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 100 - 50}px);
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
