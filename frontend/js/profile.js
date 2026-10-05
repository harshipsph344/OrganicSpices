// =================================
// GET LOGGED-IN USER
// =================================

const loggedInUser =
    localStorage.getItem("loggedInUser");


// =================================
// CHECK LOGIN
// =================================

if (!loggedInUser) {

    alert("Please login first.");

    window.location.href =
        "login.html";

}


// =================================
// LOAD USER PROFILE
// =================================

async function loadProfile() {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/users/profile/${loggedInUser}/`
        );

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load profile."
            );

        }


        // =============================
        // DISPLAY PROFILE DATA
        // =============================

        document.getElementById(
            "profile-username"
        ).value = data.username;


        document.getElementById(
            "profile-email"
        ).value = data.email;


        document.getElementById(
            "profile-phone"
        ).value = data.phone;


        document.getElementById(
            "profile-address"
        ).value = data.address;


    } catch (error) {

        console.error(error);

        document.getElementById(
            "profile-message"
        ).innerHTML = `
            <p class="text-danger">
                Unable to load profile.
            </p>
        `;

    }

}


// =================================
// LOAD PROFILE
// =================================

loadProfile();