document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) {
        alert('Missing session ID. Please contact support.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/payment/update-balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to update balance. Please contact support.');
        }

        const data = await response.json();
        alert(`Balance updated successfully! New balance: ${data.newBalance} EUR.`);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating your balance. Please try again.');
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
