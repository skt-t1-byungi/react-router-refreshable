# react-router-refreshable

Supports refresh (remount) on react-router-dom

[![version](https://flat.badgen.net/npm/v/react-router-refreshable)](https://www.npmjs.com/package/react-router-refreshable)
[![license](https://flat.badgen.net/github/license/skt-t1-byungi/react-router-refreshable)](https://github.com/skt-t1-byungi/react-router-refreshable/blob/master/LICENSE)
[![test](https://github.com/skt-t1-byungi/react-router-refreshable/actions/workflows/test.yml/badge.svg)](https://github.com/skt-t1-byungi/react-router-refreshable/actions/workflows/test.yml)


## Install

```sh
npm i react-router-refreshable
```

## Example

```js
import { Refreshable } from 'react-router-refreshable'
```

```jsx
<Layout>
    <Refreshable>
        <Switch>
            <Route path="/home">
                <HomePage />
            </Route>
            <Route path="/post">
                <PostPage />
            </Route>
            {/* ... */}
        </Switch>
    </Refreshable>
</Layout>
```

## Description

When the user clicks on a link with the same url as the current url on the react-router, nothing happens. However, most users expect the page to refresh. Solving with `location.reload()` (or `<BrowserRouter forceRefresh />`) is wasteful.

The `Refreshable` component of `react-router-refreshable` remounts `children` when `history.push` to the same address. It is possible to efficiently provide the user's expected result.

See a **[Demo](https://codesandbox.io/s/react-router-refreshable-demo-cw8gj?file=/src/App.js)**

### Nested Refreshable

Each page may have different areas to expect to refresh. Nested Refreshables can dynamically narrow the refresh area.

```jsx
<Refreshable>
    <Route path="/teams/:teamId">
        {/* 👇 This component is not refreshed when '/teams/:teamId/*'. */}
        <TeamsContentLayout>
            <Refreshable>
                <Route path="/teams/:teamId/users">
                    <TeamUsersPage />
                </Route>
            </Refreshable>
        </TeamsContentLayout>
    </Route>
</Refreshable>
```

### `on` event listener prop

There is an `on` property that triggers when the refresh is started.

```jsx
<Refreshable on={() => console.log('Start refreshing!')}>{/* ... */}</Refreshable>
```

### useIsRefreshingRef()

`useIsRefreshingRef()` returns a `RefObject` indicating whether it is refreshing. Although not recommended, ignoring some logic in the effects hook can improve performance.

```js
import { useIsRefreshingRef } from 'react-router-refreshable'
```

```js
function Page() {
    const isRefreshingRef = useIsRefreshingRef()

    useEffect(() => {
        if (!isRefreshingRef.current) {
            /* ... Run only when not refresh */
        }
        return () => {
            if (!isRefreshingRef.current) {
                /* ... Run only when not refresh */
            }
        }
    }, [])

    /* ... */
}
```

## License

MIT
