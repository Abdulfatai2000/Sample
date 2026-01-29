/**
 * COLDWANDE CBT TEST - Global Utilities
 * Handles LocalStorage and Data Management
 */

const DB_KEYS = {
    COURSES: 'uni_courses',
    ANALYTICS: 'uni_analytics',
    SESSIONS: 'uni_sessions',
    SETTINGS: 'uni_settings'
};

class StorageManager {
    static get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage Get Error:', e);
            return null;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Storage Full! Please clear some space.');
            }
            console.error('Storage Set Error:', e);
            return false;
        }
    }

    static init() {
        if (!this.get(DB_KEYS.COURSES)) {
            console.log('Initializing Database...');
            this.seedData();
        }
    }

    static async seedData() {
        try {
            // Load Courses
            const coursesReq = await fetch('data/courses.json');
            const courses = await coursesReq.json();
            this.set(DB_KEYS.COURSES, courses);

            // Init Analytics
            const analytics = {
                totalSessions: 0,
                totalTimePlayed: 0, // in seconds
                averageScore: 0,
                studentsCount: 0, // Mock for this localized version
                coursePerformance: {}
            };
            this.set(DB_KEYS.ANALYTICS, analytics);

            console.log('Database Initialized Successfully');
        } catch (err) {
            console.error('Failed to seed data:', err);
        }
    }
}

// Global Formatter
const Utils = {
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
});
