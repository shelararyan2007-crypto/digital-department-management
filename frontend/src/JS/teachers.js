/* =====================================================
   HOD TEACHERS PAGE
   ===================================================== */

const API_BASE_URL = "http://localhost:8080";

let currentUser = null;
let departmentId = null;
let departmentName = "";

let allTeacherRelationships = [];

let currentStatusFilter = "APPROVED";


/* =====================================================
   INITIALIZATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeTeachersPage();

});


async function initializeTeachersPage() {

    try {

        loadCurrentUser();

        setupNavigation();

        setupSummaryFilters();

        setupRefreshButton();

        setupLogout();

        await loadDepartmentTeachers();

    } catch (error) {

        console.error(
            "Teachers page initialization failed:",
            error
        );

        showDashboardToast(
            "Error",
            "Unable to load the Teachers page.",
            "error"
        );

    }

}


/* =====================================================
   CURRENT USER
   ===================================================== */

function loadCurrentUser() {

    const storedUser =
        localStorage.getItem("currentUser");

    if (!storedUser) {

        window.location.href = "index.html";

        return;

    }

    try {

        currentUser = JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Invalid currentUser data:",
            error
        );

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

        return;

    }


    if (!currentUser.departmentId) {

        showDashboardToast(
            "Error",
            "Your department could not be determined.",
            "error"
        );

        return;

    }


    departmentId =
        Number(currentUser.departmentId);

    departmentName =
        currentUser.departmentName || "Department";


    updateUserInterface();

}


/* =====================================================
   UPDATE HEADER
   ===================================================== */

function updateUserInterface() {

    const profileName =
        document.getElementById("profileName");

    const topbarDepartment =
        document.getElementById("topbarDepartment");

    const departmentBadge =
        document.getElementById(
            "teachersDepartmentName"
        );


    if (profileName) {

        profileName.textContent =
            currentUser.name || "HOD";

    }


    if (topbarDepartment) {

        topbarDepartment.textContent =
            departmentName;

    }


    if (departmentBadge) {

        departmentBadge.innerHTML = `
            <i class="fa-solid fa-building-columns"></i>
            <span>${escapeHtml(departmentName)}</span>
        `;

    }

}


/* =====================================================
   LOAD TEACHERS
   ===================================================== */

async function loadDepartmentTeachers() {

    if (!departmentId) {

        return;

    }


    const tableWrapper =
        document.getElementById(
            "teachersTableWrapper"
        );


    if (tableWrapper) {

        tableWrapper.innerHTML = `
            <div class="teachers-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <span>
                    Loading teachers...
                </span>

            </div>
        `;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/teacher-departments/department/${departmentId}`
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data = await response.json();


        allTeacherRelationships =
            Array.isArray(data)
                ? data
                : [];


        updateTeacherCounts();

        renderTeacherList();

    } catch (error) {

        console.error(
            "Failed to load department teachers:",
            error
        );


        allTeacherRelationships = [];

        updateTeacherCounts();

        renderTeacherError();

        showDashboardToast(
            "Error",
            "Could not load teachers from the server.",
            "error"
        );

    }

}


/* =====================================================
   UPDATE COUNTS
   ===================================================== */

function updateTeacherCounts() {

    const approvedCount =
        allTeacherRelationships.filter(
            relationship =>
                relationship.status === "APPROVED"
        ).length;


    const pendingCount =
        allTeacherRelationships.filter(
            relationship =>
                relationship.status === "PENDING"
        ).length;


    const rejectedCount =
        allTeacherRelationships.filter(
            relationship =>
                relationship.status === "REJECTED"
        ).length;


    const approvedElement =
        document.getElementById(
            "approvedTeacherCount"
        );


    const pendingElement =
        document.getElementById(
            "pendingTeacherCount"
        );


    const rejectedElement =
        document.getElementById(
            "rejectedTeacherCount"
        );


    if (approvedElement) {

        approvedElement.textContent =
            approvedCount;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pendingCount;

    }


    if (rejectedElement) {

        rejectedElement.textContent =
            rejectedCount;

    }

}


/* =====================================================
   SUMMARY FILTERS
   ===================================================== */

function setupSummaryFilters() {

    const filterCards =
        document.querySelectorAll(
            ".teacher-summary-card"
        );


    filterCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const status =
                    card.dataset.teacherStatus;

                if (!status) {

                    return;

                }


                currentStatusFilter =
                    status;


                filterCards.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                card.classList.add("active");


                renderTeacherList();

            }
        );

    });

}


/* =====================================================
   RENDER TEACHER LIST
   ===================================================== */

function renderTeacherList() {

    const tableWrapper =
        document.getElementById(
            "teachersTableWrapper"
        );


    const title =
        document.getElementById(
            "teacherListTitle"
        );


    const subtitle =
        document.getElementById(
            "teacherListSubtitle"
        );


    if (!tableWrapper) {

        return;

    }


    const filteredTeachers =
        allTeacherRelationships.filter(
            relationship =>
                relationship.status ===
                currentStatusFilter
        );


    updateListHeading(
        title,
        subtitle
    );


    if (filteredTeachers.length === 0) {

        renderEmptyState(
            tableWrapper,
            currentStatusFilter
        );

        return;

    }


    tableWrapper.innerHTML = `

        <table class="teachers-table">

            <thead>

                <tr>

                    <th>
                        Teacher
                    </th>

                    <th>
                        Faculty ID
                    </th>

                    <th>
                        Email
                    </th>

                    <th>
                        Mobile
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Actions
                    </th>

                </tr>

            </thead>


            <tbody>

                ${filteredTeachers
                    .map(
                        relationship =>
                            createTeacherRow(
                                relationship
                            )
                    )
                    .join("")}

            </tbody>

        </table>

    `;


    setupTeacherRowActions();

}


/* =====================================================
   LIST HEADING
   ===================================================== */

function updateListHeading(
    title,
    subtitle
) {

    if (!title || !subtitle) {

        return;

    }


    if (currentStatusFilter === "APPROVED") {

        title.textContent =
            "Approved Teachers";

        subtitle.textContent =
            "Currently approved teaching staff";

    } else if (
        currentStatusFilter === "PENDING"
    ) {

        title.textContent =
            "Pending Requests";

        subtitle.textContent =
            "Teacher registration requests waiting for approval";

    } else if (
        currentStatusFilter === "REJECTED"
    ) {

        title.textContent =
            "Rejected Teachers";

        subtitle.textContent =
            "Teacher requests rejected by the department";

    }

}


/* =====================================================
   CREATE TABLE ROW
   ===================================================== */

function createTeacherRow(
    relationship
) {

    const teacher =
        relationship.teacher || {};


    const teacherName =
        teacher.name || "Unknown Teacher";


    const username =
        teacher.username || "—";


    const email =
        teacher.email || "—";


    const mobile =
        teacher.mobile || "—";


    const status =
        relationship.status || "UNKNOWN";


    const relationshipId =
        relationship.id;


    let actions = `

        <button
            type="button"
            class="teacher-action-btn view-teacher-btn"
            data-id="${relationshipId}"
        >

            <i class="fa-solid fa-eye"></i>

            View

        </button>

    `;


    if (status === "PENDING") {

        actions += `

            <button
                type="button"
                class="teacher-action-btn approve-teacher-btn"
                data-id="${relationshipId}"
            >

                <i class="fa-solid fa-check"></i>

                Approve

            </button>


            <button
                type="button"
                class="teacher-action-btn reject-teacher-btn"
                data-id="${relationshipId}"
            >

                <i class="fa-solid fa-xmark"></i>

                Reject

            </button>

        `;

    }


    if (status === "APPROVED") {

        actions += `

            <button
                type="button"
                class="teacher-action-btn remove-teacher-btn"
                data-id="${relationshipId}"
            >

                <i class="fa-solid fa-user-minus"></i>

                Remove

            </button>

        `;

    }


    return `

        <tr>

            <td>

                <strong>
                    ${escapeHtml(teacherName)}
                </strong>

            </td>


            <td>
                ${escapeHtml(username)}
            </td>


            <td>
                ${escapeHtml(email)}
            </td>


            <td>
                ${escapeHtml(mobile)}
            </td>


            <td>

                <span
                    class="teacher-status-badge ${status.toLowerCase()}"
                >

                    ${escapeHtml(status)}

                </span>

            </td>


            <td>

                <div class="teacher-actions">

                    ${actions}

                </div>

            </td>

        </tr>

    `;

}


/* =====================================================
   ACTION BUTTONS
   ===================================================== */

function setupTeacherRowActions() {

    document
        .querySelectorAll(".view-teacher-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    openTeacherView(id);

                }
            );

        });


    document
        .querySelectorAll(".approve-teacher-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    updateTeacherStatus(
                        id,
                        "APPROVED"
                    );

                }
            );

        });


    document
        .querySelectorAll(".reject-teacher-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    updateTeacherStatus(
                        id,
                        "REJECTED"
                    );

                }
            );

        });


    document
        .querySelectorAll(".remove-teacher-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    openTeacherRemove(id);

                }
            );

        });

}


/* =====================================================
   APPROVE / REJECT
   ===================================================== */

async function updateTeacherStatus(
    relationshipId,
    newStatus
) {

    if (!relationshipId) {

        return;

    }


    const relationship =
        findRelationshipById(
            relationshipId
        );


    if (!relationship) {

        return;

    }


    const teacher =
        relationship.teacher || {};


    const teacherName =
        teacher.name || "this teacher";


    let confirmationMessage;


    if (newStatus === "APPROVED") {

        confirmationMessage =
            `Approve ${teacherName} for your department?`;

    } else {

        confirmationMessage =
            `Reject ${teacherName}'s department request?`;

    }


    const confirmed =
        window.confirm(
            confirmationMessage
        );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/teacher-departments/${relationshipId}/status?status=${newStatus}`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        showDashboardToast(
            newStatus === "APPROVED"
                ? "Teacher Approved"
                : "Request Rejected",
            `${teacherName} has been ${
                newStatus === "APPROVED"
                    ? "approved"
                    : "rejected"
            }.`,
            "success"
        );


        await loadDepartmentTeachers();


    } catch (error) {

        console.error(
            "Failed to update teacher status:",
            error
        );


        showDashboardToast(
            "Update Failed",
            "The teacher status could not be updated.",
            "error"
        );

    }

}


/* =====================================================
   FIND RELATIONSHIP
   ===================================================== */

function findRelationshipById(
    relationshipId
) {

    return allTeacherRelationships.find(
        relationship =>
            Number(relationship.id) ===
            Number(relationshipId)
    );

}


/* =====================================================
   OPEN TEACHER VIEW
   ===================================================== */

function openTeacherView(
    relationshipId
) {

    const relationship =
        findRelationshipById(
            relationshipId
        );


    if (!relationship) {

        return;

    }


    if (
        typeof window.openTeacherModal ===
        "function"
    ) {

        window.openTeacherModal(
            relationship,
            "view"
        );

    } else {

        console.error(
            "openTeacherModal() is not available."
        );

    }

}


/* =====================================================
   OPEN REMOVE CONFIRMATION
   ===================================================== */

function openTeacherRemove(
    relationshipId
) {

    const relationship =
        findRelationshipById(
            relationshipId
        );


    if (!relationship) {

        return;

    }


    if (
        typeof window.openTeacherModal ===
        "function"
    ) {

        window.openTeacherModal(
            relationship,
            "remove"
        );

    } else {

        console.error(
            "openTeacherModal() is not available."
        );

    }

}


/* =====================================================
   EMPTY STATE
   ===================================================== */

function renderEmptyState(
    container,
    status
) {

    let icon =
        "fa-user-slash";

    let title =
        "No teachers found";

    let message =
        "There are no teachers in this category.";

    
    if (status === "APPROVED") {

        icon =
            "fa-user-check";

        title =
            "No approved teachers";

        message =
            "No teachers are currently approved for this department.";

    }


    if (status === "PENDING") {

        icon =
            "fa-user-clock";

        title =
            "No pending requests";

        message =
            "There are no teacher registration requests waiting for approval.";

    }


    if (status === "REJECTED") {

        icon =
            "fa-user-xmark";

        title =
            "No rejected teachers";

        message =
            "There are no rejected teacher requests for this department.";

    }


    container.innerHTML = `

        <div class="teachers-empty-state">

            <i class="fa-solid ${icon}"></i>

            <strong>
                ${title}
            </strong>

            <span>
                ${message}
            </span>

        </div>

    `;

}


/* =====================================================
   ERROR STATE
   ===================================================== */

function renderTeacherError() {

    const container =
        document.getElementById(
            "teachersTableWrapper"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="teachers-empty-state error">

            <i class="fa-solid fa-triangle-exclamation"></i>

            <strong>
                Unable to load teachers
            </strong>

            <span>
                Please check that the backend is running
                and try refreshing the page.
            </span>

        </div>

    `;

}


/* =====================================================
   REFRESH
   ===================================================== */

function setupRefreshButton() {

    const button =
        document.getElementById(
            "refreshTeachersBtn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async () => {

            const icon =
                button.querySelector("i");


            if (icon) {

                icon.classList.add(
                    "fa-spin"
                );

            }


            await loadDepartmentTeachers();


            if (icon) {

                icon.classList.remove(
                    "fa-spin"
                );

            }

        }
    );

}


/* =====================================================
   NAVIGATION
   ===================================================== */

function setupNavigation() {

    document
        .querySelectorAll(
            ".sidebar-item"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const section =
                        item.dataset.section;


                    if (
                        section === "dashboard"
                    ) {

                        window.location.href =
                            "hod-dashboard.html";

                        return;

                    }


                    if (
                        section === "teachers"
                    ) {

                        return;

                    }
if (
    section === "subjects"
) {

    window.location.href =
        "hod-subjects.html";

    return;
}


if (
    section === "subject-allocation"
) {

    window.location.href =
        "hod-subject-allocation.html";

    return;
}

                    showDashboardToast(
                        "Coming Soon",
                        `${capitalize(section)} module will be available in the next stage.`,
                        "info"
                    );

                }
            );

        });

}


/* =====================================================
   LOGOUT
   ===================================================== */
function setupLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem("currentUser");

            window.location.href = "index.html";

        }
    );

}
/* =====================================================
   TOAST
   ===================================================== */

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

    const icon =
        document.getElementById(
            "dashboardToastIcon"
        );

    const titleElement =
        document.getElementById(
            "dashboardToastTitle"
        );

    const messageElement =
        document.getElementById(
            "dashboardToastMessage"
        );


    if (
        !container ||
        !toast ||
        !icon ||
        !titleElement ||
        !messageElement
    ) {

        return;

    }


    titleElement.textContent =
        title;

    messageElement.textContent =
        message;


    let iconClass =
        "fa-circle-check";


    if (type === "error") {

        iconClass =
            "fa-circle-exclamation";

    } else if (type === "info") {

        iconClass =
            "fa-circle-info";

    }


    icon.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
    `;


    container.classList.add("show");


    clearTimeout(
        window.teacherToastTimeout
    );


    window.teacherToastTimeout =
        setTimeout(
            () => {

                container.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =====================================================
   TOAST CLOSE
   ===================================================== */

const toastClose =
    document.getElementById(
        "dashboardToastClose"
    );


if (toastClose) {

    toastClose.addEventListener(
        "click",
        () => {

            const container =
                document.getElementById(
                    "dashboardToastContainer"
                );


            if (container) {

                container.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =====================================================
   UTILITIES
   ===================================================== */

function capitalize(
    value
) {

    if (!value) {

        return "";

    }


    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}