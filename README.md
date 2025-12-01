# NextRibe - Modern Community Discussion Platform

NextRibe is a feature-rich community discussion platform built with Next.js, TypeScript, and MongoDB. It provides a modern, responsive interface for users to create communities, participate in discussions, and engage with content through voting and commenting.

## 🚀 Features

- **User Authentication**
  - Secure JWT-based authentication
  - Email/Password registration and login
  - Protected routes and API endpoints

- **Communities**
  - Create and join communities
  - Public and private community options
  - Community-specific discussions and content

- **Discussions & Replies**
  - Create and participate in threaded discussions
  - Rich text formatting support
  - Upvote/downvote system
  - Real-time updates

- **User Profiles**
  - Personalized user profiles
  - Activity tracking
  - Community memberships

- **Responsive Design**
  - Mobile-first approach
  - Dark mode support
  - Accessible UI components

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)
  - React Hook Form
  <!-- - Zod (Schema Validation) -->

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - JWT Authentication
  - Server Actions

- **Development Tools**
  - ESLint
  - Prettier
  - TypeScript
  - Husky (Git Hooks)

## 🏗️ Project Structure

```
src/
├── app/                  # App router pages
│   ├── (auth)/           # Authentication routes
│   ├── (shell)/          # Main application layout
│   └── api/              # API routes
├── components/           # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── community/        # Community-related components
│   └── discussions/      # Discussion components
├── core/                 # Core application logic
│   ├── config/           # App configuration
│   ├── constants/        # App-wide constants
│   └── types/            # TypeScript type definitions
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication helpers
│   └── axios.ts          # API client configuration
└── store/                # State management
    ├── useUserStore.ts   # User state management
    └── useDiscussionStore.ts # Discussions state
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB instance
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/nextribe.git
   cd nextribe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

5. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Documentation

### API Endpoints

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `GET /api/communities` - List all communities
- `POST /api/communities` - Create a new community
- `GET /api/discussions` - List all discussions
- `POST /api/discussions` - Create a new discussion

### State Management

The application uses Zustand for state management with two main stores:

1. **useUserStore** - Manages user authentication and profile data
2. **useDiscussionStore** - Handles discussions and community data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework for Production
- [MongoDB](https://www.mongodb.com) - The database for modern applications
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management made simple

