/* =====================================================
   TEACHER MODAL
   ===================================================== */

let activeTeacherRelationship = null;
let activeTeacherModalMode = null;


/* =====================================================
   INITIALIZATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    setupTeacherModal();

});


function setupTeacherModal() {

    const overlay =
        document.getElementById(
            "teacherModalOverlay"
        );

    const closeButton =
        document.getElementById(
            "teacherModalClose"
        );

    const cancelButton =
        document.getElementById(
            "teacherModalCancel"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeTeacherModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeTeacherModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === overlay
                ) {

                    closeTeacherModal();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeTeacherModal();

            }

        }
    );

}


/* =====================================================
   OPEN MODAL
   ===================================================== */

window.openTeacherModal = function (
    relationship,
    mode = "view"
) {

    if (!relationship) {

        return;

    }


    activeTeacherRelationship =
        relationship;

    activeTeacherModalMode =
        mode;


    const overlay =
        document.getElementById(
            "teacherModalOverlay"
        );

    const title =
        document.getElementById(
            "teacherModalTitle"
        );

    const eyebrow =
        document.getElementById(
            "teacherModalEyebrow"
        );

    const avatar =
        document.getElementById(
            "teacherModalAvatar"
        );

    const body =
        document.getElementById(
            "teacherModalBody"
        );

    const footer =
        document.getElementById(
            "teacherModalFooter"
        );


    if (
        !overlay ||
        !title ||
        !eyebrow ||
        !avatar ||
        !body ||
        !footer
    ) {

        return;

    }


    const teacher =
        relationship.teacher || {};


    const teacherName =
        teacher.name ||
        "Unknown Teacher";


    if (mode === "remove") {

        eyebrow.textContent =
            "Remove Department Membership";

        title.textContent =
            "Remove Teacher";

        avatar.classList.add(
            "danger"
        );

        avatar.innerHTML = `
            <i class="fa-solid fa-user-minus"></i>
        `;


        body.innerHTML =
            createRemoveContent(
                relationship
            );


        footer.innerHTML = `

            <button
                type="button"
                class="teacher-modal-secondary"
                id="teacherModalCancel"
            >
                Cancel
            </button>


            <button
                type="button"
                class="teacher-modal-danger"
                id="confirmTeacherRemove"
            >

                <i class="fa-solid fa-user-minus"></i>

                Remove from Department

            </button>

        `;


        const confirmButton =
            document.getElementById(
                "confirmTeacherRemove"
            );


        if (confirmButton) {

            confirmButton.addEventListener(
                "click",
                confirmTeacherRemoval
            );

        }


    } else {

        eyebrow.textContent =
            "Teacher Profile";

        title.textContent =
            teacherName;

        avatar.classList.remove(
            "danger"
        );

        avatar.innerHTML = `
            <i class="fa-solid fa-user"></i>
        `;


        body.innerHTML =
            createTeacherProfileContent(
                relationship
            );


        footer.innerHTML = `

            <button
                type="button"
                class="teacher-modal-secondary"
                id="teacherModalCancel"
            >

                Close

            </button>

        `;


        const cancelButton =
            document.getElementById(
                "teacherModalCancel"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeTeacherModal
            );

        }

    }


    overlay.classList.add("show");

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

};


/* =====================================================
   CREATE TEACHER PROFILE
   ===================================================== */

function createTeacherProfileContent(
    relationship
) {

    const teacher =
        relationship.teacher || {};

    const department =
        relationship.department || {};


    const teacherName =
        teacher.name || "—";

    const username =
        teacher.username || "—";

    const email =
        teacher.email || "—";

    const mobile =
        teacher.mobile || "—";

    const dob =
        formatDate(
            teacher.dateOfBirth
        );

    const gender =
        formatGender(
            teacher.gender
        );

    const departmentName =
        department.name || "—";

    const departmentCode =
        department.code || "—";

    const status =
        relationship.status || "—";


    return `

        <div class="teacher-profile-summary">

            <div>

                <span class="teacher-profile-label">
                    Faculty ID
                </span>

                <strong>
                    ${escapeHtml(username)}
                </strong>

            </div>


            <span
                class="teacher-status-badge ${String(status).toLowerCase()}"
            >
                ${escapeHtml(status)}
            </span>

        </div>


        <div class="teacher-profile-grid">


            <div class="teacher-profile-field">

                <span>
                    Full Name
                </span>

                <strong>
                    ${escapeHtml(teacherName)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Email
                </span>

                <strong>
                    ${escapeHtml(email)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Mobile
                </span>

                <strong>
                    ${escapeHtml(mobile)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Date of Birth
                </span>

                <strong>
                    ${escapeHtml(dob)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Gender
                </span>

                <strong>
                    ${escapeHtml(gender)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Department
                </span>

                <strong>
                    ${escapeHtml(departmentName)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Department Code
                </span>

                <strong>
                    ${escapeHtml(departmentCode)}
                </strong>

            </div>


            <div class="teacher-profile-field">

                <span>
                    Relationship ID
                </span>

                <strong>
                    #${escapeHtml(
                        relationship.id
                    )}
                </strong>

            </div>

        </div>

    `;

}


/* =====================================================
   CREATE REMOVE CONTENT
   ===================================================== */

function createRemoveContent(
    relationship
) {

    const teacher =
        relationship.teacher || {};

    const department =
        relationship.department || {};


    const teacherName =
        teacher.name || "this teacher";

    const username =
        teacher.username || "—";

    const departmentName =
        department.name || "this department";


    return `

        <div class="teacher-remove-warning">


            <div class="teacher-remove-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>


            <div>

                <h4>
                    Remove department membership?
                </h4>

                <p>

                    You are about to remove
                    <strong>
                        ${escapeHtml(teacherName)}
                    </strong>
                    from
                    <strong>
                        ${escapeHtml(departmentName)}
                    </strong>.

                </p>

            </div>

        </div>


        <div class="teacher-remove-details">


            <div>

                <span>
                    Faculty ID
                </span>

                <strong>
                    ${escapeHtml(username)}
                </strong>

            </div>


            <div>

                <span>
                    Department
                </span>

                <strong>
                    ${escapeHtml(departmentName)}
                </strong>

            </div>


            <div>

                <span>
                    Current Status
                </span>

                <strong class="teacher-remove-status">
                    ${escapeHtml(
                        relationship.status ||
                        "APPROVED"
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Relationship ID
                </span>

                <strong>
                    #${escapeHtml(
                        relationship.id
                    )}
                </strong>

            </div>

        </div>


        <div class="teacher-remove-note">

            <i class="fa-solid fa-circle-info"></i>

            <span>

                This removes the teacher's
                <strong>
                    membership in this department only
                </strong>.
                Their teacher account is not deleted.
                If they belong to another department,
                that membership remains unaffected.

            </span>

        </div>

    `;

}


/* =====================================================
   CONFIRM REMOVE
   ===================================================== */

async function confirmTeacherRemoval() {

    if (!activeTeacherRelationship) {

        return;

    }


    const relationshipId =
        activeTeacherRelationship.id;


    const teacher =
        activeTeacherRelationship.teacher || {};


    const teacherName =
        teacher.name ||
        "Teacher";


    const confirmButton =
        document.getElementById(
            "confirmTeacherRemove"
        );


    if (confirmButton) {

        confirmButton.disabled = true;

        confirmButton.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Removing...

        `;

    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/teacher-departments/${relationshipId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        closeTeacherModal();


        showDashboardToast(
            "Teacher Removed",
            `${teacherName} has been removed from your department.`,
            "success"
        );


        /*
         * teachers.js owns the main teacher list.
         * Reload it after the relationship is deleted.
         */

        if (
            typeof loadDepartmentTeachers ===
            "function"
        ) {

            await loadDepartmentTeachers();

        }


    } catch (error) {

        console.error(
            "Failed to remove teacher:",
            error
        );


        if (confirmButton) {

            confirmButton.disabled = false;

            confirmButton.innerHTML = `

                <i class="fa-solid fa-user-minus"></i>

                Remove from Department

            `;

        }


        showDashboardToast(
            "Removal Failed",
            "The teacher could not be removed from this department.",
            "error"
        );

    }

}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeTeacherModal() {

    const overlay =
        document.getElementById(
            "teacherModalOverlay"
        );


    if (!overlay) {

        return;

    }


    overlay.classList.remove(
        "show"
    );


    overlay.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    activeTeacherRelationship =
        null;

    activeTeacherModalMode =
        null;

}


/* =====================================================
   DATE FORMAT
   ===================================================== */

function formatDate(
    value
) {

    if (!value) {

        return "—";

    }


    try {

        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch {

        return value;

    }

}


/* =====================================================
   GENDER FORMAT
   ===================================================== */

function formatGender(
    gender
) {

    if (!gender) {

        return "—";

    }


    const value =
        String(gender)
            .toLowerCase();


    if (value === "male") {

        return "Male";

    }


    if (value === "female") {

        return "Female";

    }


    if (value === "other") {

        return "Other";

    }


    return gender;

}


/* =====================================================
   HTML ESCAPE
   ===================================================== */

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