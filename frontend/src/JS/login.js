/* =====================================================
   LOGIN SYSTEM
   ATMA MALIK INSTITUTE
===================================================== */


/* =====================================================
   API CONFIGURATION
===================================================== */

const API_BASE_URL = "http://localhost:8080";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const togglePassword =
    document.getElementById("togglePassword");

const passwordIcon =
    document.getElementById("passwordIcon");

const usernameLabel =
    document.getElementById("usernameLabel");

const toastContainer =
    document.getElementById("toastContainer");

const accountTypeButtons =
    document.querySelectorAll(".account-type");


/* =====================================================
   TEACHER REGISTRATION ELEMENTS
===================================================== */

let teacherRegistration = null;

let registerTeacherButton = null;


/* =====================================================
   CURRENT ROLE
===================================================== */

let selectedRole = "HOD";


/* =====================================================
   INITIALIZE LOGIN SYSTEM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Login system initialized.");

    teacherRegistration =
        document.getElementById("teacherRegistration");

    registerTeacherButton =
        document.getElementById("registerTeacherButton");

    setupAccountTypeButtons();

    setupPasswordToggle();

    setupForm();

    setupTeacherRegistration();

    updateUsernameField();

});


/* =====================================================
   ACCOUNT TYPE BUTTONS
===================================================== */

function setupAccountTypeButtons() {

    accountTypeButtons.forEach(button => {

        button.addEventListener("click", () => {

            accountTypeButtons.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            selectedRole =
                button.dataset.role;


            console.log(
                "Selected role:",
                selectedRole
            );


            /*
             * Update username field
             * according to selected role.
             */

            updateUsernameField();


            /*
             * Clear old input values when
             * switching account type.
             */

            usernameInput.value = "";

            passwordInput.value = "";

        });

    });

}


/* =====================================================
   UPDATE USERNAME FIELD
===================================================== */

function updateUsernameField() {

    /*
     * Teacher registration visibility
     *
     * Only TEACHING_STAFF should see
     * the registration option.
     */

    if (teacherRegistration) {

        if (selectedRole === "TEACHING_STAFF") {

            teacherRegistration.style.setProperty(
                "display",
                "flex",
                "important"
            );

        } else {

            teacherRegistration.style.setProperty(
                "display",
                "none",
                "important"
            );

        }

    }


    /*
     * HOD
     */

    if (selectedRole === "HOD") {

        usernameLabel.textContent =
            "Username";

        usernameInput.placeholder =
            "Enter your username";

        usernameInput.autocomplete =
            "username";

    }


    /*
     * TEACHING STAFF
     */

    else if (
        selectedRole === "TEACHING_STAFF"
    ) {

        usernameLabel.textContent =
            "Faculty ID";

        usernameInput.placeholder =
            "Enter your Faculty ID";

        usernameInput.autocomplete =
            "username";

    }


    /*
     * STUDENT
     */

    else {

        usernameLabel.textContent =
            "Username";

        usernameInput.placeholder =
            "Enter your username";

        usernameInput.autocomplete =
            "username";

    }

}


/* =====================================================
   TEACHER REGISTRATION
===================================================== */

function setupTeacherRegistration() {

    if (!registerTeacherButton) {

        console.log(
            "Teacher registration button not found."
        );

        return;

    }


    registerTeacherButton.addEventListener(
        "click",
        () => {

            console.log(
                "Opening teacher registration page."
            );

            window.location.href =
                "teacher-register.html";

        }
    );

}


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function setupPasswordToggle() {

    if (!togglePassword) {

        console.error(
            "Password toggle button not found."
        );

        return;

    }


    togglePassword.addEventListener(
        "click",
        (event) => {

            /*
             * Prevent the button from
             * submitting the form.
             */

            event.preventDefault();


            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";


                passwordIcon.className =
                    "fa-regular fa-eye-slash";


                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }


            else {

                passwordInput.type =
                    "password";


                passwordIcon.className =
                    "fa-regular fa-eye";


                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =====================================================
   FORM SUBMISSION
===================================================== */

function setupForm() {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            console.log(
                "Login button clicked."
            );


            /*
             * Read values
             */

            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;


            /* ==========================================
               VALIDATION
            =========================================== */


            /*
             * BOTH EMPTY
             */

            if (
                username === "" &&
                password === ""
            ) {

                showToast(
                    "Fields Required",
                    "Please enter your username and password.",
                    "error"
                );

                usernameInput.focus();

                return;

            }


            /*
             * USERNAME EMPTY
             */

            if (username === "") {

                showToast(
                    "Username Required",
                    "Please enter your username.",
                    "error"
                );

                usernameInput.focus();

                return;

            }


            /*
             * PASSWORD EMPTY
             */

            if (password === "") {

                showToast(
                    "Password Required",
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            /* ==========================================
               LOGIN
            =========================================== */

            await performLogin(
                username,
                password
            );

        }
    );

}


/* =====================================================
   PERFORM LOGIN
===================================================== */

async function performLogin(
    username,
    password
) {

    /*
     * Disable button while
     * request is running.
     */

    setLoginLoading(true);


    const loginData = {

        username: username,

        password: password

    };


    console.log(
        "Sending login request:",
        {
            username: username,
            role: selectedRole
        }
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            loginData
                        )

                }
            );


        console.log(
            "Login HTTP status:",
            response.status
        );


        /*
         * Read response safely.
         *
         * We DO NOT blindly call
         * response.json().
         *
         * This prevents the
         * "Unexpected end of JSON input"
         * error.
         */

        const rawResponse =
            await response.text();


        console.log(
            "Raw login response:",
            rawResponse
        );


        let data = null;


        if (
            rawResponse &&
            rawResponse.trim() !== ""
        ) {

            try {

                data =
                    JSON.parse(
                        rawResponse
                    );

            }

            catch (jsonError) {

                console.error(
                    "JSON parsing error:",
                    jsonError
                );

            }

        }


        /* ==========================================
           HTTP ERROR
        =========================================== */

        if (!response.ok) {

            /*
             * 401 / 403 / other errors
             */

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                showToast(
                    "Login Failed",
                    "Invalid username or password.",
                    "error"
                );

            }


            else if (
                response.status >= 500
            ) {

                showToast(
                    "Server Error",
                    "The server could not process your login. Please try again.",
                    "error"
                );

            }


            else {

                showToast(
                    "Login Failed",
                    "Unable to login. Please check your credentials.",
                    "error"
                );

            }


            console.error(
                "Login failed:",
                response.status,
                data
            );


            setLoginLoading(false);

            return;

        }


        /* ==========================================
           SUCCESS RESPONSE
        =========================================== */

        if (!data) {

            showToast(
                "Login Failed",
                "The server returned an invalid response.",
                "error"
            );

            setLoginLoading(false);

            return;

        }


        console.log(
            "Login response:",
            data
        );


        /* ==========================================
           ROLE VALIDATION
        =========================================== */

        const backendRole =
            data.role;


        if (
            backendRole !==
            selectedRole
        ) {

            showToast(
                "Wrong Account Type",
                "Please select the correct account type for this account.",
                "error"
            );

            setLoginLoading(false);

            return;

        }


        /* ==========================================
           SAVE USER
        =========================================== */

        localStorage.setItem(
            "currentUser",
            JSON.stringify(data)
        );


        console.log(
            "Current user saved:",
            data
        );


        /* ==========================================
           SUCCESS TOAST
        =========================================== */

        showToast(
            "Login Successful",
            `Welcome back, ${data.name || data.username}.`,
            "success"
        );


        /* ==========================================
           REDIRECT
        =========================================== */

        setTimeout(() => {

            /*
             * HOD
             */

            if (
                backendRole ===
                "HOD"
            ) {

                window.location.href =
                    "hod-dashboard.html";

            }


            /*
             * TEACHING STAFF
             *
             * Teacher dashboard is not
             * built yet.
             */

            else if (
                backendRole ===
                "TEACHING_STAFF"
            ) {

                showToast(
                    "Teacher Portal",
                    "Teacher dashboard is coming soon.",
                    "success"
                );

                setLoginLoading(false);

            }


            /*
             * STUDENT
             *
             * Student dashboard is not
             * built yet.
             */

            else if (
                backendRole ===
                "STUDENT"
            ) {

                showToast(
                    "Student Portal",
                    "Student dashboard is coming soon.",
                    "success"
                );

                setLoginLoading(false);

            }


        }, 900);


    }


    catch (error) {

        console.error(
            "LOGIN FETCH ERROR:",
            error
        );


        /*
         * This catches:
         *
         * - backend offline
         * - CORS problem
         * - network failure
         * - localhost mismatch
         */

        showToast(
            "Connection Error",
            "Unable to connect to the server. Make sure the backend is running.",
            "error"
        );


        setLoginLoading(false);

    }

}


/* =====================================================
   LOGIN BUTTON LOADING
===================================================== */

function setLoginLoading(
    loading
) {

    if (loading) {

        loginButton.disabled =
            true;

        loginButtonText.textContent =
            "LOGGING IN...";

    }


    else {

        loginButton.disabled =
            false;

        loginButtonText.textContent =
            "LOGIN";

    }

}


/* =====================================================
   TOAST SYSTEM
===================================================== */

function showToast(
    title,
    message,
    type = "error"
) {

    /*
     * Make absolutely sure
     * the container exists.
     */

    if (!toastContainer) {

        console.error(
            "Toast container not found."
        );

        return;

    }


    /* ==========================================
       ICON
    =========================================== */

    let iconClass =
        "fa-solid fa-circle-exclamation";


    if (type === "success") {

        iconClass =
            "fa-solid fa-circle-check";

    }


    /* ==========================================
       CREATE TOAST
    =========================================== */

    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="${iconClass}"></i>

        </div>


        <div class="toast-content">

            <strong>
                ${escapeHtml(title)}
            </strong>

            <span>
                ${escapeHtml(message)}
            </span>

        </div>


        <button
            type="button"
            class="toast-close"
            aria-label="Close notification">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    /* ==========================================
       CLOSE BUTTON
    =========================================== */

    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            removeToast(toast);

        }
    );


    /* ==========================================
       ADD TO PAGE
    =========================================== */

    toastContainer.appendChild(
        toast
    );


    /* ==========================================
       AUTO REMOVE
    =========================================== */

    setTimeout(() => {

        removeToast(toast);

    }, 4000);

}


/* =====================================================
   REMOVE TOAST
===================================================== */

function removeToast(
    toast
) {

    if (!toast) {

        return;

    }


    toast.style.opacity =
        "0";

    toast.style.transform =
        "translateX(35px)";

    toast.style.transition =
        "all 0.25s ease";


    setTimeout(() => {

        if (
            toast.parentNode
        ) {

            toast.remove();

        }

    }, 250);

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


/* =====================================================
   DEVELOPMENT DEBUG
===================================================== */

console.log(
    "Login JavaScript loaded successfully."
);