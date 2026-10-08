const apiKey = 'SUA_API_KEY'; 
const currencyRates = {};

async function fetchCurrencyRates() {
    try {
        const response = await fetch(
            'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,ETH-BRL'
        );

        if (!response.ok) {
            throw new Error('Falha ao consultar a API');
        }

        const data = await response.json();

        currencyRates.BRL = 1;
        currencyRates.USD = Number(data.USDBRL.bid);
        currencyRates.EUR = Number(data.EURBRL.bid);
        currencyRates.BTC = Number(data.BTCBRL.bid);
        currencyRates.ETH = Number(data.ETHBRL.bid);

    } catch (error) {
        console.error('Erro ao buscar taxas:', error);
    }
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    const fromRate = currencyRates[fromCurrency];
    const toRate = currencyRates[toCurrency];

    if (fromRate && toRate) {
        return (amount / fromRate) * toRate;
    }
    return null;
}

document.getElementById('convertBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    const result = convertCurrency(amount, fromCurrency, toCurrency);
    const resultDiv = document.getElementById('result');

    if (result !== null) {
        resultDiv.innerHTML = `${amount} ${fromCurrency} é igual a ${result.toFixed(2)} ${toCurrency}.`;
    } else {
        resultDiv.innerHTML = 'Erro na conversão. Verifique os valores.';
    }
});

// Atualiza a data e hora a cada segundo
function updateDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    document.getElementById('datetime').innerText = now.toLocaleString('pt-BR', options);
}

// Chama a função para carregar as taxas de câmbio ao iniciar
fetchCurrencyRates();

// Atualiza a data e hora
setInterval(updateDateTime, 1000);
updateDateTime();
