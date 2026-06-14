import json
from sqlalchemy.orm import Session
from . import models, auth

def seed_database(db: Session):
    # 1. Create Default Admin User
    admin_email = "admin@skillsphere.com"
    db_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not db_admin:
        hashed_password = auth.get_password_hash("admin123")
        db_admin = models.User(
            name="Administrator",
            email=admin_email,
            password=hashed_password,
            role="admin",
            badges_json=json.dumps(["Administrator", "First Step"]),
            streak_count=1
        )
        db.add(db_admin)
        db.commit()
        print("Admin user created successfully.")

    # 2. Create Skills
    skills_data = [
        # --- Programming Languages ---
        {
            "name": "Python",
            "category": "Programming Languages",
            "description": "A versatile and powerful high-level general-purpose programming language known for its readability and extensive libraries.",
            "roadmap": {
                "introduction": "Python is the leading language for Data Science, AI, Web Development, and Automation. This roadmap takes you from a complete beginner to writing high-performance async programs.",
                "beginner": [
                    {"title": "Variables & Data Types", "description": "Declaring variables, numbers, strings, and booleans."},
                    {"title": "Control Flows & Loops", "description": "Using if-else conditions, for loops, and while loops."},
                    {"title": "Functions & Scope", "description": "Defining reusable functions, arguments, and local/global scoping."}
                ],
                "intermediate": [
                    {"title": "Standard Data Structures", "description": "Lists, tuples, sets, and dictionaries in Python."},
                    {"title": "Object-Oriented Programming", "description": "Creating classes, inheritance, polymorphism, and encapsulation."},
                    {"title": "File I/O & Exception Handling", "description": "Reading and writing files; handling errors with try-except."}
                ],
                "advanced": [
                    {"title": "Decorators & Generators", "description": "Advanced function wrappers and memory-efficient iterators using yield."},
                    {"title": "Concurrency & Asyncio", "description": "Asynchronous programming using async and await syntax."},
                    {"title": "Testing & Packaging", "description": "Writing unit tests with pytest and building pip packages."}
                ],
                "concepts": [
                    {"name": "Dynamic Typing", "value": "Python assigns type at runtime. Variables can dynamically switch types."},
                    {"name": "PEP 8 Style Guide", "value": "The standard styling guidelines for writing clean and readable Python code."}
                ]
            },
            "videos": [
                {"title": "Python for Beginners - Full Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc", "channel_name": "Programming with Mosh", "difficulty": "Beginner"},
                {"title": "Python Course in Hindi - One Shot", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=ERCMXc8x7mc", "channel_name": "Apna College", "difficulty": "Beginner"},
                {"title": "Python in Urdu - Complete Course for Beginners", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=qHJjMvHLJdg", "channel_name": "CodeWithHarry", "difficulty": "Beginner"},
                {"title": "Intermediate Python Programming Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=HGOBQxh228g", "channel_name": "freeCodeCamp", "difficulty": "Intermediate"}
            ],
            "practice": [
                {"title": "Python Variables Practice (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/python/python_variables.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "Two Sum (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/two-sum/", "platform": "LeetCode", "topic": "Arrays"},
                {"title": "Longest Palindromic Substring (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/longest-palindromic-substring/", "platform": "LeetCode", "topic": "Strings"},
                {"title": "Merge k Sorted Lists (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/merge-k-sorted-lists/", "platform": "LeetCode", "topic": "Linked Lists"},
                {"title": "Reverse Nodes in k-Group (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/", "platform": "LeetCode", "topic": "Linked Lists"}
            ]
        },
        {
            "name": "Java",
            "category": "Programming Languages",
            "description": "A class-based, object-oriented programming language designed to have as few implementation dependencies as possible (Write Once, Run Anywhere).",
            "roadmap": {
                "introduction": "Java is the backbone of Android apps, enterprise backend systems, and financial architectures. Master class hierarchies and JVM internals.",
                "beginner": [
                    {"title": "Java Basics & JVM", "description": "Understanding JDK, JRE, JVM and compiling Java code."},
                    {"title": "Java Syntax & Primitive Types", "description": "Declaring data types, operators, and basic variables."},
                    {"title": "Conditionals & Loops", "description": "Applying if-else clauses, switch cases, and loops (for, while, do-while)."}
                ],
                "intermediate": [
                    {"title": "Arrays & Collections", "description": "Working with ArrayLists, HashMaps, Sets, and LinkLists."},
                    {"title": "OOP in Java", "description": "Polymorphism, Inheritance, Interfaces, and Abstract classes."},
                    {"title": "Exceptions & File Operations", "description": "Try-catch blocks, throw keywords, and file reader/writer classes."}
                ],
                "advanced": [
                    {"title": "Java Streams & Lambdas", "description": "Functional style programming introduced in Java 8."},
                    {"title": "Multithreading & Concurrency", "description": "Implementing threads, runnable interfaces, and thread synchronization."},
                    {"title": "JVM Memory Management", "description": "Garbage collection mechanics, heap, and stack analysis."}
                ],
                "concepts": [
                    {"name": "Platform Independence", "value": "Java source compiles into JVM bytecode, which runs on any platform containing a JVM."},
                    {"name": "Strict Typing", "value": "Every variable and parameter must have a declared type before compilation."}
                ]
            },
            "videos": [
                {"title": "Java Tutorial for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=A74TOX803d0", "channel_name": "freeCodeCamp", "difficulty": "Beginner"},
                {"title": "Java & OOPS in Hindi - Full Course", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=UmnCZ7-9yDY", "channel_name": "Apna College", "difficulty": "Beginner"},
                {"title": "Java Complete Course in Urdu", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=gT8v3WscYn0", "channel_name": "UnboxCode", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "Java Syntax Practice (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/java/java_intro.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "Container With Most Water (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/container-with-most-water/", "platform": "LeetCode", "topic": "Arrays"},
                {"title": "Median of Two Sorted Arrays (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/", "platform": "LeetCode", "topic": "Algorithms"},
                {"title": "N-Queens II (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/n-queens-ii/", "platform": "LeetCode", "topic": "Backtracking"},
                {"title": "First Missing Positive (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/first-missing-positive/", "platform": "LeetCode", "topic": "Arrays"}
            ]
        },
        {
            "name": "C++",
            "category": "Programming Languages",
            "description": "A high-performance programming language offering direct control over hardware and memory, widely used in systems coding and game engines.",
            "roadmap": {
                "introduction": "C++ is crucial for game development, graphics rendering, browsers, and embedded systems. Learn pointers and memory reference.",
                "beginner": [
                    {"title": "Variables & Basic Input/Output", "description": "Writing standard iostream console operations and values."},
                    {"title": "Conditionals & Operators", "description": "If statements, switch clauses, and relational operators."},
                    {"title": "Arrays & Functions", "description": "Declaring fixed size arrays and separating code into functions."}
                ],
                "intermediate": [
                    {"title": "Pointers & References", "description": "Understanding memory addresses, pointer arithmetic, and reference params."},
                    {"title": "OOP & Classes", "description": "Constructors, destructors, virtual functions, and class instances."},
                    {"title": "STL (Standard Template Library)", "description": "Vectors, Maps, Sets, and Algorithms in C++."}
                ],
                "advanced": [
                    {"title": "Dynamic Memory & Smart Pointers", "description": "Using new/delete, unique_ptr, shared_ptr, and weak_ptr."},
                    {"title": "Template Metaprogramming", "description": "Writing generic code using templates and typename filters."},
                    {"title": "C++ Memory Management", "description": "Understanding stack allocation, heap, and raw memory cache."}
                ],
                "concepts": [
                    {"name": "Manual Memory Management", "value": "C++ developers directly allocate and free heap memory, avoiding garbage collectors."},
                    {"name": "Multi-Paradigm Support", "value": "Supports procedural, object-oriented, and functional styles of coding."}
                ]
            },
            "videos": [
                {"title": "C++ Tutorial for Beginners - Full Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=vLnPwxZdW4Y", "channel_name": "freeCodeCamp", "difficulty": "Beginner"},
                {"title": "C++ Placement Course - Hindi", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=z9b5aRfrz7M", "channel_name": "Apna College", "difficulty": "Beginner"},
                {"title": "C++ Programming in Urdu/Hindi", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=18c3MTX0PK0", "channel_name": "CodeWithHarry", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "C++ Syntax Basics (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/cpp/cpp_intro.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "3Sum (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/3sum/", "platform": "LeetCode", "topic": "Arrays"},
                {"title": "Regular Expression Matching (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/regular-expression-matching/", "platform": "LeetCode", "topic": "Strings"},
                {"title": "Merge Double Linked Lists (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/merge-k-sorted-lists/", "platform": "LeetCode", "topic": "Linked Lists"},
                {"title": "Maximal Rectangle (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/maximal-rectangle/", "platform": "LeetCode", "topic": "Arrays"}
            ]
        },
        {
            "name": "JavaScript",
            "category": "Programming Languages",
            "description": "The scripting language of the Web, essential for client-side interactivity, frontend framework manipulation, and server-side execution.",
            "roadmap": {
                "introduction": "JavaScript powers 98% of the web. This path guides you from basic document interactions to modern ES6+ paradigms and asynchronous operations.",
                "beginner": [
                    {"title": "JS Variables & Types", "description": "Declaring let, const, var, and understanding dynamically typed values."},
                    {"title": "DOM Manipulation", "description": "Selecting, styling, and listening to document events in browsers."},
                    {"title": "Basic Loops & Arrays", "description": "Iterating lists using standard for, while, and array methods."}
                ],
                "intermediate": [
                    {"title": "ES6+ Modern Syntax", "description": "Arrow functions, destructuring, template literals, and rest/spread operators."},
                    {"title": "Asynchronous JS", "description": "Callbacks, Promises, and the async/await syntax."},
                    {"title": "JSON & Fetch API", "description": "Querying REST APIs and updating HTML data dynamically."}
                ],
                "advanced": [
                    {"title": "Closures & Scope Chain", "description": "Understanding execution contexts, lexical scope, and functional closures."},
                    {"title": "Prototypes & OOP JS", "description": "Prototype inheritance, constructor functions, and ES6 classes."},
                    {"title": "Event Loop & V8 Engine", "description": "How JS handles single-threaded concurrency using the task queue and call stack."}
                ],
                "concepts": [
                    {"name": "Single-Threaded", "value": "JavaScript runs code on a single thread using non-blocking I/O events."},
                    {"name": "First-Class Functions", "value": "Functions are treated as variables, meaning they can be passed as arguments or returned."}
                ]
            },
            "videos": [
                {"title": "JavaScript Course for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=W6NZfCO5SIk", "channel_name": "Programming with Mosh", "difficulty": "Beginner"},
                {"title": "Namaste JavaScript - Season 1 (Hindi)", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=pN6jk0uUrD8", "channel_name": "Akshay Saini", "difficulty": "Intermediate"},
                {"title": "JS Full Course in Urdu/Hindi", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=hKB-YGF14SY", "channel_name": "CodeWithHarry", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "JS Variables Challenge (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/js/js_variables.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "Longest Substring Without Repeating Characters (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "platform": "LeetCode", "topic": "Strings"},
                {"title": "Edit Distance (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/edit-distance/", "platform": "LeetCode", "topic": "Dynamic Programming"},
                {"title": "Substring with Concatenation of All Words (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/substring-with-concatenation-of-all-words/", "platform": "LeetCode", "topic": "Strings"}
            ]
        },
        {
            "name": "C#",
            "category": "Programming Languages",
            "description": "A modern, object-oriented language developed by Microsoft, widely used for enterprise applications and Unity game development.",
            "roadmap": {
                "introduction": "Learn C# and the .NET framework.",
                "beginner": [{"title": "C# Basics", "description": "Learn syntax and data types."}],
                "intermediate": [{"title": "OOP in C#", "description": "Understand classes and interfaces."}],
                "advanced": [{"title": "LINQ & Async", "description": "Learn LINQ queries and asynchronous coding."}],
                "concepts": [{"name": "Type Safety", "value": "Strict type safety enforced by compilation."}]
            },
            "videos": [
                {"title": "C# Tutorial - Full Course for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=gfkTf1OIv2s", "channel_name": "freeCodeCamp", "difficulty": "Beginner"},
                {"title": "C# Tutorial in Hindi", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=kYyE9Tc1_pE", "channel_name": "CodeWithHarry", "difficulty": "Beginner"},
                {"title": "C# Programming in Urdu", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=b4dK2wI-Lws", "channel_name": "Urdu IT Academy", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "C# Syntax Basics (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/cs/index.php", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "Add Two Numbers (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/add-two-numbers/", "platform": "LeetCode", "topic": "Linked Lists"},
                {"title": "Longest Valid Parentheses (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/longest-valid-parentheses/", "platform": "LeetCode", "topic": "Dynamic Programming"},
                {"title": "Sudoku Solver (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/sudoku-solver/", "platform": "LeetCode", "topic": "Backtracking"},
                {"title": "Jump Game II (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/jump-game-ii/", "platform": "LeetCode", "topic": "Algorithms"}
            ]
        },
        {
            "name": "PHP",
            "category": "Programming Languages",
            "description": "A popular general-purpose scripting language that is especially suited to web development.",
            "roadmap": {
                "introduction": "Master server-side templating and database connectivity using PHP.",
                "beginner": [{"title": "PHP Basics", "description": "Variables, echo, conditional logic."}],
                "intermediate": [{"title": "Form Handling & SQL", "description": "Handling GET/POST forms and connecting to MySQL database."}],
                "advanced": [{"title": "MVC & Laravel", "description": "Designing MVC apps and modern PHP development using Laravel framework."}],
                "concepts": [{"name": "Server-side execution", "value": "Runs on web server prior to delivering HTML client-side."}]
            },
            "videos": [
                {"title": "PHP For Beginners - 2024", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=OK_JCtrrv-c", "channel_name": "freeCodeCamp", "difficulty": "Beginner"},
                {"title": "PHP Full Course in Hindi", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=xW7ro3lwaCI", "channel_name": "CodeWithHarry", "difficulty": "Beginner"},
                {"title": "PHP Course for Beginners - Urdu", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=2n87p_P6_v4", "channel_name": "Yahoo Baba", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "PHP Syntax Practice (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/php/default.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "String to Integer (atoi) (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/string-to-integer-atoi/", "platform": "LeetCode", "topic": "Math"},
                {"title": "Wildcard Matching (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/wildcard-matching/", "platform": "LeetCode", "topic": "Dynamic Programming"},
                {"title": "Scramble String (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/scramble-string/", "platform": "LeetCode", "topic": "Strings"}
            ]
        },
        {
            "name": "Go",
            "category": "Programming Languages",
            "description": "An open-source programming language created by Google, designed for simplicity, concurrency, and high-performance network services.",
            "roadmap": {
                "introduction": "Learn Go (Golang) for fast microservices and backend engineering.",
                "beginner": [{"title": "Go Basics", "description": "Variables, types, control flow structures."}],
                "intermediate": [{"title": "Structs & Interfaces", "description": "Creating custom structs, methods, and interface contracts."}],
                "advanced": [{"title": "Goroutines & Channels", "description": "Handling concurrent tasks using lightweight threads and channel communication."}],
                "concepts": [{"name": "Static Compilation", "value": "Go compiles directly into machine code for rapid startup and low footprint."}]
            },
            "videos": [
                {"title": "Go Tutorial - 11 Projects", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=YS4e4q9oBaU", "channel_name": "freeCodeCamp", "difficulty": "Beginner"},
                {"title": "Golang Course in Hindi", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=X4q1OM0voO0", "channel_name": "LCO", "difficulty": "Beginner"},
                {"title": "Go Language Tutorial in Urdu", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=P_Jm_96n1lE", "channel_name": "Urdu IT Academy", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "Go Loop Syntax (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/git/default.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "Search in Rotated Sorted Array (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/", "platform": "LeetCode", "topic": "Arrays"},
                {"title": "N-Queens (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/n-queens/", "platform": "LeetCode", "topic": "Backtracking"},
                {"title": "Text Justification (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/text-justification/", "platform": "LeetCode", "topic": "Strings"},
                {"title": "Largest Rectangle in Histogram (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/", "platform": "LeetCode", "topic": "Arrays"}
            ]
        },
        {
            "name": "Rust",
            "category": "Programming Languages",
            "description": "A systems programming language focused on safety, speed, and concurrency, preventing segment faults and data races.",
            "roadmap": {
                "introduction": "Understand memory safety without a garbage collector using Rust's borrow checker.",
                "beginner": [{"title": "Cargo & Rust Basics", "description": "Project initialization, mutable/immutable variables."}],
                "intermediate": [{"title": "Ownership & Borrowing", "description": "Master stack/heap variables, references, borrowing, and lifetimes."}],
                "advanced": [{"title": "Smart Pointers & Concurrency", "description": "Using Rc, Arc, Mutex and writing safe multithreaded systems."}],
                "concepts": [{"name": "Borrow Checker", "value": "Enforces compiler-level ownership rules ensuring thread and memory safety."}]
            },
            "videos": [
                {"title": "Rust Programming Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=zF34dRivLOw", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"},
                {"title": "Rust Tutorial For Beginners in Hindi", "platform": "YouTube", "type": "Video", "language": "Hindi", "url": "https://www.youtube.com/watch?v=kU78qf3366I", "channel_name": "Code Eater", "difficulty": "Beginner"},
                {"title": "Rust Tutorial in Urdu", "platform": "YouTube", "type": "Video", "language": "Urdu", "url": "https://www.youtube.com/watch?v=tF38k5qWjrs", "channel_name": "Urdu Academy", "difficulty": "Beginner"}
            ],
            "practice": [
                {"title": "Rust Variables Syntax (Easiest)", "difficulty": "Easy", "url": "https://www.w3schools.com/cpp/default.asp", "platform": "W3Schools", "topic": "Syntax"},
                {"title": "Find First and Last Position (Medium)", "difficulty": "Medium", "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", "platform": "LeetCode", "topic": "Binary Search"},
                {"title": "Trapping Rain Water (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/trapping-rain-water/", "platform": "LeetCode", "topic": "Arrays"},
                {"title": "Permutation Sequence (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/permutation-sequence/", "platform": "LeetCode", "topic": "Math"},
                {"title": "Basic Calculator (Hardest)", "difficulty": "Hard", "url": "https://leetcode.com/problems/basic-calculator/", "platform": "LeetCode", "topic": "Math"}
            ]
        },
        # --- Web Development ---
        {
            "name": "HTML",
            "category": "Web Development",
            "description": "HyperText Markup Language, the standard formatting layout for structuring web pages.",
            "roadmap": {"introduction": "Learn the elements and structure of the World Wide Web.", "beginner": [{"title": "Elements & Tags", "description": "Creating paragraphs, titles, anchors, and images."}], "intermediate": [{"title": "Semantic HTML", "description": "Using header, footer, article, and section tag wrappers."}], "advanced": [{"title": "SEO & Accessibility", "description": "Adding aria attributes, meta tags, and formatting forms for screen readers."}], "concepts": [{"name": "DOM Structure", "value": "HTML constructs the DOM tree that browsers read."}]},
            "videos": [{"title": "HTML Full Course for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=kUMe1FH4XXI", "channel_name": "Programming with Mosh", "difficulty": "Beginner"}],
            "practice": [{"title": "HTML Tags Practice", "difficulty": "Easy", "url": "https://www.w3schools.com/html/", "platform": "W3Schools", "topic": "Structure"}]
        },
        {
            "name": "CSS",
            "category": "Web Development",
            "description": "Cascading Style Sheets, used to style, structure layout, and beautify plain HTML documents.",
            "roadmap": {"introduction": "Style web apps with grids, flexbox, and modern HSL responsive variables.", "beginner": [{"title": "Selectors & Colors", "description": "Applying class selectors, IDs, margins, and padding rules."}], "intermediate": [{"title": "Flexbox & Grid", "description": "Constructing dynamic column layouts and alignment grids."}], "advanced": [{"title": "Animations & Variables", "description": "Using CSS variables, transitions, transform, and `@keyframes` animations."}], "concepts": [{"name": "The Box Model", "value": "Every HTML element is a box with margins, borders, padding, and content."}]},
            "videos": [{"title": "CSS Tutorial - Zero to Hero", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=yfoY53QXEnI", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "CSS Flexbox Challenge", "difficulty": "Easy", "url": "https://www.w3schools.com/css/css3_flexbox.asp", "platform": "W3Schools", "topic": "Layout"}]
        },
        {
            "name": "React",
            "category": "Web Development",
            "description": "A declarative, efficient, and flexible JavaScript library for building component-based user interfaces.",
            "roadmap": {"introduction": "Master single-page app development using functional components, state hooks, and routers.", "beginner": [{"title": "JSX & Components", "description": "Writing markup in JavaScript, creating reusable UI units."}], "intermediate": [{"title": "Hooks & State", "description": "Using useState, useEffect, and custom hooks for component lifecycle."}], "advanced": [{"title": "Context & Redux", "description": "Managing global application state using React Context API and Redux store."}], "concepts": [{"name": "Virtual DOM", "value": "React maintains a virtual representation of the DOM to batch render changes efficiently."}]},
            "videos": [{"title": "React.js Tutorial for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=SqcY0GlETPk", "channel_name": "Programming with Mosh", "difficulty": "Beginner"}],
            "practice": [{"title": "React Component Hooks", "difficulty": "Medium", "url": "https://www.w3schools.com/react/", "platform": "W3Schools", "topic": "State"}]
        },
        {
            "name": "Node.js",
            "category": "Web Development",
            "description": "A back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.",
            "roadmap": {"introduction": "Write server-side javascript applications.", "beginner": [{"title": "Node Module System", "description": "Working with file system, path, and HTTP built-in modules."}], "intermediate": [{"title": "Express Framework", "description": "Building routing APIs, middlewares, and server controllers."}], "advanced": [{"title": "Websockets & Streams", "description": "Real-time communication with socket.io and memory stream caching."}], "concepts": [{"name": "Non-blocking I/O", "value": "Event-driven architecture allows Node to process high loads of connections asynchronously."}]},
            "videos": [{"title": "Node.js Tutorial for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=TlB_eWDSMt4", "channel_name": "Programming with Mosh", "difficulty": "Beginner"}],
            "practice": [{"title": "Node Server Practice", "difficulty": "Medium", "url": "https://www.w3schools.com/nodejs/", "platform": "W3Schools", "topic": "Routing"}]
        },
        {
            "name": "Backend Development",
            "category": "Web Development",
            "description": "Building server-side logic, database interactions, user sessions, security architectures, and API endpoints.",
            "roadmap": {"introduction": "Develop web servers, databases, and secure APIs.", "beginner": [{"title": "HTTP & REST APIs", "description": "Understanding client-server communication, headers, and request methods."}], "intermediate": [{"title": "Databases & ORMs", "description": "Connecting SQL databases and writing queries/mappings."}], "advanced": [{"title": "Security & Deployments", "description": "Implementing JWT, password salting, CORS, and cloud hosting."}], "concepts": [{"name": "Stateless Architecture", "value": "Each request contains all validation data, enabling scale across multiple instances."}]},
            "videos": [{"title": "Backend Development Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=qwAFL766Z60", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "SQL Injection Prevention", "difficulty": "Hard", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Security"}]
        },
        # --- AI & Data ---
        {
            "name": "Machine Learning",
            "category": "AI & Data",
            "description": "Algorithms that parse data, learn from it, and make informed decisions or predictions based on findings.",
            "roadmap": {"introduction": "Train models to recognize patterns using supervised and unsupervised learning.", "beginner": [{"title": "Math Foundations", "description": "Linear algebra, calculus, and basic probability statistics."}], "intermediate": [{"title": "Regression & Classification", "description": "Implementing Linear/Logistic Regression, Decision Trees, and SVMs."}], "advanced": [{"title": "Model Evaluation", "description": "Hyperparameter tuning, cross-validation, and ROC/AUC metrics."}], "concepts": [{"name": "Supervised Learning", "value": "Training models using labeled datasets to predict targets."}]},
            "videos": [{"title": "Machine Learning for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=GwIo3gGTe3A", "channel_name": "Programming with Mosh", "difficulty": "Beginner"}],
            "practice": [{"title": "Linear Regression Math", "difficulty": "Medium", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Mathematics"}]
        },
        {
            "name": "Deep Learning",
            "category": "AI & Data",
            "description": "A subset of machine learning based on artificial neural networks, simulating brain structures to process unstructured inputs.",
            "roadmap": {"introduction": "Build multi-layer neural networks using PyTorch and TensorFlow.", "beginner": [{"title": "Neural Network Basics", "description": "Understanding weights, biases, and activation functions (ReLU, Sigmoid)."}], "intermediate": [{"title": "CNNs & RNNs", "description": "Convolutional networks for computer vision; Recurrent networks for sequential data."}], "advanced": [{"title": "Transformers & LLMs", "description": "Self-attention mechanisms, GPT model architectures, and pre-training."}], "concepts": [{"name": "Backpropagation", "value": "Algorithm that updates neural weights by calculating gradient loss updates."}]},
            "videos": [{"title": "Deep Learning Crash Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=VyW348OM68g", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "Neural Net Implementation", "difficulty": "Hard", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Neural Nets"}]
        },
        {
            "name": "Data Science",
            "category": "AI & Data",
            "description": "Extracting clean insights and knowledge from structured/unstructured datasets using statistics, pandas, and data tools.",
            "roadmap": {"introduction": "Analyze data, clean dataframes, and build dashboards.", "beginner": [{"title": "NumPy & Pandas", "description": "Loading, cleaning, and filtering data matrices."}], "intermediate": [{"title": "Data Visualizations", "description": "Creating plots with Matplotlib, Seaborn, and Tableau dashboards."}], "advanced": [{"title": "Statistical Inference", "description": "Hypothesis testing, A/B tests, and probability distributions."}], "concepts": [{"name": "Exploratory Data Analysis", "value": "Analyzing dataset parameters to summarize main structural features visually."}]},
            "videos": [{"title": "Data Science for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=ua-CiDNNj30", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "Pandas Data Cleaning", "difficulty": "Medium", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Pandas"}]
        },
        {
            "name": "Generative AI",
            "category": "AI & Data",
            "description": "AI systems capable of generating text, images, code, or media in response to prompts, using foundational large language models.",
            "roadmap": {"introduction": "Utilize LLMs, prompt engineering, RAG, and fine-tuning configurations.", "beginner": [{"title": "Prompt Engineering", "description": "Zero-shot, few-shot prompting, and structuring LLM inputs."}], "intermediate": [{"title": "RAG (Retrieval-Augmented Gen)", "description": "Embedding documents in vector databases to provide external context to models."}], "advanced": [{"title": "Fine-Tuning & Quantization", "description": "Updating LLM weights on specific task datasets using LoRA."}], "concepts": [{"name": "Attention Mechanism", "value": "Allows models to focus on specific sections of context when predicting text output."}]},
            "videos": [{"title": "Generative AI Crash Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=mEsleV16qdo", "channel_name": "Google Cloud", "difficulty": "Beginner"}],
            "practice": [{"title": "Vector Database Queries", "difficulty": "Medium", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Vector DB"}]
        },
        # --- Other Skills ---
        {
            "name": "Cyber Security",
            "category": "Other Skills",
            "description": "The practice of defending computers, servers, mobile devices, electronic systems, networks, and data from malicious attacks.",
            "roadmap": {"introduction": "Identify system flaws, run tests, and secure applications.", "beginner": [{"title": "Network Security", "description": "IP addressing, subnets, firewalls, and ports."}], "intermediate": [{"title": "Penetration Testing", "description": "Scanning web servers for common exploits (SQLi, XSS, CSRF)."}], "advanced": [{"title": "Cryptography & Audits", "description": "Symmetric/Asymmetric encryption, SSL certificates, and security logs."}], "concepts": [{"name": "Zero Trust Model", "value": "A framework requiring all users to be authenticated and validated continuously."}]},
            "videos": [{"title": "Cyber Security Full Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=nzj7Wg46zgA", "channel_name": "Edureka", "difficulty": "Beginner"}],
            "practice": [{"title": "Port Scanning Basics", "difficulty": "Medium", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Networks"}]
        },
        {
            "name": "UI/UX Design",
            "category": "Other Skills",
            "description": "Designing premium, responsive user interfaces (UI) and conducting user experience (UX) research to create delightful user flows.",
            "roadmap": {"introduction": "Create clean design systems, wireframes, and high-fidelity mockups.", "beginner": [{"title": "Design Principles", "description": "Typography, color harmony, layouts, and spacing grids."}], "intermediate": [{"title": "Figma Prototyping", "description": "Creating interactive buttons, transitions, and component variants."}], "advanced": [{"title": "UX Research", "description": "Conducting user interviews, usability audits, and heat-map analyses."}], "concepts": [{"name": "Visual Hierarchy", "value": "Arranging layout elements in order of visual importance to guide reader attention."}]},
            "videos": [{"title": "Figma UI/UX Design Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=c9Wg6a_YLdU", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "UX Evaluation Case Study", "difficulty": "Medium", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "UX Audit"}]
        },
        {
            "name": "Git & GitHub",
            "category": "Other Skills",
            "description": "Version control systems used to track code edits, manage branches, and collaborate on software projects.",
            "roadmap": {"introduction": "Track development histories and collaborate across engineering teams.", "beginner": [{"title": "Git Basics", "description": "Initializing repositories, adding file staging, and creating commits."}], "intermediate": [{"title": "Branching & Merges", "description": "Creating branches, merging code, and resolving file conflicts."}], "advanced": [{"title": "GitHub Actions CI/CD", "description": "Setting up build and test automation on git pull requests."}], "concepts": [{"name": "Distributed Versioning", "value": "Git clones the entire repository history onto local workstations."}]},
            "videos": [{"title": "Git and GitHub for Beginners", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=RGOj5yH7evk", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "Git Commit Challenge", "difficulty": "Easy", "url": "https://www.w3schools.com/git/", "platform": "W3Schools", "topic": "Syntax"}]
        },
        {
            "name": "Cloud Computing",
            "category": "Other Skills",
            "description": "Deploying servers, storage, databases, networking, and software services over the internet using AWS, Azure, or GCP.",
            "roadmap": {"introduction": "Configure virtual clouds and automate serverless container deployments.", "beginner": [{"title": "Cloud Basics", "description": "SaaS, PaaS, IaaS structures, and AWS fundamentals."}], "intermediate": [{"title": "Virtual Servers & Containers", "description": "Setting up EC2 instances, security groups, and Docker images."}], "advanced": [{"title": "Kubernetes & CI/CD", "description": "Scaling containers automatically and hosting scalable apps."}], "concepts": [{"name": "Serverless Computing", "value": "Cloud provider executes functions dynamically without persistent servers."}]},
            "videos": [{"title": "AWS Certified Practitioner Course", "platform": "YouTube", "type": "Video", "language": "English", "url": "https://www.youtube.com/watch?v=SOTamWGuDKc", "channel_name": "FreeCodeCamp", "difficulty": "Beginner"}],
            "practice": [{"title": "Cloud Resource Configuration", "difficulty": "Hard", "url": "https://www.hackerrank.com", "platform": "HackerRank", "topic": "Infrastructure"}]
        }
    ]

    for s in skills_data:
        # Check if skill already exists
        existing_skill = db.query(models.Skill).filter(models.Skill.name == s["name"]).first()
        
        if not existing_skill:
            existing_skill = models.Skill(
                name=s["name"],
                category=s["category"],
                description=s["description"],
                roadmap_json=json.dumps(s["roadmap"])
            )
            db.add(existing_skill)
            db.commit()
            db.refresh(existing_skill)
            print(f"Seeded Skill: {existing_skill.name}")
        else:
            # Update roadmap
            existing_skill.roadmap_json = json.dumps(s["roadmap"])
            db.commit()
            
        # CLEAR existing resources & practice challenges for this specific skill to avoid duplicates,
        # and re-insert the updated ones so restarts immediately apply new/corrected resources!
        db.query(models.Resource).filter(models.Resource.skill_id == existing_skill.id).delete()
        db.query(models.Practice).filter(models.Practice.skill_id == existing_skill.id).delete()
        db.commit()

        # Seed Resources for this skill
        for video in s["videos"]:
            new_res = models.Resource(
                skill_id=existing_skill.id,
                title=video["title"],
                platform=video["platform"],
                type=video["type"],
                language=video["language"],
                url=video["url"],
                channel_name=video["channel_name"],
                difficulty=video["difficulty"]
            )
            db.add(new_res)
        
        # Seed Practice tasks for this skill
        for practice in s["practice"]:
            new_prac = models.Practice(
                skill_id=existing_skill.id,
                title=practice["title"],
                difficulty=practice["difficulty"],
                url=practice["url"],
                platform=practice["platform"],
                topic=practice["topic"]
            )
            db.add(new_prac)
            
        db.commit()
        print(f"Seeded resources and challenges for {existing_skill.name}")
