---
sidebar_position: 1
---

# Search projects

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
</details>

#### QUERY PARAMETERS

- **query** \
    key: `q` \
    type: `string` \
    Example: `q=zoom`

- **sortby** \
    key: `sortby` \
    type: `ENUM { relevance | downloads | follow_count | recently_updated | recently_published }` \
    default: `relevance` \
    Example: `sortby=downloads`

- **offset** \
    key: `offset` \
    type: `number` \
    Example: `offset=20`

- **limit** \
    key: `limit` \
    type: `number` \
    default: `20` \
    max: `100` \
    Example: `limit=50`