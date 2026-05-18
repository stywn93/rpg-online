import Assessment from "./Assessment.jsx"
import AnamnesaHistory from "./AnamnesaHistory.jsx"
import PatientProfile from "../patients/PatientProfile.jsx"
import {useAssessmentPatient} from "../lib/hooks/CustomHooks.js"


export default function AssesmentLayout() {

    const {patient, loading} = useAssessmentPatient()

    if (loading) return <div>Loading...</div>
    // console.log(patient)

    return (
        <section>
            <div className="mx-auto flex flex-col gap-6 xl:flex-row xl:items-start">

                <div className="w-full xl:w-fit xl:max-w-md xl:flex-none xl:shrink-0">
                    <Assessment patient={patient}/>
                </div>
                <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
                    <PatientProfile patient={patient}/>
                    <AnamnesaHistory patient={patient}/>
                </div>
            </div>
        </section>
    )
}
