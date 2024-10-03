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

#### Form Data

- **File** \
    key: `file` \
    type: `image/png` `image/jpeg` `image/webp` \
    maxSize: `512 KiB`



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

## Update project details

<details>
<summary>PATCH `/project/{ID|slug}`</summary>

```json
{
    "success": true,
    "message": "Project details updated",
    "slug": "project-slug"
}
```

</details>

REQUEST BODY SCHEMA: `multipart/form-data`

#### Form Data

- **Name** \
    key: `name` \
    type: `string` \
    maxLength: `32`

- **slug** \
    key: `slug` \
    type: `string` (URL safe & lowercase) \

- **Visibility** \
    key: `visibility` \
    type: `ENUM { listed | private | unlisted | archived }`

- **Type** \
    key: `type` \
    type: `ENUM { mod | modpack | shader | resource-pack | datamod | plugin }[]` [More info](https://github.com/CRModders/cosmic-mod-manager/tree/main/packages/shared/lib/utils/index.ts#L212)

- **Client side** \
    key: `clientSide` \
    type: `ENUM { unknown | required | optional | unsupported }`

- **Server side** \
    key: `serverSide` \
    type: `ENUM { unknown | required | optional | unsupported }`

- **Summary** \
    key: `summary` \
    type: `string` \
    maxLength: `256`

- **Icon** \
    key: `icon` \
    type: `string | File` \
    maxSize: `512 KiB`

:::note

If you don't intend to update the icon, just send any string value in that form field. Sending an empty value or a string of 0 len will cause the current project icon to be deleted.

:::


## Update project description

<details>
<summary>PATCH `/project/{ID|slug}/description`</summary>

```json
{
    "success": true,
    "message": "Project description updated"
}
```

</details>

REQUEST BODY SCHEMA: `application/json`

- **Description** \
    key: `description` \
    type: `string` \
    maxLength: `65256 characters`



## Update project tags

<details>
<summary>PATCH `/project/{ID|slug}/tags`</summary>

```json
{
    "success": true,
    "message": "Project tags updated"
}
```

</details>

REQUEST BODY SCHEMA: `application/json`

- **Categories** \
    key: `categories` \
    type: `string[]` \
    Check [/tags/categories](https://api.crmm.tech/api/tags/categories) for a list of available categories. Filter the categories list by project type using the `type` query parameter, like [/tags/categories?type=shader](https://api.crmm.tech/api/tags/categories?type=shader).

- **FeaturedCategories** \
    key: `featuredCategories` \
    type: `string[]` (It must be a subset of the list of categories you provide) \
    maxLength: `3`


EXAMPLE REQUEST BODY:

```json
// For a shader
{
    "categories": ["atmosphere", "bloom", "colored-lighting", "reflections"],
    "featuredCategories": ["bloom", "reflections"]
}
```


## Update project license

<details>
<summary>PATCH `/project/{ID|slug}/license`</summary>

```json
{
    "success": true,
    "message": "Project license updated"
}
```

</details>

REQUEST BODY SCHEMA: `application/json`

- **Name** \
    key: `name` \
    type: `string`

- **ID** \
    key: `id` \
    type: `string`

- **Url** (optional) \
    key: `url` \
    type: `string`

:::note

If you use a [SPDX](https://spdx.org) license ID, the name and a url to spdx page will be added automatically. \
If you've a custom license and it doesn't have a SPDX ID, you can just provide the name and the url if possible. \
Check for the list of licenses here [`/tags/licenses`](https://api.crmm.tech/api/tags/licenses).

:::
