// --- DATENBANK (Hier kommen später deine Wörter rein) ---
const db = [
    {
        type: "tabu",
        term: "Chiaroscuro",
        forbidden: ["Hell", "Dunkel", "Licht", "Schatten", "Barock"]
    },
    {
        type: "tabu",
        term: "Sfumato",
        forbidden: ["Da Vinci", "Rauch", "Weich", "Übergang", "Mona Lisa"]
    },
    {
        type: "tabu",
        term: "Kontrapost",
        forbidden: ["Standbein", "Spielbein", "Antike", "Hüfte", "Gewicht"]
    },
    {
        type: "quiz",
        question: "Was bedeutet 'Alla-prima'?",
        options: ["Nass-in-Nass Malerei", "Vorzeichnung auf Holz", "Der erste Druck", "Ein italienisches Gericht"],
        correct: 0
    },
    {
        type: "quiz",
        question: "Welches Verfahren ist subtraktiv?",
        options: ["Plastik (Ton)", "Skulptur (Stein)", "Bronzeguss", "Assemblage"],
        correct: 1
    }
];

// --- SPIEL LOGIK ---

let currentMode = "";
let currentPool = [];
let score = 0;

function showMenu() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('menu-screen').classList.add('active');
}

function startGame(mode) {
    currentMode = mode;
    // Filtert die Datenbank nach dem gewählten Modus
    currentPool = db.filter(item => item.type === mode);
    
    // Mischen (Shuffle)
    currentPool.sort(() => Math.random() - 0.5);

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    if (mode === 'tabu') {
        document.getElementById('game-tabu').classList.add('active');
        nextTabu();
    } else if (mode === 'quiz') {
        score = 0;
        document.getElementById('game-quiz').classList.add('active');
        updateScore();
        nextQuiz();
    }
}

// TABU FUNKTIONEN
function nextTabu() {
    if (currentPool.length === 0) {
        alert("Runde vorbei!");
        showMenu();
        return;
    }
    const card = currentPool.pop(); // Nimmt das letzte Element
    
    document.getElementById('tabu-term').innerText = card.term;
    const list = document.getElementById('tabu-forbidden');
    list.innerHTML = "";
    card.forbidden.forEach(word => {
        let li = document.createElement('li');
        li.innerText = word;
        list.appendChild(li);
    });
}

// QUIZ FUNKTIONEN
function nextQuiz() {
    if (currentPool.length === 0) {
        alert("Quiz beendet! Dein Score: " + score);
        showMenu();
        return;
    }
    
    // Reset UI
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('btn-next-quiz').classList.add('hidden');
    
    const card = currentPool.pop();
    document.getElementById('quiz-question').innerText = card.question;
    
    const container = document.getElementById('quiz-options');
    container.innerHTML = "";
    
    card.options.forEach((opt, index) => {
        let btn = document.createElement('button');
        btn.className = "quiz-opt";
        btn.innerText = opt;
        btn.onclick = () => checkQuiz(index, card.correct, btn);
        container.appendChild(btn);
    });
}

function checkQuiz(selectedIndex, correctIndex, btnElement) {
    // Sperre alle Buttons
    const allBtns = document.querySelectorAll('.quiz-opt');
    allBtns.forEach(b => b.disabled = true);
    
    if (selectedIndex === correctIndex) {
        btnElement.classList.add('correct');
        score++;
        updateScore();
    } else {
        btnElement.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct'); // Zeige richtige Lösung
    }
    
    document.getElementById('btn-next-quiz').classList.remove('hidden');
}

function updateScore() {
    document.getElementById('quiz-score').innerText = "Punkte: " + score;
}