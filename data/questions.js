/**
 * COLDWANDE CBT DATA STORE
 * Replaces JSON files for offline compatibility
 */

const SEED_COURSES = [
    {
        "id": "c1", "code": "CSC101", "title": "Introduction to Computer Science",
        "department": "Computer Science", "level": "100", "description": "Fundamental concepts of computing, algorithms, and data representation.",
        "questionsCount": 50, "time": 45, "difficulty": "Easy", "color": "#6C63FF", "icon": "fa-laptop-code"
    },
    {
        "id": "c2", "code": "CSC102", "title": "Introduction to Programming",
        "department": "Computer Science", "level": "100", "description": "Problem solving with Python/C++, logic flow, and syntax.",
        "questionsCount": 40, "time": 45, "difficulty": "Medium", "color": "#6C63FF", "icon": "fa-code"
    },
    {
        "id": "c3", "code": "CSC201", "title": "Computer Programming I",
        "department": "Computer Science", "level": "200", "description": "Data Structures, Arrays, Stacks, Queues, and Lists.",
        "questionsCount": 45, "time": 60, "difficulty": "Hard", "color": "#6C63FF", "icon": "fa-layer-group"
    },
    {
        "id": "c4", "code": "CSC202", "title": "Computer Programming II",
        "department": "Computer Science", "level": "200", "description": "Low-level programming, Assembly, and memory management.",
        "questionsCount": 40, "time": 60, "difficulty": "Hard", "color": "#6C63FF", "icon": "fa-microchip"
    },
    {
        "id": "c5", "code": "CSC211", "title": "Object-Oriented Programming",
        "department": "Computer Science", "level": "200", "description": "Classes, Inheritance, Polymorphism, and Design Patterns.",
        "questionsCount": 35, "time": 50, "difficulty": "Medium", "color": "#6C63FF", "icon": "fa-project-diagram"
    },
    {
        "id": "cce1", "code": "CPE203", "title": "Introduction to Digital Circuits",
        "department": "Computer Engineering", "level": "200", "description": "Logic gates, boolean algebra, and circuit design.",
        "questionsCount": 30, "time": 45, "difficulty": "Medium", "color": "#FFC107", "icon": "fa-memory"
    },
    {
        "id": "m1", "code": "MTH101", "title": "General Mathematics I",
        "department": "Mathematics", "level": "100", "description": "Algebra, Trigonometry, and coordinate geometry.",
        "questionsCount": 60, "time": 60, "difficulty": "Medium", "color": "#36D1DC", "icon": "fa-square-root-alt"
    },
    {
        "id": "m2", "code": "MTH103", "title": "Geometry and Vectors",
        "department": "Mathematics", "level": "100", "description": "Vector analysis, 2D/3D geometry and calculus.",
        "questionsCount": 50, "time": 60, "difficulty": "Hard", "color": "#36D1DC", "icon": "fa-shapes"
    },
    {
        "id": "m3", "code": "MTH201", "title": "Mathematical Methods",
        "department": "Mathematics", "level": "200", "description": "ODE, Advanced Calculus, and Series.",
        "questionsCount": 40, "time": 70, "difficulty": "Hard", "color": "#36D1DC", "icon": "fa-infinity"
    },
    {
        "id": "p1", "code": "PHY101", "title": "General Physics I",
        "department": "Physics", "level": "100", "description": "Mechanics, Heat, and Properties of Matter.",
        "questionsCount": 50, "time": 50, "difficulty": "Medium", "color": "#FF9F43", "icon": "fa-atom"
    },
    {
        "id": "s1", "code": "STT101", "title": "Introduction to Statistics",
        "department": "Statistics", "level": "100", "description": "Data presentation, measures of central tendency.",
        "questionsCount": 40, "time": 40, "difficulty": "Easy", "color": "#FF6584", "icon": "fa-chart-bar"
    },
    {
        "id": "s2", "code": "STT111", "title": "Probability I",
        "department": "Statistics", "level": "100", "description": "Sample spaces, probability axioms, and combinations.",
        "questionsCount": 35, "time": 45, "difficulty": "Medium", "color": "#FF6584", "icon": "fa-dice"
    },
    {
        "id": "s3", "code": "STT201", "title": "Statistical Inference",
        "department": "Statistics", "level": "200", "description": "Hypothesis testing, distributions, and estimation.",
        "questionsCount": 45, "time": 60, "difficulty": "Hard", "color": "#FF6584", "icon": "fa-chart-line"
    }
];

const SEED_ANALYTICS = {
    "sessions": [],
    "users": [],
    "feedback": [],
    "questionStats": {},
    "systemStats": {
        "totalSessions": 0,
        "totalTimeSpent": 0,
        "activeUsers": 0
    }
};

const SEED_QUESTIONS = {
    "CSC101": [
        {
            "id": "q1",
            "course": "CSC101",
            "text": "Which of the following is NOT a high-level programming language?",
            "options": ["Python", "Java", "Assembly", "C++"],
            "correct": 2,
            "explanation": "Assembly is a low-level language appearing in the second generation of programming languages.",
            "difficulty": "Easy",
            "topic": "Programming Languages"
        },
        {
            "id": "q2",
            "course": "CSC101",
            "text": "What does CPU stand for?",
            "options": ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Central Processor Unit"],
            "correct": 1,
            "explanation": "CPU stands for Central Processing Unit, the primary component of a computer.",
            "difficulty": "Easy",
            "topic": "Hardware"
        },
        {
            "id": "q3",
            "course": "CSC101",
            "text": "1 byte is equal to how many bits?",
            "options": ["4", "8", "16", "32"],
            "correct": 1,
            "explanation": "1 byte consists of 8 bits.",
            "difficulty": "Easy",
            "topic": "Data Representation"
        },
        {
            "id": "q4",
            "course": "CSC101",
            "text": "Which component is volatile memory?",
            "options": ["Hard Disk", "ROM", "RAM", "Flash Drive"],
            "correct": 2,
            "explanation": "RAM (Random Access Memory) is volatile; it loses data when power is lost.",
            "difficulty": "Medium",
            "topic": "Hardware"
        },
        {
            "id": "q5",
            "course": "CSC101",
            "text": "Binary representation of decimal 10 is:",
            "options": ["1010", "1100", "1001", "1110"],
            "correct": 0,
            "explanation": "8(1) + 4(0) + 2(1) + 1(0) = 10.",
            "difficulty": "Medium",
            "topic": "Number Systems"
        }
    ],
    "MTH101": [
        {
            "id": "m1",
            "course": "MTH101",
            "text": "Solve for x: 2x + 5 = 15",
            "options": ["5", "10", "2", "7.5"],
            "correct": 0,
            "explanation": "2x = 10 -> x = 5.",
            "difficulty": "Easy",
            "topic": "Algebra"
        },
        {
            "id": "m2",
            "course": "MTH101",
            "text": "What is the value of sin(90°)?",
            "options": ["0", "1", "0.5", "-1"],
            "correct": 1,
            "explanation": "Sine of 90 degrees is 1.",
            "difficulty": "Easy",
            "topic": "Trigonometry"
        },
        {
            "id": "m3",
            "course": "MTH101",
            "text": "If f(x) = x², find f'(x).",
            "options": ["x", "2x", "x²", "2"],
            "correct": 1,
            "explanation": "The derivative of x^n is nx^(n-1). So derivative of x² is 2x.",
            "difficulty": "Medium",
            "topic": "Calculus"
        },
        {
            "id": "m4",
            "course": "MTH101",
            "text": "The set of all rational and irrational numbers is called?",
            "options": ["Integers", "Natural Numbers", "Real Numbers", "Complex Numbers"],
            "correct": 2,
            "explanation": "Real numbers include both rational and irrational numbers.",
            "difficulty": "Easy",
            "topic": "Sets"
        },
        {
            "id": "m5",
            "course": "MTH101",
            "text": "Evaluate: log₁₀(1000)",
            "options": ["2", "3", "10", "100"],
            "correct": 1,
            "explanation": "10 raised to the power of 3 is 1000.",
            "difficulty": "Medium",
            "topic": "Logarithms"
        }
    ],
    "STT201": [
        {
            "id": "stt201_1",
            "course": "STT201",
            "text": "What is the primary purpose of hypothesis testing?",
            "options": ["To calculate the mean", "To test a claim about a population parameter", "To measure variance", "To sample the population"],
            "correct": 1,
            "explanation": "Hypothesis testing uses sample data to evaluate a claim about a population parameter.",
            "difficulty": "Medium",
            "topic": "Hypothesis Testing"
        },
        {
            "id": "stt201_2",
            "course": "STT201",
            "text": "Which distribution is used for small sample sizes (n < 30) when population variance is unknown?",
            "options": ["Normal Distribution", "Binomial Distribution", "t-Distribution", "Chi-Square Distribution"],
            "correct": 2,
            "explanation": "The t-distribution is used when sample size is small and population standard deviation is unknown.",
            "difficulty": "Medium",
            "topic": "Distributions"
        },
        {
            "id": "stt201_3",
            "course": "STT201",
            "text": "A Type I error occurs when:",
            "options": ["We reject a true null hypothesis", "We accept a false null hypothesis", "We reject a false null hypothesis", "We accept a true null hypothesis"],
            "correct": 0,
            "explanation": "Type I error is the rejection of a true null hypothesis (false positive).",
            "difficulty": "Hard",
            "topic": "Errors"
        },
        {
            "id": "stt201_4",
            "course": "STT201",
            "text": "What is the probability of an event closer to 1 indicate?",
            "options": ["It is unlikely to happen", "It is likely to happen", "It is impossible", "It is uncertain"],
            "correct": 1,
            "explanation": "Probability close to 1 indicates a high likelihood of occurrence.",
            "difficulty": "Easy",
            "topic": "Probability"
        },
        {
            "id": "stt201_5",
            "course": "STT201",
            "text": "In a Chi-Square test for independence, the degrees of freedom is calculated as:",
            "options": ["n - 1", "(r - 1)(c - 1)", "n - k", "r + c - 1"],
            "correct": 1,
            "explanation": "Degrees of freedom = (rows - 1) * (columns - 1).",
            "difficulty": "Medium",
            "topic": "Non-Parametric Tests"
        }
    ]
};
