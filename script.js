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
        currentMode: 'scientific',
        waitingForOperand: false,
        stats: {
            data: [],
            sum: 0,
            count: 0
        },
        theme: 'purple-blue'
    };

    // Elementos DOM
    const mainDisplay = document.getElementById('main-display');
    const secondaryDisplay = document.getElementById('secondary-display');
    const memoryDisplay = document.getElementById('memory-display');
    const modeDisplay = document.getElementById('mode-display');
    const terminalOutput = document.getElementById('terminal-output');
    const calculationHistory = document.getElementById('calculation-history');
    const commandInput = document.querySelector('.command-input');
    
    // Inicialização
    initParticles();
    setupEventListeners();
    updateDisplay();
    showWelcomeMessages();
    
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
        
        // Botões de tema
        document.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', () => switchTheme(button.dataset.theme));
        });
        
        // Terminal
        document.querySelector('.send-btn').addEventListener('click', handleCommand);
        commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCommand();
        });
        
        // Histórico
        document.querySelector('.history-btn.clear').addEventListener('click', clearHistory);
        
        // Teclado
        document.addEventListener('keydown', handleKeyboardInput);
    }

    function showWelcomeMessages() {
        addTerminalMessage("> Inicializando módulos matemáticos...", "system");
        setTimeout(() => addTerminalMessage("> Carregando funções trigonométricas...", "system"), 500);
        setTimeout(() => addTerminalMessage("> Funções científicas carregadas com sucesso", "success"), 1000);
        setTimeout(() => addTerminalMessage("> Sistema pronto para operação", "success"), 1500);
        setTimeout(() => addTerminalMessage("> _", "prompt"), 2000);
    }
    
    // Manipulador de entrada numérica
    function handleNumberInput(num) {
        if (state.waitingForOperand) {
            state.currentValue = '0';
            state.waitingForOperand = false;
        }

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
                state.waitingForOperand = true;
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
        
        try {
            switch(func) {
                case 'second':
                    state.isSecondFunction = !state.isSecondFunction;
                    updateFunctionButtons();
                    addTerminalMessage(`> Funções secundárias ${state.isSecondFunction ? 'ativadas' : 'desativadas'}`, "system");
                    return;
                    
                case 'sin':
                    if (state.isSecondFunction) {
                        if (value < -1 || value > 1) throw new Error("Valor inválido para arcseno");
                        result = Math.asin(value);
                        if (!state.isRadians) result = toDegrees(result);
                    } else {
                        result = Math.sin(state.isRadians ? value : toRadians(value));
                    }
                    break;
                    
                case 'cos':
                    if (state.isSecondFunction) {
                        if (value < -1 || value > 1) throw new Error("Valor inválido para arccosseno");
                        result = Math.acos(value);
                        if (!state.isRadians) result = toDegrees(result);
                    } else {
                        result = Math.cos(state.isRadians ? value : toRadians(value));
                    }
                    break;
                    
                case 'tan':
                    if (state.isSecondFunction) {
                        result = Math.atan(value);
                        if (!state.isRadians) result = toDegrees(result);
                    } else {
                        const input = state.isRadians ? value : toRadians(value);
                        if (Math.abs(input % (Math.PI/2)) < 1e-10) throw new Error("Tangente indefinida");
                        result = Math.tan(input);
                    }
                    break;
                    
                case 'sinh':
                    result = state.isSecondFunction ? Math.asinh(value) : Math.sinh(value);
                    break;
                    
                case 'cosh':
                    if (state.isSecondFunction && value < 1) throw new Error("Valor inválido para arccosh");
                    result = state.isSecondFunction ? Math.acosh(value) : Math.cosh(value);
                    break;
                    
                case 'tanh':
                    result = state.isSecondFunction ? Math.atanh(value) : Math.tanh(value);
                    break;
                    
                case 'log':
                    if (value <= 0) throw new Error("Logaritmo de número não positivo");
                    result = state.isSecondFunction ? Math.pow(10, value) : Math.log10(value);
                    break;
                    
                case 'ln':
                    if (value <= 0) throw new Error("Logaritmo natural de número não positivo");
                    result = state.isSecondFunction ? Math.exp(value) : Math.log(value);
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
                    
                case 'golden':
                    result = (1 + Math.sqrt(5)) / 2;
                    break;
                    
                case '^':
                    if (state.previousValue === null) throw new Error("Digite um número antes da operação");
                    result = Math.pow(parseFloat(state.previousValue), value);
                    break;
                    
                case '√':
                    if (value < 0) throw new Error("Raiz quadrada de número negativo");
                    result = state.isSecondFunction ? Math.pow(value, 2) : Math.sqrt(value);
                    break;
                    
                case '!':
                    if (value < 0 || !Number.isInteger(value)) throw new Error("Fatorial de número não inteiro ou negativo");
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
                    
                case 'round':
                    result = Math.round(value);
                    break;
                    
                case 'trunc':
                    result = Math.trunc(value);
                    break;
                    
                case 'sign':
                    result = Math.sign(value);
                    break;
                    
                case 'rand':
                    result = Math.random();
                    break;
                    
                case 'mod':
                    if (state.previousValue === null) throw new Error("Digite um número antes da operação");
                    if (value === 0) throw new Error("Divisão por zero");
                    result = parseFloat(state.previousValue) % value;
                    break;
                    
                case 'gcd':
                    if (!Number.isInteger(value) || !Number.isInteger(parseFloat(state.previousValue || '0'))) {
                        throw new Error("GCD requer números inteiros");
                    }
                    result = gcd(parseFloat(state.previousValue || '0'), value);
                    break;
                    
                case 'lcm':
                    if (!Number.isInteger(value) || !Number.isInteger(parseFloat(state.previousValue || '0'))) {
                        throw new Error("LCM requer números inteiros");
                    }
                    result = lcm(parseFloat(state.previousValue || '0'), value);
                    break;
                    
                case '10^x':
                    result = Math.pow(10, value);
                    break;
                    
                case 'hypot':
                    if (state.previousValue === null) throw new Error("Digite um número antes da operação");
                    result = Math.hypot(parseFloat(state.previousValue), value);
                    break;
                    
                case 'cbrt':
                    result = Math.cbrt(value);
                    break;
                    
                case 'log2':
                    if (value <= 0) throw new Error("Logaritmo de número não positivo");
                    result = state.isSecondFunction ? Math.pow(2, value) : Math.log2(value);
                    break;
                    
                case 'clamp':
                    if (!state.previousValue) throw new Error("Digite o valor mínimo antes");
                    const min = parseFloat(state.previousValue);
                    const max = parseFloat(state.currentValue);
                    result = Math.min(Math.max(value, min), max);
                    break;
                    
                case 'stats-add':
                    state.stats.data.push(value);
                    state.stats.sum += value;
                    state.stats.count++;
                    addTerminalMessage(`> Valor ${value} adicionado ao conjunto estatístico (total: ${state.stats.count})`, "system");
                    return;
                    
                case 'stats-clear':
                    state.stats.data = [];
                    state.stats.sum = 0;
                    state.stats.count = 0;
                    addTerminalMessage("> Conjunto estatístico limpo", "system");
                    return;
                    
                case 'stats-mean':
                    if (state.stats.count === 0) throw new Error("Nenhum dado no conjunto");
                    result = state.stats.sum / state.stats.count;
                    break;
                    
                case 'stats-stddev':
                    if (state.stats.count === 0) throw new Error("Nenhum dado no conjunto");
                    const mean = state.stats.sum / state.stats.count;
                    const squaredDiffs = state.stats.data.map(x => Math.pow(x - mean, 2));
                    result = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / state.stats.count);
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
                    if (!Number.isInteger(value)) throw new Error("Conversão para binário requer número inteiro");
                    result = parseInt(state.currentValue).toString(2);
                    addTerminalMessage(`> Conversão para binário: ${result}`, "system");
                    break;
                    
                case 'hex':
                    if (!Number.isInteger(value)) throw new Error("Conversão para hexadecimal requer número inteiro");
                    result = parseInt(state.currentValue).toString(16).toUpperCase();
                    addTerminalMessage(`> Conversão para hexadecimal: 0x${result}`, "system");
                    break;
                    
                case 'oct':
                    if (!Number.isInteger(value)) throw new Error("Conversão para octal requer número inteiro");
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
                    output: formatResult(result),
                    isSecond: state.isSecondFunction,
                    timestamp: new Date()
                };
                
                state.history.push(state.lastOperation);
                addToHistory(state.lastOperation);
                
                state.currentValue = formatResult(result);
                state.isSecondFunction = false;
                state.waitingForOperand = true;
                updateFunctionButtons();
                updateDisplay();
            }
        } catch (error) {
            addTerminalMessage(`> Erro: ${error.message}`, "error");
            state.currentValue = '0';
            updateDisplay();
        }
    }
    
    // Formatar resultado para exibição
    function formatResult(value) {
        // Tratar números muito grandes ou muito pequenos
        if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-6 && value !== 0)) {
            return value.toExponential(8).replace(/(\.\d*?[1-9])0+e/, '$1e').replace(/\.?0+e/, 'e');
        }
        
        // Tratar números inteiros
        if (Number.isInteger(value)) {
            return value.toString();
        }
        
        // Arredondar para 10 dígitos significativos
        const rounded = parseFloat(value.toPrecision(10));
        
        // Remover zeros desnecessários
        return rounded.toString().replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
    }
    
    // Manipulador de limpeza
    function handleClear(clearType) {
        if (clearType === 'C') {
            state.currentValue = '0';
            state.previousValue = null;
            state.operation = null;
            state.waitingForOperand = false;
            addTerminalMessage("> Calculadora reiniciada", "system");
        } else if (clearType === 'CE') {
            state.currentValue = '0';
            state.waitingForOperand = false;
        }
        updateDisplay();
    }
    
    // Realizar cálculo
    function calculate() {
        try {
            let result;
            const prev = parseFloat(state.previousValue);
            const current = parseFloat(state.currentValue);
            
            if (isNaN(prev)) {
                throw new Error("Valor anterior inválido");
            }
            
            if (isNaN(current)) {
                throw new Error("Valor atual inválido");
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
                    if (current === 0) throw new Error("Divisão por zero");
                    result = prev / current;
                    break;
                case '%':
                    if (current === 0) throw new Error("Divisão por zero");
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
            
            state.currentValue = formatResult(result);
            state.previousValue = null;
            state.waitingForOperand = true;
            
            addTerminalMessage(`> Cálculo: ${prev} ${state.operation} ${current} = ${result}`, "success");
        } catch (error) {
            addTerminalMessage(`> Erro: ${error.message}`, "error");
            state.currentValue = '0';
            state.previousValue = null;
            state.operation = null;
            updateDisplay();
        }
    }
    
    // Atualizar display
    function updateDisplay() {
        mainDisplay.textContent = state.currentValue;
        
        if (state.operation && state.previousValue !== null) {
            secondaryDisplay.textContent = `${state.previousValue} ${state.operation}`;
        } else {
            secondaryDisplay.textContent = '';
        }
        
        memoryDisplay.textContent = state.memory !== 0 ? `MEM: ${formatResult(state.memory)}` : '';
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
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        modeDisplay.textContent = `MODO: ${mode.toUpperCase()} | ${state.isRadians ? 'RAD' : 'DEG'}`;
        addTerminalMessage(`> Modo alterado para: ${mode.toUpperCase()}`, "system");
    }
    
    // Mudar tema da calculadora
    function switchTheme(themeName) {
        state.theme = themeName;
        document.documentElement.className = themeName;
        addTerminalMessage(`> Tema alterado para: ${themeName.replace('-', ' ').toUpperCase()}`, "system");
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
                addTerminalMessage("> theme [purple-blue|cyber-green|matrix|dark-red] - Muda tema", "system");
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
                } else if (cmd.startsWith('theme ')) {
                    const theme = cmd.split(' ')[1];
                    const availableThemes = ['purple-blue', 'cyber-green', 'matrix', 'dark-red'];
                    if (availableThemes.includes(theme)) {
                        switchTheme(theme);
                    } else {
                        addTerminalMessage("> Erro: Tema inválido. Temas disponíveis: purple-blue, cyber-green, matrix, dark-red", "error");
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
            if (index >= 10) return;
            
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
    
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
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