import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/auth.jsx'

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#E6EDF3] mb-4">CodeInit</h1>
        <p className="text-[#8B949E] mb-8">AI-powered project initializer</p>
        <a 
          href="/auth" 
          className="bg-[#2F80ED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1E6FD9] transition-colors"
        >
          Get Started
        </a>
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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
