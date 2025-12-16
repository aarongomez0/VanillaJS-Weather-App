let transactions = [];

const form = document.getElementById('transactionForm');
const transactionsList = document.getElementById('transactionsList');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const clearAllBtn = document.getElementById('clearAll');

function init() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
        updateUI();
    }
}

function saveToStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

function calculateTotals() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;
    
    return { income, expense, balance };
}

function updateTotals() {
    const { income, expense, balance } = calculateTotals();
    
    totalBalance.textContent = formatCurrency(balance);
    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);
    
    if (balance >= 0) {
        totalBalance.style.color = '#4caf50';
    } else {
        totalBalance.style.color = '#f44336';
    }
}

function renderTransactions() {
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-message">No hay transacciones aún. ¡Comienza agregando una!</p>';
        return;
    }
    
    transactionsList.innerHTML = transactions.map((t, index) => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-description">${t.description}</div>
                <div class="transaction-category">${getCategoryEmoji(t.category)} ${t.category}</div>
            </div>
            <span class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </span>
            <button class="btn-delete" onclick="deleteTransaction(${index})">Eliminar</button>
        </div>
    `).join('');
}

function getCategoryEmoji(category) {
    const emojis = {
        comida: '🍔',
        transporte: '🚗',
        entretenimiento: '🎮',
        salud: '💊',
        educacion: '📚',
        compras: '🛍️',
        servicios: '🔧',
        otros: '📦'
    };
    return emojis[category] || '📦';
}

function addTransaction(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    
    if (!description || isNaN(amount) || amount <= 0) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date: new Date().toLocaleDateString('es-AR')
    };
    
    transactions.unshift(transaction);
    
    saveToStorage();
    updateUI();
    form.reset();
}

function deleteTransaction(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
        transactions.splice(index, 1);
        saveToStorage();
        updateUI();
    }
}

function clearAllTransactions() {
    if (transactions.length === 0) {
        alert('No hay transacciones para eliminar');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar TODAS las transacciones? Esta acción no se puede deshacer.')) {
        transactions = [];
        saveToStorage();
        updateUI();
    }
}

function updateUI() {
    updateTotals();
    renderTransactions();
}

form.addEventListener('submit', addTransaction);
clearAllBtn.addEventListener('click', clearAllTransactions);

init();