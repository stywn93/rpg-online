import {Link, useParams} from "react-router-dom";
import {useLocalStorage} from "react-use";
import useAuth from "../auth/UseAuth.js";
import usePatientDetail from "../lib/hooks/usePatientDetail.js";
import PatientProfile from "./PatientProfile.jsx";
import VisitHistory from "./VisitHistory.jsx";

export default function PatientDetails() {
    const {patientId} = useParams()
    const [token] = useLocalStorage("token", "")
    const {logout} = useAuth()

    const {patient, visits, isLoading, error} = usePatientDetail({token, patientId, logout})

    return (
        <section>
            <div className="mx-auto flex flex-col gap-6 xl:flex-row xl:items-start">
                <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
                    {patient && (
                        <div className="flex justify-end">
                            <Link to={`/patients/${patientId}/edit`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                Edit Data Pasien
                            </Link>
                        </div>
                    )}
                    <PatientProfile patient={patient}/>
                    <VisitHistory visits={visits} isLoading={isLoading} error={error}/>
                </div>
            </div>
        </section>
    )
}