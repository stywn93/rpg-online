import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom'
import Dashboard from "./Dashboard.jsx"
import Reservasi from "./Reservasi.jsx"
import Jadwal from "./Jadwal.jsx"
import Pasien from "./Pasien.jsx"
import Pengguna from "./Pengguna.jsx"
import Table from "./Table.jsx"
import ReservasiBaru from "./ReservasiBaru.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/' element={<Dashboard/>}>
                    <Route path='table' element={<Table />}/>
                    <Route path='reservation' element={<Reservasi />}/>
                    <Route path='schedules' element={<Jadwal />}/>
                    <Route path='patients' element={<Pasien/>}/>
                    <Route path='users' element={<Pengguna/>}/>
                    <Route path='reservation/new' element={<ReservasiBaru/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)