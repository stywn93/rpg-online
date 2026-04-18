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
import ReservasiBaru from "./ReservasiBaru.jsx"
import {Toaster} from "react-hot-toast"
import AuthProvider from "./AuthProvider.jsx"
import HasilReservasi from "./HasilReservasi.jsx"
import AntrianKunjungan from "./AntrianKunjungan.jsx"
import Profile from "./Profile.jsx"
import Pemeriksaan from "./Pemeriksaan.jsx"
import RencanaKunjunganUlang from "./RencanaKunjunganUlang.jsx"
import RiwayatAnamnesa from "./RiwayatAnamnesa.jsx";
import Pendaftaran from "./Pendaftaran.jsx"
import DetailPasien from "./DetailPasien.jsx"
import UbahPasien from "./UbahPasien.jsx"
import Assesment from "./Assesment.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <Toaster position="top-center"/>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/' element={<Dashboard/>}>

                        <Route path='reservation'>
                            <Route index element={<AntrianKunjungan/>}/>
                            <Route path='new' element={<ReservasiBaru/>}/>
                            <Route path='confirm' element={<HasilReservasi/>}/>
                            <Route path='revisit' element={<RencanaKunjunganUlang/>}/>
                            <Route path="assesment" element={<Assesment/>}/>
                        </Route>
                        <Route path={"patients"}>
                            <Route index element={<Pasien/>}/>
                            <Route path={"registration"} element={<Pendaftaran/>}></Route>
                            <Route path={":patientId"} element={<DetailPasien/>}/>
                            <Route path={":patientId/edit"} element={<UbahPasien/>}/>
                        </Route>
                        <Route path={"service"}>
                            <Route index element={<Jadwal/>}/>

                        </Route>
                        <Route path='users' element={<Pengguna/>}/>
                        <Route path='profile' element={<Profile/>}/>

                        <Route path='riwayat-anamnesa' element={<RiwayatAnamnesa/>}/>

                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)
