import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService } from '../auth.js';
import { useNavigate } from 'react-router-dom';
import Error from '../components/error.jsx';
import Toast from '../components/toast.jsx';

const AuthPage = () => {
  const authService = new AuthService();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [error, setError] = useState({ show: false, message: '' });
  // const [showError, setShowError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  // const [showToast, setShowToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState('');
  // const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  // Single form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Validation states
  const [errors, setErrors] = useState({});

  const validateForm = (isLoginMode) => {
    const newErrors = {};

    if (isLoginMode) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    // setToast({ show: true, message: 'Logging in...', type: 'success' });
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    try {
      const response = await authService.login({email: formData.email, password: formData.password}); 
      setToast({ show: true, message: 'Logged in successfully!', type: 'success' });
      console.log(response);
      // showToastMessage('Logged in successfully!', 'success');
      navigate('/generate');
    } catch (error) {
      // setErrorMessage(error.message);
      // setShowError(true);
      setError({ show: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setIsLoading(true);
    try {
        const response = await authService.createAccount({email: formData.email, name: formData.name, password: formData.password}); 
        console.log(response);
        // showToastMessage('Account created successfully!', 'success');
        setToast({ show: true, message: 'Account created successfully!', type: 'success' });
        navigate('/generate');

    } catch (error) {
      // setErrorMessage(error.message);
      // setShowError(true);
      setError({ show: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // const showToastMessage = (message, type = 'success') => {
  //   // setToastMessage(message);
  //   // setToastType(type);
  //   // setShowToast(true);
  //   // setTimeout(() => setShowToast(false), 3000);
  //   Toast.show(true, message, type);
  // };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    // Reset form data when switching modes
    setFormData({
      name: '',
      email: '',
      password: ''
    });
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

  const overlayVariants = {
    login: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    signup: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const formVariants = {
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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
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
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto"
      >
                      <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => authService.logout()}
                className="w-full bg-[#2F80ED] text-white py-2 px-4 rounded-lg font-medium"
              >
                Logout Test
              </motion.button>
        {/* Card Container */}
        <div className="relative overflow-hidden bg-[#161B22] rounded-2xl border border-[#30363D] shadow-2xl">
          <div className="flex relative">
            {/* Login Form */}
            <div className="w-1/2 p-8 md:p-12">
              <motion.div variants={formVariants}>
                <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Welcome Back</h2>
                <p className="text-[#8B949E] mb-8">Sign in to your CodeInit account</p>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="login-email" className="block text-[#E6EDF3] font-medium mb-2">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#0D1117] border rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all ${
                        errors.email ? 'border-red-500' : 'border-[#30363D]'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-[#E6EDF3] font-medium mb-2">
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#0D1117] border rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all ${
                        errors.password ? 'border-red-500' : 'border-[#30363D]'
                      }`}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2F80ED] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1E6FD9] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                      />
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-[#8B949E]">
                    Don't have an account?{' '}
                    <button
                      onClick={toggleMode}
                      className="text-[#2F80ED] hover:text-[#1E6FD9] font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Signup Form */}
            <div className="w-1/2 p-8 md:p-12">
              <motion.div variants={formVariants}>
                <h2 className="text-3xl font-bold text-[#E6EDF3] mb-2">Create Account</h2>
                <p className="text-[#8B949E] mb-8">Join CodeInit and start building</p>

                <form onSubmit={handleSignup} className="space-y-6">
                  <div>
                    <label htmlFor="signup-name" className="block text-[#E6EDF3] font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#0D1117] border rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all ${
                        errors.name ? 'border-red-500' : 'border-[#30363D]'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="block text-[#E6EDF3] font-medium mb-2">
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#0D1117] border rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all ${
                        errors.email ? 'border-red-500' : 'border-[#30363D]'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block text-[#E6EDF3] font-medium mb-2">
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 bg-[#0D1117] border rounded-lg text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all ${
                        errors.password ? 'border-red-500' : 'border-[#30363D]'
                      }`}
                      placeholder="Create a password"
                    />
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2F80ED] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1E6FD9] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                      />
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-[#8B949E]">
                    Already have an account?{' '}
                    <button
                      onClick={toggleMode}
                      className="text-[#2F80ED] hover:text-[#1E6FD9] font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Overlay Panel */}
            <motion.div
              variants={overlayVariants}
              animate={isLogin ? "login" : "signup"}
              className="absolute top-0 w-1/2 h-full bg-gradient-to-br from-[#2F80ED] to-[#1E6FD9] flex items-center justify-center"
            >
              <div className="text-center text-white p-8 md:p-12">
                <div className="mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
                
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <motion.div
                      key="signup-text"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold mb-4">Start Building</h3>
                      <p className="text-lg opacity-90 mb-6">
                        Join thousands of developers creating amazing projects
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm opacity-80">Instant project setup</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm opacity-80">Modern tech stack support</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm opacity-80">Team collaboration tools</span>
                        </div>
                      </div>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={toggleMode}
                        className="mt-8 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#2F80ED] transition-all"
                      >
                        Sign Up
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login-text"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold mb-4">Welcome Back!</h3>
                      <p className="text-lg opacity-90 mb-6">
                        Sign in to continue your coding journey with CodeInit
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm opacity-80">AI-powered project initialization</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm opacity-80">Smart code generation</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm opacity-80">Collaborative development</span>
                        </div>
                      </div>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={toggleMode}
                        className="mt-8 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#2F80ED] transition-all"
                      >
                        Sign In
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      <Error show={error.show} message={error.message} />
    </div>
  );
};

export default AuthPage;
