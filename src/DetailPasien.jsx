
import {useEffect, useEffectEvent, useState} from "react";
import {useParams} from "react-router-dom";
import {useLocalStorage} from "react-use";
import Profile from "./Profile.jsx";
import RiwayatAnamnesa from "./RiwayatAnamnesa.jsx";
import {getPatientDetail} from "./lib/api/Patient.js";
import {listAssesment} from "./lib/api/Assesment.js";

export default function DetailPasien() {
    const {patientId} = useParams()
    const [token, _] = useLocalStorage("token", "")
    const [patient, setPatient] = useState(null)
    const [riwayat, setRiwayat] = useState([])

    const fetchPatientDetail = useEffectEvent(async function getDetailPatient() {
        try {
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
                console.log(riwayatBody.data)
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
    }, [token, patientId])

    return (
        <section>
            <div className="mx-auto flex flex-col gap-6 xl:flex-row xl:items-start">
                <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
                    <Profile patient={patient ?? {}}/>
                    <RiwayatAnamnesa riwayat={riwayat}/>
                </div>
            </div>
        </section>
    )
}
