# 🌸 Kira - Menstrual Cycle Tracking App

Kira is a modern, intuitive web application designed to help users track their menstrual cycles. Users manually enter their daily data `(flow intensity, mood, energy levels, sleep hours, symptoms, and personal notes)` through an intuitive interface, and the app transforms this information into beautiful, interactive charts and insights to help understand cycle patterns and overall wellbeing.

🌟 **[Live Demo](https://kiira.netlify.app)** - Try the web app now!

🖥️ [Video Demo - Desktop]

https://github.com/user-attachments/assets/d0e38ce1-1e6f-4151-bcfe-3af185843b52

📱[Video Demo - Mobile]


https://github.com/user-attachments/assets/99c54df5-4f0c-4e00-a96a-1a44a2e4bc0d



## 📋 Table of Contents

- [Why This Data Matters](#-why-this-data-matters)
- [Design Philosophy](#-design-philosophy)
- [Technical Architecture](#-technical-architecture)
- [App Features & Navigation Guide](#-app-features--navigation-guide)
- [Security & Privacy](#-security--privacy)
- [Data Structure](#-data-structure)
- [Getting Started](#-getting-started)
- [Local Development Setup](#-local-development-setup)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)

### 📊 Why This Data Matters

Menstrual cycle tracking is crucial for:
- **Health Awareness**: Understanding normal vs. abnormal patterns
- **Symptom Management**: Identifying triggers and patterns in mood, energy, and physical symptoms
- **Medical Communication**: Providing healthcare providers with accurate cycle data
- **Personal Planning**: Predicting future cycles and planning around them

## 🎨 Design Philosophy

### User Experience
- **Minimalist Interface**: Clean, calming design using soft pink and purple gradients
- **Intuitive Navigation**: Calendar-based interaction that feels natural
- **Accessibility**: High contrast, readable typography, and clear visual hierarchy
- **Mobile-First**: Responsive design optimized for daily mobile usage

### Visual Design Choices
- **Color Palette**: Soft pinks and purples to create a welcoming, feminine aesthetic
- **Typography**: Clean, modern fonts for excellent readability
- **Icons & Graphics**: Simple, recognizable symbols for quick data entry
- **Cards & Modals**: Organized information display with clear visual separation

## 🛠 Technical Architecture

### Frontend Stack
- **React 19** with TypeScript for type safety and modern development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling and consistent design system
- **React Router** for seamless navigation between pages

### Backend & Data
- **Convex** as the backend-as-a-service platform for real-time data
- **Clerk** for secure user authentication and user management
- **Real-time Sync**: Instant updates across all user sessions

### Key Technical Decisions

1. **Convex over Traditional Backend**: Chosen for real-time data synchronization, serverless architecture, built-in database with TypeScript schema validation, automatic API generation, and zero-config deployment without managing servers
2. **Clerk for Authentication**: Selected for enterprise-grade security, seamless social logins, user management dashboard, and excellent React integration without complex auth setup
3. **TypeScript**: Ensures type safety and better developer experience
4. **Component Architecture**: Modular, reusable components for maintainability
5. **Responsive Design**: Mobile-first approach since most tracking happens on-the-go
6. **Calendar-Centric UI**: Natural interaction pattern for date-based data

## 📱 App Features & Navigation Guide

### 1. Landing Page
- **Welcome Interface**: Introduction to the app's purpose
- **Sign Up/Sign In**: Secure authentication via Clerk
- **Feature Overview**: Brief explanation of tracking capabilities

### 2. Dashboard (Main App)
The heart of the application with three main sections:

#### Calendar View
- **Monthly Calendar**: Visual representation of your cycle data
- **Color-Coded Days**: Different colors indicate cycle phases and data availability
- **Quick Navigation**: Easy month-to-month browsing
- **Day Selection**: Click any day to view or add data

#### Daily Tracking Modal
When you click on a calendar day, you can log:
- **Flow Intensity**: None, Light, Medium, Heavy
- **Mood Tracking**: Great, Good, Okay, Low, Irritable
- **Energy Levels**: High, Medium, Low
- **Sleep Hours**: Numeric input for sleep duration
- **Symptoms**: Multi-select from common symptoms (Cramps, Bloating, Headache, Mood swings, Fatigue, Nausea, Back pain, Acne, Food cravings, Dizziness)
- **Personal Notes**: Free-text field for additional observations

#### Insights Dashboard
- **Cycle Overview**: Average cycle length and patterns
- **Symptom Trends**: Visual charts showing symptom frequency over time
- **Sleep Patterns**: Sleep duration trends and correlations
- **Mood Analysis**: Mood patterns throughout different cycle phases

## 🔐 Security & Privacy

- **Secure Authentication**: Clerk handles all user authentication securely
- **Data Encryption**: All data is encrypted in transit and at rest via Convex
- **User Ownership**: Users have full control over their personal health data
- **Privacy First**: No data sharing with third parties

## 📊 Data Structure

The app currently tracks these manually entered data points:

- **Cycles**: Start dates and durations for menstrual periods
- **Daily Entries**: 
  - **Flow Intensity**: None, Light, Medium, Heavy
  - **Mood**: Great (😊), Good (🙂), Okay (😐), Low (😔), Irritable (😤) 
  - **Energy Level**: High, Medium, Low (with color indicators)
  - **Sleep Hours**: 3-12 hours using an interactive slider
  - **Symptoms**: Multi-select from 10 common symptoms (Cramps, Bloating, Headache, etc.)
  - **Personal Notes**: Free-form text for additional observations

## 🚀 Getting Started

The easiest way to explore Kira is through our **[Live Demo](https://kiira.netlify.app)**. Simply:

1. Visit the live demo link
2. Sign up with your email or use social login
3. Start tracking your cycle data immediately
4. Explore the insights dashboard to see your patterns

## 💻 Local Development Setup

To run Kira locally on your machine:

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Kira
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_CONVEX_URL=your_convex_deployment_url
   ```

4. **Set up Convex (Backend)**:
   ```bash
   npx convex dev
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to `http://localhost:5173` to see the app

## 🤝 Contributing

This project is part of a technical assessment. For questions or feedback, please reach out directly.

## 📄 License

This project is created for evaluation purposes.

---

**Built with ❤️ for women's health awareness and empowerment.**
