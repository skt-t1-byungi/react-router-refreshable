import React, { PropsWithChildren, useLayoutEffect, useEffect, createContext, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import usePrevious from 'use-previous'
import useForceUpdate from 'use-force-update'

const ctx = createContext({
    isRefreshingRef: { current: false },
    counterFx() {},
})

export default function Refreshable({ children, on }: PropsWithChildren<{ on?: () => void }>) {
    const counterRef = useRef(0)

    const isRefreshingRef = useRef(false)
    const currCtxRef = useRef({
        isRefreshingRef,
        counterFx() {
            counterRef.current++
            return () => {
                counterRef.current--
            }
        },
    }).current

    const parentCtx = useContext(ctx)
    useLayoutEffect(parentCtx.counterFx, [])

    const curr = useLocation()
    const prev = usePrevious(curr)

    const isRefreshRender =
        counterRef.current === 0 &&
        prev &&
        prev.pathname === curr.pathname &&
        prev.search === curr.search &&
        prev.state === curr.state &&
        prev.key !== curr.key

    if (isRefreshRender) {
        isRefreshingRef.current = true
    }
    useEffect(() => {
        if (!isRefreshRender && isRefreshingRef.current) {
            isRefreshingRef.current = false
        }
    })

    const forceUpdate = useForceUpdate()
    const listenerRef = useRef(on)
    listenerRef.current = on

    useLayoutEffect(() => {
        if (isRefreshRender) {
            forceUpdate()
            listenerRef.current?.()
        }
    }, [isRefreshRender])

    return <ctx.Provider value={currCtxRef}>{isRefreshRender || children}</ctx.Provider>
}

export function useIsRefreshingRef() {
    return useContext(ctx).isRefreshingRef
}
