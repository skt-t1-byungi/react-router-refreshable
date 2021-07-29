import { ReactNode, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import usePrevious from 'use-previous'

export default function Refreshable({ children }: { children: ReactNode }) {
    const curr = useLocation()
    const prev = usePrevious(curr)
    const [isBlank, setIsBlank] = useState(false)

    const isRefreshRender =
        prev &&
        prev.pathname === curr.pathname &&
        prev.search === curr.search &&
        prev.state === curr.state &&
        prev.key !== curr.key

    useLayoutEffect(() => {
        if (isRefreshRender) {
            setIsBlank(true)
        } else if (isBlank) {
            setIsBlank(false)
        }
    }, [isRefreshRender, isBlank])

    return isBlank || children
}
