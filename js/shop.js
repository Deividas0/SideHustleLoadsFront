document.addEventListener('DOMContentLoaded', () => {
    const balanceInfo = document.getElementById('balance-info');
    const buyVipButton = document.getElementById('buy-vip');
    const token = getCookie('Token'); // Retrieve token from cookies

    // Fetch current balance
    async function fetchBalance() {
        if (!token) {
            alert('You are not logged in. Please log in to continue.');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user/balance', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }

            const data = await response.json();
            balanceInfo.textContent = `Your current balance: €${data.balance}`;
        } catch (error) {
            console.error('Error fetching balance:', error);
            balanceInfo.textContent = 'Unable to fetch your balance.';
        }
    }

    // Handle VIP Purchase
    buyVipButton.addEventListener('click', async () => {
        if (!token) {
            alert('You are not logged in. Please log in to continue.');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user/vip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: 4 }) // VIP costs €4
            });

            if (!response.ok) {
                throw new Error('Failed to purchase VIP status');
            }

            const data = await response.json();
            alert(data.message);
            fetchBalance(); // Update the balance
        } catch (error) {
            console.error('Error purchasing VIP:', error);
            alert('Unable to complete the purchase. Please try again.');
        }
    });

    // Fetch balance on page load
    fetchBalance();

    // Helper function to get a cookie value
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});
