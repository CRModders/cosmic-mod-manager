---
slug: /
sidebar_position: 1
---

# Introduction

Welcome to the documentation of CRMM api!

### Important links
- GitHub repo: [https://github.com/crmodders/cosmic-mod-manager](https://github.com/crmodders/cosmic-mod-manager)
- Website URL: [https://www.crmm.tech](https://www.crmm.tech)
- API URL: [https://api.crmm.tech](https://api.crmm.tech)

Also, you can check the API Rate Limits [here](https://github.com/CRModders/cosmic-mod-manager/blob/bc01c108505fca4ce52c3094972cdfcd2e91cb62/packages/backend/src/middleware/rate-limiter.ts#L171).

<br />

### Authentication

As of now, there's no implementation of PATs, so you'll have to use your cookie for authentication for the time being.

Example:
```bash
curl -X PATCH \
--header "Cookie: auth-token=URL_ENCODED_COOKIE_STRING" \
--form "icon=@./Pictures/iris logo.webp" \
https://api.crmm.tech/api/project/iris/icon
```

*You can get the cookie from either the `Application tab > Cookies` or from the headers of a request made by the website to the API.
