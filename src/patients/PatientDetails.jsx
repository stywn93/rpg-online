import {useEffect, useEffectEvent, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useLocalStorage} from "react-use";
import PatientProfile from "./PatientProfile.jsx";
import AnamnesaHistory from "../assessments/AnamnesaHistory.jsx";
import {getPatientDetail, listPatientsByParent} from "../lib/api/Patient.js";
import {listAssesment} from "../lib/api/Assesment.js";
import useAuth from "../auth/UseAuth.js";
import {isUser} from "../auth/permissions.js";

export default function PatientDetails() {
    const {patientId} = useParams()
    const navigate = useNavigate()
    const [token, _] = useLocalStorage("token", "")
    const {user} = useAuth()
    const [patient, setPatient] = useState(null)
    const [riwayat, setRiwayat] = useState([])

    const fetchPatientDetail = useEffectEvent(async function getDetailPatient() {
        try {
            if (isUser(user)) {
                const childrenResponse = await listPatientsByParent(token, user.id)
                const childrenBody = await childrenResponse.json()
                const children = childrenBody?.data ?? childrenBody ?? []

                const isOwnChild = children.some(
                    (child) => String(child.id ?? child.patient_id) === String(patientId)
                )

                if (!isOwnChild) {
                    navigate("/patients", { replace: true })
                    return
                }
            }

            const [patientResponse, riwayatResponse] = await Promise.all([
                getPatientDetail(token, patientId),
                listAssesment(token, patientId),
            ])

            const patientBody = await patientResponse.json()
            const riwayatBody = await riwayatResponse.json()

            if (patientResponse.ok) {
                setPatient(patientBody.data)
            }

            if (riwayatResponse.ok) {
                setRiwayat(riwayatBody.data ?? [])
            }
        } catch (e) {
            console.error(e)
        }
    })

    useEffect(() => {
        if (!token || !patientId) {
            return
        }

        fetchPatientDetail()
    }, [token, patientId, user?.id])

    return (
        <section>
            <div className="mx-auto flex flex-col gap-6 xl:flex-row xl:items-start">
                <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
                    <PatientProfile patient={patient ?? {}}/>
                    <AnamnesaHistory riwayat={riwayat}/>
                </div>
            </div>
        </section>
    )
}
