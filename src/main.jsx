import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import {BrowserRouter, Route, Router, RouterProvider, Routes} from 'react-router-dom'
import Dashboard from "./Dashboard.jsx"
import Reservasi from "./Reservasi.jsx"
import Jadwal from "./Jadwal.jsx"
import Pasien from "./Pasien.jsx"
import Pengguna from "./Pengguna.jsx"
import Table from "./Table.jsx"
import ReservasiBaru from "./ReservasiBaru.jsx"
import {Toaster} from "react-hot-toast"
import AuthProvider from "./AuthProvider.jsx"
import HasilReservasi from "./HasilReservasi.jsx"
import AntrianKunjungan from "./AntrianKunjungan.jsx"
import Profile from "./Profile.jsx"
import Pemeriksaan from "./Pemeriksaan.jsx"
import RencanaKunjunganUlang from "./RencanaKunjunganUlang.jsx"
import RiwayatAnamnesa from "./RiwayatAnamnesa.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <Toaster position="top-center"/>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/' element={<Dashboard/>}>
                        <Route path='table' element={<Table/>}/>
                        <Route path='reservation' element={<AntrianKunjungan/>}/>
                        <Route path='schedules' element={<Jadwal/>}/>
                        <Route path='patients' element={<Pasien/>}/>
                        <Route path='users' element={<Pengguna/>}/>
                        <Route path='profile' element={<Profile/>}/>
                        <Route path='reservation/new' element={<ReservasiBaru/>}/>
                        <Route path='reservation/confirm' element={<HasilReservasi/>}/>
                        <Route path='pemeriksaan' element={<Pemeriksaan/>}/>
                        <Route path='reservation/revisit' element={<RencanaKunjunganUlang/>}/>
                        <Route path='riwayat-anamnesa' element={<RiwayatAnamnesa/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)
