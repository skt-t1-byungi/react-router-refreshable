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
    const currCtxValue = useRef({
        isRefreshingRef,
        counterFx() {
            counterRef.current++
            return () => {
                counterRef.current--
            }
        },
    }).current

    const parentCtxValue = useContext(ctx)
    useLayoutEffect(parentCtxValue.counterFx, [])

    const curr = useLocation()
    const prev = usePrevious(curr)

    const isRefreshRender =
        counterRef.current === 0 &&
        prev &&
        prev.pathname === curr.pathname &&
        prev.search === curr.search &&
        prev.key !== curr.key

    if (isRefreshRender) {
        isRefreshingRef.current = true
    }
    // Parent hook runs later than child hook
    useEffect(() => {
        if (!isRefreshRender && isRefreshingRef.current) {
            isRefreshingRef.current = false
        }
    })

    const forceUpdate = useForceUpdate()
    const onRef = useRef(on)
    onRef.current = on

    useLayoutEffect(() => {
        if (isRefreshRender) {
            forceUpdate()
            onRef.current?.()
        }
    }, [isRefreshRender])

    return <ctx.Provider value={currCtxValue}>{isRefreshRender || children}</ctx.Provider>
}

export function useIsRefreshingRef() {
    return useContext(ctx).isRefreshingRef
}
