// =================================
// LOGIN FORM
// =================================

const API_BASE_URL = "https://organicspices.onrender.com";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("login-username").value.trim();

    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users/login/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Login successful!");

            localStorage.setItem(
                "loggedInUser",
                data.username
            );

            window.location.href = "index.html";

        } else {

            alert(
                data.message ||
                "Invalid username or password."
            );
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");
    }

});