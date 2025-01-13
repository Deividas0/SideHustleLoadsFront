document.addEventListener('DOMContentLoaded', () => {
    window.goBack = function () {
        window.history.back();
    };

    document.getElementById('topup-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const token = getCookie('Token');

        if (!token) {
            alert('You are not logged in. Please log in to proceed.');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/payment/create-stripe-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                throw new Error('Failed to initiate payment. Please try again.');
            }

            const { sessionId } = await response.json();
            const stripe = Stripe('pk_test_51Pvg0g02npHYE7SXTwXfJzqvOtQ82DpMYTcv5Dxhe8P0Tm221TXwbauvPGCYleU9QR8z8Tfv6r4dBAmIj3VtpDaL00GEEw00u1');
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during the payment process. Please try again.');
        }
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
});
