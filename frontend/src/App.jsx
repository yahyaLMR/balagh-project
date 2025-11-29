
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NewComplaint from '../pages/NewComplaint';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ManageComplaints from '../pages/ManageComplaints';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (

    <>
    <BrowserRouter> 
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/newComplaint' element={<NewComplaint />} />
          <Route path='/login' element={<Login/>} />
          <Route 
            path='/manage-complaints' 
            element={
              <ProtectedRoute>
                <ManageComplaints />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App
