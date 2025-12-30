import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import UserData from './Pages/UserDetails'
import Vote from './Pages/Vote'
import QnA from './Pages/QnA'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<UserData />} />
          <Route path="/vote" element={<Vote/>} />
          <Route path="/survey" element={<QnA />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App