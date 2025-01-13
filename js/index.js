document.getElementById("loginButton").addEventListener("click", function () {
    window.location.href = "/login";
});

document.getElementById("registerButton").addEventListener("click", function () {
    window.location.href = "/registration";
});

const socket = new SockJS('http://localhost:8080/project');
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
    

    stompClient.subscribe('/topic/time', (message) => {
        document.getElementById('time-display').textContent = message.body;
    });

    stompClient.subscribe('/topic/totalListings', (message) => {
        document.getElementById('total_listings').textContent = "Total ads: " + message.body;
    });
}, (error) => {
    console.log('WebSocket connection error: ', error);
});
