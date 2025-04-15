Absolutely! Here's a clean and professional `CONTRIBUTING.md` file for your **College Infirmary Management System (CIMS) - Frontend** project:

---

# 🛠️ Contributing to College Infirmary Management System (CIMS) - Frontend

Thank you for considering contributing to **CIMS Frontend**! We welcome all kinds of contributions — code, documentation, bug reports, ideas, and design feedback. This guide will help you get started.

---

## 📋 Table of Contents

- [📦 Getting Started](#-getting-started)
- [🌱 How to Contribute](#-how-to-contribute)
- [🔧 Code Standards](#-code-standards)
- [✅ Commit Guidelines](#-commit-guidelines)
- [🧪 Running Tests](#-running-tests)
- [🚀 Submitting a Pull Request](#-submitting-a-pull-request)
- [🙌 Code of Conduct](#-code-of-conduct)

---

## 📦 Getting Started

1. **Fork the repo**
2. Clone your fork locally:
   ```bash
   git clone git@github.com:Pralad02210217/E-Health-Frontend.git
   cd cims-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file and configure it as per the [README.md](./README.md).

5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌱 How to Contribute

There are many ways to contribute:

- 🐛 Report bugs
- ✨ Suggest new features or UI improvements
- 📝 Improve documentation
- 💻 Submit pull requests for issues
- 🎨 Refactor code and improve performance

---

## 🔧 Code Standards

We follow best practices for clean, readable, and scalable code.

- Use **TypeScript** consistently.
- Use **Zod** for all validation schemas.
- Use **React Hook Form** for forms.
- Format code using **Prettier** and lint with **ESLint**.
- Follow **accessibility (a11y)** standards for UI components.

### File Naming

- Component: `PascalCase.tsx`
- Hook: `useSomething.ts`
- API: `api.ts` or `something.api.ts`
- Schema: `schema.ts` or `something.schema.ts`

---

## ✅ Commit Guidelines

We use semantic commit messages:

| Type     | Description                        |
|----------|------------------------------------|
| `feat:`  | A new feature                      |
| `fix:`   | A bug fix                          |
| `docs:`  | Documentation only changes         |
| `style:` | Formatting, missing semi colons…   |
| `refactor:` | Code refactoring                |
| `test:`  | Adding missing tests               |
| `chore:` | Maintenance work (configs, deps)   |

Example:
```bash
git commit -m "feat: add illness category creation form"
```

---

## 🧪 Running Tests



Please add/update relevant tests if you're submitting a new feature or bug fix.

---

## 🚀 Submitting a Pull Request

1. Create a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes.

3. Ensure your code is formatted:
   ```bash
   npm run lint
   npm run format
   ```

4. Push your branch:
   ```bash
   git push origin feat/your-feature-name
   ```

5. Create a Pull Request from GitHub UI.

✅ Make sure your PR:
- References related issue(s) if any
- Passes all CI/CD checks
- Includes clear description and screenshots (if UI-related)

---

## 🙌 Code of Conduct

We are committed to a **harassment-free**, **inclusive**, and **collaborative** environment for everyone. 

---

## 🙏 Thank You

Thanks for taking the time to contribute! You make this project better 💙

---