import React from 'react'
import { render, act } from '@testing-library/react'
import Refreshable from '../src/index'
import { createWrapper, expectLifecycleTrack, Lifecycle } from './utils'

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
