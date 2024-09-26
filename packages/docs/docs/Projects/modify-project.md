---
sidebar_position: 2
---

# Modify a project


## Update project icon

<details>
<summary>PATCH `/api/project/{ID|slug}/icon`</summary>

```json
{
    "success": true,
    "message": "Project icon updated"
}
```
</details>

REQUEST BODY SCHEMA: `multipart/form-data`

### Form Data

- **File** \
    key: `file` \
    type: `image/png` `image/jpeg` `image/webp` \
    maxSize: `512 KiB`

<br />


## Remove project icon

<details>
<summary>DELETE `/api/project/{ID|slug}/icon`</summary>

```json
{
    "success": true,
    "message": "Project icon deleted"
}
```
</details>