import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/auth.jsx'
import PromptToScript from './pages/generate.jsx'
import Toast from './components/toast.jsx'
import Error from './components/error.jsx'
import React, { useState, useEffect } from 'react';

const Home = () => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });



  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#E6EDF3] mb-4">CodeInit</h1>
        <p className="text-[#8B949E] mb-8">AI-powered project initializer</p>
        <div className="space-x-4">
          <a 
            href="/auth"
            className="bg-[#2F80ED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1E6FD9] transition-colors"
          >
            Get Started
          </a>
          <a 
            href="/generate" 
            className="bg-[#161B22] text-[#E6EDF3] px-6 py-3 rounded-lg font-medium border border-[#30363D] hover:bg-[#0D1117] transition-colors"
          >
            Generate Scripts
          </a>
        </div>
        <Toast show={toast.show} message={toast.message} type={toast.type} />
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <BrowserRouter>
      
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/generate' element={<PromptToScript />} />
          </Routes>
        
      </BrowserRouter>
    </>
  )
}

export default App
