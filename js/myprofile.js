document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById("profileForm");
    const token = getCookie("Token");

    if (!token) {
        alert("Error occurred. Please re-login.");
        window.location.href = "/login";
        return;
    }

    const fetchUserProfile = async () => {
        try {
            const response = await fetch("http://localhost:8080/user/profile", {
                method: "GET",
                headers: {
                    "Authorization": token,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch profile data");
            }

            const userProfile = await response.json();
            populateProfileForm(userProfile);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            alert("Error loading profile data. Please try again later.");
        }
    };

    const populateProfileForm = (data) => {
        document.getElementById("balance").value = "$" + data.balance;
        document.getElementById("status").value = data.status;
        document.getElementById("username").value = data.username;
        document.getElementById("country").value = data.country || "";
        document.getElementById("whatsapp").value = data.whatsapp || "";
        document.getElementById("viber").value = data.viber || "";
        document.getElementById("registrationDate").value = data.registrationDate;
        document.getElementById("totalListingsCreated").value = data.totalListingsCreated;
    };

    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedProfile = {
            country: profileForm["country"].value,
            whatsapp: profileForm["whatsapp"].value,
            viber: profileForm["viber"].value,
        };

        try {
            const response = await fetch("http://localhost:8080/user/profile", {
                method: "PUT",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again later.");
        }
    });

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }

    fetchUserProfile();
});
