document.getElementById('coin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const currency = document.getElementById('coin').value;
    const crypto = document.getElementById('crypto').value;
    const amount = parseFloat(document.getElementById('amount').value);

    // Si la moneda es VES, se consulta en USDT
    const symbol = crypto + (currency === 'VES' ? 'USDT' : currency);

    try {
        // 1. Obtener precio base de Binance
        const data = await (await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=' + symbol)).json();

        // 2. Obtener tasa VES en vivo si la divisa es Bolívares
        const tasa = currency === 'VES' 
            ? (await (await fetch('https://open.er-api.com/v6/latest/USD')).json()).rates.VES 
            : 1;

        const price = parseFloat(data.lastPrice) * tasa;

        // 3. Renderizar resultados en pantalla
        document.getElementById('res-price').textContent = price.toFixed(2) + ' ' + currency;
        document.getElementById('res-high').textContent = (parseFloat(data.highPrice) * tasa).toFixed(2) + ' ' + currency;
        document.getElementById('res-low').textContent = (parseFloat(data.lowPrice) * tasa).toFixed(2) + ' ' + currency;
        document.getElementById('res-change').textContent = parseFloat(data.priceChangePercent).toFixed(2) + ' %';
        document.getElementById('res-crypto-amount').textContent = (amount / price).toFixed(6) + ' ' + crypto;

        document.getElementById('coin-info').style.display = 'block';
    } catch (error) {
        alert('Error al consultar la cotización.');
    }
});