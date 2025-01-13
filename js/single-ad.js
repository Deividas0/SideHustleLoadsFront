document.addEventListener("DOMContentLoaded", async () => {
    const userDetailsContainer = document.querySelector(".user-info");
    const adDetailsContainer = document.querySelector(".ad-info");
    const token = getCookie("Token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const adId = params.get("id");

    if (!adId) {
        adDetailsContainer.innerHTML = "<p>Error: No ad ID provided in the URL.</p>";
        return;
    }

    const fetchAdDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/listing/${adId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch ad details");
            }

            const data = await response.json();
            const { listing, userProfileDTO } = data;

            displayUserDetails(userProfileDTO);
            displayAdDetails(listing);
        } catch (error) {
            adDetailsContainer.innerHTML = `<p>No ads found. Check the ad ID.</p>`;
        }
    };

    const displayUserDetails = (userProfile) => {
        userDetailsContainer.innerHTML = `
            <div class="user-detail">
                <p class="label">Username:</p>
                <p>${userProfile.username}</p>
            </div>
            <div class="user-detail">
                <p class="label">Country:</p>
                <p>${userProfile.country}</p>
            </div>
            <div class="user-detail">
                <p class="label">Member since:</p>
                <p>${userProfile.registrationDate || 'Not provided'}</p>
            </div>
            <div class="user-detail">
                <p class="label">Total ads created:</p>
                <p>${userProfile.totalListingsCreated || 'Not provided'}</p>
            </div>
            <div class="user-detail">
                <h2> Contact information:
            </div>
            <div class="user-detail">
                <p class="label">WhatsApp:</p>
                <p>${userProfile.whatsapp || 'Not provided'}</p>
            </div>
            <div class="user-detail">
                <p class="label">Viber:</p>
                <p>${userProfile.viber || 'Not provided'}</p>
            </div>
        `;
    };

    const displayAdDetails = (ad) => {
        const adImageContainer = document.querySelector(".ad-image-container");
        const columns = document.querySelectorAll(".ad-info-column");
    
        adImageContainer.innerHTML = `
            <img src="${ad.base64Image}" alt="${ad.title}" class="ad-image">
        `;
    
        columns[0].innerHTML = `
            <div class="ad-detail">
                <p class="label">Title:</p>
                <p>${ad.title}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Description:</p>
                <p>${ad.description}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Pick up country:</p>
                <p>${ad.pickUpCountry}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Country to deliver:</p>
                <p>${ad.deliveryCountry}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Pickup Location:</p>
                <p>${ad.pickUpLocation}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Delivery Location:</p>
                <p>${ad.deliveryLocation}</p>
            </div>
        `;
    
        columns[1].innerHTML = `
            <div class="ad-detail">
                <p class="label">Weight (kg):</p>
                <p>${ad.weight}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Height (cm):</p>
                <p>${ad.height}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Width (cm):</p>
                <p>${ad.width}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Load Type:</p>
                <p>${ad.loadType}</p>
            </div>
            <div class="ad-detail">
                <p class="label">Created At:</p>
                <p>${ad.createdAt}</p>
            </div>
        `;
    };
    
    

    fetchAdDetails();
});

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}
