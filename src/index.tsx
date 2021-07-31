import React, { ReactNode, useLayoutEffect, useState, createContext, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import usePrevious from 'use-previous'

const ctx = createContext(() => {})

export default function Refreshable({ children, on }: { children?: ReactNode; on?: () => void }) {
    const countRef = useRef(0)
    const currGatherer = useRef(() => {
        countRef.current++
        return () => countRef.current--
    }).current

    const parentGatherer = useContext(ctx)
    useLayoutEffect(parentGatherer, [])

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
        if (countRef.current === 0 && isRefreshRender) {
            setIsBlank(true)
            on?.()
        } else if (isBlank) {
            setIsBlank(false)
        }
    }, [isRefreshRender, isBlank])

    return <ctx.Provider value={currGatherer}>{isBlank || children}</ctx.Provider>
}
