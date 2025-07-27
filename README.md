# 🎯 Todo App

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### ✨ A beautiful React-based todo application with modern features

</div>

---

## 🌟 Features

<div align="center">

| 🎨 **Theme System** | ✅ **Todo Management** | 🔔 **Smart Notifications** | 💾 **Persistent Storage** | 📊 **Progress Tracking** | 🔍 **Filtering/Sorting** | 🏷️ **Tags** | ♻️ **Recurring Tasks** | 👤 **Account Sync** | 📴 **Offline Mode** |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Automatic dark/light mode switching with manual override | Add, edit, complete and delete todos with due dates | Browser notifications for due tasks | Firebase Realtime Database with cloud sync | Percentage bar of completed tasks | Filter by status and sort by date | Organize todos with optional tags | Daily, weekly or monthly recurrence | Sign in to sync across devices | Use the app even when offline |

</div>

This release introduces a basic service worker to cache the application shell so your tasks remain accessible without a network connection.

---

## 🚀 Live Demo

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jphermans/todo-app)

</div>

---

## 📦 Development Commands

<div align="center">

| Command | Description | Status |
|:--------|:------------|:-------|
| `npm run dev` | 🚀 Start development server with HMR | ✅ Ready |
| `npm run build` | 📦 Build for production | ✅ Ready |
| `npm run lint` | 🔍 Run ESLint | ✅ Ready |
| `npm run preview` | 👀 Preview production build locally | ✅ Ready |

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-19-blue?logo=react&style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript&style=flat-square)
![CSS3](https://img.shields.io/badge/CSS3-Modern-purple?logo=css3&style=flat-square)

### Build Tools
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite&style=flat-square)
![ESLint](https://img.shields.io/badge/ESLint-Code%20Quality-red?logo=eslint&style=flat-square)

### Storage
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange?style=flat-square)

</div>

---

## 🎯 Getting Started

### Prerequisites
- 📦 **Node.js** (v16 or higher)
- 🔧 **npm** or **yarn**
- 🔥 **Firebase Account** (free tier)

### Firebase Setup (Required)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create Project" → Name it "todo-app-{yourname}"
   - Enable **Realtime Database**
   - Go to **Rules** tab and set:
   ```json
   {
     "rules": {
       "todos": {
         "$user": {
           ".read": true,
           ".write": true
         }
       }
     }
   }
   ```

2. **Firebase Credentials** ✅ Already configured in `.env`
   - Since this is a private repository, credentials are included
   - Ready to deploy directly to GitHub Pages

### Quick Start

<div align="center">

```bash
# Clone the repository
git clone https://github.com/jphermans/todo-app.git

# Navigate to project directory
cd todo-app

# Install dependencies
npm install

# Configure Firebase (edit src/firebase.js with your config)

# Start development server
npm run dev
```

</div>

Your app will be running at [http://localhost:5173](http://localhost:5173) 🎉

---

## 🏗️ Architecture

<div align="center">

| Component | Purpose | Status |
|:----------|:--------|:-------|
| `App.jsx` | 🎯 Main app component with theme toggle | ✅ Active |
| `TodoList.jsx` | 📋 Core todo functionality (CRUD operations) | ✅ Active |
| `index.css` | 🎨 Theme-aware CSS with custom properties | ✅ Active |

</div>

---

## 🎨 Theme System

<div align="center">

### 🌓 Three Theme States
- 🌙 **Dark Mode** - Easy on the eyes
- ☀️ **Light Mode** - Clean and bright
- 🖥️ **System** - Automatic based on OS preference

### 🎯 CSS Custom Properties
- Consistent theming across all components
- Easy theme switching without page reload

### 🔥 Firebase Theme & Color Sync
Your **theme preferences** (light/dark mode) and **color scheme** choices are automatically saved to **Firebase Realtime Database** and synced across all your devices!

- 🌓 **Theme State** - Your choice of System/Light/Dark mode
- 🎨 **Color Scheme** - Your selected accent color (Blue, Green, Purple, Orange, Pink, Red, Teal, Indigo)
- 📊 **Real-time Sync** - Changes appear instantly on any device you're signed into
- 🔒 **Per-user Storage** - Each user has their own theme preferences

**How it works:**
- When you change themes or colors, preferences are saved to Firebase
- On any device, sign in with the same username to sync your personalized theme
- No account required - just use your preferred username

</div>

## ✨ Extra Features

<div align="center">

| Extra | Description |
|:------|:-----------|
| 📝 **Subtasks** | Break down todos into smaller actionable items |
| 🎨 **Color Scheme Selector** | Choose between multiple accent colors |
| 🖱️ **Mouse Trail** | Playful cursor-following animation |
| ⚠️ **Custom Alerts** | Friendly success and warning popups |
| 👤 **Per-user Storage** | Sign in to sync across all devices |

</div>

---

## 📱 Responsive Design

<div align="center">

| Device | Status |
|:-------|:-------|
| 📱 **Mobile** | ✅ Fully Responsive |
| 💻 **Tablet** | ✅ Optimized Layout |
| 🖥️ **Desktop** | ✅ Complete Features |

</div>

---

## 🤝 Contributing

<div align="center">

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

---

## 📄 License

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</div>

---

<div align="center">

### ⭐ Show your support

Give a ⭐ if this project helped you!

Made with ❤️ by [jphermans](https://github.com/jphermans)

</div>