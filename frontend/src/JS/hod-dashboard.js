// =====================================================
// HOD DASHBOARD
// =====================================================

const API_BASE_URL = "http://localhost:8080";


// =====================================================
// GET LOGGED-IN USER
// =====================================================

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);


// =====================================================
// AUTH CHECK
// =====================================================

if (!currentUser) {

    window.location.href = "index.html";

}


// =====================================================
// DOM ELEMENTS
// =====================================================

const departmentNameElement =
    document.getElementById("departmentName");

const totalTeachersElement =
    document.getElementById("totalTeachers");

const totalStudentsElement =
    document.getElementById("totalStudents");

const pendingRequestsElement =
    document.getElementById("pendingRequests");

const todaysAttendanceElement =
    document.getElementById("todaysAttendance");


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    if (
        !currentUser ||
        !currentUser.departmentId
    ) {

        console.error(
            "Department information is missing."
        );

        showDashboardToast(
            "Dashboard Error",
            "Department information is missing.",
            "error"
        );

        return;
    }


    const departmentId =
        currentUser.departmentId;


    console.log(
        "Loading dashboard for department:",
        departmentId
    );


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/hod/dashboard/${departmentId}`
        );


        console.log(
            "Dashboard HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Dashboard request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Dashboard data:",
            data
        );


        // =================================================
        // DEPARTMENT NAME
        // =================================================

        if (departmentNameElement) {

            departmentNameElement.textContent =
                data.departmentName ||
                currentUser.departmentName ||
                "Department";

        }


        // =================================================
        // TOTAL TEACHERS
        // =================================================

        if (totalTeachersElement) {

            totalTeachersElement.textContent =
                data.totalTeachers ?? 0;

        }


        // =================================================
        // TOTAL STUDENTS
        // =================================================

        if (totalStudentsElement) {

            totalStudentsElement.textContent =
                data.totalStudents ?? 0;

        }


        // =================================================
        // PENDING REQUESTS
        // =================================================

        if (pendingRequestsElement) {

            pendingRequestsElement.textContent =
                data.pendingRequests ?? 0;

        }


        // =================================================
        // TODAY'S ATTENDANCE
        // =================================================

        if (todaysAttendanceElement) {

            todaysAttendanceElement.textContent =
                `${data.todaysAttendance ?? 0}%`;

        }


        // =================================================
        // FIX LOADING DEPARTMENT TEXT
        // =================================================

        document
            .querySelectorAll("*")
            .forEach(element => {

                if (
                    element.children.length === 0 &&
                    element.textContent.trim() ===
                        "Loading department..."
                ) {

                    element.textContent =
                        data.departmentName ||
                        currentUser.departmentName ||
                        "Department";

                }

            });


        console.log(
            "Dashboard updated successfully."
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        if (departmentNameElement) {

            departmentNameElement.textContent =
                currentUser.departmentName ||
                "Department";

        }


        document
            .querySelectorAll("*")
            .forEach(element => {

                if (
                    element.children.length === 0 &&
                    element.textContent.trim() ===
                        "Loading department..."
                ) {

                    element.textContent =
                        currentUser.departmentName ||
                        "Department";

                }

            });


        showDashboardToast(
            "Connection Error",
            "Unable to load dashboard data.",
            "error"
        );

    }

}


// =====================================================
// LOAD PENDING TEACHER REQUESTS
// =====================================================

async function loadPendingTeacherRequests() {

    if (
        !currentUser ||
        !currentUser.departmentId
    ) {

        console.error(
            "HOD department ID is missing."
        );

        return;
    }


    const departmentId =
        currentUser.departmentId;


    const requestsList =
        document.getElementById(
            "pendingRequestsList"
        );


    const pendingBadge =
        document.getElementById(
            "pendingRequestBadge"
        );


    if (!requestsList) {

        console.error(
            "pendingRequestsList element was not found."
        );

        return;
    }


    requestsList.innerHTML = `
        <div class="pending-loading">
            Loading pending requests...
        </div>
    `;


    console.log(
        "Loading pending teacher requests for department:",
        departmentId
    );


    try {

        // =================================================
        // GET ALL TEACHER-DEPARTMENT RELATIONSHIPS
        // =================================================

        const response = await fetch(
            `${API_BASE_URL}/api/teacher-departments/department/${departmentId}`
        );


        console.log(
            "Pending requests HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Pending request API failed: ${response.status}`
            );

        }


        const allRequests =
            await response.json();


        console.log(
            "All teacher department requests:",
            allRequests
        );


        // =================================================
        // FILTER ONLY PENDING REQUESTS
        // =================================================

        const requests =
            Array.isArray(allRequests)
                ? allRequests.filter(
                    request =>
                        request.status === "PENDING"
                )
                : [];


        console.log(
            "Filtered pending teacher requests:",
            requests
        );


        // =================================================
        // UPDATE BADGE
        // =================================================

        if (pendingBadge) {

            pendingBadge.textContent =
                requests.length;

        }


        // =================================================
        // UPDATE DASHBOARD COUNTER
        // =================================================

        if (pendingRequestsElement) {

            pendingRequestsElement.textContent =
                requests.length;

        }


        // =================================================
        // NO REQUESTS
        // =================================================

        if (requests.length === 0) {

            requestsList.innerHTML = `

                <div class="pending-empty-state">

                    <i class="fa-solid fa-circle-check"></i>

                    <span>
                        No pending teacher requests.
                    </span>

                </div>

            `;

            return;
        }


        // =================================================
        // CLEAR LIST
        // =================================================

        requestsList.innerHTML = "";


        // =================================================
        // CREATE REQUEST CARDS
        // =================================================

        requests.forEach(request => {

            const teacher =
                request.teacher || {};


            const department =
                request.department || {};


            const card =
                document.createElement("div");


            card.className =
                "teacher-request-card";


            card.innerHTML = `

                <div class="teacher-request-info">

                    <strong class="teacher-request-name">

                        ${escapeHtmlDashboard(
                            teacher.name ||
                            "Unknown Teacher"
                        )}

                    </strong>


                    <div class="teacher-request-details">

                        <span>

                            <i class="fa-solid fa-id-card"></i>

                            ${escapeHtmlDashboard(
                                teacher.username ||
                                "N/A"
                            )}

                        </span>


                        <span>

                            <i class="fa-solid fa-envelope"></i>

                            ${escapeHtmlDashboard(
                                teacher.email ||
                                "N/A"
                            )}

                        </span>


                        <span>

                            <i class="fa-solid fa-building"></i>

                            ${escapeHtmlDashboard(
                                department.name ||
                                currentUser.departmentName ||
                                "Department"
                            )}

                        </span>

                    </div>


                    <span class="teacher-request-status">
                        PENDING
                    </span>

                </div>


                <div class="teacher-request-actions">

                    <button
                        type="button"
                        class="approve-request-btn"
                        data-request-id="${request.id}"
                    >

                        <i class="fa-solid fa-check"></i>

                        Approve

                    </button>


                    <button
                        type="button"
                        class="reject-request-btn"
                        data-request-id="${request.id}"
                    >

                        <i class="fa-solid fa-xmark"></i>

                        Reject

                    </button>

                </div>

            `;


            requestsList.appendChild(card);

        });


        // =================================================
        // BUTTON EVENTS
        // =================================================

        setupTeacherRequestButtons();


    } catch (error) {

        console.error(
            "Pending teacher request error:",
            error
        );


        requestsList.innerHTML = `

            <div class="pending-empty-state">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <span>
                    Unable to load pending requests.
                </span>

            </div>

        `;


        showDashboardToast(
            "Request Error",
            "Unable to load pending teacher requests.",
            "error"
        );

    }

}


// =====================================================
// APPROVE / REJECT BUTTONS
// =====================================================

function setupTeacherRequestButtons() {

    const approveButtons =
        document.querySelectorAll(
            ".approve-request-btn"
        );


    const rejectButtons =
        document.querySelectorAll(
            ".reject-request-btn"
        );


    // =================================================
    // APPROVE
    // =================================================

    approveButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const requestId =
                    button.dataset.requestId;


                updateTeacherRequestStatus(
                    requestId,
                    "APPROVED"
                );

            }
        );

    });


    // =================================================
    // REJECT
    // =================================================

    rejectButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const requestId =
                    button.dataset.requestId;


                updateTeacherRequestStatus(
                    requestId,
                    "REJECTED"
                );

            }
        );

    });

}


// =====================================================
// UPDATE TEACHER REQUEST STATUS
// =====================================================

async function updateTeacherRequestStatus(
    requestId,
    status
) {

    console.log(
        `Updating teacher request ${requestId} to ${status}`
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/teacher-departments/${requestId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );


        console.log(
            "Approval update HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Status update failed: ${response.status}`
            );

        }


        // =================================================
        // SUCCESS TOAST
        // =================================================

        if (status === "APPROVED") {

            showDashboardToast(
                "Teacher Approved",
                "Teacher request has been approved successfully."
            );

        } else {

            showDashboardToast(
                "Teacher Rejected",
                "Teacher request has been rejected successfully."
            );

        }


        // =================================================
        // REFRESH REQUEST LIST
        // =================================================

        await loadPendingTeacherRequests();


        // =================================================
        // REFRESH DASHBOARD COUNTERS
        // =================================================

        await loadDashboard();


    } catch (error) {

        console.error(
            "Teacher approval error:",
            error
        );


        showDashboardToast(
            "Action Failed",
            "Unable to update the teacher request.",
            "error"
        );

    }

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtmlDashboard(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, .logout-btn, [data-action='logout']"
        );


    logoutButtons.forEach(button => {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                console.log(
                    "Logout button clicked."
                );


                localStorage.removeItem(
                    "currentUser"
                );


                sessionStorage.clear();


                showDashboardToast(
                    "Logged Out",
                    "You have been logged out successfully."
                );


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 500);

            }
        );

    });

}


// =====================================================
// SIDEBAR NAVIGATION
// =====================================================

function setupSidebarNavigation() {

    const sidebarItems =
        document.querySelectorAll(
            ".sidebar-item"
        );


    sidebarItems.forEach(item => {

        item.addEventListener(
            "click",
            function(event) {

                const section =
                    this.dataset.section;


                console.log(
                    "Sidebar section:",
                    section
                );


                // =================================================
                // DASHBOARD
                // =================================================

                if (section === "dashboard") {

                    event.preventDefault();

                    window.location.href =
                        "hod-dashboard.html";

                    return;
                }


                // =================================================
                // TEACHERS
                // =================================================
if (section === "dashboard") {

    showDashboardSection();

}

else if (section === "teachers") {

    window.location.href = "hod-teachers.html";

}

else if (section === "students") {

    showDashboardToast(
        "Students",
        "Students module will be available in the next stage."
    );

}

else if (section === "subjects") {

    window.location.href = "hod-subjects.html";

}
                // =================================================
                // TIMETABLE
                // =================================================

                if (section === "timetable") {

                    event.preventDefault();

                    showDashboardToast(
                        "Timetable",
                        "Timetable module will be available in the next stage."
                    );

                    return;
                }


                // =================================================
                // ATTENDANCE
                // =================================================

                if (section === "attendance") {

                    event.preventDefault();

                    showDashboardToast(
                        "Attendance",
                        "Attendance module will be available in the next stage."
                    );

                    return;
                }


                // =================================================
                // TASKS
                // =================================================

                if (section === "tasks") {

                    event.preventDefault();

                    showDashboardToast(
                        "Tasks",
                        "Tasks module will be available in the next stage."
                    );

                    return;
                }


                // =================================================
                // EVENTS
                // =================================================

                if (section === "events") {

                    event.preventDefault();

                    showDashboardToast(
                        "Events",
                        "Events module will be available in the next stage."
                    );

                    return;
                }


                // =================================================
                // ANNOUNCEMENTS
                // =================================================

                if (section === "announcements") {

                    event.preventDefault();

                    showDashboardToast(
                        "Announcements",
                        "Announcements module will be available in the next stage."
                    );

                    return;
                }


                // =================================================
                // ANALYTICS
                // =================================================

                if (section === "analytics") {

                    event.preventDefault();

                    showDashboardToast(
                        "Analytics",
                        "Analytics module will be available in the next stage."
                    );

                    return;
                }


                // =================================================
                // REPORTS
                // =================================================

                if (section === "reports") {

                    event.preventDefault();

                    showDashboardToast(
                        "Reports",
                        "Reports module will be available in the next stage."
                    );

                    return;
                }

            }
        );

    });

}


// =====================================================
// DASHBOARD TOAST
// =====================================================

function showDashboardToast(
    title,
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "dashboardToastContainer"
        );


    const toast =
        document.getElementById(
            "dashboardToast"
        );


    const toastTitle =
        document.getElementById(
            "dashboardToastTitle"
        );


    const toastMessage =
        document.getElementById(
            "dashboardToastMessage"
        );


    const toastIcon =
        document.getElementById(
            "dashboardToastIcon"
        );


    const closeButton =
        document.getElementById(
            "dashboardToastClose"
        );


    // =================================================
    // SAFETY CHECK
    // =================================================

    if (
        !container ||
        !toast ||
        !toastTitle ||
        !toastMessage
    ) {

        console.error(
            "Dashboard toast elements not found."
        );

        return;
    }


    // =================================================
    // SET CONTENT
    // =================================================

    toastTitle.textContent =
        title;


    toastMessage.textContent =
        message;


    // =================================================
    // SET TYPE
    // =================================================

    toast.classList.remove(
        "success",
        "error"
    );


    toast.classList.add(
        type === "error"
            ? "error"
            : "success"
    );


    // =================================================
    // SET ICON
    // =================================================

    if (toastIcon) {

        if (type === "error") {

            toastIcon.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>
            `;

        } else {

            toastIcon.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
            `;

        }

    }


    // =================================================
    // SHOW TOAST
    // =================================================

    toast.classList.add(
        "show"
    );


    // =================================================
    // CLOSE BUTTON
    // =================================================

    if (closeButton) {

        closeButton.onclick = () => {

            toast.classList.remove(
                "show"
            );

        };

    }


    // =================================================
    // AUTO HIDE
    // =================================================

    clearTimeout(
        window.dashboardToastTimer
    );


    window.dashboardToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


// =====================================================
// INITIALIZE DASHBOARD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "HOD Dashboard initialized."
        );


        console.log(
            "Current user:",
            currentUser
        );


        loadDashboard();


        loadPendingTeacherRequests();


        setupLogout();


        setupSidebarNavigation();

    }
);