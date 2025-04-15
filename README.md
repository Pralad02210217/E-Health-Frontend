Absolutely! Here's your beautifully polished and markdown-optimized `README.md` for the **College Infirmary Management System (CIMS) - Frontend**:

---

# 🏥 College Infirmary Management System (CIMS) - Frontend

## 🌟 Overview

**CIMS** is a robust, role-based healthcare management platform tailored for college environments. This frontend app is powered by **Next.js 14**, styled with **Tailwind CSS** and **Shadcn UI**, and built with modern developer tools like **TypeScript**, **Zod**, and **TanStack Query** to ensure speed, accessibility, and maintainability.

---

## ✨ Key Features

### 🔐 Authentication & Role Management
- Secure **JWT-based authentication**
- **Role-based access control** (RBAC) for:
  - Students
  - Health Assistants (HA)
  - Staff
  - Dean
- Session & route protection

### 👤 User Dashboards

#### 👨‍🎓 Student Portal
- Access treatment history
- Book appointments
- View medical records

#### 🩺 Health Assistant Portal
- Record treatments & symptoms
- Manage medicine stock
- Review patient analytics

#### 🧑‍💼 Dean Portal
- Analytics & reports dashboard
- Manage HA & staff roles
- Monitor mental health cases

### 📊 Data Visualization
- Real-time charts using **React Charts**
- Exportable reports (PDF/CSV planned)
- Comprehensive statistics

### 🎨 Design System
- Fully **responsive** and accessible
- **Dark/Light mode** toggle
- Shadcn UI-based modular components
- Smooth UX with **toast feedback**

---

## 🛠️ Tech Stack

| Category            | Technologies                              |
|---------------------|-------------------------------------------|
| Framework           | **Next.js 14**, **React 18**              |
| Language            | **TypeScript**                            |
| Styling             | **Tailwind CSS**, **Shadcn UI**           |
| State Management    | **TanStack Query** (React Query)          |
| Forms & Validation  | **React Hook Form**, **Zod**              |
| Charts              | **React Charts**                          |
| Testing             | **Jest**, **React Testing Library**       |
| Linting/Formatting  | **ESLint**, **Prettier**                  |

---

## 📁 Project Structure

```
src/
├── app/                   # Next.js 14 app directory
│   ├── (auth)/            # Auth routes (login, register, etc.)
│   ├── dashboard/         # Main dashboards (Student, HA, Dean)
│   └── layout.tsx         # Root layout component
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── forms/             # Form elements
│   ├── auth/              # Auth-related components
│   └── dashboard/         # Dashboard widgets
├── hooks/                 # Custom React hooks
├── lib/                   # API utilities & helpers
├── styles/                # Global styles
└── types/                 # Shared TypeScript types
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or yarn
- Git

### 📦 Installation

```bash
git clone https://github.com/yourusername/cims-frontend.git
cd cims-frontend
npm install
```

### ⚙️ Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
```

### ▶️ Start the Dev Server

```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🔧 Configuration

| Variable                        | Description                  | Required |
|---------------------------------|------------------------------|----------|
| `NEXT_PUBLIC_API_URL`          | Backend API base URL         | ✅       |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name         | ✅       |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`    | Cloudinary public API key     | ✅       |

---

## 📚 API Integration

This frontend communicates with a RESTful backend API for:

- 🔐 Authentication → `/api/auth/*`
- 👥 User Management → `/api/users/*`
- 🩺 Treatments & Diagnoses → `/api/treatments/*`
- 📈 Analytics Dashboard → `/api/analytics/*`

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests (if available)
npm run test:e2e
```

---

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Zod form validation
- ✅ RBAC authorization
- ✅ CSRF/XSS protection
- ✅ Secure headers (via Next.js middleware)

---

## 🎯 Future Roadmap

- [ ] Real-time WebSocket-based notifications
- [ ] AI-based health flagging
- [ ] Export reports (PDF/CSV)
- [ ] Multilingual support
- [ ] Telemedicine support
- [ ] Admin email alerts for critical events

---

## 👥 Contributing

Want to contribute? Awesome!

Check out our [Contributing Guide](CONTRIBUTING.md) for:
- PR conventions
- Branching strategy
- Code of conduct

---

## 📄 License

Licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- Everyone who helped shape this product ❤️

---

## 📞 Support

Having issues or feature requests?

> Please [open an issue](https://github.com/yourusername/cims-frontend/issues) or contact the dev team.

---

Made with 💙 by **Your Team Name**

---

Let me know if you’d like a version with deployment steps (e.g., Vercel/Netlify) or screenshots!