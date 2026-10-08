/* =========================================================
   SUBJECTS PAGE
   ========================================================= */

const API_BASE_URL = "http://localhost:8080";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;
let currentDepartmentId = null;
let currentDepartmentCode = null;

let currentSubjects = [];
let editingSubjectId = null;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const academicYearGroup =
    document.getElementById("academicYearGroup");

const academicYearSelect =
    document.getElementById("academicYearSelect");

const semesterSelect =
    document.getElementById("semesterSelect");

const modalAcademicYear =
    document.getElementById("modalAcademicYear");

const modalSemester =
    document.getElementById("modalSemester");

const subjectsTableWrapper =
    document.getElementById("subjectsTableWrapper");

const subjectListTitle =
    document.getElementById("subjectListTitle");

const subjectListSubtitle =
    document.getElementById("subjectListSubtitle");

const subjectsDepartmentName =
    document.getElementById("subjectsDepartmentName");

const topbarDepartment =
    document.getElementById("topbarDepartment");

const profileName =
    document.getElementById("profileName");

const subjectModalOverlay =
    document.getElementById("subjectModalOverlay");

const subjectModalTitle =
    document.getElementById("subjectModalTitle");

const subjectModalEyebrow =
    document.getElementById("subjectModalEyebrow");

const subjectModalClose =
    document.getElementById("subjectModalClose");

const subjectModalCancel =
    document.getElementById("subjectModalCancel");

const saveSubjectBtn =
    document.getElementById("saveSubjectBtn");

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const refreshSubjectsBtn =
    document.getElementById("refreshSubjectsBtn");

const subjectForm =
    document.getElementById("subjectForm");

const subjectName =
    document.getElementById("subjectName");

const subjectCode =
    document.getElementById("subjectCode");

const subjectFormError =
    document.getElementById("subjectFormError");

const dashboardToast =
    document.getElementById("dashboardToast");

const dashboardToastTitle =
    document.getElementById("dashboardToastTitle");

const dashboardToastMessage =
    document.getElementById("dashboardToastMessage");

const dashboardToastClose =
    document.getElementById("dashboardToastClose");


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializePage();

});


function initializePage() {

    loadCurrentUser();

    if (!currentUser) {
        showToast(
            "Session Required",
            "Please login again.",
            "error"
        );

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);

        return;
    }

    setupNavigation();

    setupFilters();

    setupModal();

    setupLogout();

    setupProfile();

    setupNotifications();

    configureDepartment();

}


/* =========================================================
   CURRENT USER
   ========================================================= */

function loadCurrentUser() {

    const storedUser =
        localStorage.getItem("currentUser");

    if (!storedUser) {
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

        return;
    }


    currentDepartmentId =
        currentUser.departmentId || null;


    currentDepartmentCode =
        getDepartmentCode(currentUser);


    if (profileName) {

        profileName.textContent =
            currentUser.name ||
            currentUser.username ||
            "HOD";

    }

}


/* =========================================================
   DEPARTMENT CODE
   ========================================================= */

function getDepartmentCode(user) {

    if (!user) {
        return null;
    }


    if (user.departmentCode) {
        return user.departmentCode.toUpperCase();
    }


    if (user.departmentName) {

        const name =
            user.departmentName.toLowerCase();


        if (name.includes("computer engineering")) {
            return "CE";
        }

        if (
            name.includes("artificial intelligence") ||
            name.includes("machine learning")
        ) {
            return "AIML";
        }

        if (
            name.includes("cyber security") ||
            name.includes("cybersecurity")
        ) {
            return "CSIOT";
        }

        if (name.includes("mechanical")) {
            return "ME";
        }

        if (
            name.includes("electronics") &&
            name.includes("telecommunication")
        ) {
            return "EXTC";
        }

        if (name.includes("civil")) {
            return "CIVIL";
        }

        if (
            name.includes("engineering sciences") ||
            name.includes("humanities")
        ) {
            return "DESH";
        }

    }


    return null;

}


/* =========================================================
   DEPARTMENT CONFIGURATION
   ========================================================= */

function configureDepartment() {

    const departmentName =
        currentUser.departmentName ||
        "Department";


    if (subjectsDepartmentName) {

        subjectsDepartmentName.innerHTML = `
            <i class="fa-solid fa-building-columns"></i>
            <span>${escapeHtml(departmentName)}</span>
        `;

    }


    if (topbarDepartment) {

        topbarDepartment.textContent =
            departmentName;

    }


    /*
     * DESH:
     * FE only
     * Semester 1 / 2
     * Academic Year selector hidden
     */

    if (currentDepartmentCode === "DESH") {

        if (academicYearGroup) {
            academicYearGroup.style.display = "none";
        }

        populateSemesterOptions(
            "FE"
        );

        return;
    }


    /*
     * All engineering departments:
     * SE / TE / BE
     */

    if (academicYearGroup) {
        academicYearGroup.style.display = "";
    }


    populateSemesterOptions("");

}


/* =========================================================
   FILTER SETUP
   ========================================================= */

function setupFilters() {

    if (academicYearSelect) {

        academicYearSelect.addEventListener(
            "change",
            () => {

                const year =
                    academicYearSelect.value;

                populateSemesterOptions(year);

                clearSubjects();

            }
        );

    }


    if (semesterSelect) {

        semesterSelect.addEventListener(
            "change",
            () => {

                loadSubjects();

            }
        );

    }


    if (refreshSubjectsBtn) {

        refreshSubjectsBtn.addEventListener(
            "click",
            () => {

                loadSubjects();

            }
        );

    }


    if (addSubjectBtn) {

        addSubjectBtn.addEventListener(
            "click",
            () => {

                openAddSubjectModal();

            }
        );

    }

}


/* =========================================================
   SEMESTER OPTIONS
   ========================================================= */

function populateSemesterOptions(
    academicYear
) {

    if (!semesterSelect) {
        return;
    }


    semesterSelect.innerHTML = "";


    const placeholder =
        document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
        "Select Semester";

    semesterSelect.appendChild(
        placeholder
    );


    let semesters = [];


    /*
     * DESH / FE
     */

    if (
        currentDepartmentCode === "DESH" ||
        academicYear === "FE"
    ) {

        semesters = [
            1,
            2
        ];

    }

    /*
     * SE
     */

    else if (academicYear === "SE") {

        semesters = [
            3,
            4
        ];

    }

    /*
     * TE
     */

    else if (academicYear === "TE") {

        semesters = [
            5,
            6
        ];

    }

    /*
     * BE
     */

    else if (academicYear === "BE") {

        semesters = [
            7,
            8
        ];

    }


    semesters.forEach(
        semester => {

            const option =
                document.createElement("option");

            option.value =
                semester;

            option.textContent =
                `Semester ${semester}`;

            semesterSelect.appendChild(
                option
            );

        }
    );


    /*
     * Also update modal semester
     */

    populateModalSemesterOptions(
        academicYear
    );

}


/* =========================================================
   MODAL SEMESTER OPTIONS
   ========================================================= */

function populateModalSemesterOptions(
    academicYear
) {

    if (!modalSemester) {
        return;
    }


    modalSemester.innerHTML = "";


    const placeholder =
        document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
        "Select Semester";

    modalSemester.appendChild(
        placeholder
    );


    let semesters = [];


    if (
        currentDepartmentCode === "DESH" ||
        academicYear === "FE"
    ) {

        semesters = [
            1,
            2
        ];

    }

    else if (academicYear === "SE") {

        semesters = [
            3,
            4
        ];

    }

    else if (academicYear === "TE") {

        semesters = [
            5,
            6
        ];

    }

    else if (academicYear === "BE") {

        semesters = [
            7,
            8
        ];

    }


    semesters.forEach(
        semester => {

            const option =
                document.createElement("option");

            option.value =
                semester;

            option.textContent =
                `Semester ${semester}`;

            modalSemester.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   LOAD SUBJECTS
   ========================================================= */

async function loadSubjects() {

    if (!currentDepartmentId) {

        showTableError(
            "Department information is missing."
        );

        return;
    }


    const semester =
        semesterSelect
            ? semesterSelect.value
            : "";


    if (!semester) {

        clearSubjects();

        return;
    }


    let academicYear;


    if (currentDepartmentCode === "DESH") {

        academicYear = "FE";

    } else {

        academicYear =
            academicYearSelect.value;

        if (!academicYear) {

            clearSubjects();

            showToast(
                "Select Academic Year",
                "Please select SE, TE or BE first.",
                "error"
            );

            return;
        }

    }


    showTableLoading();


    try {

        const url =
            `${API_BASE_URL}/api/subjects/department/` +
            `${currentDepartmentId}/year/` +
            `${academicYear}/semester/` +
            `${semester}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                await getResponseError(
                    response
                )
            );

        }


        const subjects =
            await response.json();


        currentSubjects =
            Array.isArray(subjects)
                ? subjects
                : [];


        renderSubjects(
            currentSubjects,
            academicYear,
            semester
        );


    } catch (error) {

        console.error(
            "Failed to load subjects:",
            error
        );


        showTableError(
            error.message ||
            "Unable to load subjects."
        );


        showToast(
            "Loading Failed",
            error.message ||
            "Unable to load subjects.",
            "error"
        );

    }

}


/* =========================================================
   RENDER SUBJECTS
   ========================================================= */

function renderSubjects(
    subjects,
    academicYear,
    semester
) {

    subjectListTitle.textContent =
        `Semester ${semester} Subjects`;


    subjectListSubtitle.textContent =
        `${academicYear} • Semester ${semester} • ` +
        `${subjects.length} subject${subjects.length === 1 ? "" : "s"}`;


    if (!subjects.length) {

        subjectsTableWrapper.innerHTML = `

            <div class="subjects-empty">

                <i class="fa-solid fa-book-open"></i>

                <h3>
                    No subjects found
                </h3>

                <p>
                    No subjects have been added for
                    ${academicYear}, Semester ${semester}.
                </p>

            </div>

        `;

        return;
    }


    const rows =
        subjects.map(
            (subject, index) => {

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <span class="subject-code">
                                ${escapeHtml(subject.code)}
                            </span>
                        </td>

                        <td>
                            <span class="subject-name">
                                ${escapeHtml(subject.name)}
                            </span>
                        </td>

                        <td>
                            <span class="subject-year">
                                ${escapeHtml(subject.academicYear)}
                            </span>
                        </td>

                        <td>
                            <span class="subject-semester">
                                Semester ${subject.semester}
                            </span>
                        </td>

                        <td>

                            <div class="subject-actions">

                                <button
                                    type="button"
                                    class="subject-action-button edit"
                                    title="Edit Subject"
                                    onclick="openEditSubjectModal(${subject.id})"
                                >

                                    <i class="fa-solid fa-pen"></i>

                                </button>


                                <button
                                    type="button"
                                    class="subject-action-button delete"
                                    title="Delete Subject"
                                    onclick="deleteSubject(${subject.id})"
                                >

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    subjectsTableWrapper.innerHTML = `

        <table class="subjects-table">

            <thead>

                <tr>

                    <th>
                        #
                    </th>

                    <th>
                        Code
                    </th>

                    <th>
                        Subject Name
                    </th>

                    <th>
                        Year
                    </th>

                    <th>
                        Semester
                    </th>

                    <th>
                        Actions
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
   CLEAR SUBJECTS
   ========================================================= */

function clearSubjects() {

    currentSubjects = [];


    subjectListTitle.textContent =
        "Subjects";


    subjectListSubtitle.textContent =
        "Select an academic year and semester to view subjects.";


    subjectsTableWrapper.innerHTML = `

        <div class="subjects-empty">

            <i class="fa-solid fa-book-open"></i>

            <h3>
                Select an academic structure
            </h3>

            <p>
                Choose the academic year and semester
                to view subjects.
            </p>

        </div>

    `;

}


/* =========================================================
   TABLE LOADING
   ========================================================= */

function showTableLoading() {

    subjectsTableWrapper.innerHTML = `

        <div class="subjects-loading">

            <i class="fa-solid fa-spinner"></i>

            Loading subjects...

        </div>

    `;

}


/* =========================================================
   TABLE ERROR
   ========================================================= */

function showTableError(
    message
) {

    subjectsTableWrapper.innerHTML = `

        <div class="subjects-error">

            <i class="fa-solid fa-triangle-exclamation"></i>

            <h3>
                Unable to load subjects
            </h3>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;

}


/* =========================================================
   MODAL SETUP
   ========================================================= */

function setupModal() {

    if (subjectModalClose) {

        subjectModalClose.addEventListener(
            "click",
            closeSubjectModal
        );

    }


    if (subjectModalCancel) {

        subjectModalCancel.addEventListener(
            "click",
            closeSubjectModal
        );

    }


    if (subjectModalOverlay) {

        subjectModalOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    subjectModalOverlay
                ) {

                    closeSubjectModal();

                }

            }
        );

    }


    if (saveSubjectBtn) {

        saveSubjectBtn.addEventListener(
            "click",
            saveSubject
        );

    }


    if (modalAcademicYear) {

        modalAcademicYear.addEventListener(
            "change",
            () => {

                const year =
                    modalAcademicYear.value;

                populateModalSemesterOptions(
                    year
                );

            }
        );

    }


    if (subjectForm) {

        subjectForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                saveSubject();

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                subjectModalOverlay &&
                subjectModalOverlay.classList.contains("show")
            ) {

                closeSubjectModal();

            }

        }
    );

}


/* =========================================================
   OPEN ADD SUBJECT MODAL
   ========================================================= */

function openAddSubjectModal() {

    editingSubjectId = null;


    subjectModalTitle.textContent =
        "Add Subject";


    subjectModalEyebrow.textContent =
        "Subject Management";


    subjectName.value = "";

    subjectCode.value = "";


    clearFormError();


    if (currentDepartmentCode === "DESH") {

        modalAcademicYear.value =
            "FE";

        modalAcademicYear.disabled =
            true;

        populateModalSemesterOptions(
            "FE"
        );


        if (semesterSelect.value) {

            modalSemester.value =
                semesterSelect.value;

        }

    } else {

        modalAcademicYear.disabled =
            false;


        if (academicYearSelect.value) {

            modalAcademicYear.value =
                academicYearSelect.value;

            populateModalSemesterOptions(
                academicYearSelect.value
            );

        } else {

            modalAcademicYear.value =
                "";

            populateModalSemesterOptions(
                ""
            );

        }


        if (semesterSelect.value) {

            modalSemester.value =
                semesterSelect.value;

        }

    }


    saveSubjectBtn.disabled = false;

    saveSubjectBtn.textContent =
        "Save Subject";


    openSubjectModal();

}


/* =========================================================
   OPEN EDIT SUBJECT MODAL
   ========================================================= */

function openEditSubjectModal(
    subjectId
) {

    const subject =
        currentSubjects.find(
            item =>
                Number(item.id) ===
                Number(subjectId)
        );


    if (!subject) {

        showToast(
            "Subject Not Found",
            "The selected subject could not be found.",
            "error"
        );

        return;
    }


    editingSubjectId =
        subject.id;


    subjectModalTitle.textContent =
        "Edit Subject";


    subjectModalEyebrow.textContent =
        "Update Subject";


    subjectName.value =
        subject.name || "";


    subjectCode.value =
        subject.code || "";


    clearFormError();


    modalAcademicYear.value =
        subject.academicYear;


    modalAcademicYear.disabled =
        currentDepartmentCode === "DESH";


    populateModalSemesterOptions(
        subject.academicYear
    );


    modalSemester.value =
        subject.semester;


    saveSubjectBtn.disabled =
        false;


    saveSubjectBtn.textContent =
        "Update Subject";


    openSubjectModal();

}


/* =========================================================
   OPEN MODAL
   ========================================================= */

function openSubjectModal() {

    if (!subjectModalOverlay) {
        return;
    }


    subjectModalOverlay.classList.add(
        "show"
    );


    subjectModalOverlay.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        () => {

            subjectName.focus();

        },
        50
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeSubjectModal() {

    if (!subjectModalOverlay) {
        return;
    }


    subjectModalOverlay.classList.remove(
        "show"
    );


    subjectModalOverlay.setAttribute(
        "aria-hidden",
        "true"
    );


    clearFormError();


    editingSubjectId = null;

}


/* =========================================================
   SAVE SUBJECT
   ========================================================= */

async function saveSubject() {

    clearFormError();


    const name =
        subjectName.value.trim();


    const code =
        subjectCode.value.trim();


    const academicYear =
        modalAcademicYear.value;


    const semester =
        modalSemester.value;


    if (!name) {

        showFormError(
            "Subject name is required."
        );

        return;
    }


    if (!code) {

        showFormError(
            "Subject code is required."
        );

        return;
    }


    if (!academicYear) {

        showFormError(
            "Academic year is required."
        );

        return;
    }


    if (!semester) {

        showFormError(
            "Semester is required."
        );

        return;
    }


    if (!currentDepartmentId) {

        showFormError(
            "Department information is missing."
        );

        return;
    }


    /*
     * Extra frontend validation.
     */

    const semesterNumber =
        Number(semester);


    if (
        academicYear === "FE" &&
        (
            currentDepartmentCode !== "DESH" ||
            ![1, 2].includes(semesterNumber)
        )
    ) {

        showFormError(
            "FE subjects are only available for DESH Semester 1 or 2."
        );

        return;
    }


    if (
        academicYear === "SE" &&
        ![3, 4].includes(semesterNumber)
    ) {

        showFormError(
            "SE subjects can only belong to Semester 3 or 4."
        );

        return;
    }


    if (
        academicYear === "TE" &&
        ![5, 6].includes(semesterNumber)
    ) {

        showFormError(
            "TE subjects can only belong to Semester 5 or 6."
        );

        return;
    }


    if (
        academicYear === "BE" &&
        ![7, 8].includes(semesterNumber)
    ) {

        showFormError(
            "BE subjects can only belong to Semester 7 or 8."
        );

        return;
    }


    saveSubjectBtn.disabled =
        true;


    saveSubjectBtn.textContent =
        editingSubjectId
            ? "Updating..."
            : "Saving...";


    try {

        let response;


        /*
         * CREATE
         */

        if (!editingSubjectId) {

            const params =
                new URLSearchParams({

                    name,
                    code,
                    departmentId:
                        String(currentDepartmentId),
                    academicYear,
                    semester:
                        String(semesterNumber)

                });


            response =
                await fetch(
                    `${API_BASE_URL}/api/subjects?${params.toString()}`,
                    {
                        method: "POST"
                    }
                );

        }


        /*
         * UPDATE
         */

        else {

            const params =
                new URLSearchParams({

                    name,
                    code,
                    academicYear,
                    semester:
                        String(semesterNumber)

                });


            response =
                await fetch(
                    `${API_BASE_URL}/api/subjects/${editingSubjectId}?${params.toString()}`,
                    {
                        method: "PUT"
                    }
                );

        }


        if (!response.ok) {

            throw new Error(
                await getResponseError(
                    response
                )
            );

        }


        const savedSubject =
            await response.json();


        console.log(
            "Subject saved:",
            savedSubject
        );


        closeSubjectModal();


        showToast(
            editingSubjectId
                ? "Subject Updated"
                : "Subject Added",
            editingSubjectId
                ? `${name} was updated successfully.`
                : `${name} was added successfully.`,
            "success"
        );


        /*
         * Reload current semester.
         */

        await loadSubjects();


    } catch (error) {

        console.error(
            "Subject save error:",
            error
        );


        showFormError(
            error.message ||
            "Unable to save subject."
        );


        showToast(
            "Save Failed",
            error.message ||
            "Unable to save subject.",
            "error"
        );


    } finally {

        saveSubjectBtn.disabled =
            false;


        saveSubjectBtn.textContent =
            editingSubjectId
                ? "Update Subject"
                : "Save Subject";

    }

}


/* =========================================================
   DELETE SUBJECT
   ========================================================= */

async function deleteSubject(
    subjectId
) {

    const subject =
        currentSubjects.find(
            item =>
                Number(item.id) ===
                Number(subjectId)
        );


    if (!subject) {

        showToast(
            "Subject Not Found",
            "The selected subject could not be found.",
            "error"
        );

        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${subject.name}" (${subject.code})?\n\nThis action cannot be undone.`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/subjects/${subjectId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                await getResponseError(
                    response
                )
            );

        }


        showToast(
            "Subject Deleted",
            `${subject.name} was deleted successfully.`,
            "success"
        );


        await loadSubjects();


    } catch (error) {

        console.error(
            "Subject delete error:",
            error
        );


        showToast(
            "Delete Failed",
            error.message ||
            "Unable to delete subject.",
            "error"
        );

    }

}


/* =========================================================
   FORM ERROR
   ========================================================= */

function showFormError(
    message
) {

    if (!subjectFormError) {
        return;
    }


    subjectFormError.textContent =
        message;


    subjectFormError.classList.add(
        "show"
    );

}


function clearFormError() {

    if (!subjectFormError) {
        return;
    }


    subjectFormError.textContent =
        "";


    subjectFormError.classList.remove(
        "show"
    );

}


/* =========================================================
   RESPONSE ERROR HANDLING
   ========================================================= */

async function getResponseError(
    response
) {

    let text = "";


    try {

        text =
            await response.text();

    } catch (error) {

        return `Request failed with status ${response.status}`;

    }


    if (!text) {

        return `Request failed with status ${response.status}`;

    }


    /*
     * Spring Boot may return JSON.
     */

    try {

        const data =
            JSON.parse(text);


        if (data.message) {
            return data.message;
        }


        if (data.error) {
            return data.error;
        }


        if (data.detail) {
            return data.detail;
        }

    } catch (error) {

        /*
         * Response was plain text.
         */

    }


    /*
     * Friendly duplicate-subject message.
     */

    if (
        text.toLowerCase().includes(
            "subject code already exists"
        )
    ) {

        return "A subject with this code already exists for this department and semester.";

    }


    return text.length > 250
        ? text.substring(0, 250) + "..."
        : text;

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

            /*
             * Already on subjects page.
             */

            break;
case "subject-allocation":

    window.location.href =
        "hod-subject-allocation.html";

    break;

        default:

            showToast(
                "Coming Soon",
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

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "currentUser"
            );


            window.location.href =
                "index.html";

        }
    );

}
/* =========================================================
   PROFILE
   ========================================================= */

function setupProfile() {

    const profileButton =
        document.getElementById(
            "profileButton"
        );


    if (!profileButton) {
        return;
    }


    profileButton.addEventListener(
        "click",
        () => {

            showToast(
                "Profile",
                currentUser?.name ||
                currentUser?.username ||
                "HOD",
                "info"
            );

        }
    );

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function setupNotifications() {

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        () => {

            showToast(
                "Notifications",
                "No new notifications.",
                "info"
            );

        }
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    title,
    message,
    type = "success"
) {

    if (
        !dashboardToast ||
        !dashboardToastTitle ||
        !dashboardToastMessage
    ) {
        return;
    }


    dashboardToastTitle.textContent =
        title;


    dashboardToastMessage.textContent =
        message;


    const icon =
        document.getElementById(
            "dashboardToastIcon"
        );


    if (icon) {

        if (type === "error") {

            icon.style.background =
                "#fff0f0";

            icon.style.color =
                "#c64b4b";

            icon.innerHTML =
                '<i class="fa-solid fa-circle-exclamation"></i>';

        }

        else if (type === "info") {

            icon.style.background =
                "#eef4ff";

            icon.style.color =
                "#4c72b8";

            icon.innerHTML =
                '<i class="fa-solid fa-circle-info"></i>';

        }

        else {

            icon.style.background =
                "#eaf7f0";

            icon.style.color =
                "#309362";

            icon.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>';

        }

    }


    dashboardToast.classList.add(
        "show"
    );


    clearTimeout(
        window.subjectToastTimer
    );


    window.subjectToastTimer =
        setTimeout(
            () => {

                dashboardToast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


if (dashboardToastClose) {

    dashboardToastClose.addEventListener(
        "click",
        () => {

            dashboardToast.classList.remove(
                "show"
            );

        }
    );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

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
   CAPITALIZE
   ========================================================= */

function capitalize(
    value
) {

    if (!value) {
        return "";
    }


    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openEditSubjectModal =
    openEditSubjectModal;

window.deleteSubject =
    deleteSubject;