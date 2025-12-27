import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import MainApp from './pages/MainApp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/start" element={<Onboarding />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  )
}

export default App
