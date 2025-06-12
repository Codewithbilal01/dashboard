// Coin data with initial prices
const coins = [
    { symbol: 'BTC', name: 'Bitcoin', icon: 'fab fa-bitcoin', price: 62350, change: 2.4 },
    { symbol: 'ETH', name: 'Ethereum', icon: 'fab fa-ethereum', price: 3420, change: 1.2 },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'fab fa-btc', price: 592.3, change: -0.8 },
    { symbol: 'SOL', name: 'Solana', icon: 'fas fa-coins', price: 146.8, change: 5.7 },
    { symbol: 'XRP', name: 'Ripple', icon: 'fas fa-dollar-sign', price: 0.528, change: 0.9 },
    { symbol: 'ADA', name: 'Cardano', icon: 'fab fa-ada', price: 0.46, change: -1.2 }
];

// Recent trades data
const recentTrades = [
    { symbol: 'BTC', name: 'Bitcoin', direction: 'Buy', price: 62350, change: 2.4, status: 'open' },
    { symbol: 'ETH', name: 'Ethereum', direction: 'Sell', price: 3418, change: -0.8, status: 'closed' },
    { symbol: 'SOL', name: 'Solana', direction: 'Buy', price: 145.2, change: 5.7, status: 'open' },
    { symbol: 'XRP', name: 'Ripple', direction: 'Buy', price: 0.524, change: 1.2, status: 'open' },
    { symbol: 'ADA', name: 'Cardano', direction: 'Sell', price: 0.458, change: -2.1, status: 'closed' }
];

// Chart data for different time periods
const chartData = {
    7: [23000, 23500, 23200, 23800, 24000, 24200, 24560],
    30: [21000, 21500, 22000, 21800, 22300, 22500, 23000, 22800, 23200, 23500,
        23800, 24000, 24200, 24500, 24700, 24500, 24300, 24000, 24200, 24500,
        24700, 25000, 24800, 24600, 24500, 24300, 24500, 24700, 24800, 24560],
    90: [20000, 20500, 21000, 20800, 21200, 21500, 21800, 22000, 22200, 22500,
        22800, 23000, 23200, 23500, 23800, 24000, 24200, 24500, 24700, 25000,
        24800, 24600, 24500, 24300, 24500, 24700, 24800, 25000, 25200, 25000,
        24800, 24600, 24500, 24300, 24500, 24700, 24800, 25000, 25200, 25500,
        25300, 25200, 25000, 24800, 25000, 25200, 25500, 25800, 26000, 25800,
        25600, 25500, 25300, 25200, 25000, 24800, 25000, 25200, 25500, 25800,
        26000, 26200, 26000, 25800, 25600, 25500, 25300, 25200, 25000, 24800,
        25000, 25200, 25500, 25800, 26000, 25800, 25600, 25500, 25300, 25200,
        25000, 24800, 25000, 25200, 25500, 25800, 26000, 25800, 25600, 24560]
};

// Function to update coin prices randomly
function updateCoinPrices() {
    coins.forEach(coin => {
        // Random price change between -0.5% and +0.5%
        const changePercent = (Math.random() - 0.5) / 100;
        coin.price *= (1 + changePercent);
        coin.price = parseFloat(coin.price.toFixed(coin.symbol === 'BTC' ? 0 : 2));

        // Update change percentage
        coin.change = parseFloat((coin.change + (Math.random() - 0.5)).toFixed(2));
    });

    renderTicker();
    renderTrades();
}

// Render ticker items
function renderTicker() {
    const container = document.getElementById('tickerContainer');
    container.innerHTML = '';

    coins.forEach(coin => {
        const item = document.createElement('div');
        item.className = 'ticker-item';

        item.innerHTML = `
                    <div class="ticker-icon">
                        <i class="${coin.icon}"></i>
                    </div>
                    <div class="ticker-info">
                        <div class="ticker-symbol">${coin.symbol}</div>
                        <div class="ticker-price">$${coin.price.toLocaleString()}</div>
                    </div>
                    <div class="ticker-change ${coin.change >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-${coin.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                        ${Math.abs(coin.change).toFixed(2)}%
                    </div>
                `;

        container.appendChild(item);
    });
}

// Render recent trades
function renderTrades() {
    const container = document.getElementById('tradesTable');
    container.innerHTML = '';

    recentTrades.forEach(trade => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>
                        <div class="symbol">
                            <div class="symbol-icon"><i class="${coins.find(c => c.symbol === trade.symbol).icon}"></i></div>
                            <div>${trade.symbol}</div>
                        </div>
                    </td>
                    <td><span class="${trade.direction === 'Buy' ? 'profit' : 'loss'}">${trade.direction}</span></td>
                    <td>$${trade.price.toLocaleString()}</td>
                    <td class="${trade.change >= 0 ? 'profit' : 'loss'}">
                        <i class="fas fa-${trade.change >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                        ${Math.abs(trade.change).toFixed(2)}%
                    </td>
                    <td><span class="status ${trade.status}">${trade.status === 'open' ? 'Active' : 'Completed'}</span></td>
                `;

        container.appendChild(row);
    });
}

// Initialize the ticker and trades
renderTicker();
renderTrades();

// Update prices every 2 seconds
let priceInterval = setInterval(updateCoinPrices, 2000);

// Performance Chart
const ctx = document.getElementById('performanceChart').getContext('2d');
let performanceChart;

function initChart(days = 7) {
    if (performanceChart) {
        performanceChart.destroy();
    }

    const labels = [];
    for (let i = 1; i <= days; i++) {
        labels.push(i === 1 ? 'Today' : (i === days ? `${days}D` : ''));
    }

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Value',
                data: chartData[days],
                borderColor: '#a1a4ab',
                backgroundColor: 'rgba(161, 164, 171, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#a1a4ab',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#94a3b8',
                        callback: function (value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// Initialize the chart
initChart(7);

// Simulate portfolio value changes
setInterval(() => {
    const newValue = 24560 + (Math.random() * 1000 - 500);
    document.querySelector('.card:first-child .card-value').textContent =
        '$' + Math.round(newValue).toLocaleString();
}, 5000);

// Refresh button functionality
document.getElementById('refreshBtn').addEventListener('click', function () {
    // Show refresh animation
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';

    // Simulate refresh delay
    setTimeout(() => {
        // Reset button
        this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';

        // Update all data
        updateCoinPrices();
        renderTrades();

        // Update portfolio value
        const portfolioValue = 24560 + (Math.random() * 2000 - 1000);
        document.querySelector('.card:first-child .card-value').textContent =
            '$' + Math.round(portfolioValue).toLocaleString();

        // Show refresh confirmation
        const originalText = this.textContent;
        this.innerHTML = '<i class="fas fa-check"></i> Refreshed';

        // Revert to original text after 1.5 seconds
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        }, 1500);
    }, 800);
});

// Settings modal functionality
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeModal = document.getElementById('closeModal');
const cancelSettings = document.getElementById('cancelSettings');
const saveSettings = document.getElementById('saveSettings');

// Open modal
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});

// Close modal
closeModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

cancelSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Save settings
saveSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';

    // Show confirmation
    const originalText = settingsBtn.textContent;
    settingsBtn.innerHTML = '<i class="fas fa-check"></i> Settings Saved';

    // Revert to original text after 1.5 seconds
    setTimeout(() => {
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i> Settings';
    }, 1500);
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Portfolio performance time filter functionality
const dayButtons = document.querySelectorAll('.day-btn');

dayButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons
        dayButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Get the days value
        const days = parseInt(this.getAttribute('data-days'));

        // Update the chart
        initChart(days);
    });
});