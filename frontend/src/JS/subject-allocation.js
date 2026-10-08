/* =========================================================
   SUBJECT ALLOCATION
   ========================================================= */

const API_BASE_URL = "http://localhost:8080";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;

let departmentId = null;
let departmentCode = null;

let classBatches = [];
let approvedTeachers = [];

let currentSubjects = [];
let currentAssignments = [];

let selectedSubjectId = null;
let selectedExistingAssignmentId = null;

let toastTimeout = null;


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePage();

    }
);


async function initializePage() {

    loadCurrentUser();

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    setupNavigation();

    setupLogout();

    setupFilterListeners();

    setupModal();

    populateAcademicYear();

    populateSemester();

    await loadDepartmentData();

    updateUserInformation();

}


/* =========================================================
   CURRENT USER
   ========================================================= */

function loadCurrentUser() {

    const storedUser =
        localStorage.getItem("currentUser");

    if (!storedUser) {
        currentUser = null;
        return;
    }

    try {

        currentUser =
            JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Unable to parse currentUser:",
            error
        );

        currentUser = null;

    }

}


/* =========================================================
   USER INFORMATION
   ========================================================= */

function updateUserInformation() {

    const userNameElement =
        document.getElementById("userName");

    const userRoleElement =
        document.getElementById("userRole");

    const userAvatarElement =
        document.getElementById("userAvatar");

    if (userNameElement) {

        userNameElement.textContent =
            currentUser.name ||
            currentUser.username ||
            "HOD";

    }

    if (userRoleElement) {

        if (currentUser.role === "HOD") {

            userRoleElement.textContent =
                "Head of Department";

        } else {

            userRoleElement.textContent =
                currentUser.role ||
                "Head of Department";

        }

    }

    if (userAvatarElement) {

        const name =
            currentUser.name ||
            currentUser.username ||
            "H";

        userAvatarElement.textContent =
            name.charAt(0).toUpperCase();

    }

}


/* =========================================================
   DEPARTMENT INFORMATION
   ========================================================= */

function resolveDepartmentInformation() {

    departmentId =
        currentUser.departmentId ||
        currentUser.department?.id ||
        null;

    departmentCode =
        currentUser.departmentCode ||
        currentUser.department?.code ||
        null;


    if (!departmentCode) {

        const departmentName =
            currentUser.departmentName ||
            currentUser.department?.name ||
            "";

        const normalized =
            departmentName.toLowerCase();

        if (normalized.includes("computer")) {

            departmentCode = "CE";

        } else if (
            normalized.includes("artificial") ||
            normalized.includes("machine learning")
        ) {

            departmentCode = "AIML";

        } else if (
            normalized.includes("cyber") ||
            normalized.includes("iot")
        ) {

            departmentCode = "CSIOT";

        } else if (
            normalized.includes("mechanical")
        ) {

            departmentCode = "ME";

        } else if (
            normalized.includes("electronics") ||
            normalized.includes("telecommunication")
        ) {

            departmentCode = "EXTC";

        } else if (
            normalized.includes("civil")
        ) {

            departmentCode = "CIVIL";

        } else if (
            normalized.includes("engineering sciences") ||
            normalized.includes("humanities")
        ) {

            departmentCode = "DESH";

        }

    }

}


/* =========================================================
   LOAD DEPARTMENT DATA
   ========================================================= */

async function loadDepartmentData() {

    resolveDepartmentInformation();

    if (!departmentId) {

        showToast(
            "Department information is missing.",
            "error"
        );

        return;

    }

    updateDepartmentBadge();

    applyDepartmentRules();

    await Promise.all([
        loadClassBatches(),
        loadApprovedTeachers()
    ]);

}


/* =========================================================
   DEPARTMENT BADGE
   ========================================================= */

function updateDepartmentBadge() {

    const badge =
        document.getElementById(
            "departmentBadge"
        );

    if (!badge) return;

    const departmentName =
        currentUser.departmentName ||
        currentUser.department?.name ||
        departmentCode ||
        "Department";

    badge.textContent =
        departmentName;

}


/* =========================================================
   ACADEMIC YEAR
   ========================================================= */

function populateAcademicYear() {

    const academicYear =
        document.getElementById(
            "academicYear"
        );

    if (!academicYear) return;

    academicYear.innerHTML = `
        <option value="">
            Select Academic Year
        </option>

        <option value="SE">
            Second Year (SE)
        </option>

        <option value="TE">
            Third Year (TE)
        </option>

        <option value="BE">
            Final Year (BE)
        </option>
    `;

}


/* =========================================================
   DEPARTMENT RULES
   ========================================================= */

function applyDepartmentRules() {

    const academicYearGroup =
        document.getElementById(
            "academicYearGroup"
        );

    const academicYear =
        document.getElementById(
            "academicYear"
        );

    if (departmentCode === "DESH") {

        if (academicYearGroup) {

            academicYearGroup.style.display =
                "none";

        }

        if (academicYear) {

            academicYear.value =
                "FE";

        }

    } else {

        if (academicYearGroup) {

            academicYearGroup.style.display =
                "";

        }

        if (academicYear) {

            academicYear.value =
                "";

        }

    }

    populateSemester();

    clearDivisionSelection();

}


/* =========================================================
   SEMESTER
   ========================================================= */

function populateSemester() {

    const semester =
        document.getElementById(
            "semester"
        );

    if (!semester) return;

    const academicYear =
        document.getElementById(
            "academicYear"
        )?.value;


    semester.innerHTML = `
        <option value="">
            Select Semester
        </option>
    `;


    let semesters = [];


    if (departmentCode === "DESH") {

        semesters = [1, 2];

    } else {

        if (academicYear === "SE") {

            semesters = [3, 4];

        } else if (academicYear === "TE") {

            semesters = [5, 6];

        } else if (academicYear === "BE") {

            semesters = [7, 8];

        }

    }


    semesters.forEach(
        semesterNumber => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                semesterNumber;

            option.textContent =
                `Semester ${semesterNumber}`;

            semester.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   FILTER LISTENERS
   ========================================================= */

function setupFilterListeners() {

    const academicYear =
        document.getElementById(
            "academicYear"
        );

    const semester =
        document.getElementById(
            "semester"
        );

    const division =
        document.getElementById(
            "division"
        );


    if (academicYear) {

        academicYear.addEventListener(
            "change",
            () => {

                populateSemester();

                clearDivisionSelection();

            }
        );

    }


    if (semester) {

        semester.addEventListener(
            "change",
            async () => {

                await populateDivisions();

                await loadAllocationData();

            }
        );

    }


    if (division) {

        division.addEventListener(
            "change",
            async () => {

                await loadAllocationData();

            }
        );

    }

}


/* =========================================================
   LOAD CLASS BATCHES
   ========================================================= */

async function loadClassBatches() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/classes/department/${departmentId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load class batches."
            );

        }

        classBatches =
            await response.json();

        await populateDivisions();

    } catch (error) {

        console.error(
            "Class batch loading error:",
            error
        );

        classBatches = [];

        showToast(
            "Unable to load class divisions.",
            "error"
        );

    }

}


/* =========================================================
   POPULATE DIVISIONS
   ========================================================= */

async function populateDivisions() {

    const division =
        document.getElementById(
            "division"
        );

    if (!division) return;


    division.innerHTML = `
        <option value="">
            Select Division
        </option>
    `;


    const selectedAcademicYear =
        departmentCode === "DESH"
            ? "FE"
            : document.getElementById(
                "academicYear"
            )?.value;


    if (!selectedAcademicYear) {

        return;

    }


    const matchingBatches =
        classBatches.filter(
            batch =>
                batch.academicYear ===
                selectedAcademicYear
        );


    matchingBatches
        .sort(
            (a, b) =>
                a.division.localeCompare(
                    b.division
                )
        )
        .forEach(
            batch => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    batch.division;

                option.textContent =
                    `Division ${batch.division}`;

                option.dataset.batchId =
                    batch.id;

                division.appendChild(
                    option
                );

            }
        );

}


/* =========================================================
   CLEAR DIVISION
   ========================================================= */

function clearDivisionSelection() {

    const division =
        document.getElementById(
            "division"
        );

    if (division) {

        division.innerHTML = `
            <option value="">
                Select Division
            </option>
        `;

    }

    clearAllocationTable();

}


/* =========================================================
   LOAD APPROVED TEACHERS
   ========================================================= */

async function loadApprovedTeachers() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/teacher-departments/department/${departmentId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load teachers."
            );

        }

        const relationships =
            await response.json();


        approvedTeachers =
            relationships.filter(
                relationship => {

                    const teacher =
                        relationship.teacher;

                    return (
                        relationship.status ===
                            "APPROVED" &&
                        teacher &&
                        teacher.role ===
                            "TEACHING_STAFF"
                    );

                }
            );


        populateTeacherSelect();

    } catch (error) {

        console.error(
            "Teacher loading error:",
            error
        );

        approvedTeachers = [];

        showToast(
            "Unable to load approved teachers.",
            "error"
        );

    }

}


/* =========================================================
   TEACHER SELECT
   ========================================================= */

function populateTeacherSelect() {

    const teacherSelect =
        document.getElementById(
            "teacherSelect"
        );

    if (!teacherSelect) return;


    teacherSelect.innerHTML = `
        <option value="">
            Select Teacher
        </option>
    `;


    approvedTeachers
        .sort(
            (a, b) => {

                const nameA =
                    a.teacher?.name ||
                    a.teacher?.username ||
                    "";

                const nameB =
                    b.teacher?.name ||
                    b.teacher?.username ||
                    "";

                return nameA.localeCompare(
                    nameB
                );

            }
        )
        .forEach(
            relationship => {

                const teacher =
                    relationship.teacher;

                if (!teacher) return;


                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    teacher.id;

                option.textContent =
                    `${teacher.name || teacher.username} (${teacher.username})`;

                teacherSelect.appendChild(
                    option
                );

            }
        );

}


/* =========================================================
   LOAD ALLOCATION DATA
   ========================================================= */

async function loadAllocationData() {

    const academicYear =
        departmentCode === "DESH"
            ? "FE"
            : document.getElementById(
                "academicYear"
            )?.value;

    const semester =
        document.getElementById(
            "semester"
        )?.value;

    const division =
        document.getElementById(
            "division"
        )?.value;


    if (
        !academicYear ||
        !semester ||
        !division
    ) {

        clearAllocationTable();

        return;

    }


    showLoading();


    try {

        const subjectsResponse =
            await fetch(
                `${API_BASE_URL}/api/subjects/department/${departmentId}/year/${academicYear}/semester/${semester}`
            );


        if (!subjectsResponse.ok) {

            throw new Error(
                "Failed to load subjects."
            );

        }


        currentSubjects =
            await subjectsResponse.json();


        const assignmentsResponse =
            await fetch(
                `${API_BASE_URL}/api/subject-assignments/department/${departmentId}/year/${academicYear}/division/${encodeURIComponent(division)}`
            );


        if (!assignmentsResponse.ok) {

            throw new Error(
                "Failed to load assignments."
            );

        }


        currentAssignments =
            await assignmentsResponse.json();


        renderAllocationTable();


    } catch (error) {

        console.error(
            "Allocation loading error:",
            error
        );

        showEmptyState(
            "Unable to load subjects or teacher assignments."
        );

    }

}


/* =========================================================
   RENDER TABLE
   ========================================================= */

function renderAllocationTable() {

    const wrapper =
        document.getElementById(
            "allocationTableWrapper"
        );

    if (!wrapper) return;


    if (
        !currentSubjects ||
        currentSubjects.length === 0
    ) {

        showEmptyState(
            "No subjects found for the selected semester."
        );

        return;

    }


    const rows =
        currentSubjects.map(
            subject => {

                const assignment =
                    currentAssignments.find(
                        item =>
                            item.subject &&
                            item.subject.id ===
                                subject.id
                    );


                const teacher =
                    assignment?.teacher;


                const teacherName =
                    teacher
                        ? (
                            teacher.name ||
                            teacher.username ||
                            "Teacher"
                        )
                        : null;


                return `
                    <tr>

                        <td>

                            <div class="allocation-subject-name">
                                ${escapeHtml(
                                    subject.name
                                )}
                            </div>

                            <span class="allocation-subject-code">
                                ${escapeHtml(
                                    subject.code
                                )}
                            </span>

                        </td>


                        <td>

                            ${
                                teacherName
                                    ? `
                                        <span class="allocation-teacher-name">
                                            ${escapeHtml(
                                                teacherName
                                            )}
                                        </span>
                                    `
                                    : `
                                        <span class="allocation-not-assigned">
                                            Not Assigned
                                        </span>
                                    `
                            }

                        </td>


                        <td>

                            <span
                                class="allocation-status-badge ${
                                    teacher
                                        ? "assigned"
                                        : "not-assigned"
                                }"
                            >

                                ${
                                    teacher
                                        ? "Assigned"
                                        : "Not Assigned"
                                }

                            </span>

                        </td>


                        <td>

                            <div class="allocation-actions">

                                ${
                                    teacher
                                        ? `
                                            <button
                                                type="button"
                                                class="allocation-action-button allocation-change-button"
                                                onclick="openAllocationModal(
                                                    ${subject.id},
                                                    ${assignment.id}
                                                )"
                                            >
                                                Change
                                            </button>

                                            <button
                                                type="button"
                                                class="allocation-action-button allocation-remove-button"
                                                onclick="removeAssignment(
                                                    ${assignment.id}
                                                )"
                                            >
                                                Remove
                                            </button>
                                        `
                                        : `
                                            <button
                                                type="button"
                                                class="allocation-action-button allocation-assign-button"
                                                onclick="openAllocationModal(
                                                    ${subject.id},
                                                    null
                                                )"
                                            >
                                                Assign
                                            </button>
                                        `
                                }

                            </div>

                        </td>

                    </tr>
                `;

            }
        ).join("");


    wrapper.innerHTML = `

        <table class="allocation-table">

            <thead>

                <tr>

                    <th>
                        Subject
                    </th>

                    <th>
                        Assigned Teacher
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Action
                    </th>

                </tr>

            </thead>

            <tbody>

                ${rows}

            </tbody>

        </table>

    `;

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openAllocationModal(
    subjectId,
    assignmentId
) {

    selectedSubjectId =
        subjectId;

    selectedExistingAssignmentId =
        assignmentId;


    const subject =
        currentSubjects.find(
            item =>
                item.id ===
                subjectId
        );


    const modal =
        document.getElementById(
            "allocationModal"
        );

    const subjectName =
        document.getElementById(
            "modalSubjectName"
        );

    const teacherSelect =
        document.getElementById(
            "teacherSelect"
        );


    if (!modal || !subject) return;


    if (subjectName) {

        subjectName.textContent =
            `${subject.name} (${subject.code})`;

    }


    if (teacherSelect) {

        teacherSelect.value = "";

    }


    if (
        selectedExistingAssignmentId
    ) {

        const existingAssignment =
            currentAssignments.find(
                item =>
                    item.id ===
                    selectedExistingAssignmentId
            );


        if (
            existingAssignment &&
            existingAssignment.teacher
        ) {

            if (teacherSelect) {

                teacherSelect.value =
                    existingAssignment.teacher.id;

            }

        }

    }


    modal.classList.add("show");

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeAllocationModal() {

    const modal =
        document.getElementById(
            "allocationModal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

    selectedSubjectId =
        null;

    selectedExistingAssignmentId =
        null;

}


/* =========================================================
   MODAL SETUP
   ========================================================= */

function setupModal() {

    const closeButton =
        document.getElementById(
            "closeAllocationModal"
        );

    const cancelButton =
        document.getElementById(
            "cancelAllocation"
        );

    const saveButton =
        document.getElementById(
            "saveAllocation"
        );

    const modal =
        document.getElementById(
            "allocationModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAllocationModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeAllocationModal
        );

    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveAllocation
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeAllocationModal();

                }

            }
        );

    }

}


/* =========================================================
   SAVE ALLOCATION
   ========================================================= */

async function saveAllocation() {

    if (!selectedSubjectId) {

        showToast(
            "Please select a subject.",
            "error"
        );

        return;

    }


    const teacherSelect =
        document.getElementById(
            "teacherSelect"
        );


    const teacherId =
        teacherSelect?.value;


    const academicYear =
        departmentCode === "DESH"
            ? "FE"
            : document.getElementById(
                "academicYear"
            )?.value;


    const division =
        document.getElementById(
            "division"
        )?.value;


    if (!teacherId) {

        showToast(
            "Please select a teacher.",
            "error"
        );

        return;

    }


    if (!academicYear || !division) {

        showToast(
            "Please select the class details.",
            "error"
        );

        return;

    }


    const selectedBatch =
        classBatches.find(
            batch =>
                batch.academicYear ===
                    academicYear &&
                batch.division ===
                    division
        );


    if (!selectedBatch) {

        showToast(
            "Class division could not be found.",
            "error"
        );

        return;

    }


    const saveButton =
        document.getElementById(
            "saveAllocation"
        );


    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "Saving...";

    }


    try {

        /*
         * If an existing assignment is being changed,
         * remove the old assignment first.
         */

        if (
            selectedExistingAssignmentId
        ) {

            const deleteResponse =
                await fetch(
                    `${API_BASE_URL}/api/subject-assignments/${selectedExistingAssignmentId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!deleteResponse.ok) {

                throw new Error(
                    "Unable to remove existing assignment."
                );

            }

        }


        const response =
            await fetch(
                `${API_BASE_URL}/api/subject-assignments?subjectId=${selectedSubjectId}&teacherId=${teacherId}&classBatchId=${selectedBatch.id}`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Unable to assign teacher.";

            try {

                const errorData =
                    await response.json();

                if (errorData.message) {

                    errorMessage =
                        errorData.message;

                }

            } catch (_) {

                // Keep default message.

            }

            throw new Error(
                errorMessage
            );

        }


        closeAllocationModal();


        showToast(
            "Teacher assigned successfully.",
            "success"
        );


        await loadAllocationData();


    } catch (error) {

        console.error(
            "Save allocation error:",
            error
        );

        showToast(
            error.message ||
                "Unable to assign teacher.",
            "error"
        );

    } finally {

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.textContent =
                "Assign Teacher";

        }

    }

}


/* =========================================================
   REMOVE ASSIGNMENT
   ========================================================= */

async function removeAssignment(
    assignmentId
) {

    if (!assignmentId) return;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/subject-assignments/${assignmentId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to remove assignment."
            );

        }


        showToast(
            "Teacher assignment removed.",
            "success"
        );


        await loadAllocationData();


    } catch (error) {

        console.error(
            "Remove assignment error:",
            error
        );

        showToast(
            error.message ||
                "Unable to remove assignment.",
            "error"
        );

    }

}


/* =========================================================
   TABLE STATES
   ========================================================= */

function showLoading() {

    const wrapper =
        document.getElementById(
            "allocationTableWrapper"
        );

    if (!wrapper) return;


    wrapper.innerHTML = `
        <div class="allocation-loading">
            Loading subjects and teacher assignments...
        </div>
    `;

}


function showEmptyState(
    message
) {

    const wrapper =
        document.getElementById(
            "allocationTableWrapper"
        );

    if (!wrapper) return;


    wrapper.innerHTML = `
        <div class="allocation-empty-state">
            ${escapeHtml(message)}
        </div>
    `;

}


function clearAllocationTable() {

    currentSubjects = [];

    currentAssignments = [];


    showEmptyState(
        "Select academic year, semester and division to view subjects."
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const sidebarItems =
        document.querySelectorAll(
            ".sidebar-item"
        );


    sidebarItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const section =
                        item.dataset.section;

                    navigateToSection(
                        section
                    );

                }
            );

        }
    );

}


function navigateToSection(
    section
) {

    switch (section) {

        case "dashboard":

            window.location.href =
                "hod-dashboard.html";

            break;


        case "teachers":

            window.location.href =
                "hod-teachers.html";

            break;


        case "subjects":

            window.location.href =
                "hod-subjects.html";

            break;


        case "subject-allocation":

            // Already on this page.

            break;


        default:

            showToast(
                `${capitalize(section)} module will be available soon.`,
                "info"
            );

            break;

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) return;


    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "currentUser"
            );

            sessionStorage.clear();

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    const toast =
        document.getElementById(
            "allocationToast"
        );

    if (!toast) return;


    if (toastTimeout) {

        clearTimeout(
            toastTimeout
        );

    }


    toast.textContent =
        message;

    toast.className =
        `allocation-toast show ${type}`;


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   UTILITIES
   ========================================================= */

function capitalize(
    value
) {

    if (!value) return "";

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

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
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GLOBAL ACTION FUNCTIONS
   ========================================================= */

window.openAllocationModal =
    openAllocationModal;

window.removeAssignment =
    removeAssignment;