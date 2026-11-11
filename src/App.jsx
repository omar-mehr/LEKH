import { useState, useEffect } from 'react'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import LoginForm from './components/LoginForm/LoginForm'
import AdminDashBoard from './components/AdminDashBoard/AdminDashBoard'
import RegisterFormStudent from './components/RegisterFormStudent/RegisterFormStudent'
import StudentDashboard from './components/StudentDashBoard/StudentDashBoard'
import CareTakerDashBoard from './components/CareTakerDashBoard/CareTakerDashBoard'

import './App.css'

function App() {
    const [token, setToken] = useState("")
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [page, setPage] = useState("login")


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
         <>
        <div className="header">
            <div className="theme-toggle-container">
                <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
        </div>


            <div>
                {page === "login" && (
                    <LoginForm
                        setToken={setToken}
                        setPage={setPage}
                    />
                )}

                {page === "register" && (
                     <RegisterFormStudent setPage={setPage} />
                )}

                {page === "AdminDashBoard" && (
                    <AdminDashBoard token={token} setToken={setToken}  setPage={setPage}/>
                )}
                {page === "StudentDashBoard" && (
                    <StudentDashboard token={token} setToken={setToken}  setPage={setPage}/>
                )}
                  {page === "CareTakerDashBoard" && (
                    <CareTakerDashBoard token={token} setToken={setToken}  setPage={setPage}/>
                )}
                
            </div>
            
       
    </>
    )
}

export default App