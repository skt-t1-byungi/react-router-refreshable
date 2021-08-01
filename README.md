# react-router-refreshable

Supports refresh (remount) on react-router-dom

## Install

```sh
npm i react-router-refreshable
```

## Description

When the user clicks on a link with the same address as the current address on the react-router, nothing happens. However, most users expect the page to refresh. Solving with `location.reload()` is wasteful.

The `Refreshable` component of `react-router-refreshable` remounts `children` when `history.push` to the same address. It is possible to efficiently provide the user's expected result.

```js
import Refreshable from 'react-router-refreshable'
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

There is an `on` property that triggers when the refresh is started.

```jsx
<Refreshable on={() => console.log('Start refreshing!')}>{/* ... */}</Refreshable>
```

## License

MIT
