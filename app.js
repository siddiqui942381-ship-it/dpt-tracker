// --- FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Replace with your web app's Firebase configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyATa9OGuI11g6NXOwh_45AMfW42-ML31Uk",
  authDomain: "academic-partner-662dc.firebaseapp.com",
  projectId: "academic-partner-662dc",
  storageBucket: "academic-partner-662dc.firebasestorage.app",
  messagingSenderId: "217529915448",
  appId: "1:217529915448:web:bcd0af856d7851fa7b6ecd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- GLOBAL VARIABLES ---
let activeCourses = [];
let allSavedSemesters = {}; // Holds data fetched from Firestore DB

// --- 1. MASTER DPT SYLLABUS ---
const defaultFields = { quizzes: "", mid: "", viva: "", final: "", total: "", grade: "none" };

const dptSyllabus = {
    "sem1": [
        { code: "DPT111", name: "Anatomy-I", credits: 4, ...defaultFields },
        { code: "DPT112", name: "Physiology-I", credits: 3, ...defaultFields },
        { code: "DPT113", name: "Kinesiology-I", credits: 3, ...defaultFields },
        { code: "DPT114", name: "English-I (Functional)", credits: 3, ...defaultFields },
        { code: "DPT115", name: "Pakistan Studies", credits: 2, ...defaultFields },
        { code: "DPT116", name: "Intro to Computer", credits: 3, ...defaultFields }
    ],
    "sem2": [
        { code: "DPT121", name: "Anatomy-II", credits: 4, ...defaultFields },
        { code: "DPT122", name: "Physiology-II", credits: 3, ...defaultFields },
        { code: "DPT123", name: "Kinesiology-II", credits: 3, ...defaultFields },
        { code: "DPT124", name: "English-II (Comm Skills)", credits: 3, ...defaultFields },
        { code: "DPT127", name: "Islamic Studies/Ethics", credits: 2, ...defaultFields },
        { code: "DPT128", name: "Sociology", credits: 2, ...defaultFields }
    ],
    "sem3": [
        { code: "DPT234", name: "English-III", credits: 3, ...defaultFields },
        { code: "DPT239", name: "Medical Physics", credits: 3, ...defaultFields },
        { code: "DPT231", name: "Anatomy-III", credits: 3, ...defaultFields },
        { code: "DPT232", name: "Physiology-III", credits: 3, ...defaultFields },
        { code: "DPT2310", name: "Biomechanics-I", credits: 3, ...defaultFields },
        { code: "DPT2311", name: "Biochemistry-I", credits: 2, ...defaultFields }
    ],
    "sem4": [
        { code: "DPT241", name: "Anatomy-IV (Neuro)", credits: 3, ...defaultFields },
        { code: "DPT2410", name: "Biomechanics-II", credits: 3, ...defaultFields },
        { code: "DPT2412", name: "Health & Wellness", credits: 2, ...defaultFields },
        { code: "DPT2411", name: "Biochemistry-II", credits: 3, ...defaultFields },
        { code: "DPT2413", name: "Exercise Physiology", credits: 3, ...defaultFields },
        { code: "DPT2414", name: "Mol. Biology & Genetics", credits: 2, ...defaultFields }
    ],
    "sem5": [
        { code: "DPT3515", name: "Pathology & Micro-I", credits: 2, ...defaultFields },
        { code: "DPT3516", name: "Pharmacology-I", credits: 2, ...defaultFields },
        { code: "DPT3517", name: "Physical Agents-I", credits: 3, ...defaultFields },
        { code: "DPT3518", name: "Therapeutic Exercises", credits: 3, ...defaultFields },
        { code: "DPT3519", name: "Biostatistics-I", credits: 3, ...defaultFields },
        { code: "DPT3520", name: "Behavioral Sciences", credits: 2, ...defaultFields },
        { code: "DPT3521", name: "Clinical Practice-I", credits: 3, ...defaultFields }
    ],
    "sem6": [
        { code: "DPT3615", name: "Pathology & Micro-II", credits: 3, ...defaultFields },
        { code: "DPT3616", name: "Pharmacology-II", credits: 2, ...defaultFields },
        { code: "DPT3617", name: "Physical Agents-II", credits: 3, ...defaultFields },
        { code: "DPT3619", name: "Biostatistics-II", credits: 3, ...defaultFields },
        { code: "DPT3622", name: "Community Medicine", credits: 3, ...defaultFields },
        { code: "DPT3621", name: "Clinical Practice-II", credits: 3, ...defaultFields }
    ],
    "sem7": [
        { code: "DPT4723", name: "Medicine-I", credits: 3, ...defaultFields },
        { code: "DPT4724", name: "Surgery-I", credits: 3, ...defaultFields },
        { code: "DPT4725", name: "Radiology & Imaging", credits: 3, ...defaultFields },
        { code: "DPT4726", name: "Musculoskeletal PT", credits: 3, ...defaultFields },
        { code: "DPT4727", name: "Evidence Based Practice", credits: 3, ...defaultFields },
        { code: "DPT4721", name: "Clinical Practice-III", credits: 3, ...defaultFields }
    ],
    "sem8": [
        { code: "DPT4823", name: "Medicine-II", credits: 3, ...defaultFields },
        { code: "DPT4824", name: "Surgery-II", credits: 3, ...defaultFields },
        { code: "DPT4828", name: "Neurological PT", credits: 3, ...defaultFields },
        { code: "DPT4829", name: "Scientific Inquiry", credits: 3, ...defaultFields },
        { code: "DPT4830", name: "Emergency Procedures", credits: 3, ...defaultFields },
        { code: "DPT4821", name: "Clinical Practice-IV", credits: 3, ...defaultFields }
    ],
    "sem9": [
        { code: "DPT5931", name: "Cardiopulmonary PT", credits: 3, ...defaultFields },
        { code: "DPT5932", name: "Prosthetics & Orthotics", credits: 2, ...defaultFields },
        { code: "DPT5933", name: "Clinical Decision Making", credits: 3, ...defaultFields },
        { code: "DPT5934", name: "Manual Therapy", credits: 3, ...defaultFields },
        { code: "DPT5935", name: "Professional Practice", credits: 2, ...defaultFields },
        { code: "DPT5936", name: "Integumentry PT", credits: 2, ...defaultFields },
        { code: "DPT5921", name: "Clinical Practice-V", credits: 3, ...defaultFields }
    ],
    "sem10": [
        { code: "DPT51037", name: "Obstetrics & Gynae PT", credits: 2, ...defaultFields },
        { code: "DPT51038", name: "Paediatric PT", credits: 2, ...defaultFields },
        { code: "DPT51039", name: "Gerontology PT", credits: 2, ...defaultFields },
        { code: "DPT51040", name: "Sports PT", credits: 2, ...defaultFields },
        { code: "DPT51021", name: "Clinical Practice-VI", credits: 4, ...defaultFields },
        { code: "DPT51041", name: "Research Project", credits: 6, ...defaultFields },
        { code: "DPT51042", name: "Human Rights", credits: 2, ...defaultFields }
    ]
};

// --- 2. RANDOM LOVE NOTES ---
const loveNotes = [
    "You're doing amazing, keeping pushing forward!",
    "I am incredibly proud of your hard work.",
    "Take a deep breath, you've got this, future doctor!",
    "Every small step is a step closer to your dream.",
    "Your dedication inspires me every day. Keep shining!",
    "Don't forget to take breaks. You're doing brilliant.",
    "Another semester, another step closer to greatness."
];

function setRandomNote() {
    const randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    document.getElementById("welcome-text").innerText = randomNote;
}

// --- 3. LOGIN & FIREBASE SYNC LOGIC ---
window.checkLogin = async function() {
    const user = document.getElementById("username").value.toLowerCase();
    const pass = document.getElementById("password").value;

    if (user === "maryum" && pass === "dpt2026") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app-screen").style.display = "block";
        
        setRandomNote();
        await fetchUserData(); // Pulls saved remote records
    } else {
        document.getElementById("error-msg").style.display = "block";
    }
}

window.logout = function() {
    document.getElementById("app-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("course-list").innerHTML = "";
    document.getElementById("history-section").style.display = "none";
    activeCourses = [];
    hideResult();
}

async function fetchUserData() {
    try {
        const docRef = doc(db, "students", "maryum");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            allSavedSemesters = docSnap.data().semesters || {};
        } else {
            allSavedSemesters = {};
        }
        updateDashboardStats();
    } catch (error) {
        console.error("Error fetching data: ", error);
        alert("Could not load data. Check your internet connection.");
    }
}

// --- 4. DASHBOARD STATS ---
function updateDashboardStats() {
    let totalGradePoints = 0;
    let totalCredits = 0;
    let semestersCompleted = 0;
    let latestSgpa = 0.00;

    // Sort semesters chronologically (sem1, sem2, etc.)
    const sortedSems = Object.keys(allSavedSemesters).sort((a, b) => {
        return parseInt(a.replace('sem', '')) - parseInt(b.replace('sem', ''));
    });

    sortedSems.forEach(semKey => {
        semestersCompleted++;
        const courses = allSavedSemesters[semKey];
        let semGradePoints = 0;
        let semCredits = 0;

        courses.forEach(course => {
            const ch = parseFloat(course.credits) || 0;
            const gp = parseFloat(course.grade) || 0;
            if (course.grade !== "none") {
                semCredits += ch;
                semGradePoints += (ch * gp);
                
                totalCredits += ch;
                totalGradePoints += (ch * gp);
            }
        });

        if (semCredits > 0) {
            latestSgpa = (semGradePoints / semCredits).toFixed(2);
        }
    });

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";

    document.getElementById("semester-count").innerText = semestersCompleted;
    document.getElementById("latest-sgpa").innerText = latestSgpa || "0.00";
    document.getElementById("cgpa").innerText = cgpa;
}

// --- 5. COURSE MANAGEMENT ---
window.loadTemplate = function() {
    const selectedSem = document.getElementById("semester-select").value;
    
    if (selectedSem !== "none") {
        if (allSavedSemesters[selectedSem]) {
            // Load from Firebase state
            activeCourses = JSON.parse(JSON.stringify(allSavedSemesters[selectedSem]));
        } else if (dptSyllabus[selectedSem]) {
            // Load default syllabus template
            activeCourses = JSON.parse(JSON.stringify(dptSyllabus[selectedSem]));
        }
        
        hideResult();
        renderCourses();
    }
}

window.addBlankCourse = function() {
    activeCourses.push({ code: "NEW", name: "", credits: 3, ...defaultFields });
    renderCourses();
}

window.dropCourse = function(index) {
    activeCourses.splice(index, 1);
    renderCourses();
}

window.updateData = function(index, field, value) {
    activeCourses[index][field] = value;
    
    if (["quizzes", "mid", "viva", "final"].includes(field)) {
        const q = Number(activeCourses[index].quizzes) || 0;
        const m = Number(activeCourses[index].mid) || 0;
        const v = Number(activeCourses[index].viva) || 0;
        const f = Number(activeCourses[index].final) || 0;
        
        if (activeCourses[index].quizzes !== "" || activeCourses[index].mid !== "" || activeCourses[index].viva !== "" || activeCourses[index].final !== "") {
             activeCourses[index].total = q + m + v + f;
             document.getElementById(`total-${index}`).value = activeCourses[index].total;
        }
    }
}

window.hideResult = function() {
    document.getElementById("result-box").style.display = "none";
}

// --- 6. RENDERING THE COURSES ---
function renderCourses() {
    const container = document.getElementById("course-list");
    container.innerHTML = ""; 

    activeCourses.forEach((course, index) => {
        container.innerHTML += `
            <div class="course-card">
                <div class="card-header">
                    <input type="text" value="${course.code}" placeholder="Code" onchange="updateData(${index}, 'code', this.value)">
                    <input type="text" value="${course.name}" placeholder="Course Name" onchange="updateData(${index}, 'name', this.value)">
                    <input type="number" value="${course.credits}" min="1" max="10" placeholder="CH" onchange="updateData(${index}, 'credits', this.value)">
                    <button class="drop-btn" onclick="dropCourse(${index})" title="Drop Course">X</button>
                </div>
                
                <div class="marks-grid">
                    <div class="input-block">
                        <label>Quizzes</label>
                        <input type="number" value="${course.quizzes}" placeholder="-" oninput="updateData(${index}, 'quizzes', this.value)">
                    </div>
                    <div class="input-block">
                        <label>Mid Term</label>
                        <input type="number" value="${course.mid}" placeholder="-" oninput="updateData(${index}, 'mid', this.value)">
                    </div>
                    <div class="input-block">
                        <label>Viva/OSPE</label>
                        <input type="number" value="${course.viva}" placeholder="-" oninput="updateData(${index}, 'viva', this.value)">
                    </div>
                    <div class="input-block">
                        <label>Final Exam</label>
                        <input type="number" value="${course.final}" placeholder="-" oninput="updateData(${index}, 'final', this.value)">
                    </div>
                    <div class="input-block">
                        <label>Total</label>
                        <input type="number" id="total-${index}" class="total-input" value="${course.total}" placeholder="0" oninput="updateData(${index}, 'total', this.value)">
                    </div>
                    <div class="input-block">
                        <label>Grade</label>
                        <select onchange="updateData(${index}, 'grade', this.value)">
                            <option value="none" ${course.grade === 'none' ? 'selected' : ''}>--</option>
                            <option value="4.0" ${course.grade === '4.0' ? 'selected' : ''}>A+ (90-100)</option>
                            <option value="3.5" ${course.grade === '3.5' ? 'selected' : ''}>A (80-89)</option>
                            <option value="3.0" ${course.grade === '3.0' ? 'selected' : ''}>B (70-79)</option>
                            <option value="2.5" ${course.grade === '2.5' ? 'selected' : ''}>C (60-69)</option>
                            <option value="2.0" ${course.grade === '2.0' ? 'selected' : ''}>D (50-59)</option>
                            <option value="0.0" ${course.grade === '0.0' ? 'selected' : ''}>F (<50)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    });
}

// --- 7. CALCULATE SGPA & SAVE TO FIREBASE ---
window.calculateSGPA = async function() {
    if (activeCourses.length === 0) return;

    let totalGradePoints = 0;
    let totalCreditHours = 0;
    let hasError = false;

    for (let i = 0; i < activeCourses.length; i++) {
        const credits = parseFloat(activeCourses[i].credits);
        const gradePoint = activeCourses[i].grade;

        if (isNaN(credits) || gradePoint === "none") {
            hasError = true;
            break;
        }

        totalCreditHours += credits;
        totalGradePoints += (credits * parseFloat(gradePoint));
    }

    if (hasError) {
        alert("Please make sure all courses have valid credit hours and a selected Grade from the dropdown.");
        return;
    }

    let sgpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours) : 0;

    // Display computed terms
    document.getElementById("sgpa-display").innerText = sgpa.toFixed(2);
    document.getElementById("ch-display").innerText = totalCreditHours;
    document.getElementById("result-box").style.display = "block";

    // Save synchronously to remote Firestore
    const selectedSem = document.getElementById("semester-select").value;
    if (selectedSem !== "none") {
        try {
            allSavedSemesters[selectedSem] = activeCourses;
            
            await setDoc(doc(db, "students", "maryum"), {
                semesters: allSavedSemesters
            }, { merge: true });

            // Dynamically refresh values on main dashboard screen
            updateDashboardStats();
            
        } catch (error) {
            console.error("Error saving document: ", error);
            alert("Error saving data. Check connection.");
        }
    }
}

// --- 8. PREVIOUS RESULTS (ACCORDION) ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("history-btn").addEventListener("click", renderHistory);
});

function renderHistory() {
    const historySection = document.getElementById("history-section");
    const container = document.getElementById("history-container");
    
    // Toggle Accordion View
    if (historySection.style.display === "block") {
        historySection.style.display = "none";
        return;
    }
    historySection.style.display = "block";
    container.innerHTML = "";

    const sortedSems = Object.keys(allSavedSemesters).sort((a, b) => {
        return parseInt(a.replace('sem', '')) - parseInt(b.replace('sem', ''));
    });

    if (sortedSems.length === 0) {
        container.innerHTML = "<p style='padding:15px; color:#666;'>No previous results saved yet.</p>";
        return;
    }

    let cumulativeGP = 0;
    let cumulativeCH = 0;

    sortedSems.forEach(semKey => {
        const courses = allSavedSemesters[semKey];
        let semGP = 0;
        let semCH = 0;
        let subjectRows = `
            <div style="font-weight: bold; font-size: 13px; color: #555; border-bottom:1px solid #ddd; padding-bottom:5px; margin-bottom:8px;" class="subject-row">
                <span>Subject Details</span>
                <span style="text-align:center;">Credit Hours</span>
                <span style="text-align:center;">Earned Points</span>
            </div>
        `;

        courses.forEach(course => {
            const ch = parseFloat(course.credits) || 0;
            const gp = parseFloat(course.grade) || 0;
            if (course.grade !== "none") {
                semCH += ch;
                semGP += (ch * gp);
                subjectRows += `
                    <div class="subject-row" style="font-size:13px; padding:4px 0; border-bottom:1px dashed #f0f0f0;">
                        <span>${course.name || 'Untitled Course'}</span>
                        <span style="text-align:center;">${ch.toFixed(1)}</span>
                        <span style="text-align:center;">${(ch * gp).toFixed(1)}</span>
                    </div>
                `;
            }
        });

        cumulativeGP += semGP;
        cumulativeCH += semCH;
        
        const sgpa = semCH > 0 ? (semGP / semCH).toFixed(2) : "0.00";
        const cgpa = cumulativeCH > 0 ? (cumulativeGP / cumulativeCH).toFixed(2) : "0.00";
        
        const titleMap = {
            "sem1": "Semester I", "sem2": "Semester II", "sem3": "Semester III", 
            "sem4": "Semester IV", "sem5": "Semester V", "sem6": "Semester VI", 
            "sem7": "Semester VII", "sem8": "Semester VIII", "sem9": "Semester IX", 
            "sem10": "Semester X"
        };

        const semHtml = `
            <div class="semester-card">
                <div class="semester-header" onclick="toggleSem('${semKey}')">
                    <span style="width: 150px; font-weight:600;">🗓 ${titleMap[semKey] || semKey}</span>
                    <span style="font-size:14px; color:#5d4fff; font-weight:500;">SGPA: ${sgpa}</span>
                    <span style="font-size:14px; color:#555; font-weight:500;">CGPA: ${cgpa}</span>
                    <span style="font-size:13px; color:#888;">CH: ${semCH.toFixed(1)}</span>
                </div>
                <div class="semester-body" id="body-${semKey}" style="display:none; padding:15px; background:#fafafa; border-top:1px solid #eee;">
                    ${subjectRows}
                </div>
            </div>
        `;
        container.innerHTML += semHtml;
    });
}

// Expand/Collapse Details Trigger
window.toggleSem = function(semKey) {
    const body = document.getElementById(`body-${semKey}`);
    if (body.style.display === "block") {
        body.style.display = "none";
    } else {
        body.style.display = "block";
    }
}