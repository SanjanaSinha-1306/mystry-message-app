# Mystery Message 🕵️‍♂️

A Full-stack anonymous feedback platform built with **Next.js**, **TypeScript**, and **MongoDB**. This application allows users to create public profiles where others can send them secret, anonymous messages. It features AI-integrated message suggestions and a robust user dashboard.

**Live Demo:**
 https://secret-message-app-v1.vercel.app

---

## 🚀 Features

* **Anonymous Messaging:** Users can send messages without creating an account.
* **User Dashboard:** Securely view, manage, and delete received messages.
* **AI Message Suggestions:** Integrated with Gemini AI to generate creative message prompts with a "Thinking" state and custom UI.
* **Message Toggle:** Users can choose when to accept or stop receiving new messages from their dashboard.
* **Secure Authentication:** Implemented using **NextAuth.js** with JWT strategy.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop views using **Tailwind CSS**.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn/UI, Lucide React.
* **Backend:** Next.js API Routes, Mongoose (MongoDB).
* **Authentication:** NextAuth.js.
* **AI Integration:** Google Gemini API (for message suggestions).
* **Validation:** Zod (for schema-based validation).
* **Deployment:** Vercel.

---

## 📁 Project Structure

The project follows a modern Next.js folder structure, optimized for scalability:

```text
/src
  /app
    /api           # API Routes (auth, messages, AI suggestions)
    /(app)         # Main application routes (Dashboard)
    /(auth)        # Authentication routes (Sign-in, Sign-up)
    /u/[username]  # Public profile pages for sending messages
  /components      # Reusable UI components (MessageCard, Navbar, etc.)
  /lib             # Database connection and utility functions
  /model           # Mongoose schemas and models
  /schemas         # Zod validation schemas
  /types           # TypeScript interfaces and API responses