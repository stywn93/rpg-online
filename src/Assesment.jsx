import Pemeriksaan from "./Pemeriksaan.jsx"
import RiwayatAnamnesa from "./RiwayatAnamnesa.jsx"
import Profile from "./Profile.jsx"
import {useAssessmentPatient} from "./lib/hooks/CustomHooks.js"


export default function Assesment() {

    const {patient, loading} = useAssessmentPatient()

    if (loading) return <div>Loading...</div>
    // console.log(patient)

    return (
        <section>
            <div className="mx-auto flex flex-col gap-6 xl:flex-row xl:items-start">

                <div className="w-full xl:w-fit xl:max-w-md xl:flex-none xl:shrink-0">
                    <Pemeriksaan patient={patient}/>
                </div>
                <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
                    <Profile patient={patient}/>
                    <RiwayatAnamnesa patient={patient}/>
                </div>
            </div>
        </section>
    )
}
