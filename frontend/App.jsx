
import { useState } from "react";
import AuthModal from "./AuthModal";
import "./App.css";

const courses = [
  { id: 1, title: "Complete Web Development Bootcamp", instructor: "Arjun Shukla", category: "Development", rating: 4.8, students: "12.5k", lessons: 42, icon: "💻", color: "purple", level: "Beginner" },
  { id: 2, title: "Python Programming Masterclass", instructor: "Nidhi Pandey", category: "Development", rating: 4.9, students: "9.8k", lessons: 36, icon: "🐍", color: "blue", level: "Beginner" },
  { id: 3, title: "UI/UX Design Fundamentals", instructor: "Krishna Gupta", category: "Design", rating: 4.7, students: "7.2k", lessons: 28, icon: "🎨", color: "pink", level: "Intermediate" },
  { id: 4, title: "Machine Learning Essentials", instructor: "Akshat Trivedi", category: "Data Science", rating: 4.8, students: "6.4k", lessons: 32, icon: "🤖", color: "orange", level: "Intermediate" },
  { id: 5, title: "Digital Marketing Strategy", instructor: "Arjun Shukla", category: "Marketing", rating: 4.6, students: "5.1k", lessons: 24, icon: "📈", color: "green", level: "Beginner" },
  { id: 6, title: "React.js From Zero to Hero", instructor: "Nidhi Pandey", category: "Development", rating: 4.9, students: "11.3k", lessons: 40, icon: "⚛️", color: "cyan", level: "Intermediate" },
];

const categories = ["All Courses", "Development", "Design", "Data Science", "Marketing"];

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [page, setPage] = useState("home");
  const [enrollments, setEnrollments] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learnverse_user") || "null");
    } catch {
      return null;
    }
  });

  const loadEnrollments = async () => {
    const token = localStorage.getItem("learnverse_token");
    if (!token) {
      setEnrollments([]);
      return;
    }
    setLearningLoading(true);
    setLearningError("");
    try {
      const response = await fetch("http://localhost:5000/api/enrollments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(response.status === 401 ? "Session expired. Please log in again." : "Unable to load enrolled courses.");
      const data = await response.json();
      setEnrollments(Array.isArray(data.enrollments) ? data.enrollments : []);
    } catch (error) {
      setLearningError(error.message);
    } finally {
      setLearningLoading(false);
    }
  };

  const handleAuthSuccess = (loggedInUser) => {
    if (!loggedInUser || !loggedInUser.name) return;
    localStorage.setItem("learnverse_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setAuthMode(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("learnverse_user");
    localStorage.removeItem("learnverse_token");
    setUser(null);
    setEnrollments([]);
    setPage("home");
  };

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("learnverse_token");

    if (!token) {
      setSelectedCourse(null);
      setAuthMode("login");
      return;
    }

    if (enrolling) return;
    setEnrolling(true);

    try {
      const response = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: Number(courseId) }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully enrolled in the course!");
        setSelectedCourse(null);
        if (page === "learning") loadEnrollments();
      } else if (response.status === 401) {
        alert("Your login has expired. Please log in again.");
        setSelectedCourse(null);
        setAuthMode("login");
      } else {
        alert(data.message || "Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Unable to connect to server.");
    } finally {
      setEnrolling(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = (course.title + " " + course.instructor)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All Courses" || course.category === category;
    return matchesSearch && matchesCategory;
  });

  const exploreCourses = () => {
    setPage("home");
    setTimeout(() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a className="logo" href="#home" onClick={() => setPage("home")}>✦ Learn<span>Verse</span></a>
        <nav>
          <a href="#home" onClick={() => setPage("home")}>Home</a>
          <a href="#courses" onClick={exploreCourses}>Explore Courses</a>
          <a href="#about" onClick={() => setPage("home")}>About</a>
          {user && <button type="button" onClick={() => { setPage("learning"); void loadEnrollments(); }} className={`learning-nav-btn ${page === "learning" ? "active" : ""}`}>My Learning</button>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ fontWeight: 600 }}>Hi, {user.name}</span>
              <button className="login-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => setAuthMode("login")}>Log In</button>
              <button className="signup-btn" onClick={() => setAuthMode("signup")}>Get Started →</button>
            </>
          )}
        </div>
      </header>

      <main>
        {page === "learning" ? (
          <section className="courses-section" style={{ minHeight: "65vh", paddingTop: 65 }}>
            <div className="section-heading">
              <div>
                <span className="section-tag">YOUR LEARNING SPACE</span>
                <h2>My Learning 📚</h2>
                <p>Your enrolled courses, saved securely in your account.</p>
              </div>
            </div>
            {learningLoading && <p>Loading your courses...</p>}
            {learningError && <p role="alert" className="learning-error">{learningError} <button onClick={loadEnrollments}>Retry</button></p>}
            {!learningLoading && !learningError && enrollments.length === 0 && (
              <div style={{ padding: 30, textAlign: "center" }}>
                <h3>No enrolled courses yet</h3>
                <p>Explore our catalog and enroll in your first course.</p>
                <button className="primary-btn" onClick={exploreCourses}>Explore Courses →</button>
              </div>
            )}
            {!learningLoading && !learningError && enrollments.length > 0 && (
              <div className="course-grid">
                {enrollments.map((enrollment) => {
                  const course = courses.find((item) => item.id === enrollment.courseId);
                  return (
                    <article className="course-card" key={enrollment._id || enrollment.courseId}>
                      <div className={`course-image ${course?.color || "purple"}`}>
                        <span>{course?.icon || "📘"}</span>
                        <small>Enrolled</small>
                      </div>
                      <div className="course-body">
                        <span className="course-category">{course?.category || "Course"}</span>
                        <h3>{course?.title || `Course #${enrollment.courseId}`}</h3>
                        <p>{course ? `By ${course.instructor}` : "Course details unavailable"}</p>
                        <div className="course-footer" style={{ display: "block" }}>
                          <p style={{ marginBottom: 8 }}>Progress: {enrollment.progress ?? 0}%</p>
                          <div role="progressbar" aria-valuenow={enrollment.progress ?? 0} aria-valuemin={0} aria-valuemax={100} className="progress-track">
                            <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, enrollment.progress ?? 0))}%` }} />
                          </div>
                          <p style={{ fontSize: 12, marginTop: 10 }}>Lessons and progress updates coming later</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
        <>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">✦ THE FUTURE OF LEARNING IS HERE</span>
            <h1>Your Next Chapter<br /><span>Starts Here.</span></h1>
            <p>Explore practical courses, sharpen your skills, and turn curiosity into confidence. Learn on your terms, at your pace.</p>
            <div className="hero-buttons">
              <button className="primary-btn" onClick={exploreCourses}>Explore Courses →</button>
              <a className="secondary-btn" href="#about">How It Works</a>
            </div>
            <div className="hero-stats">
              <div><strong>06</strong><span>Courses to explore</span></div>
              <div><strong>04</strong><span>Learning categories</span></div>
              <div><strong>24/7</strong><span>Browse anytime</span></div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-disc" />
            <div className="skyline skyline-back" />
            <div className="skyline skyline-front" />
            <div className="palm palm-left"><span /></div>
            <div className="palm palm-right"><span /></div>
            <div className="hero-horizon" />
          </div>
        </section>

        {/* COURSES SECTION */}
        <section className="courses-section" id="courses">
          <div className="section-heading">
            <div>
              <span className="section-tag">EXPLORE &amp; LEARN</span>
              <h2>Discover Your Next Skill</h2>
              <p>Explore courses designed to help you reach your goals.</p>
            </div>
          </div>
          <div className="filters">
            <div className="categories">
              {categories.map((item) => (
                <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
            <input className="search-input" type="search" placeholder="🔍 Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="course-grid">
            {filteredCourses.map((course) => (
              <article className="course-card" key={course.id}>
                <div className={`course-image ${course.color}`}>
                  <span>{course.icon}</span>
                  <small>{course.level}</small>
                </div>
                <div className="course-body">
                  <span className="course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>By {course.instructor}</p>
                  <div className="course-meta">
                    <span>✦ {course.level} friendly</span>
                    <span>Explore at your pace</span>
                  </div>
                  <div className="course-footer">
                    <span>📖 {course.lessons} Lessons</span>
                    <button onClick={() => setSelectedCourse(course)}>View Course →</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <p className="empty-state">No courses found. Try another search.</p>
          )}
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <span className="section-tag">WHY LEARNVERSE?</span>
          <h2>Learning Made Simple</h2>
          <div className="benefits">
            <div><span>📚</span><h3>Quality Courses</h3><p>Learn through structured, easy-to-follow lessons.</p></div>
            <div><span>⏰</span><h3>Learn at Your Pace</h3><p>Study whenever and wherever you want.</p></div>
            <div><span>🏆</span><h3>Track Your Progress</h3><p>Stay motivated as you complete your learning goals.</p></div>
          </div>
        </section>
        </>
        )}
      </main>

      {/* FOOTER */}
      <footer>
        <strong>✦ LearnVerse</strong>
        <span>© 2026 LearnVerse. Built for curious minds.</span>
      </footer>

      {/* COURSE DETAILS POPUP */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedCourse(null)}>✕</button>
            <div className={`modal-art ${selectedCourse.color}`}>{selectedCourse.icon}</div>
            <span className="course-category">{selectedCourse.category}</span>
            <h2>{selectedCourse.title}</h2>
            <p>Instructor: {selectedCourse.instructor}</p>
            <p>{selectedCourse.lessons} lessons · {selectedCourse.level}</p>
            <button className="primary-btn" disabled={enrolling} onClick={() => handleEnroll(selectedCourse.id)}>
              {enrolling ? "Enrolling..." : "Enroll Now →"}
            </button>
          </div>
        </div>
      )}

      {/* LOGIN / SIGNUP POPUP */}
      {authMode && (
        <AuthModal
          onAuthSuccess={handleAuthSuccess}
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
        />
      )}
    </div>
  );
}
