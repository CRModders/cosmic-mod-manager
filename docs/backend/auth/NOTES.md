# A rough idea for auth implementation

File structure
```
auth/
├── sign-in/
│   └── index.ts
├── sign-up/
│   └── index.ts
├── auth-providers/
│   ├── github.ts
│   ├── discord.ts
│   ├── gitlab.ts
│   ├── google.ts
│   └── credential.ts
├── user.ts
└── session.ts
```

## Sign-in flow
- ### oAuth
    - User clicks the oAuth provider signIn widget
    - The client makes a request to `/api/auth/get-oauth-url/:authProvider`
    - The server will [GENERATE OAUTH URL](#generate-oauth-url) and return that in response
        ```typescript
        return ctx.json({ oAuthUrl: generatedOAuthUrl }, HTTP_CODES.success);
        ```
    - The client will redirect the user to `oAuthUrl`
    - The user gets redirected back to `/auth/callback/:authProvider` after a successful authorization from the oAuthProvider with the `tokenExchangeCode` and the `csrfState` parameter
    - If the `csrfState` matches the code is sent to `/api/auth/signin/:authProvider` for the user to be signedIn finally

- ### Credential
    - The user enters their signin credentials and presses the signin button
    - The data is sent to `/api/auth/signin/:authProvider` ("credential" is authProvider here)

- The signin request is handled by a `signInRequestHandler`
- It passes down the data to the respective auth provider to [GET OAUTH USER PROFILE DATA](#get-oauth-user-profile-data) from the received data
    ```typescript
    const userProfile: SignInProfileData = await getGithubUserProfile(ctx);
    ```
- If the provider returns valid data it continues else returns a `HTTP_CODES.badRequest` status code
- The validated profile data is then passed to `createUserSession` to [CREATE USER SESSION](#create-user-session)
    ```typescript
    const sessionCreationResult = await createUserSession(ctx, userProfile);
    ```
- If there's something unusual about the signin the `createUserSession` function will create a SESSION with `UNVERIFIED` status in the db and redirect the user to `/auth/verify-signin` and send a `securityCode` on the account's email address
- If the user doesn't successfully verify the session within 12 hours of session creation, it will be deleted by the background job DELETE EXPIRED UNVERIFIED SESSIONS
- If the user closes the page without verifying, they will automatically be redirected to the verification page till an unverified session that is not expired exists in the cookie, unverified sessions will be treated the same as not-logged in all the places, that session cannot access any private user data.Sign-up flow
- On successful verification the session will be updated to verified giving that user access the the account data

<br>

## Sign-up flow
- ### oAuth
    Same thing as login process to get the `tokenExchangeCode`

- ### Credential
    Not available

- The request will be handled by a `signUpRequestHandler`
- It will get profile data the same as signIn
- After validating all the data it will create a new user and then log the user in


<br>

## GENERATE OAUTH URL
- Generating the oAuth url will involve setting up a url template for the respecitive oauth providers
- Generating a random `csrfState`, `csrfChallengeCode` and `csrfChallengeHash`

<br>

## GET OAUTH USER PROFILE DATA
- Get the `tokenExchangeCode` and `csrfChallengeHash` from the callback request
- Exchange the code with an `accessToken`
- Get the user data from the respective oauth endpoint

<br>

## CREATE USER SESSION
- Receive the profile data for the session
- Get session details like browser, os, ip and location
- Check if the signin has is done from a location that is not in currently signed in sessions list, if yes create a new session with a status of `UNVERIFIED` and redirect the user to enter security code sent to the email address, if its all fine create the session with status `ACTIVE`
