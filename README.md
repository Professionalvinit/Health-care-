# 🏥 HealthCare Plus - Comprehensive Health Platform

A modern, comprehensive health platform built with **Vite + React + TypeScript**, designed for both patients and healthcare providers. Features AI-powered symptom checking, secure messaging, appointment scheduling, and health analytics.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Professionalvinit/Health-care-)

## 🌟 Features

### 👥 **Dual User Interface**
- **Patient Dashboard** - Personal health management
- **Provider Dashboard** - Healthcare professional tools

### 🔧 **Core Functionality**
- 🤖 **AI Symptom Checker** - Intelligent health assessment
- 📅 **Smart Scheduling** - Appointment booking and management
- 💊 **Medication Tracking** - Prescription and adherence monitoring
- 💬 **Secure Messaging** - HIPAA-compliant communication
- 📊 **Health Analytics** - Progress tracking and insights
- 🎥 **Telehealth** - Video consultation capabilities
- 📋 **Health Records** - Comprehensive medical history

### 🛡️ **Security & Compliance**
- HIPAA-compliant design
- Secure data handling
- Privacy-focused architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Professionalvinit/Health-care-.git
   cd Health-care-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🏗️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Deployment:** Vercel
- **Code Quality:** ESLint, TypeScript

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── patient-dashboard.tsx
│   │   │   ├── provider-dashboard.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── symptom-checker.tsx
│   │   │   └── ...
│   │   └── page.tsx            # Main app component
│   ├── components/ui/          # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── main.tsx               # App entry point
├── vercel.json                # Vercel deployment config
├── DEPLOYMENT.md              # Deployment guide
└── package.json
```

## 🌐 Deployment

### Quick Deploy to Vercel

1. **Using deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Manual deployment:**
   ```bash
   npm run build
   vercel --prod
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎯 Demo Accounts

### Patient Demo
- **Role:** Patient
- **Features:** Health tracking, appointments, messaging

### Provider Demo  
- **Role:** Healthcare Provider
- **Features:** Patient management, scheduling, analytics

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📊 Performance

- **Bundle Size:** Optimized with code splitting
- **Load Time:** Fast initial page load
- **SEO:** Optimized for search engines
- **Accessibility:** WCAG compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components inspired by modern design principles
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

---

**Made with ❤️ for better healthcare accessibility**
