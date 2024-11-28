---
sidebar_position: 1
---

# Search projects

## Search API

<details>
<summary>GET `/api/search`</summary>


```json
"hits": [
    {
        "id": "J-sUmTnO6DEFC6d8o4",
        "slug": "simply-cosmic-shading",
        "name": "Simply Cosmic Shading",
        "summary": "Replaces the sun-based block shading with a static one.",
        "type": ["mod"],
        "icon": "https://i.ibb.co/Pc7GmNf/logox1080.png",
        "downloads": 19,
        "followers": 0,
        "dateUpdated": "2024-09-16T14:24:21.459Z",
        "datePublished": "2024-09-14T22:11:05.835Z",
        "categories": ["utility", "decoration"],
        "featuredCategories": ["utility"],
        "gameVersions": ["0.3.0-pre-alpha", "0.3.1-pre-alpha"],
        "loaders": ["quilt"],
        "author": "StartsMercury"  // CRMM username of the author
    },
    ...
],
"query": "shading?type=mod",
"processingTimeMs": 2,
"limit": 20,
"offset": 0,
"estimatedTotalHits": 2
```

[Source code reference](https://github.com/CRModders/cosmic-mod-manager/tree/main/packages/shared/types/api/index.ts#L142)
</details>

### Query Parameters

- **Query** \
    key: `q` \
    type: `string` \
    Example: `q=zoom`

- **Sortby** \
    key: `sortby` \
    type: `ENUM { relevance | downloads | follow_count | recently_updated | recently_published }` \
    default: `relevance` \
    Example: `sortby=downloads`

- **Limit** \
    key: `limit` \
    type: `number` \
    default: `20` \
    max: `100` \
    Example: `limit=50`

- **Offset** \
    key: `offset` \
    type: `number` \
    Example: `offset=20`

- **Page** \
    key: `page` \
    type: `number` \
    Example: `page=3`

:::note

Please note that the `page` value will be ignored if you provide an `offset` also.

:::

### Filters

- **Type** \
    key: `type` \
    type: `ENUM { mod | modpack | shader | resource-pack | datamod | plugin }` \
    Example: `type=mod`

- **Loader** \
    key: `l` \
    type: [`ENUM`](https://api.crmm.tech/api/search/filters/loaders) \
    Example: `l=quilt`

- **Game version** \
    key: `v` \
    type: [`ENUM`](https://api.crmm.tech/api/search/filters/game-versions) \
    Example: `v=0.3.1-pre-alpha`

- **Category** \
    key: `c` \
    type: [`ENUM`](https://api.crmm.tech/api/tags/categories) \
    Example: `c=realistic&c=64x`

:::tip

You can use the endpoint `/tags/categories` to get categories based on project types also. \
For example, [`/tags/categories?type=mod`](https://api.crmm.tech/api/tags/categories?type=mod) returns all the categories applicable to mods.

:::
<br />


## Get a Project

<details>
<summary>GET `/api/project/{ID|slug}`</summary>

```json
"success": true,
"project": {
    "id": "aGpOpKiIRORfH684gv",
    "teamId": "QQM8DQzZJoc076lbl1",
    "orgId": null,
    "name": "Dice",
    "icon": "https://cdn.crmm.tech/cdn/data/dice/JolAzfYYSrgnj2Ak.png",
    "status": "draft",
    "summary": "A dice datamod with dice. 16x textures. ",
    "description": "...",
    "type": ["datamod"],
    "categories": ["decoration"],
    "featuredCategories": ["decoration"],
    "licenseId": "MIT",
    "licenseName": "MIT License",
    "licenseUrl": "",
    "dateUpdated": "2024-09-25T10:22:30.340Z",
    "datePublished": "2024-09-20T10:02:57.589Z",
    "downloads": 48,
    "followers": 0,
    "slug": "dice",
    "visibility": "listed",
    "issueTrackerUrl": "https://codeberg.org/eatham/cr-dice/issues",
    "projectSourceUrl": "https://codeberg.org/eatham/cr-dice",
    "projectWikiUrl": "",
    "discordInviteUrl": "",
    "clientSide": "required",
    "serverSide": "unknown",
    "loaders": [],
    "gameVersions": ["0.3.1-pre-alpha", "0.3.0-pre-alpha"],
    "gallery": [
        {
            "id": "vtMgB0OzA5lwjnJmYJ",
            "name": "All the dice! Again!",
            "description": "",
            "image": "https://cdn.crmm.tech/cdn/data/dice/gallery/5m_nx-W64ygxQg_SM1.png",
            "featured": false,
            "dateCreated": "2024-09-25T10:17:40.100Z",
            "orderIndex": 18
        }
    ],
    "members": [
        {
            "id": "uEHGSSQCxZ0ObgVUeo",
            "userId": "K4SwdRSPubHZgi-ZoE",
            "teamId": "QQM8DQzZJoc076lbl1",
            "userName": "ethan",
            "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIQT9VZWTXbfFcIMw1QO-LDFhvbwStJi82s_PZPmkT2Fd8pofw=s96-c",
            "role": "Owner",
            "isOwner": true,
            "accepted": true,
            "permissions": [],
            "organisationPermissions": []
        }
    ],
    "organisation": null
}
```

[Source code reference](https://github.com/CRModders/cosmic-mod-manager/tree/main/packages/shared/types/api/index.ts#L60)

</details>
