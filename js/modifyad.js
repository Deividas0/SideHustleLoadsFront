document.addEventListener("DOMContentLoaded", () => {
    const modifyAdForm = document.getElementById("modifyAdForm");
    const adIdInput = document.getElementById("adId");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const pickUpCountryInput = document.getElementById("pickUpCountry");
    const countryToDeliverInput = document.getElementById("countryToDeliver");
    const pickUpLocationInput = document.getElementById("pickUpLocation");
    const deliveryLocationInput = document.getElementById("deliveryLocation");
    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");
    const widthInput = document.getElementById("width");
    const loadTypeInput = document.getElementById("loadType");

    const token = getCookie("Token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const fetchAdDetails = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const adId = urlParams.get("id");

        if (!adId) {
            alert("Ad ID is missing!");
            window.location.href = "/myads.html";
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/listing/${adId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch ad details.");
            }

            const data = await response.json();
            const listing = data.listing;

            adIdInput.value = listing.id;
            titleInput.value = listing.title;
            descriptionInput.value = listing.description;
            pickUpCountryInput.value = listing.pickUpCountry;
            countryToDeliverInput.value = listing.deliveryCountry;
            pickUpLocationInput.value = listing.pickUpLocation;
            deliveryLocationInput.value = listing.deliveryLocation;
            weightInput.value = listing.weight;
            heightInput.value = listing.height;
            widthInput.value = listing.width;
            loadTypeInput.value = listing.loadType;
        } catch (error) {
            alert(`Error: ${error.message}`);
            window.location.href = "/myads.html";
        }
    };

    
    modifyAdForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const adId = adIdInput.value;
        const formData = {
            id: adId,
            title: titleInput.value,
            description: descriptionInput.value,
            pickUpCountry: pickUpCountryInput.value,
            deliveryCountry: countryToDeliverInput.value,
            pickUpLocation: pickUpLocationInput.value,
            deliveryLocation: deliveryLocationInput.value,
            weight: weightInput.value,
            height: heightInput.value,
            width: widthInput.value,
            loadType: loadTypeInput.value,
        };

        await updateAd(adId, formData);
    });

    const updateAd = async (adId, data) => {
        try {
            const response = await fetch(`http://localhost:8080/listing/${adId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Failed to update ad: ${errorDetails}`);
            }

            alert("Ad updated successfully!");
            window.location.href = "/myads.html";
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    fetchAdDetails();

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
