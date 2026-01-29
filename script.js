/**
 * COLDWANDE CBT TEST - University CBT Platform
 * Global Utilities and Storage Management
 */

// Storage Keys Configuration
const STORAGE_KEYS = {
    COURSES: 'cbt_courses',
    ANALYTICS: 'cbt_analytics',
    QUESTIONS_PREFIX: 'cbt_q_',
    USER_SESSION: 'cbt_user_session',
    SESSIONS: 'cbt_sessions',
    THEME: 'cbt_theme',
    ADMIN_AUTH: 'cbt_admin_auth',
    SETTINGS: 'cbt_settings'
};

/**
 * StorageManager Class
 * Handles all LocalStorage operations with error handling
 */
class StorageManager {
    constructor() {
        this.ready = this.init();
    }

    /**
     * Initialize storage and seed data
     */
    async init() {
        try {
            // Check if courses exist, if not seed data
            const existingCourses = this.get(STORAGE_KEYS.COURSES);
            if (!existingCourses || existingCourses.length === 0) {
                console.log('Initializing database...');
                await this.seedData();
            } else {
                // ALWAYS refresh courses to ensure updates
                await this.seedData();
            }
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    /**
     * Seed initial data into localStorage
     */
    async seedData() {
        try {
            // Load courses from global variable (if available)
            if (window.SEED_COURSES) {
                localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(window.SEED_COURSES));
                console.log('Courses loaded from global variable');
            } else {
                // Fallback: Try to fetch from JSON file
                try {
                    const coursesReq = await fetch('data/courses.json');
                    if (coursesReq.ok) {
                        const courses = await coursesReq.json();
                        this.set(STORAGE_KEYS.COURSES, courses);
                        console.log('Courses loaded from JSON file');
                    }
                } catch (fetchError) {
                    console.warn('Could not fetch courses.json, using defaults if available');
                }
            }

            // Load analytics structure
            if (window.SEED_ANALYTICS) {
                let current = this.get(STORAGE_KEYS.ANALYTICS);
                if (!current) {
                    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(window.SEED_ANALYTICS));
                }
            } else {
                // Initialize default analytics structure
                let current = this.get(STORAGE_KEYS.ANALYTICS);
                if (!current) {
                    const analytics = {
                        sessions: [],
                        systemStats: {
                            totalSessions: 0,
                            totalTimeSpent: 0,
                            totalTimePlayed: 0,
                            averageScore: 0,
                            studentsCount: 0
                        },
                        questionStats: {},
                        coursePerformance: {}
                    };
                    this.set(STORAGE_KEYS.ANALYTICS, analytics);
                }
            }

            // Load questions from global variable
            if (window.SEED_QUESTIONS) {
                for (const [courseCode, questions] of Object.entries(window.SEED_QUESTIONS)) {
                    const normalizedCode = courseCode.toUpperCase();
                    localStorage.setItem(
                        STORAGE_KEYS.QUESTIONS_PREFIX + normalizedCode,
                        JSON.stringify(questions)
                    );
                    console.log(`Seeded questions for ${normalizedCode}`);
                }
                console.log('Questions loaded successfully');
            }

            console.log('Data seeded successfully');
        } catch (error) {
            console.error('Error seeding data:', error);
        }
    }

    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @returns {any} Parsed data or null
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage Get Error:', e);
            return null;
        }
    }

    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Storage Full! Please clear some space.');
                console.error('Storage quota exceeded');
            }
            console.error('Storage Set Error:', e);
            return false;
        }
    }

    /**
     * Get questions for a specific course
     * @param {string} courseCode - Course code (e.g., 'CSC101')
     * @returns {Array} Array of questions
     */
    getQuestions(courseCode) {
        return this.get(STORAGE_KEYS.QUESTIONS_PREFIX + courseCode.toUpperCase()) || [];
    }

    /**
     * Set questions for a specific course
     * @param {string} courseCode - Course code
     * @param {Array} questions - Questions array
     */
    setQuestions(courseCode, questions) {
        return this.set(STORAGE_KEYS.QUESTIONS_PREFIX + courseCode.toUpperCase(), questions);
    }

    /**
     * Get all courses
     * @returns {Array} Array of courses
     */
    getCourses() {
        return this.get(STORAGE_KEYS.COURSES) || [];
    }

    /**
     * Get analytics data
     * @returns {Object} Analytics object
     */
    getAnalytics() {
        return this.get(STORAGE_KEYS.ANALYTICS);
    }

    /**
     * Save a session to analytics
     * @param {Object} sessionData - Session data object
     */
    saveSession(sessionData) {
        let analytics = this.get(STORAGE_KEYS.ANALYTICS);
        if (!analytics) {
            console.error('Analytics not initialized');
            return;
        }

        // Add session to sessions array
        analytics.sessions.push(sessionData);

        // Update system stats
        analytics.systemStats.totalSessions++;
        analytics.systemStats.totalTimeSpent += sessionData.duration || 0;
        analytics.systemStats.totalTimePlayed += sessionData.duration || 0;

        // Update question stats for the course
        if (!analytics.questionStats[sessionData.courseCode]) {
            analytics.questionStats[sessionData.courseCode] = {
                scores: [],
                attempts: 0
            };
        }

        const courseStats = analytics.questionStats[sessionData.courseCode];
        courseStats.attempts++;
        courseStats.scores.push({
            score: sessionData.score,
            date: new Date().toISOString(),
            student: sessionData.studentId || 'Anonymous'
        });

        // Sort scores in descending order
        courseStats.scores.sort((a, b) => b.score - a.score);

        // Keep top 50 to save space (UI shows top 10)
        if (courseStats.scores.length > 50) {
            courseStats.scores = courseStats.scores.slice(0, 50);
        }

        // Update course performance
        if (!analytics.coursePerformance[sessionData.courseCode]) {
            analytics.coursePerformance[sessionData.courseCode] = {
                totalAttempts: 0,
                averageScore: 0,
                scores: []
            };
        }

        const perfStats = analytics.coursePerformance[sessionData.courseCode];
        perfStats.totalAttempts++;
        perfStats.scores.push(sessionData.score);
        perfStats.averageScore = perfStats.scores.reduce((a, b) => a + b, 0) / perfStats.scores.length;

        // Calculate overall average score
        const allScores = Object.values(analytics.coursePerformance)
            .flatMap(perf => perf.scores);
        if (allScores.length > 0) {
            analytics.systemStats.averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
        }

        // Save updated analytics
        this.set(STORAGE_KEYS.ANALYTICS, analytics);
    }

    /**
     * Clear all storage data
     */
    clearAll() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            console.log('All storage cleared');
            window.location.reload();
        }
    }

    /**
     * Get user session
     * @returns {Object} User session data
     */
    getUserSession() {
        return this.get(STORAGE_KEYS.USER_SESSION);
    }

    /**
     * Set user session
     * @param {Object} sessionData - User session data
     */
    setUserSession(sessionData) {
        return this.set(STORAGE_KEYS.USER_SESSION, sessionData);
    }

    /**
     * Get theme preference
     * @returns {string} Theme ('light' or 'dark')
     */
    getTheme() {
        return this.get(STORAGE_KEYS.THEME) || 'light';
    }

    /**
     * Set theme preference
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        return this.set(STORAGE_KEYS.THEME, theme);
    }
}

/**
 * Utility Functions
 */
const utils = {
    /**
     * Format seconds to MM:SS
     * @param {number} seconds - Seconds to format
     * @returns {string} Formatted time string
     */
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Format date to readable string
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId: () => {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Get URL query parameter
     * @param {string} param - Parameter name
     * @returns {string|null} Parameter value
     */
    getQueryParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Shuffle array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Calculate percentage
     * @param {number} value - Value
     * @param {number} total - Total
     * @returns {number} Percentage
     */
    calculatePercentage: (value, total) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Alias for compatibility
const Utils = utils;

// Initialize StorageManager
const db = new StorageManager();

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
    window.db = db;
    window.utils = utils;
    window.Utils = Utils;
    window.STORAGE_KEYS = STORAGE_KEYS;
}

// Log initialization
console.log('COLDWANDE CBT TEST - Storage Manager Initialized');
