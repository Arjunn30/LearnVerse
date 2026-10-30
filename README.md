# 🌴 LearnVerse — Miami Neon Edition

### Learn Beyond Limits. ✨

LearnVerse is a full-stack e-learning web application featuring a vibrant, GTA VI-inspired Miami neon aesthetic. It combines a modern user interface with practical course discovery and user authentication features.

The interface features a dark midnight theme, neon pink and purple gradients, sunset-inspired visuals, and responsive layouts.

## 🚀 Features

- 🌴 **Miami Neon UI** — Dark theme with vibrant pink, purple, and cyan accents.
- 🔐 **User Authentication** — Signup and login using JWT and bcrypt.
- 📚 **Course Catalog** — Explore courses across multiple categories.
- 🔎 **Search & Filtering** — Find courses by title, instructor, or category.
- 🎓 **Course Enrollment** — Enroll in available courses.
- 📊 **My Learning Dashboard** — View enrolled courses and progress information.
- 📱 **Responsive Design** — Optimized for desktop and mobile screens.
- 🗄️ **MongoDB Integration** — Database-backed user accounts and enrollments.

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| React.js | Node.js | MongoDB Atlas |
| Vite | Express.js | Mongoose |
| CSS3 | JWT & bcrypt | |

## 🎨 Design Inspiration

The LearnVerse interface takes visual inspiration from the vibrant Miami atmosphere associated with GTA VI.

Its design includes:

- Midnight navy backgrounds
- Neon pink and purple gradients
- Sunset-inspired hero visuals
- Modern course cards
- Smooth hover effects
- Responsive navigation

*LearnVerse is an independent educational project and is not affiliated with Rockstar Games or Grand Theft Auto.*

## 💻 Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/Arjunn30/LearnVerse.git
cd LearnVerse
```

**2. Start the backend**

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Then run:

```bash
npm run dev
```

**3. Start the frontend**

Open another terminal:

```bash
cd learnverse
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 📚 Available Courses

| Course | Instructor |
|---|---|
| Complete Web Development Bootcamp | Arjun Shukla |
| Python Programming Masterclass | Nidhi Pandey |
| UI/UX Design Fundamentals | Krishna Gupta |
| Machine Learning Essentials | Akshat Trivedi |
| Digital Marketing Strategy | Akshay Banari |
| React.js From Zero to Hero | Nidhi Pandey |

## 🔮 Future Improvements

- Interactive video lessons
- Real-time learning progress
- Course completion certificates
- Instructor dashboards
- Personalized course recommendations
- Online backend deployment

## 👨‍💻 Developer

**Arjun Shukla**

MCA Student | Full-Stack Web Development

GitHub: https://github.com/Arjunn30

---

⭐ If you like this project, consider starring the repository!

**Built with React, Express, MongoDB, and a little Miami neon magic. 🌴💜**
