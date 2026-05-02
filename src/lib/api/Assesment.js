import { apiBaseUrl } from "./baseUrl"

export const insertAssesent = async (token, {patient_id, weight, height, nutrition_status, visitDate, condition, remark}) => {
    return await fetch(`${apiBaseUrl}/growthrecords`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            patient_id, weight, height, nutrition_status, visitDate, condition, remark
        })
    })
}
