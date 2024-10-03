---
sidebar_position: 4
---

# Upload a version

<details>
<summary>POST `/project/{ID|slug}/version`</summary>
```json
{
    "success": true,
    "message": "Successfully created new version",
    "slug": "NEW_VERSION'S_SLUG"
}
```
</details>

REQUEST BODY SCHEMA: `multipart/form-data`

- **Title** \
    key: `title` \
    type: `string` \
    maxLength: `64`

- **Changelog** \
    key: `changelog` \
    type: `string` \
    maxLength: `65256`

- **ReleaseChannel** \
    key: `releaseChannel` \
    type: `ENUM { release | beta | alpha }`

- **Featured** \
    key: `featured` \
    type: `booleanish string ("true" | "false")`

- **VersionNumber** \
    key: `versionNumber` \
    type: `string`

- **Loaders** \
    key: `loaders` \
    type: `string[]` (Check [/tags/loaders](https://api.crmm.tech/api/tags/loaders) for a list of available loaders)

- **VameVersions** \
    key: `gameVersions` \
    type: `string[]` (Check [/tags/game-versions](https://api.crmm.tech/api/tags/game-versions) for a list of available game v)

- **Dependencies** \
    key: `dependencies` \
    type: `Dependency[]`
    ```ts
    interface Dependency {
        projectId: string,
        versionId: string | null,
        dependencyType: ENUM { required | optional | incompatible | embedded },
    }
    ```

- **PrimaryFile** \
    key: `primaryFile` \
    type: `File`

- **AdditionalFiles** \
    key: `additionalFiles` \
    type: `File[]` \
    maxLength: `10`

