// Módulo Principal da Calculadora
class SuperCalculator {
    constructor(previousOperandElement, currentOperandElement) {
        // Elementos DOM
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.variablesDisplay = document.getElementById('variablesDisplay');
        this.memoryDisplay = document.getElementById('memoryDisplay');
        
        // Estado da Calculadora
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.isShiftActive = false;
        
        // Configurações
        this.settings = {
            precision: 10,
            scientificNotation: 'auto',
            angleUnit: 'deg',
            numberBase: 'dec',
            theme: 'dark'
        };
        
        // Memória e Variáveis
        this.memory = 0;
        this.variables = new Map();
        this.history = [];
        this.currentMode = 'basic';
        
        // Módulos
        this.mathParser = new MathParser();
        this.converter = new UnitConverter();
        this.graphEngine = new GraphEngine();
        this.analytics = new Analytics();
        this.pluginManager = new PluginManager();
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupModeSystem();
        this.initScientificButtons();
        this.initProgrammerButtons();
        this.initConverter();
        this.setupThemeSystem();
        this.setupTutorial();
        this.updateDisplay();
        
        this.analytics.track('calculator_started');
    }

    // === SISTEMA BÁSICO ===
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
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
        if (!this.operation || !this.previousOperand) return;

        try {
            let result;
            const prev = parseFloat(this.previousOperand);
            const current = this.currentOperand ? parseFloat(this.currentOperand) : 0;

            // Operações básicas
            switch (this.operation) {
                case '+': result = prev + current; break;
                case '-': result = prev - current; break;
                case '×': result = prev * current; break;
                case '÷': 
                    if (current === 0) throw new Error('Divisão por zero');
                    result = prev / current; 
                    break;
                default:
                    // Tenta usar o parser matemático para operações complexas
                    const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
                    result = this.mathParser.evaluate(expression);
            }

            this.recordHistory(`${this.previousOperand} ${this.operation} ${this.currentOperand}`, result);
            this.currentOperand = this.formatNumber(result);
            this.operation = null;
            this.previousOperand = '';
            this.shouldResetDisplay = true;

            this.analytics.track('calculation_completed', {
                operation: this.operation,
                result: result
            });

        } catch (error) {
            this.displayError(error.message);
        }

        this.updateDisplay();
    }

    // === SISTEMA CIENTÍFICO AVANÇADO ===
    handleScientificFunction(func) {
        try {
            const x = parseFloat(this.currentOperand);
            if (isNaN(x)) return;

            let result;
            const angle = this.convertAngle(x);

            switch (func) {
                case 'sin': result = Math.sin(angle); break;
                case 'cos': result = Math.cos(angle); break;
                case 'tan': result = Math.tan(angle); break;
                case 'sin⁻¹': result = Math.asin(x) * (180/Math.PI); break;
                case 'cos⁻¹': result = Math.acos(x) * (180/Math.PI); break;
                case 'tan⁻¹': result = Math.atan(x) * (180/Math.PI); break;
                case 'sinh': result = Math.sinh(x); break;
                case 'cosh': result = Math.cosh(x); break;
                case 'tanh': result = Math.tanh(x); break;
                case 'log': result = Math.log10(x); break;
                case 'ln': result = Math.log(x); break;
                case '√': result = Math.sqrt(x); break;
                case 'x²': result = Math.pow(x, 2); break;
                case 'x³': result = Math.pow(x, 3); break;
                case 'x^y': this.chooseOperation('^'); return;
                case '10^x': result = Math.pow(10, x); break;
                case 'e^x': result = Math.exp(x); break;
                case 'x!': result = this.factorial(x); break;
                case '1/x': result = 1 / x; break;
                case '|x|': result = Math.abs(x); break;
                case 'π': result = Math.PI; break;
                case 'e': result = Math.E; break;
                case 'φ': result = (1 + Math.sqrt(5)) / 2; break;
                default: return;
            }

            this.recordHistory(`${func}(${x})`, result);
            this.currentOperand = this.formatNumber(result);
            this.shouldResetDisplay = true;
            this.updateDisplay();

        } catch (error) {
            this.displayError(error.message);
        }
    }

    convertAngle(angle) {
        switch (this.settings.angleUnit) {
            case 'rad': return angle;
            case 'grad': return angle * Math.PI / 200;
            default: return angle * Math.PI / 180; // deg
        }
    }

    factorial(n) {
        if (n < 0 || !Number.isInteger(n)) throw new Error('Fatorial requer inteiro não negativo');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }

    // === SISTEMA PROGRAMADOR ===
    handleProgrammerOperation(op) {
        try {
            let value = parseInt(this.currentOperand) || 0;

            switch (op) {
                case 'AND': this.chooseOperation('&'); return;
                case 'OR': this.chooseOperation('|'); return;
                case 'XOR': this.chooseOperation('^'); return;
                case 'NOT': value = ~value; break;
                case 'NAND': value = ~(value & parseInt(this.previousOperand)); break;
                case 'NOR': value = ~(value | parseInt(this.previousOperand)); break;
                case '<<': value = value << 1; break;
                case '>>': value = value >> 1; break;
                case 'ROL': value = (value << 1) | (value >>> 31); break;
                case 'ROR': value = (value >>> 1) | (value << 31); break;
                default:
                    if (['A','B','C','D','E','F'].includes(op)) {
                        this.appendNumber(op);
                        return;
                    }
            }

            this.currentOperand = this.convertBase(value.toString(10), this.settings.numberBase);
            this.updateDisplay();

        } catch (error) {
            this.displayError('Erro na operação binária');
        }
    }

    convertBase(number, toBase) {
        const num = parseInt(number, 10);
        switch (toBase) {
            case 'hex': return num.toString(16).toUpperCase();
            case 'oct': return num.toString(8);
            case 'bin': return num.toString(2);
            default: return num.toString(10);
        }
    }

    // === SISTEMA DE GRÁFICOS ===
    plotGraph() {
        const expression = document.getElementById('functionInput').value;
        if (!expression) return;

        try {
            this.graphEngine.plot(expression, {
                width: 600,
                height: 300,
                xRange: [-10, 10],
                yRange: [-10, 10]
            });
            
            const derivative = this.graphEngine.calculateDerivative(expression);
            const integral = this.graphEngine.calculateIntegral(expression);
            
            document.getElementById('graphInfo').innerHTML = `
                <div>Derivada: ${derivative}</div>
                <div>Integral: ∫${expression} dx</div>
            `;

        } catch (error) {
            this.displayError('Erro ao plotar gráfico');
        }
    }

    // === SISTEMA DE CONVERSÃO ===
    handleUnitConversion() {
        const category = document.getElementById('converterCategory').value;
        const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;

        try {
            const result = this.converter.convert(fromValue, fromUnit, toUnit, category);
            document.getElementById('toValue').value = this.formatNumber(result);
        } catch (error) {
            this.displayError('Erro na conversão');
        }
    }

    // === SISTEMA DE VARIÁVEIS ===
    setVariable() {
        const name = document.getElementById('varName').value.trim();
        const value = document.getElementById('varValue').value;

        if (!name) return;

        try {
            const numValue = parseFloat(value) || this.mathParser.evaluate(value);
            this.variables.set(name, numValue);
            this.updateVariablesDisplay();
