import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)