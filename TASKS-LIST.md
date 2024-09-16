- [x] Add mobile nav menu
- [x] Add linked auth providers management option

- [x] Add delete account option
- [x] Add session management

- [x] Add dashboard layout
- [x] Add project creation form

- [x] Reconsider the DB Schema \
    Reference := [MODRINTH](https://github.com/modrinth/labrinth/blob/master/src/models/v3)


- [x] Add a gameVersions field to Project which contains all the gameVersions that project has support for
- [x] Add versions list page
- [x] Add version page
- [x] Setup file cdn
- [x] Add featured versions \
    References :=
    [Iris Versions](https://api.modrinth.com/v2/project/iris/version)
    [Iris Dependencies](https://api.modrinth.com/v2/project/iris/dependencies)

- [x] Add project gallery
  - [x] Add gallery image upload
  - [x] Update project data endpoint to send gallery image list
  - [x] Move all the Url construction logic to backend and send already constructed url's to the frontend (eg. for icons)
  - [x] Add gallery list display
  - [x] Implement gallery item indexing option
  - [x] Add option to remove gallery image
  - [x] Add gallery edit option

- [x] Add changelog page

- [x] Add the interactive download button on project home page
- [x] Add accent colors and icons for loaders
- [x] Add the new version list UI

- [x] Add edit version page \
  NOTE:- Create reusable components from the new version page and use them in both upload form and edit form
- [x] Add option to add dependencies on a version
- [x] Add file hashes to prevent duplicate file upload

- [x] Add function to count downloads
- [x] Add filters on the changelog page
- [x] Add filters on the versions page

- [x] Add settings page
  - [x] General settings page
  - [x] Description settings page
  - [x] Tags settings page
  - [x] License settings page
  - [x] Links settings page
  - [x] Members settings page

- [x] Add search page

- [-] Add transfer ownership option
- [-] Update the overview page of dashboard to show real stats
- [-] Fix session location not being shown
- [-] Add notifications
- [-] Add a separate rate limiter for the CDN

- [-] Fix project deletion
- [-] Fix user deletion

- [-] Modify downloads queue to count valid downloads instantly by save the download details in redis cache for an interval for validations of other downloads
- [-] Add a proper profile edit page

<!-- Later stuff -->
- [-] Add custom redirect after login