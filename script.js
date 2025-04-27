:root {
    --primary-dark: #0a0a12;
    --secondary-dark: #12121d;
    --accent-purple: #8a2be2;
    --accent-blue: #00bfff;
    --neon-purple: #d300ff;
    --neon-blue: #00f7ff;
    --text-primary: #e0e0e0;
    --text-secondary: #a0a0a0;
    --glow-intensity: 0.8;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Courier New', monospace;
}

body {
    background-color: var(--primary-dark);
    color: var(--text-primary);
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background-image: 
        radial-gradient(circle at 20% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(0, 191, 255, 0.1) 0%, transparent 50%);
}

.cyber-container {
    width: 800px;
    height: 600px;
    background-color: var(--secondary-dark);
    border-radius: 15px;
    box-shadow: 
        0 0 20px rgba(138, 43, 226, 0.5),
        0 0 40px rgba(0, 191, 255, 0.3);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(138, 43, 226, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;
    z-index: 1;
}

.holographic-display {
    background-color: rgba(10, 10, 18, 0.8);
    border: 1px solid var(--accent-purple);
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    box-shadow: 
        inset 0 0 10px rgba(138, 43, 226, 0.3),
        inset 0 0 20px rgba(0, 191, 255, 0.2);
}

.holographic-display::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--neon-purple), transparent);
    animation: scanline 3s linear infinite;
}

@keyframes scanline {
    0% { top: 0; }
    100% { top: 100%; }
}

.display-main {
    font-size: 2.5rem;
    text-align: right;
    font-weight: bold;
    letter-spacing: 2px;
    color: var(--neon-blue);
    text-shadow: 0 0 5px var(--neon-blue);
    height: 50px;
    overflow: hidden;
    white-space: nowrap;
}

.display-secondary {
    font-size: 1.2rem;
    text-align: right;
    color: var(--text-secondary);
    height: 25px;
    overflow: hidden;
}

.display-memory {
    font-size: 0.9rem;
    text-align: left;
    color: var(--accent-purple);
    height: 20px;
    overflow: hidden;
}

.cyber-controls {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.control-panel {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.cyber-keyboard {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 10px;
    flex-grow: 1;
}

.cyber-btn {
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 5px;
    color: var(--text-primary);
    background-color: rgba(30, 30, 45, 0.7);
    box-shadow: 
        0 0 5px rgba(138, 43, 226, 0.3),
        0 0 10px rgba(0, 191, 255, 0.1);
}

.cyber-btn::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    border-radius: 6px;
    background: linear-gradient(45deg, var(--neon-purple), var(--neon-blue), var(--neon-purple));
    background-size: 200% 200%;
    opacity: 0;
    transition: 0.3s;
}

.cyber-btn:hover::before {
    opacity: 0.7;
    animation: gradient 2s ease infinite;
}

@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.cyber-btn:active {
    transform: scale(0.95);
}

.cyber-btn:hover {
    box-shadow: 
        0 0 10px rgba(138, 43, 226, 0.5),
        0 0 20px rgba(0, 191, 255, 0.3);
}

.num-btn {
    background-color: rgba(40, 40, 60, 0.8);
}

.num-btn:hover {
    background-color: rgba(60, 60, 90, 0.9);
    color: var(--neon-blue);
}

.op-btn {
    background-color: rgba(70, 70, 100, 0.8);
    color: var(--accent-blue);
}

.op-btn:hover {
    background-color: rgba(90, 90, 130, 0.9);
    color: var(--neon-blue);
}

.func-btn {
    background-color: rgba(80, 30, 120, 0.8);
    font-size: 0.9rem;
}

.func-btn:hover {
    background-color: rgba(100, 50, 150, 0.9);
    color: var(--neon-purple);
}

.clear-btn {
    background-color: rgba(150, 40, 40, 0.8);
}

.clear-btn:hover {
    background-color: rgba(180, 50, 50, 0.9);
    color: #ff6b6b;
}

.equals-btn {
    grid-column: span 4;
    background-color: var(--accent-purple);
    color: white;
}

.equals-btn:hover {
    background-color: var(--neon-purple);
    box-shadow: 0 0 15px var(--neon-purple);
}

.mode-btn {
    flex: 1;
    margin: 0 5px;
    background-color: rgba(20, 20, 40, 0.8);
    font-size: 0.9rem;
}

.mode-btn.active {
    background-color: var(--accent-purple);
    box-shadow: 0 0 10px var(--accent-purple);
}

.cyber-effects {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: -1;
}

.neon-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
    animation: neon-line 8s linear infinite;
}

@keyframes neon-line {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

.grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        linear-gradient(rgba(138, 43, 226, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 191, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
}

.particle-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.cyber-terminal {
    width: 800px;
    height: 200px;
    background-color: rgba(10, 10, 20, 0.9);
    border-radius: 0 0 15px 15px;
    margin-top: -15px;
    border: 1px solid rgba(138, 43, 226, 0.3);
    border-top: none;
    box-shadow: 
        0 0 20px rgba(138, 43, 226, 0.3),
        0 0 40px rgba(0, 191, 255, 0.2);
    display: flex;
    flex-direction: column;
    z-index: 0;
}

.terminal-header {
    background: linear-gradient(to right, var(--primary-dark), var(--secondary-dark));
    padding: 8px 15px;
    border-radius: 5px 5px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--accent-purple);
}

.terminal-title {
    font-size: 0.9rem;
    color: var(--accent-blue);
    font-weight: bold;
}

.terminal-controls i {
    margin-left: 10px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color 0.2s;
}

.terminal-controls i:hover {
    color: var(--text-primary);
}

.terminal-body {
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--accent-blue);
    font-family: 'Courier New', monospace;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-purple) var(--secondary-dark);
}

.terminal-body::-webkit-scrollbar {
    width: 6px;
}

.terminal-body::-webkit-scrollbar-track {
    background: var(--secondary-dark);
}

.terminal-body::-webkit-scrollbar-thumb {
    background-color: var(--accent-purple);
    border-radius: 3px;
}

.terminal-body div {
    margin-bottom: 5px;
    animation: terminal-typing 0.5s ease-out;
}

@keyframes terminal-typing {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Animations */
@keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        opacity: 1;
    }
    20%, 22%, 24%, 55% {
        opacity: 0.7;
    }
}

.flicker {
    animation: flicker 3s infinite;
}

/* Responsive design */
@media (max-width: 850px) {
    .cyber-container, .cyber-terminal {
        width: 95%;
    }
    
    .cyber-keyboard {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .mode-btn {
        font-size: 0.7rem;
        padding: 5px;
    }
    
    .display-main {
        font-size: 1.8rem;
    }
}
