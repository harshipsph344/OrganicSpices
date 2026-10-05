// =================================
// LOGIN FORM
// =================================

const loginForm =
    document.getElementById("login-form");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Get form values

    const username =
        document.getElementById("login-username").value.trim();

    const password =
        document.getElementById("login-password").value;


    // Check fields

    if (!username || !password) {

        alert("Please enter username and password.");

        return;
    }


    // Send login request to Django

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/users/login/",
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

            // Save logged-in username

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

        alert(
            "Unable to connect to the server."
        );
    }

});