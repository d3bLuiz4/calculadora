// console.log("Seja bem vindo!!!") // Não é mais necessário para a interface HTML

// 1. **Seleção do elemento de display (a "saída")**
const display = document.getElementById('res'); // Pega o <p id="res"> do HTML

// Variável para armazenar a expressão que o usuário está digitando
let currentExpression = '';
let lastInputWasOperator = false; // Ajuda a evitar múltiplos operadores seguidos
let calculated = false; // Ajuda a resetar o display após um cálculo

// 2. **Suas Funções de Operação (Corrigidas e Mantendo a Lógica de Array)**
// A correção principal é 'Function' para 'function' e 'multiplicar' com resultado inicial 1.

function somar(numeros) {
    let resultado = 0;
    for (let x = 0; x < numeros.length; x++) {
        resultado += numeros[x];
    }
    return resultado;
}

function subtrair(numeros) {
    if (numeros.length === 0) return 0;
    let resultado = numeros[0];
    for (let x = 1; x < numeros.length; x++) {
        resultado -= numeros[x];
    }
    return resultado;
}

function multiplicar(numeros) {
    if (numeros.length === 0) return 0; // Se não houver números, o resultado é 0
    let resultado = 1; // Corrigido: Inicia com 1 para multiplicação
    for (let x = 0; x < numeros.length; x++) {
        resultado *= numeros[x];
    }
    return resultado;
}

function dividir(numeros) {
    if (numeros.length === 0) return 0;
    let resultado = numeros[0];
    for (let x = 1; x < numeros.length; x++) {
        if (numeros[x] === 0) {
            return "Divisão por zero!"; // Evita divisão por zero
        }
        resultado /= numeros[x];
    }
    return resultado;
}

// 3. **Funções para Interagir com o Display (os botões)**

// Adiciona o valor clicado ao display e à expressão
function appendToDisplay(value) {
    if (calculated && !isNaN(value)) { // Se um resultado foi calculado e o próximo é um número
        currentExpression = value; // Começa uma nova expressão
        calculated = false;
    } else if (value === ',' && (currentExpression.includes(',') || currentExpression.endsWith('+') || currentExpression.endsWith('-') || currentExpression.endsWith('*') || currentExpression.endsWith('/'))) {
        // Evita múltiplos pontos decimais no mesmo número ou após operadores
        return;
    } else if (value === '.' && currentExpression.includes('.')) { // Se o HTML enviasse ponto
        return;
    } else if (['+', '-', 'x', '/'].includes(value)) { // Se for um operador
        if (lastInputWasOperator && value !== '-') { // Evita múltiplos operadores, mas permite '-'' como negativo
            currentExpression = currentExpression.slice(0, -1) + value; // Substitui o último operador
        } else {
            currentExpression += value;
        }
        lastInputWasOperator = true;
        calculated = false;
    } else { // Se for um número ou o primeiro ponto decimal
        currentExpression += value;
        lastInputWasOperator = false;
        calculated = false;
    }
    display.textContent = currentExpression;
}

// Limpa o display e a expressão
function clearDisplay() {
    currentExpression = '';
    display.textContent = 'Digite...';
    lastInputWasOperator = false;
    calculated = false;
}

// Remove o último caractere (backspace)
function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    display.textContent = currentExpression === '' ? 'Digite...' : currentExpression;
    lastInputWasOperator = ['+', '-', 'x', '/'].includes(currentExpression.slice(-1)); // Verifica se o último é um operador
    calculated = false;
}

// A função mais complexa: calcula o resultado usando suas funções de array
function calculateResult() {
    if (currentExpression === '') {
        display.textContent = 'Digite...';
        return;
    }

    try {
        // --- LÓGICA PARA PARSEAR A EXPRESSÃO E USAR SUAS FUNÇÕES ---
        // ATENÇÃO: Esta é uma simplificação. Para uma calculadora completa,
        // você precisaria de um algoritmo de parsing mais robusto para
        // lidar com ordem de operações, parênteses, etc.
        // Aqui, faremos uma avaliação sequencial simples.

        let expressionParts = currentExpression
            .replace(/x/g, '*') // Substitui 'x' por '*'
            .replace(/,/g, '.') // Substitui ',' por '.' para cálculo
            .split(/([+\-*/])/); // Divide por operadores, mantendo-os na array

        // Remove partes vazias que podem surgir (ex: se começar com operador ou houver múltiplos)
        expressionParts = expressionParts.filter(part => part.trim() !== '');

        if (expressionParts.length < 3) { // Mínimo de número, operador, número
            display.textContent = 'Erro de sintaxe';
            currentExpression = '';
            return;
        }

        let tempResult = parseFloat(expressionParts[0]);

        for (let i = 1; i < expressionParts.length; i += 2) {
            const operator = expressionParts[i];
            const nextNumber = parseFloat(expressionParts[i + 1]);

            if (isNaN(tempResult) || isNaN(nextNumber)) {
                display.textContent = 'Erro de sintaxe';
                currentExpression = '';
                return;
            }

            // AQUI É ONDE SUAS FUNÇÕES SÃO CHAMADAS
            switch (operator) {
                case '+':
                    tempResult = somar([tempResult, nextNumber]);
                    break;
                case '-':
                    tempResult = subtrair([tempResult, nextNumber]);
                    break;
                case '*':
                    tempResult = multiplicar([tempResult, nextNumber]);
                    break;
                case '/':
                    tempResult = dividir([tempResult, nextNumber]);
                    if (typeof tempResult === 'string') { // Se for "Divisão por zero!"
                        display.textContent = tempResult;
                        currentExpression = '';
                        calculated = true;
                        return;
                    }
                    break;
                default:
                    display.textContent = 'Operador inválido';
                    currentExpression = '';
                    return;
            }
        }

        let finalResult = tempResult;

        // --- FIM DA LÓGICA DE PARSING SIMPLIFICADO ---


        // Exibir o resultado formatado e armazená-lo para futuras operações
        if (isNaN(finalResult) || !isFinite(finalResult)) {
            display.textContent = 'Erro';
            currentExpression = '';
        } else {
            // Formata o número para exibir vírgula como separador decimal no Brasil
            display.textContent = finalResult.toLocaleString('pt-BR');
            // Armazena a expressão com vírgula para futuras operações
            currentExpression = finalResult.toString().replace('.', ',');
        }
        calculated = true;

    } catch (error) {
        display.textContent = 'Erro'; // Em caso de erro na expressão
        currentExpression = '';
        calculated = false;
        console.error("Erro no cálculo:", error); // Ajuda a depurar
    }
    lastInputWasOperator = false; // Após um cálculo, o próximo input não é um operador consecutivo
}


// 4. **Conectando os botões HTML ao JavaScript**
// Certifique-se de que seus botões no HTML têm a classe 'calc-button'
// e o atributo 'data-value' como no exemplo anterior!

const buttons = document.querySelectorAll('.calc-button'); // Seleciona todos os botões com a classe 'calc-button'

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Pega o valor do botão, preferindo 'data-value' se existir, senão o texto interno
        const value = button.dataset.value || button.textContent;

        if (value === 'C') {
            clearDisplay();
        } else if (value === '<|') { // O botão de backspace
            backspace();
        } else if (value === '=') {
            calculateResult();
        } else { // Para números, operadores (+, -, /, x), e vírgula
            appendToDisplay(value);
        }
    });
});

// A parte do MENU INTERATIVO (do...while loop, prompt, console.log) foi removida
// pois ela é para interação via console, não via interface gráfica HTML.