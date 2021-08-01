import React, { useEffect, useRef, PropsWithChildren } from 'react'
import { Router, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import Refreshable from '../src/index'

test('no refreshable, no remount', () => {
    const track = jest.fn()
    const { Wrapper, history } = createWrapper()
    render(
        <Wrapper>
            <Lifecycle tracker={track} />
        </Wrapper>
    )
    act(() => history.push('/'))
    expectLifecycleTrack(track, ['mount'])
})

test('use refreshable to remount', () => {
    const track = jest.fn()
    const { Wrapper, history } = createWrapper()
    render(
        <Wrapper>
            <Refreshable>
                <Lifecycle tracker={track} />
            </Refreshable>
        </Wrapper>
    )
    act(() => history.push('/'))
    expectLifecycleTrack(track, ['mount', 'unmount', 'mount'])
})

test('if have a child refreshable, parent refreshable is paused', () => {
    const track1 = jest.fn()
    const track2 = jest.fn()
    const { Wrapper, history } = createWrapper()
    const { rerender } = render(
        <Wrapper>
            <Refreshable>
                <Lifecycle tracker={track1}>
                    <Refreshable>
                        <Lifecycle tracker={track2} />
                    </Refreshable>
                </Lifecycle>
            </Refreshable>
        </Wrapper>
    )
    act(() => history.push('/'))
    expectLifecycleTrack(track1, ['mount'])
    expectLifecycleTrack(track2, ['mount', 'unmount', 'mount'])

    const track3 = jest.fn()
    rerender(
        <Wrapper>
            <Refreshable>
                <Lifecycle tracker={track3} />
            </Refreshable>
        </Wrapper>
    )
    expectLifecycleTrack(track3, ['update'])
    act(() => history.push('/'))
    expectLifecycleTrack(track3, ['update', 'unmount', 'mount'])
})

function expectLifecycleTrack(tracker: jest.Mock, inputs: Array<'mount' | 'unmount' | 'update'>) {
    expect(tracker).toBeCalledTimes(inputs.length)
    inputs.forEach((input, idx) => expect(tracker).toHaveBeenNthCalledWith(idx + 1, input))
}

function createWrapper({ path = '/' } = {}) {
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

function Lifecycle({ tracker, children }: PropsWithChildren<{ tracker: (event: string) => void }>) {
    const mountedRef = useRef(false)
    const trackerRef = useRef(tracker)
    trackerRef.current = tracker
    useEffect(() => {
        if (mountedRef.current) trackerRef.current('update')
    })
    useEffect(() => {
        mountedRef.current = true
        trackerRef.current('mount')
        return () => trackerRef.current('unmount')
    }, [])
    return <>{children}</>
}
