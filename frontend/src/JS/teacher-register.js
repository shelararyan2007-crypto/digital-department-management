const API_BASE_URL = "http://localhost:8080";


document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // DOM ELEMENTS
    // =====================================================

    const form =
        document.getElementById("teacherRegistrationForm");

    const nameInput =
    document.querySelector('input[name="name"]');

const facultyIdInput =
    document.querySelector('input[name="username"]');

const emailInput =
    document.querySelector('input[name="email"]');

const mobileInput =
    document.querySelector('input[name="mobile"]');
    const dobDay =
        document.getElementById("dobDay");

    const dobMonth =
        document.getElementById("dobMonth");

    const dobYear =
        document.getElementById("dobYear");

    const genderSelect =
        document.getElementById("gender");

    const departmentSelect =
        document.getElementById("department");

    const passwordInput =
        document.getElementById("password");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const backToLoginButton =
        document.getElementById("backToLogin");


    // =====================================================
    // INITIALIZATION
    // =====================================================

    populateDays();
    populateYears();

    setupPasswordToggles();
    setupMobileInput();
    setupForm();
    setupBackButton();


    // =====================================================
    // TOAST CONTAINER
    // =====================================================

    function getToastContainer() {

        let container =
            document.getElementById("toastContainer");

        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "toastContainer";

            container.className =
                "toast-container";

            document.body.appendChild(container);
        }

        return container;
    }


    // =====================================================
    // TOAST SYSTEM
    // =====================================================

    function showToast(
        title,
        message,
        type = "error"
    ) {

        const toastContainer =
            getToastContainer();


        let iconClass =
            "fa-solid fa-circle-exclamation";


        if (type === "success") {

            iconClass =
                "fa-solid fa-circle-check";

        }

        else if (type === "warning") {

            iconClass =
                "fa-solid fa-triangle-exclamation";
        }


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


        const closeButton =
            toast.querySelector(".toast-close");


        closeButton.addEventListener(
            "click",
            () => {

                removeToast(toast);

            }
        );


        toastContainer.appendChild(toast);


        // Allow CSS animation to start
        requestAnimationFrame(() => {

            toast.classList.add("show");

        });


        setTimeout(() => {

            removeToast(toast);

        }, 4500);
    }


    // =====================================================
    // REMOVE TOAST
    // =====================================================

    function removeToast(toast) {

        if (!toast) {
            return;
        }


        toast.classList.remove("show");


        setTimeout(() => {

            if (toast.parentNode) {

                toast.parentNode.removeChild(toast);

            }

        }, 300);
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;
    }


    // =====================================================
    // PASSWORD EYE TOGGLES
    // =====================================================
function setupPasswordToggles() {

    const passwordToggleButtons =
        document.querySelectorAll(
            ".password-toggle"
        );


    passwordToggleButtons.forEach(
        (button) => {

            button.type = "button";


            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    const wrapper =
                        button.closest(
                            ".input-wrapper"
                        );


                    if (!wrapper) {
                        return;
                    }


                    const input =
                        wrapper.querySelector(
                            "input"
                        );


                    const icon =
                        button.querySelector("i");


                    if (!input) {
                        return;
                    }


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type = "text";


                        if (icon) {

                            icon.classList.remove(
                                "fa-eye"
                            );

                            icon.classList.add(
                                "fa-eye-slash"
                            );
                        }


                        button.setAttribute(
                            "aria-label",
                            "Hide password"
                        );

                    } else {

                        input.type = "password";


                        if (icon) {

                            icon.classList.remove(
                                "fa-eye-slash"
                            );

                            icon.classList.add(
                                "fa-eye"
                            );
                        }


                        button.setAttribute(
                            "aria-label",
                            "Show password"
                        );
                    }

                }
            );
        }
    );
}

    // =====================================================
    // POPULATE DAYS
    // =====================================================

    function populateDays() {

        if (!dobDay) {
            return;
        }


        for (
            let day = 1;
            day <= 31;
            day++
        ) {

            const option =
                document.createElement("option");


            option.value =
                day;

            option.textContent =
                day;


            dobDay.appendChild(
                option
            );
        }
    }


    // =====================================================
    // POPULATE YEARS
    // =====================================================

    function populateYears() {

        if (!dobYear) {
            return;
        }


        const currentYear =
            new Date().getFullYear();


        for (
            let year = currentYear;
            year >= 1940;
            year--
        ) {

            const option =
                document.createElement("option");


            option.value =
                year;

            option.textContent =
                year;


            dobYear.appendChild(
                option
            );
        }
    }


    // =====================================================
    // MOBILE INPUT
    // =====================================================

    function setupMobileInput() {

        if (!mobileInput) {
            return;
        }


        mobileInput.addEventListener(
            "input",
            () => {

                mobileInput.value =
                    mobileInput.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );
    }


    // =====================================================
    // GET VALID DOB
    // =====================================================

    function getDateOfBirth() {

        const day =
            Number(dobDay.value);

        const month =
            Number(dobMonth.value);

        const year =
            Number(dobYear.value);


        if (
            !day ||
            !month ||
            !year
        ) {

            return null;
        }


        const date =
            new Date(
                year,
                month - 1,
                day
            );


        /*
         * Prevent invalid dates:
         *
         * 31 February
         * 31 April
         * etc.
         */

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {

            return null;
        }


        /*
         * Prevent future DOB.
         */

        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        if (date > today) {

            return null;
        }


        const monthString =
            String(month)
                .padStart(2, "0");


        const dayString =
            String(day)
                .padStart(2, "0");


        return `${year}-${monthString}-${dayString}`;
    }


    // =====================================================
    // CALCULATE AGE
    // =====================================================

    function calculateAge(
        dateOfBirth
    ) {

        const birthDate =
            new Date(
                `${dateOfBirth}T00:00:00`
            );


        const today =
            new Date();


        let age =
            today.getFullYear()
            -
            birthDate.getFullYear();


        const monthDifference =
            today.getMonth()
            -
            birthDate.getMonth();


        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate()
                <
                birthDate.getDate()
            )
        ) {

            age--;
        }


        return age;
    }


    // =====================================================
    // FORM SUBMISSION
    // =====================================================

    function setupForm() {

        if (!form) {

            console.error(
                "Teacher registration form not found."
            );

            return;
        }


        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // -----------------------------------------
                // READ VALUES
                // -----------------------------------------

                const name =
                    nameInput.value.trim();


                const facultyId =
                    facultyIdInput.value
                        .trim()
                        .toUpperCase();


                const email =
                    emailInput.value.trim();


                const mobile =
                    mobileInput.value.trim();


                const dateOfBirth =
                    getDateOfBirth();


                const gender =
                    genderSelect.value;


                const departmentId =
                    departmentSelect.value;


                const password =
                    passwordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

                if (!name) {

                    showToast(
                        "Full Name Required",
                        "Please enter your full name.",
                        "error"
                    );

                    nameInput.focus();

                    return;
                }


                if (!facultyId) {

                    showToast(
                        "Faculty ID Required",
                        "Please enter your Faculty ID.",
                        "error"
                    );

                    facultyIdInput.focus();

                    return;
                }


                if (!email) {

                    showToast(
                        "Email Required",
                        "Please enter your email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(email)
                ) {

                    showToast(
                        "Invalid Email",
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;
                }


                if (
                    mobile.length !== 10
                ) {

                    showToast(
                        "Invalid Mobile Number",
                        "Mobile number must contain exactly 10 digits.",
                        "error"
                    );

                    mobileInput.focus();

                    return;
                }


                if (!dateOfBirth) {

                    showToast(
                        "Invalid Date of Birth",
                        "Please enter a valid date of birth that is not in the future.",
                        "error"
                    );

                    return;
                }


                // -----------------------------------------
                // AGE CHECK
                // -----------------------------------------

                const age =
                    calculateAge(
                        dateOfBirth
                    );


                if (age < 18) {

                    showToast(
                        "Age Requirement",
                        `Teacher registration requires an age of at least 18 years. Current age: ${age}.`,
                        "error"
                    );

                    return;
                }


                if (!gender) {

                    showToast(
                        "Gender Required",
                        "Please select your gender.",
                        "error"
                    );

                    genderSelect.focus();

                    return;
                }


                if (!departmentId) {

                    showToast(
                        "Department Required",
                        "Please select your department.",
                        "error"
                    );

                    departmentSelect.focus();

                    return;
                }


                if (!password) {

                    showToast(
                        "Password Required",
                        "Please enter a password.",
                        "error"
                    );

                    passwordInput.focus();

                    return;
                }


                if (
                    password.length < 6
                ) {

                    showToast(
                        "Weak Password",
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    passwordInput.focus();

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showToast(
                        "Password Mismatch",
                        "Password and confirm password do not match.",
                        "error"
                    );

                    confirmPasswordInput.focus();

                    return;
                }


                // -----------------------------------------
                // REQUEST BODY
                // -----------------------------------------

                const requestBody = {

                    name: name,

                    username: facultyId,

                    email: email,

                    dateOfBirth:
                        dateOfBirth,

                    mobile: mobile,

                    gender: gender,

                    password: password,

                    departmentId:
                        Number(departmentId)
                };


                // -----------------------------------------
                // REGISTER BUTTON
                // -----------------------------------------

                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "Register";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Registering...";
                }


                // -----------------------------------------
                // BACKEND REQUEST
                // -----------------------------------------

                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/api/teacher-registration`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        requestBody
                                    )
                            }
                        );


                    const responseText =
                        await response.text();


                    let data = {};


                    if (
                        responseText &&
                        responseText.trim() !== ""
                    ) {

                        try {

                            data =
                                JSON.parse(
                                    responseText
                                );

                        } catch {

                            data = {};
                        }
                    }


                    // -----------------------------------------
                    // BACKEND ERROR
                    // -----------------------------------------

                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            responseText ||
                            `Registration failed with status ${response.status}.`
                        );
                    }


                    // -----------------------------------------
                    // SUCCESS
                    // -----------------------------------------

                    showToast(
                        "Registration Successful",
                        "Your account has been submitted and is waiting for HOD approval.",
                        "success"
                    );


                    form.reset();


                    // Reset password icons
                    document
                        .querySelectorAll(
                            ".password-toggle"
                        )
                        .forEach(button => {

                            const icon =
                                button.querySelector("i");

                            if (icon) {

                                icon.classList.remove(
                                    "fa-eye-slash"
                                );

                                icon.classList.add(
                                    "fa-eye"
                                );
                            }


                            button.setAttribute(
                                "aria-label",
                                "Show password"
                            );
                        });


                    setTimeout(
                        () => {

                            window.location.href =
                                "index.html";

                        },
                        2500
                    );


                } catch (error) {

                    console.error(
                        "Teacher registration error:",
                        error
                    );


                    if (
                        error instanceof TypeError
                    ) {

                        showToast(
                            "Connection Error",
                            "Unable to connect to the backend. Make sure Spring Boot is running.",
                            "error"
                        );

                    }

                    else {

                        showToast(
                            "Registration Failed",
                            error.message ||
                            "Something went wrong during registration.",
                            "error"
                        );
                    }


                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalText;
                    }
                }
            }
        );
    }


    // =====================================================
    // BACK TO LOGIN
    // =====================================================

    function setupBackButton() {

        if (!backToLoginButton) {
            return;
        }


        backToLoginButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "index.html";
            }
        );
    }

});