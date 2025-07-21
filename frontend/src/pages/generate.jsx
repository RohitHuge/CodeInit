import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../auth.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context.jsx';
import Toast from '../components/toast.jsx';
import Error from '../components/error.jsx';

// Dummy user data
const user = {
  name: 'Rohit Huge',
  avatar: 'https://ui-avatars.com/api/?name=Rohit+Huge&background=2F80ED&color=fff&size=128',
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    authService.logout();
    // showToastMessage('Logged out successfully!', 'success');
    Toast.show(true, 'Logged out successfully!', 'success');
    useAuth.setUser(username = '', email = '', user_id = '');
    navigate('/');
  };

  return (
    <header className="w-full bg-[#161B22] border-b border-[#30363D] py-3 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <div className="text-2xl font-bold text-[#2F80ED] tracking-tight select-none">
          CodeInit
        </div>
        <div className="relative" ref={menuRef}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] rounded-lg px-2 py-1"
            aria-label="User menu"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full border-2 border-[#2F80ED] shadow-sm"
            />
            <span className="text-[#E6EDF3] font-medium hidden sm:block">{user.name}</span>
            <svg className="w-4 h-4 text-[#8B949E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-44 bg-[#161B22] border border-[#30363D] rounded-lg shadow-lg py-2 z-50"
              >
                <div className="px-4 py-2 text-[#8B949E] text-xs">Signed in as</div>
                <div className="px-4 py-1 text-[#E6EDF3] font-medium truncate">{user.name}</div>
                <hr className="my-2 border-[#30363D]" />
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#22272e' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#E6EDF3] hover:bg-[#22272e] transition rounded-b-lg"
                >
                  Logout
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const PromptToScript = () => {
  const [prompt, setPrompt] = useState('');
  const [setupType, setSetupType] = useState('fullstack');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState(null);
  // const [showError, setShowError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // const [showToast, setShowToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState('');
  // const [toastType, setToastType] = useState('success');
  const [errors, setErrors] = useState({});
  const outputRef = useRef(null);

  // Generate unique UUID for script files
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const [scriptUUID] = useState(generateUUID());

  // const showToastMessage = (message, type = 'success') => {
  //   setToastMessage(message);
  //   setToastType(type);
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 3000);
  // };

  const validateForm = () => {
    const newErrors = {};
    
    if (!prompt.trim()) {
      newErrors.prompt = 'Please describe your project idea';
    } else if (prompt.trim().length < 10) {
      newErrors.prompt = 'Please provide a more detailed description (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateScripts = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate dummy scripts based on setup type
      const shellScript = setupType === 'fullstack' 
        ? `#!/bin/bash
# CodeInit Setup Script - MERN Stack
# Generated for: ${prompt.substring(0, 50)}...

echo "🚀 Initializing MERN stack project..."

# Create project directory
mkdir my-mern-app
cd my-mern-app

# Initialize backend
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon

# Create basic server structure
cat > server.js << 'EOF'
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res) => {
  res.json({ message: 'MERN API is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
EOF

# Initialize frontend
cd ..
npx create-react-app frontend
cd frontend
npm install axios react-router-dom

echo "✅ MERN stack project initialized successfully!"
echo "📁 Backend: ./backend"
echo "📁 Frontend: ./frontend"
echo "🚀 Run 'cd backend && npm start' to start the server"
echo "🚀 Run 'cd frontend && npm start' to start the client"`

        : `#!/bin/bash
# CodeInit Setup Script - Frontend Only
# Generated for: ${prompt.substring(0, 50)}...

echo "🚀 Initializing frontend project..."

# Create React app with TypeScript
npx create-react-app my-app --template typescript
cd my-app

# Install additional dependencies
npm install tailwindcss @headlessui/react @heroicons/react
npm install --save-dev @types/node

# Initialize Tailwind CSS
npx tailwindcss init -p

# Configure Tailwind
cat > tailwind.config.js << 'EOF'
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Update CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "✅ Frontend project initialized successfully!"
echo "🚀 Run 'npm start' to start the development server"`;

      const batchScript = setupType === 'fullstack'
        ? `@echo off
REM CodeInit Setup Script - MERN Stack (Windows)
REM Generated for: ${prompt.substring(0, 50)}...

echo 🚀 Initializing MERN stack project...

REM Create project directory
mkdir my-mern-app
cd my-mern-app

REM Initialize backend
mkdir backend
cd backend
call npm init -y
call npm install express mongoose cors dotenv bcryptjs jsonwebtoken
call npm install --save-dev nodemon

REM Create basic server structure
echo const express = require('express'); > server.js
echo const mongoose = require('mongoose'); >> server.js
echo const cors = require('cors'); >> server.js
echo require('dotenv').config(); >> server.js
echo. >> server.js
echo const app = express(); >> server.js
echo const PORT = process.env.PORT ^|^| 5000; >> server.js
echo. >> server.js
echo app.use(cors()); >> server.js
echo app.use(express.json()); >> server.js
echo. >> server.js
echo app.get('/', (req, res) =^> { >> server.js
echo   res.json({ message: 'MERN API is running!' }); >> server.js
echo }); >> server.js
echo. >> server.js
echo app.listen(PORT, () =^> { >> server.js
echo   console.log(\`Server running on port \${PORT}\`); >> server.js
echo }); >> server.js

REM Initialize frontend
cd ..
call npx create-react-app frontend
cd frontend
call npm install axios react-router-dom

echo ✅ MERN stack project initialized successfully!
echo 📁 Backend: ./backend
echo 📁 Frontend: ./frontend
echo 🚀 Run 'cd backend ^&^& npm start' to start the server
echo 🚀 Run 'cd frontend ^&^& npm start' to start the client`

        : `@echo off
REM CodeInit Setup Script - Frontend Only (Windows)
REM Generated for: ${prompt.substring(0, 50)}...

echo 🚀 Initializing frontend project...

REM Create React app with TypeScript
call npx create-react-app my-app --template typescript
cd my-app

REM Install additional dependencies
call npm install tailwindcss @headlessui/react @heroicons/react
call npm install --save-dev @types/node

REM Initialize Tailwind CSS
call npx tailwindcss init -p

echo ✅ Frontend project initialized successfully!
echo 🚀 Run 'npm start' to start the development server`;

      const curlCommand = `curl -s https://codeinit.com/scripts/${scriptUUID}.sh | bash`;

      setScripts({
        shell: shellScript,
        batch: batchScript,
        curl: curlCommand,
        uuid: scriptUUID
      });

      // showToastMessage('Scripts generated successfully!', 'success');
      Toast(true, 'Scripts generated successfully!', 'success');
      
      // Scroll to output section
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (error) {
      // setErrorMessage('Failed to generate scripts. Please try again.');
      // setShowError(true);
      Error(true, 'Failed to generate scripts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      // showToastMessage(`${type} copied to clipboard!`, 'success');
      Toast(true, `${type} copied to clipboard!`, 'success');
    } catch (error) {
      // showToastMessage('Failed to copy to clipboard', 'error');
      Error(true, 'Failed to copy to clipboard');
    }
  };

  const downloadScript = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // showToastMessage(`${filename} downloaded successfully!`, 'success');
    Toast(true, `${filename} downloaded successfully!`, 'success');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const outputVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };



  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Header />
      <div className="max-w-7xl mx-auto mt-10 px-4">
        {/* Toast Notification */}
        {/* <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                toastType === 'success' ? 'bg-[#28A745]' : 'bg-red-500'
              } text-white`}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Error Modal */}
        {/* <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
              onClick={() => setShowError(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#161B22] p-6 rounded-lg border border-[#30363D] max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-[#E6EDF3] text-lg font-bold mb-4">Error</h3>
                <p className="text-[#8B949E] mb-4">{errorMessage}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowError(false)}
                  className="w-full bg-[#2F80ED] text-white py-2 px-4 rounded-lg font-medium"
                >
                  Try Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Loading Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#161B22] p-8 rounded-lg border border-[#30363D] text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#2F80ED] border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-[#E6EDF3] text-xl font-bold mb-2">Generating Setup Scripts...</h3>
                <p className="text-[#8B949E]">Analyzing your project requirements</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Prompt Input */}
            <motion.div variants={cardVariants} className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">
                  Describe Your Project
                </h1>
                <p className="text-[#8B949E] text-lg">
                  Tell us what you want to build, and we'll generate the perfect setup scripts.
                </p>
              </div>

              <div className="space-y-6">
                {/* Project Description Input */}
                <div>
                  <label htmlFor="project-prompt" className="block text-[#E6EDF3] font-medium mb-2">
                    Project Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="project-prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Build a MERN stack app with chat functionality, user authentication, and real-time messaging..."
                      className={`w-full h-32 px-4 py-3 bg-[#0D1117] border rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all resize-none ${
                        errors.prompt ? 'border-red-500' : 'border-[#30363D]'
                      }`}
                    />
                    {errors.prompt && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.prompt}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Setup Type Selection */}
                <div>
                  <label className="block text-[#E6EDF3] font-medium mb-3">
                    Setup Type
                  </label>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSetupType('frontend')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        setupType === 'frontend'
                          ? 'bg-[#2F80ED] text-white'
                          : 'bg-[#0D1117] text-[#8B949E] border border-[#30363D] hover:text-[#E6EDF3]'
                      }`}
                    >
                      Frontend Only
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSetupType('fullstack')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        setupType === 'fullstack'
                          ? 'bg-[#2F80ED] text-white'
                          : 'bg-[#0D1117] text-[#8B949E] border border-[#30363D] hover:text-[#E6EDF3]'
                      }`}
                    >
                      Fullstack (MERN)
                    </motion.button>
                  </div>
                </div>

                {/* Generate Button */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={generateScripts}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-[#2F80ED] to-[#1E6FD9] text-white py-4 px-6 rounded-lg font-medium hover:from-[#1E6FD9] hover:to-[#1557B3] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Generating...
                    </div>
                  ) : (
                    'Generate Script'
                  )}
                </motion.button>

                <p className="text-[#8B949E] text-sm text-center">
                  Powered by AI. Scripts tailored based on your description.
                </p>
              </div>
            </motion.div>

            {/* Right Panel - Script Output */}
            <motion.div variants={cardVariants} className="space-y-6">
              <AnimatePresence>
                {scripts ? (
                  <motion.div
                    ref={outputRef}
                    variants={outputVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-[#E6EDF3] mb-2">
                        Generated Scripts
                      </h2>
                      <p className="text-[#8B949E]">
                        Download or copy these scripts to get started quickly.
                      </p>
                    </div>

                    {/* Shell Script */}
                    <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[#E6EDF3] font-medium">Shell Script</h3>
                        <span className="text-[#8B949E] text-sm">~2.5KB</span>
                      </div>
                      <div className="bg-[#161B22] rounded p-3 mb-3 overflow-x-auto">
                        <pre className="text-[#E6EDF3] text-sm">
                          <code>{scripts.shell.substring(0, 200)}...</code>
                        </pre>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => downloadScript(scripts.shell, `setup-${scripts.uuid}.sh`)}
                          className="flex-1 bg-[#2F80ED] text-white py-2 px-4 rounded font-medium hover:bg-[#1E6FD9] transition-colors"
                        >
                          Download
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => copyToClipboard(scripts.shell, 'Shell script')}
                          className="flex-1 bg-[#161B22] text-[#E6EDF3] py-2 px-4 rounded font-medium border border-[#30363D] hover:bg-[#0D1117] transition-colors"
                        >
                          Copy
                        </motion.button>
                      </div>
                    </div>

                    {/* Batch Script */}
                    <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[#E6EDF3] font-medium">Batch Script</h3>
                        <span className="text-[#8B949E] text-sm">~2.3KB</span>
                      </div>
                      <div className="bg-[#161B22] rounded p-3 mb-3 overflow-x-auto">
                        <pre className="text-[#E6EDF3] text-sm">
                          <code>{scripts.batch.substring(0, 200)}...</code>
                        </pre>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => downloadScript(scripts.batch, `setup-${scripts.uuid}.bat`)}
                          className="flex-1 bg-[#2F80ED] text-white py-2 px-4 rounded font-medium hover:bg-[#1E6FD9] transition-colors"
                        >
                          Download
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => copyToClipboard(scripts.batch, 'Batch script')}
                          className="flex-1 bg-[#161B22] text-[#E6EDF3] py-2 px-4 rounded font-medium border border-[#30363D] hover:bg-[#0D1117] transition-colors"
                        >
                          Copy
                        </motion.button>
                      </div>
                    </div>

                    {/* One-liner Command */}
                    <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[#E6EDF3] font-medium">Pasteable Link</h3>
                        <span className="text-[#8B949E] text-sm">~80B</span>
                      </div>
                      <div className="bg-[#161B22] rounded p-3 mb-3 overflow-x-auto">
                        <pre className="text-[#E6EDF3] text-sm">
                          <code>{scripts.curl}</code>
                        </pre>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => copyToClipboard(scripts.curl, 'One-liner command')}
                        className="w-full bg-[#161B22] text-[#E6EDF3] py-2 px-4 rounded font-medium border border-[#30363D] hover:bg-[#0D1117] transition-colors"
                      >
                        Copy Command
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-24 h-24 bg-[#161B22] rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-[#8B949E]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-[#E6EDF3] text-xl font-medium mb-2">Ready to Generate</h3>
                    <p className="text-[#8B949E] max-w-sm">
                      Describe your project idea and we'll generate custom setup scripts tailored to your needs.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PromptToScript;
