document.addEventListener("DOMContentLoaded", () => {
    const adsContainer = document.getElementById("adsContainer");
    const filterForm = document.getElementById("filterForm");
    const token = getCookie("Token");

    if (!token) {
        alert("Error occurred. Please re-login.");
        window.location.href = "/login";
        return;
    }

    const fetchAds = async (filterParams = {}) => {
        try {
            const response = await fetch("http://localhost:8080/listing/filter", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filterParams),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch ads");
            }

            const listings = await response.json();
            displayAds(listings);
        } catch (error) {
            adsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error("Error fetching ads:", error);
        }
    };

    const displayAds = (listings) => {
        adsContainer.innerHTML = "";

        if (listings.length === 0) {
            adsContainer.innerHTML = "<p>No ads found.</p>";
            return;
        }

        listings.forEach((ad) => {
            const adElement = document.createElement("div");
            adElement.classList.add("ad-card");

            adElement.innerHTML = `
                <img src="${ad.base64Image}" alt="${ad.title}" class="ad-image">
                <div class="ad-details">
                    <h4>ID: ${ad.id}</h4>
                    <h4>${ad.title}</h4>
                    <p><strong>Description:</strong> ${ad.description}</p>
                    <p><strong>Pick up country:</strong> ${ad.pickUpCountry}</p>
                    <p><strong>Country to deliver:</strong> ${ad.deliveryCountry}</p>
                    <p><strong>Pickup:</strong> ${ad.pickUpLocation}</p>
                    <p><strong>Delivery:</strong> ${ad.deliveryLocation}</p>
                    ${ad.mustDeliverBefore ? `<p><strong>Must deliver before:</strong> ${ad.mustDeliverBefore}</p>` : ""}
                    ${ad.weight ? `<p><strong>Weight (kg):</strong> ${ad.weight}</p>` : ""}
                    ${ad.height ? `<p><strong>Height (cm):</strong> ${ad.height}</p>` : ""}
                    ${ad.width ? `<p><strong>Width (cm):</strong> ${ad.width}</p>` : ""}
                    ${ad.loadType ? `<p><strong>Type:</strong> ${ad.loadType}</p>` : ""}
                    <p><strong>Created At:</strong> ${ad.createdAt}</p>
                </div>
            `;

            adElement.addEventListener("click", () => {
                window.location.href = `/single-ad.html?id=${ad.id}`;
            });

            adsContainer.appendChild(adElement);
        });
    };

    filterForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fromCountry = filterForm["from-country"].value;
        const toCountry = filterForm["to-country"].value;

        const filterParams = {
            pickUpCountry: fromCountry || null,
            deliveryCountry: toCountry || null,
        };

        fetchAds(filterParams);
    });

    fetchAds({});
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
