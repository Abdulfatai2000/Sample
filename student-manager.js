class StudentManager {
    constructor() {
        this.courseId = utils.getQueryParam('course');
        this.course = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {}; // { qId: optionIndex }
        this.flags = new Set();
        this.timer = null;
        this.timeLeft = 0;
        this.mode = 'exam'; // 'exam' or 'study' or 'practice'
        this.setupParams = { count: 20, time: 20 };
        this.allAvailableQuestions = [];
        this.timeSpent = 0; // Initialize clearly
        this.init();
    }

    async init() {
        console.group('StudentManager Initialization');
        console.log('CourseId:', this.courseId);

        try {
            // Wait for database to be ready (seeded)
            if (db.ready) {
                console.log('Waiting for db.ready...');
                await db.ready;
                console.log('db.ready resolved');
            }

            if (!this.courseId) {
                alert('No course selected!');
                window.location.href = 'index.html';
                return;
            }

            // Fetch Course Meta - match by code (case-insensitive)
            const courses = db.getCourses();
            this.course = courses.find(c => c.code.toLowerCase() === this.courseId.toLowerCase());

            if (!this.course) {
                alert('Invalid Course!');
                window.location.href = 'index.html';
                return;
            }

            document.title = `${this.course.code} Practice`;
            document.getElementById('course-title').innerText = `${this.course.code} - ${this.course.title}`;

            // Fetch Questions
            this.allAvailableQuestions = db.getQuestions(this.course.code);
            console.log(`Loaded ${this.allAvailableQuestions.length} questions for ${this.course.code}`);

            if (this.allAvailableQuestions.length === 0) {
                console.error('No questions found for course:', this.course.code);
                alert('No questions loaded for this course yet.');
                window.location.href = 'index.html';
                return;
            }

            // Setup UI
            const maxQEl = document.getElementById('max-q');
            const countInput = document.getElementById('setup-count');

            if (maxQEl) maxQEl.innerText = this.allAvailableQuestions.length;
            if (countInput) {
                countInput.value = Math.min(20, this.allAvailableQuestions.length);
                countInput.max = this.allAvailableQuestions.length;
            }

            console.log('UI Setup complete');
        } catch (err) {
            console.error('Initialization failed:', err);
            alert('Failed to initialize practice session. Please check console for details.');
        } finally {
            console.groupEnd();
        }
    }

    setMode(mode) {
        this.mode = mode;
        const btnExam = document.getElementById('btn-mode-exam');
        const btnPractice = document.getElementById('btn-mode-practice');
        const btnStudy = document.getElementById('btn-mode-study');

        const groupCount = document.getElementById('group-count');
        const groupTime = document.getElementById('group-time');
        const desc = document.getElementById('mode-desc');

        // Reset styles
        [btnExam, btnPractice, btnStudy].forEach(b => {
            b.style.background = 'transparent';
            b.style.color = 'var(--dark)';
            b.style.borderColor = '#ddd';
        });

        const activeBtn = mode === 'exam' ? btnExam : (mode === 'practice' ? btnPractice : btnStudy);
        activeBtn.style.background = 'var(--primary)';
        activeBtn.style.color = 'white';
        activeBtn.style.borderColor = 'var(--primary)';

        if (mode === 'exam') {
            desc.innerText = "Simulate a real exam. Timed, results at end.";
            groupCount.style.display = 'block';
            groupTime.style.display = 'block';
        } else if (mode === 'practice') {
            desc.innerText = "Untimed practice with immediate answer feedback.";
            groupCount.style.display = 'block';
            groupTime.style.display = 'none'; // Hide time
        } else {
            desc.innerText = "Review key concepts and notes for this course.";
            groupCount.style.display = 'none';
            groupTime.style.display = 'none';
        }
    }

    startSession() {
        if (this.mode === 'study') {
            this.startStudyMode();
            return;
        }

        const countInput = document.getElementById('setup-count');
        const timeInput = document.getElementById('setup-time');

        const count = parseInt(countInput.value) || 20;
        const time = parseInt(timeInput.value) || 20;

        if (count > this.allAvailableQuestions.length) {
            alert(`Max questions available is ${this.allAvailableQuestions.length}`);
            return;
        }

        // Randomize and slice
        this.questions = this.shuffleArray([...this.allAvailableQuestions]).slice(0, count);

        // Hide Modal
        document.getElementById('setup-modal').classList.add('hidden');

        // Setup Timer
        if (this.mode === 'exam') {
            this.timeLeft = time * 60;
            this.startTimer();
            document.getElementById('timer').style.display = 'block';
        } else {
            // Practice mode needs timer too, but for tracking duration only
            this.timeLeft = 0;
            this.startTimer();
            document.getElementById('timer').style.display = 'none';
        }

        // Render UI
        this.renderPalette();
        this.loadQuestion(0);

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    startStudyMode() {
        // Placeholder for new Study Mode
        document.getElementById('setup-modal').classList.add('hidden');
        document.getElementById('question-container').innerHTML = `
            <div style="padding:40px; text-align:center;">
                <i class="fas fa-book-reader" style="font-size:4rem; color:var(--primary); margin-bottom:20px"></i>
                <h2>Study Notes: ${this.course.code}</h2>
                <p>Keynotes and summary cards will appear here.</p>
                <div style="margin-top:30px; display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px; text-align:left">
                    <div class="card" style="padding:20px; border:1px solid #eee; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.05)">
                        <h4><i class="fas fa-tag"></i> Key Definitions</h4>
                        <p style="font-size:0.9rem; color:#666">Fundamental terms and concepts important for this course.</p>
                    </div>
                     <div class="card" style="padding:20px; border:1px solid #eee; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.05)">
                        <h4><i class="fas fa-calculator"></i> Formulas</h4>
                        <p style="font-size:0.9rem; color:#666">Essential formulas and equations to remember.</p>
                    </div>
                     <div class="card" style="padding:20px; border:1px solid #eee; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.05)">
                        <h4><i class="fas fa-lightbulb"></i> Tips & Tricks</h4>
                        <p style="font-size:0.9rem; color:#666">Common pitfalls and how to avoid them.</p>
                    </div>
                </div>
                <button class="btn btn-outline" style="margin-top:40px" onclick="window.location.reload()">Back to Setup</button>
            </div>
        `;
        document.querySelector('.exam-sidebar').style.display = 'none'; // Hide sidebar
        document.querySelector('.exam-layout').style.gridTemplateColumns = '1fr'; // Full width
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startTimer() {
        this.timeSpent = 0; // Reset
        this.timer = setInterval(() => {
            this.timeSpent++;

            if (this.mode === 'exam') {
                if (this.timeLeft <= 0) {
                    this.submitExam();
                    return;
                }
                this.timeLeft--;
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const el = document.getElementById('timer');
        el.innerText = utils.formatTime(this.timeLeft);
        if (this.timeLeft < 300) el.classList.add('warning'); // Last 5 mins
    }

    renderPalette() {
        const p = document.getElementById('palette');
        p.innerHTML = '';
        this.questions.forEach((q, idx) => {
            const btn = document.createElement('div');
            btn.className = `q-indicator ${idx === this.currentQuestionIndex ? 'active' : ''}`;
            btn.innerText = idx + 1;
            btn.onclick = () => this.loadQuestion(idx);
            btn.id = `idx-${idx}`;
            p.appendChild(btn);
        });
    }

    restartSession() {
        window.location.reload();
    }

    viewCorrections() {
        this.mode = 'review';
        document.getElementById('result-modal').classList.add('hidden');
        this.loadQuestion(0);
    }

    updatePaletteStatus(idx) {
        const btn = document.getElementById(`idx-${idx}`);
        if (!btn) return;

        btn.className = `q-indicator ${idx === this.currentQuestionIndex ? 'active' : ''}`;

        const qId = this.questions[idx].id;
        if (this.userAnswers[qId] !== undefined) btn.classList.add('answered');
        if (this.flags.has(qId)) btn.classList.add('flagged');
    }

    loadQuestion(idx) {
        // Update old palette status before moving
        this.updatePaletteStatus(this.currentQuestionIndex);

        this.currentQuestionIndex = idx;
        const q = this.questions[idx];
        const container = document.getElementById('question-container');
        const savedAns = this.userAnswers[q.id];
        const isFlagged = this.flags.has(q.id);


        const showExplanation = (this.mode === 'practice' || this.mode === 'review') && (savedAns !== undefined || this.mode === 'review');

        const getOptionClass = (i) => {
            if (this.mode === 'practice' && savedAns !== undefined) {
                if (i === q.correct) return 'correct';
                if (i === savedAns && i !== q.correct) return 'wrong';
            }
            if (this.mode === 'review') {
                if (i === q.correct) return 'correct';
                if (i === savedAns && i !== q.correct) return 'wrong';
                if (i === savedAns) return 'wrong'; // if answer was wrong and not corrected above
            }
            return savedAns === i ? 'selected' : '';
        };

        container.innerHTML = `
            <div class="q-header">
                <div class="q-number">Question ${idx + 1} of ${this.questions.length}</div>
                
                <!-- Timer in header -->
                <div id="timer" class="timer-pill ${this.timeLeft < 300 && this.mode === 'exam' ? 'warning' : ''}" style="${this.mode === 'practice' ? 'display:none' : ''}">
                    ${utils.formatTime(this.timeLeft)}
                </div>

                <button class="flag-btn ${isFlagged ? 'active' : ''}" onclick="studentManager.toggleFlag('${q.id}', this)">
                    <i class="fas fa-flag"></i> ${isFlagged ? 'Flagged' : 'Flag'}
                </button>
            </div>
            <div class="q-text">${q.text}</div>
            <div class="options-list ${(showExplanation || this.mode === 'review') ? 'disabled' : ''}">
                ${q.options.map((opt, i) => `
                    <div class="option-item ${getOptionClass(i)}" onclick="studentManager.selectOption('${q.id}', ${i}, this)">
                        <div class="option-marker">${String.fromCharCode(65 + i)}</div>
                        <span>${opt}</span>
                    </div>
                `).join('')}
            </div>

            ${showExplanation ? `
            <div class="explanation-box" style="margin-top:20px; padding:15px; background:#f0f7ff; border-left:4px solid var(--primary); border-radius:4px">
                <h4 style="margin-bottom:5px; color:var(--primary)">Explanation:</h4>
                <p>${q.explanation || 'No explanation available.'}</p>
            </div>
            ` : ''}

            <div class="nav-buttons">
                <button class="btn btn-outline" ${idx === 0 ? 'disabled' : ''} onclick="studentManager.prev()">
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                <button class="btn btn-primary" ${idx === this.questions.length - 1 ? 'disabled' : ''} onclick="studentManager.next()">
                    Next <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <div style="margin-top:20px; text-align:center">
                <button onclick="${this.mode === 'review' ? 'window.location.reload()' : 'studentManager.submitExam()'}" 
                        class="btn ${this.mode === 'review' ? 'btn-primary' : 'btn-danger'}" 
                        style="padding:10px 40px; font-weight:bold; border-radius:25px; box-shadow:0 4px 15px rgba(0,0,0,0.1)">
                    ${this.mode === 'review' ? 'Finish Review' : 'Submit Exam'}
                </button>
            </div>
        `;
        this.updatePaletteStatus(idx);
    }

    selectOption(qId, typeIdx, el) {
        if ((this.mode === 'practice' || this.mode === 'review') && this.userAnswers[qId] !== undefined) return;
        if (this.mode === 'review') return; // Completely disable in review

        this.userAnswers[qId] = typeIdx;

        if (this.mode === 'practice') {
            // Re-render to show explanation immediately
            this.loadQuestion(this.currentQuestionIndex);
        } else {
            // Normal visual update
            const parent = el.parentElement;
            Array.from(parent.children).forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
        }

        this.updatePaletteStatus(this.currentQuestionIndex);
    }

    toggleFlag(qId, btn) {
        if (this.flags.has(qId)) {
            this.flags.delete(qId);
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-flag"></i> Flag';
        } else {
            this.flags.add(qId);
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-flag"></i> Flagged';
        }
        this.updatePaletteStatus(this.currentQuestionIndex);
    }

    next() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }
    }

    prev() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }

    quitExam() {
        if (confirm('Are you sure you want to quit? Progress will be lost.')) {
            window.location.href = 'index.html';
        }
    }

    submitExam() {
        if (!confirm('Are you sure you want to submit?')) return;
        clearInterval(this.timer);
        this.calculateResults();
    }

    calculateResults() {
        let score = 0;
        let answered = 0;

        this.questions.forEach(q => {
            const ans = this.userAnswers[q.id];
            if (ans !== undefined) {
                answered++;
                if (ans === q.correct) score++;
            }
        });

        const percent = Math.round((score / this.questions.length) * 100);

        // Save Session
        const sessionData = {
            id: utils.generateId(),
            courseCode: this.course.code,
            score: percent,
            questionsTotal: this.questions.length,
            questionsCorrect: score,
            duration: this.timeSpent,
            timestamp: new Date().toISOString()
        };

        db.saveSession(sessionData); // Saves to DB and Leaderboard
        this.showResultModal(percent, answered);
    }

    showResultModal(percent, answered) {
        const modal = document.getElementById('result-modal');
        modal.classList.remove('hidden');

        document.getElementById('final-score').innerText = `${percent}%`;

        // Update Chart Conic Gradient
        const chart = document.getElementById('result-chart');
        chart.style.background = `conic-gradient(var(--primary) ${percent}%, #eee ${percent}%0)`;

        document.getElementById('total-answered').innerText = `${answered}/${this.questions.length}`;
        document.getElementById('total-time').innerText = utils.formatTime(this.timeSpent);
        document.getElementById('accuracy-rating').innerText = answered > 0 ? `${Math.round((percent / 100 * this.questions.length / answered) * 100)}%` : '0%';
    }

    async saveFeedback() {
        const text = document.getElementById('feedback-text').value;
        if (!text) {
            alert('Please enter feedback');
            return;
        }

        const analytics = db.get(STORAGE_KEYS.ANALYTICS); // Accessing global key
        analytics.feedback.push({
            text: text,
            date: new Date().toISOString(),
            course: this.course.code
        });
        db.set(STORAGE_KEYS.ANALYTICS, analytics);

        alert('Thank you for your feedback!');
        window.location.href = 'index.html';
    }
}

const studentManager = new StudentManager();
