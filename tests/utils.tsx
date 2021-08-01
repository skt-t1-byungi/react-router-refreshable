import React, { useEffect, useRef, PropsWithChildren } from 'react'
import { Router, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'

export function createWrapper({ path = '/' } = {}) {
    const history = createMemoryHistory({ initialEntries: [path] })
    function Wrapper({ children }: PropsWithChildren<{}>) {
        return (
            <Router history={history}>
                <Route path={path}>{children}</Route>
            </Router>
        )
    }
    return { Wrapper, history }
}

export function Lifecycle({
    tracker,
    children,
    onMount,
    onUpdate,
    onUnmount,
}: PropsWithChildren<{
    tracker: (event: string) => void
    onMount?: () => void
    onUpdate?: () => void
    onUnmount?: () => void
}>) {
    const mountedRef = useRef(false)
    const trackerRef = useRef(tracker)
    trackerRef.current = tracker
    useEffect(() => {
        if (mountedRef.current) {
            trackerRef.current('update')
            onUpdate?.()
        }
    })
    useEffect(() => {
        mountedRef.current = true
        trackerRef.current('mount')
        onMount?.()
        return () => {
            trackerRef.current('unmount')
            onUnmount?.()
        }
    }, [])
    return <>{children}</>
}

export function expectLifecycleTrack(tracker: jest.Mock, inputs: Array<'mount' | 'unmount' | 'update'>) {
    expect(tracker).toBeCalledTimes(inputs.length)
    inputs.forEach((input, idx) => expect(tracker).toHaveBeenNthCalledWith(idx + 1, input))
}
