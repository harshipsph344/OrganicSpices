// =================================
// GET LOGGED-IN USER
// =================================

const API_BASE_URL = "https://organicspices.onrender.com";

const loggedInUser = localStorage.getItem("loggedInUser");


// =================================
// CHECK LOGIN
// =================================

if (!loggedInUser) {

    alert("Please login first.");

    window.location.href = "login.html";
}


// =================================
// LOAD USER PROFILE
// =================================

async function loadProfile() {

    try {

        const response = await fetch(
            API_BASE_URL + "/api/users/profile/" + loggedInUser + "/"
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Unable to load profile."
            );

        }


        // Display profile data

        document.getElementById("profile-username").value =
            data.username;

        document.getElementById("profile-email").value =
            data.email;

        document.getElementById("profile-phone").value =
            data.phone || "";

        document.getElementById("profile-address").value =
            data.address || "";


    } catch (error) {

        console.error(error);

        document.getElementById("profile-message").innerHTML =
            '<p class="text-danger">Unable to load profile.</p>';

    }

}


// =================================
// UPDATE USER PROFILE
// =================================

async function updateProfile() {

    const phone =
        document.getElementById("profile-phone").value.trim();

    const address =
        document.getElementById("profile-address").value.trim();


    try {

        const response = await fetch(
            API_BASE_URL +
            "/api/users/profile/update/" +
            loggedInUser +
            "/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    phone: phone,
                    address: address
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            document.getElementById("profile-message").innerHTML =
                '<p class="text-success">Profile updated successfully!</p>';

        } else {

            document.getElementById("profile-message").innerHTML =
                '<p class="text-danger">' +
                (data.message || "Unable to update profile.") +
                '</p>';

        }


    } catch (error) {

        console.error(error);

        document.getElementById("profile-message").innerHTML =
            '<p class="text-danger">Unable to connect to the server.</p>';

    }

}


// =================================
// LOAD PROFILE
// =================================

loadProfile();