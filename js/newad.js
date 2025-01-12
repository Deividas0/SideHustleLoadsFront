document.addEventListener("DOMContentLoaded", () => {
    const newAdForm = document.getElementById("newAdForm");
    const token = getCookie("Token");

    // Redirect to login if token is missing
    if (!token) {
        window.location.href = "/login";
        return;
    }

    newAdForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData();

        // Prepare listing data
        const listing = {
            title: newAdForm.title.value,
            description: newAdForm.description.value,
            pickUpCountry: newAdForm.pickUpCountry.value, // New field
            deliveryCountry: newAdForm.deliveryCountry.value, // New field
            pickUpLocation: newAdForm.pickUpLocation.value,
            deliveryLocation: newAdForm.deliveryLocation.value,
            weight: newAdForm.weight.value,
            height: newAdForm.height.value,
            width: newAdForm.width.value,
            loadType: newAdForm.loadType.value,
        };

        // Validate mandatory fields for countries
        if (!listing.pickUpCountry || !listing.deliveryCountry) {
            alert("Please select both Pick Up Country and Country to Deliver.");
            return;
        }

        // Add listing as JSON string to FormData
        formData.append("listing", JSON.stringify(listing));

        // Add image file to FormData
        const imageFile = newAdForm.imageFile.files[0];
        if (imageFile) {
            if (!validateImageFile(imageFile)) {
                alert("Invalid file type. Only PNG, JPEG, and GIF are allowed.");
                return;
            }
            formData.append("file", imageFile);
        }

        try {
            const response = await fetch("http://localhost:8080/listing/new", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData, // Send FormData directly
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create ad");
            }

            alert("Ad created successfully!");
            window.location.href = "/ads.html";
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        }
    });

    // Validate file type
    function validateImageFile(file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
        return allowedTypes.includes(file.type);
    }

    // Get a specific cookie by name
    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }
});
