import {useEffect, useMemo, useState} from "react"
import {listService} from "../api/ServiceTypes.js"
import {normalizeServiceList} from "../utils/Normalization.js"

export default function useServiceOptions({token, logout}) {
    const [serviceOptions, setServiceOptions] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            return
        }

        let isMounted = true

        async function fetchServiceOptions() {
            setIsLoading(true)

            try {
                const response = await listService(token, {perPage: 100})
                const body = await response.json()

                if (response.status === 200) {
                    if (isMounted) {
                        setServiceOptions(normalizeServiceList(body))
                    }
                } else if (response.status === 401) {
                    logout()
                }
            } catch {
                if (isMounted) {
                    setServiceOptions([])
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchServiceOptions()

        return () => {
            isMounted = false
        }
    }, [token, logout])

    const activeServiceOptions = useMemo(
        () => serviceOptions.filter((item) => item.aktif == 1),
        [serviceOptions]
    )

    return {serviceOptions, activeServiceOptions, isLoading}
}