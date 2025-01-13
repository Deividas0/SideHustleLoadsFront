document.addEventListener("DOMContentLoaded", () => {
    const adsContainer = document.getElementById("adsContainer");
    const token = getCookie("Token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const fetchMyAds = async () => {
        try {
            const response = await fetch("http://localhost:8080/listing/byuserid", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch your ads.");
            }

            const listings = await response.json();
            displayAds(listings);
        } catch (error) {
            adsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    };

    const displayAds = (listings) => {
        adsContainer.innerHTML = "";
        if (listings.length === 0) {
            adsContainer.innerHTML = "<p>You have no ads.</p>";
            return;
        }

        listings.forEach((ad) => {
            const adElement = document.createElement("div");
            adElement.classList.add("ad-card");
            adElement.innerHTML = `
                <img src="${ad.base64Image || 'https://i.ibb.co/8M8yPnQ/no-image.jpg'}" alt="${ad.title}" class="ad-image">
                <div class="ad-details">
                    <h4>ID: ${ad.id}</h4>
                    <h4>${ad.title}</h4>
                    <p>${ad.description}</p>
                    <p><strong>Pickup:</strong> ${ad.pickUpLocation}</p>
                    <p><strong>Delivery:</strong> ${ad.deliveryLocation}</p>
                    <p><strong>Weight:</strong> ${ad.weight} kg</p>
                    <p><strong>Height:</strong> ${ad.height} cm</p>
                    <p><strong>Width:</strong> ${ad.width} cm</p>
                    <p><strong>Type:</strong> ${ad.loadType}</p>
                    <p><strong>Created At:</strong> ${ad.createdAt}</p>
                </div>
                <div class="ad-actions">
                    <button class="edit-btn" data-id="${ad.id}">Modify</button>
                    <button class="delete-btn" data-id="${ad.id}">Delete</button>
                </div>
            `;
            adsContainer.appendChild(adElement);
        });
        

        document.querySelectorAll(".edit-btn").forEach((button) =>
            button.addEventListener("click", handleModify)
        );

        document.querySelectorAll(".delete-btn").forEach((button) =>
            button.addEventListener("click", handleDelete)
        );
    };

    const handleModify = (event) => {
        const adId = event.target.dataset.id;
        window.location.href = `/modifyad.html?id=${adId}`;
    };

    const handleDelete = async (event) => {
        const adId = event.target.dataset.id;

        if (!confirm("Are you sure you want to delete this ad?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/listing/${adId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete the ad.");
            }

            alert("Ad deleted successfully.");
            fetchMyAds();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    fetchMyAds();

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }
});
