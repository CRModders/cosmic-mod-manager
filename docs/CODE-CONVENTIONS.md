# Some Conventions to follow

## Naming conventions
- Functions and regular variables should be named in camelCase
    ```typescript
    const checkIfSearchResultCacheIsValid = ( ... ) => { ... };
    const isSearchResultCacheValid = checkIfSearchResultCacheIsValid( ... );
    ```

- All config variables and magic numbers must be in UPPERCASE and separated by underscores (`_`)
    ```typescript
    const USERNAME_MAX_LENGTH = 32;
    const SEARCHDB_SYNC_INTERVAL_MS = 300_000;
    ```

- Make sure to add comments when doing complex or hacky things if possible with examples

NOTE:- You may find this in many places that instead of having a separate loading state for things that load only once on render, a value of `undefinded` has been used to represent that it's still uninitialized and the data is still loading, while using `null` to represent that the data fetching is complete and the value is actually empty
