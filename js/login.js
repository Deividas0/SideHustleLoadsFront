document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    const body = {
        username: username,
        password: password
    };

    fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then((text) => {
                    errorMessage.textContent = text;
                });
            }
        })
        .then((data) => {
            const token = data.token;
            setCookie("Token", token);
            alert("Login successful!");
            window.location.href = "/ads.html";
        })
        .catch((error) => {
            console.error("Error:", error);
            if (!errorMessage.textContent) {
                alert("An error occurred. Please try again later.");
            }
        });
});

function setCookie(name, value) {
    let date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toUTCString();

    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
}