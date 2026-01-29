/**
 * COLDWANDE CBT - Core Data
 */

window.SEED_COURSES = [
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
        "questionsCount": 110, "time": 60, "difficulty": "Hard", "color": "#6C63FF", "icon": "fa-layer-group"
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
        "questionsCount": 200, "time": 60, "difficulty": "Hard", "color": "#FF6584", "icon": "fa-chart-line"
    }
];

window.SEED_ANALYTICS = {
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
