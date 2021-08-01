import React, { ReactNode, useLayoutEffect, useState, createContext, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import usePrevious from 'use-previous'

const ctx = createContext(() => {})

export default function Refreshable({ children, on }: { children?: ReactNode; on?: () => void }) {
    const counterRef = useRef(0)
    const counterFx = useRef(() => {
        counterRef.current++
        return () => {
            counterRef.current--
        }
    }).current

    const parentCounterFx = useContext(ctx)
    useLayoutEffect(parentCounterFx, [])

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
        if (counterRef.current === 0 && isRefreshRender) {
            setIsBlank(true)
            on?.()
        } else if (isBlank) {
            setIsBlank(false)
        }
    }, [isRefreshRender, isBlank])

    return <ctx.Provider value={counterFx}>{isBlank || children}</ctx.Provider>
}
