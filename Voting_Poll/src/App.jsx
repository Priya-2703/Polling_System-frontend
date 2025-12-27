import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import UserData from './Pages/UserDetails'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<UserData />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App