import React from 'react'
import { render, act } from '@testing-library/react'
import { createWrapper, expectLifecycleTrack, Lifecycle } from './utils'
import { Refreshable, useIsRefreshingRef } from '../src/index'

test('isRefreshing', () => {
    const track = jest.fn()
    const values = [] as boolean[]

    function Test() {
        const isRefreshingRef = useIsRefreshingRef()
        function push() {
            values.push(isRefreshingRef.current)
        }
        return <Lifecycle tracker={track} onMount={push} onUpdate={push} onUnmount={push} />
    }

    const { Wrapper, history } = createWrapper({ path: '/home' })
    render(
        <Wrapper>
            <Refreshable>
                <Test />
            </Refreshable>
        </Wrapper>
    )

    expectLifecycleTrack(track, ['mount'])
    expect(values).toEqual([false])

    act(() => history.push('/home'))

    expectLifecycleTrack(track, ['mount', 'unmount', 'mount'])
    expect(values).toEqual([false, true, true])

    act(() => history.push('/other'))

    expectLifecycleTrack(track, ['mount', 'unmount', 'mount', 'unmount'])
    expect(values).toEqual([false, true, true, false])
})
