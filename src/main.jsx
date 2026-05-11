import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from "./Dashboard.jsx"
import Pasien from "./Pasien.jsx"
import ReservasiBaru from "./ReservasiBaru.jsx"
import {Toaster} from "react-hot-toast"
import AuthProvider from "./AuthProvider.jsx"
import HasilReservasi from "./HasilReservasi.jsx"
import AntrianKunjungan from "./AntrianKunjungan.jsx"
import RencanaKunjunganUlang from "./RencanaKunjunganUlang.jsx"
import Pendaftaran from "./Pendaftaran.jsx"
import DetailPasien from "./DetailPasien.jsx"
import UbahPasien from "./UbahPasien.jsx"
import Assesment from "./Assesment.jsx"
import Parents from "./Parents.jsx"
import DetailUser from "./DetailUser.jsx";

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
                            <Route path="assesment/:id" element={<Assesment/>}/>
                        </Route>
                        <Route path={"patients"}>
                            <Route index element={<Pasien/>}/>
                            <Route path={"registration"} element={<Pendaftaran/>}></Route>
                            <Route path={":patientId"} element={<DetailPasien/>}/>
                            <Route path={":patientId/edit"} element={<UbahPasien/>}/>
                        </Route>
                        <Route path={"users"}>
                            <Route index element={<Parents/>}/>
                            <Route path={"registration"} element={<Pendaftaran/>}></Route>
                            <Route path={":userID"} element={<DetailUser/>}/>
                            <Route path={":patientId/edit"} element={<UbahPasien/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)
