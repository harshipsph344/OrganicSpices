// =================================
// REGISTER FORM
// =================================

const API_BASE_URL = "https://organicspices.onrender.com";

const registerForm =
    document.getElementById("register-form");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Get form values

    const name =
        document.getElementById("register-name").value.trim();

    const username =
        document.getElementById("register-username").value.trim();

    const email =
        document.getElementById("register-email").value.trim();

    const password =
        document.getElementById("register-password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;


    // Check password

    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;
    }


    // Send data to Django backend

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users/register/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: username,

                    email: email,

                    password: password

                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            alert("Account created successfully!");

            registerForm.reset();

            window.location.href = "login.html";

        } else {

            alert(
                data.message ||
                "Registration failed!"
            );
        }


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }

});