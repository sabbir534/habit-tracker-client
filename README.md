# HabitTracker

**Live Site URL:** [https://habit-tracker-client.web.app/](https://habit-tracker-client.web.app/)

This is the client-side for the **HabitTracker** web application. It's a full-stack MERN project built to help users create, track, and manage their daily habits to build consistency and boost productivity.

The app features secure authentication, full CRUD operations for habits, and a community gallery to browse public habits.

---

## 🚀 Key Features

- **Secure Authentication:** Full user login and registration with Email/Password and Google Sign-In provided by Firebase. All private routes are protected.
- **Full Habit CRUD:** Users can create, read, update (via a modal), and delete their own habits from the "My Habits" dashboard.
- **Daily Completion & Streaks:** Users can mark habits complete once per day. The app automatically calculates and displays the user's current streak.
- **Progress Visualization:** A 30-day progress bar and streak badges on the "Habit Details" page keep users motivated.
- **Image Uploads:** Uses ImgBB to handle image uploads for user profile pictures (on registration) and custom habit images (on creation/update).
- **Public Habit Gallery:** A "Browse Public Habits" page where users can see all habits shared by the community.
- **Dynamic Filtering & Search:** The public habits page features live client-side filtering by category and debounced searching by keywords.
- **Rich UI & Animations:** Built with Tailwind CSS and DaisyUI, featuring a dark/light mode toggle, animated page sections with Framer Motion, and an animated hero slider using Swiper.js.

---

## 🛠️ Tech Stack

- **Framework:** React
- **Routing:** React Router
- **Styling:** Tailwind CSS & DaisyUI
- **Authentication:** Firebase
- **API Requests:** Axios
- **Image Hosting:** ImgBB
- **Animations:** Framer Motion, React Simple Typewriter
- **Sliders:** Swiper.js
- **Notifications:** React Hot Toast, SweetAlert2

---

## 📦 How to Run Locally

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/your-client-repo.git](https://github.com/your-username/your-client-repo.git)
    cd your-client-repo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add your Firebase and ImgBB keys:

    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    VITE_IMGBB_API_KEY=your_imgbb_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
