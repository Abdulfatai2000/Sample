class AdminManager {
    constructor() {
        this.analytics = null;
        this.courses = [];
        this.init();
    }

    async init() {
        // Check Auth
        if (sessionStorage.getItem('admin_logged_in')) {
            document.getElementById('login-overlay').style.display = 'none';
            this.loadData();
        }

        // Add Enter key listener for login
        document.getElementById('admin-pass')?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.login();
        });
    }

    login() {
        const pass = document.getElementById('admin-pass').value;
        if (pass === 'admin') {
            sessionStorage.setItem('admin_logged_in', 'true');
            document.getElementById('login-overlay').style.display = 'none';
            this.loadData();
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    }

    loadData() {
        this.analytics = db.get(STORAGE_KEYS.ANALYTICS);
        this.courses = db.getCourses();

        if (!this.analytics) return;

        this.renderOverview();

        // Setup Filter for Leaderboard
        const selector = document.getElementById('leaderboard-course-filter');
        this.courses.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.code;
            opt.innerText = `${c.code} - ${c.title}`;
            selector.appendChild(opt);
        });
    }

    showTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.getElementById(`tab-${tabName}`).classList.remove('hidden');

        // Update Sidebar Active
        document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
        event.target.closest('a').classList.add('active');

        if (tabName === 'users') this.loadLeaderboard();
        if (tabName === 'questions') this.loadQuestionBanks();
        if (tabName === 'feedback') this.loadFeedback();
    }

    renderOverview() {
        // Stats
        document.getElementById('total-sessions').innerText = this.analytics.systemStats.totalSessions;
        document.getElementById('total-hours').innerText = (this.analytics.systemStats.totalTimeSpent / 3600).toFixed(1);
        document.getElementById('active-courses').innerText = this.courses.length;

        // Chart (Popularity)
        const chart = document.getElementById('course-popularity-chart');
        chart.innerHTML = '';
        const maxSessions = Math.max(...Object.values(this.analytics.questionStats).map(s => s.attempts), 1);

        this.courses.forEach(c => {
            const stats = this.analytics.questionStats[c.code] || { attempts: 0 };
            const height = (stats.attempts / maxSessions) * 100;

            const bar = document.createElement('div');
            bar.style.height = `${Math.max(height, 10)}%`; // Min height for visibility
            bar.style.background = c.color;
            bar.style.width = '60px'; // wider bars
            bar.style.borderRadius = '5px 5px 0 0';
            bar.title = `${c.code}: ${stats.attempts} sessions`;
            bar.innerHTML = `<span style="font-size:0.7rem; display:block; text-align:center; transform:translateY(-20px); font-weight:bold">${c.code}</span>`;

            chart.appendChild(bar);
        });
    }

    loadLeaderboard() {
        const courseCode = document.getElementById('leaderboard-course-filter').value || this.courses[0].code;
        const stats = this.analytics.questionStats[courseCode];
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = '';

        if (!stats || !stats.scores || stats.scores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No data available yet</td></tr>';
            return;
        }

        // Already sorted when saving, but just in case
        const top10 = stats.scores.slice(0, 10);

        top10.forEach((s, idx) => {
            const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
            const rankBadge = rankClass ? `<span class="rank-badge ${rankClass}">${idx + 1}</span>` : idx + 1;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rankBadge}</td>
                <td><i class="fas fa-user-graduate"></i> Student</td> <!-- Placeholder for user management -->
                <td>${s.score}%</td>
                <td>${new Date(s.date).toLocaleDateString()}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    loadQuestionBanks() {
        const grid = document.getElementById('q-courses-list');
        grid.innerHTML = '';

        this.courses.forEach(c => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cursor = 'pointer';
            card.style.borderLeft = `5px solid ${c.color}`;
            card.innerHTML = `<h4>${c.code}</h4><p class="mt-1">Manage Questions</p>`;
            card.onclick = () => this.viewCourseQuestions(c.code);
            grid.appendChild(card);
        });
    }

    viewCourseQuestions(code) {
        document.getElementById('q-courses-list').classList.add('hidden');
        document.getElementById('q-list-container').classList.remove('hidden');

        const questions = db.getQuestions(code);
        const tbody = document.getElementById('questions-table-body');
        tbody.innerHTML = '';

        questions.forEach(q => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${q.id}</td>
                <td>${q.text.substring(0, 50)}...</td>
                <td>${q.difficulty}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    resetQView() {
        document.getElementById('q-courses-list').classList.remove('hidden');
        document.getElementById('q-list-container').classList.add('hidden');
    }

    loadFeedback() {
        const container = document.getElementById('feedback-list');
        container.innerHTML = '';

        const feedbacks = this.analytics.feedback || [];
        if (feedbacks.length === 0) {
            container.innerHTML = '<p>No feedback received yet.</p>';
            return;
        }

        feedbacks.reverse().forEach(f => {
            const item = document.createElement('div');
            item.className = 'card mb-1';
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                    <strong>${f.course || 'General'}</strong>
                    <small>${new Date(f.date).toLocaleDateString()}</small>
                </div>
                <p>${f.text}</p>
            `;
            container.appendChild(item);
        });
    }
}

const adminManager = new AdminManager();
