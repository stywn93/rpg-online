import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from "./Dashboard.jsx"
import Patients from "./patients/Patients.jsx"
import CreateReservation from "./reservations/CreateReservation.jsx"
import {Toaster} from "react-hot-toast"
import AuthProvider from "./auth/AuthProvider.jsx"
import ConfirmedReservation from "./reservations/ConfirmedReservation.jsx"
import ReservationList from "./reservations/ReservationList.jsx"
import Revisit from "./reservations/Revisit.jsx"
import PatientRegistration from "./patients/PatientRegistration.jsx"
import PatientDetails from "./patients/PatientDetails.jsx"
import PatientEdit from "./patients/PatientEdit.jsx"
import AssesmentLayout from "./assessments/AssesmentLayout.jsx"
import Users from "./users/Users.jsx"
import UserDetails from "./users/UserDetails.jsx"
import UserRegistration from "./users/UserRegistration.jsx"
import UserEdit from "./users/UserEdit.jsx"
import ServiceList from "./services/ServiceList.jsx"
import ServiceForm from "./services/ServiceForm.jsx"

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
                            <Route index element={<ReservationList/>}/>
                            <Route path='new' element={<CreateReservation/>}/>
                            <Route path='confirm' element={<ConfirmedReservation/>}/>
                            <Route path='revisit' element={<Revisit/>}/>
                            <Route path="assesment/:id" element={<AssesmentLayout/>}/>
                        </Route>
                        <Route path={"patients"}>
                            <Route index element={<Patients/>}/>
                            <Route path={"registration"} element={<PatientRegistration/>}></Route>
                            <Route path={":patientId"} element={<PatientDetails/>}/>
                            <Route path={":patientId/edit"} element={<PatientEdit/>}/>
                        </Route>
                        <Route path={"users"}>
                            <Route index element={<Users/>}/>
                            <Route path={":userID"} element={<UserDetails/>}/>
                            <Route path={"registration"} element={<UserRegistration/>}/>
                            <Route path={":patientId/edit"} element={<UserEdit/>}/>
                        </Route>
                        <Route path={"services"}>
                            <Route index element={<ServiceList/>}/>
                            <Route path={"create"} element={<ServiceForm/>}/>
                            <Route path={":id/edit"} element={<ServiceForm/>}/>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)