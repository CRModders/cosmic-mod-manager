import type { Locale } from "~/locales/types";
import { Rules } from "./legal";
import tags from "./tags";


type Gender = "f" | "m" | "n" | "a";

// make first letter capital
function capitalStart(str: string) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

// Prepositions for gender, case and determination
const prepositions = {
    nominative: {
        m: ["der", "ein", "dieser"],
        f: ["die", "eine", "diese"],
        n: ["das", "ein", "dieses"],
        a: ["der/die/das", "ein/e", "diese/r/s"]
    },
    genitive: {
        m: ["des", "eines", "diesen"],
        f: ["der", "einer", "dieser"],
        n: ["des", "eines", "dieses"],
        a: ["der/des", "einer/s", "diesen/r/s"]
    },
    accusative: {
        m: ["den", "einen", "diesen"],
        f: ["die", "eine", "diese"],
        n: ["das", "ein", "dieses"],
        a: ["die/den/das", "ein/eine/einen", "diese/diesen/diesess"]
    },
    dative: {
        m: ["dem", "einem", "diesem"],
        f: ["der", "einer", "dieser"],
        n: ["dem", "einem", "diesem"],
        a: ["der/dem", "deiner/m", "dieser/m"]
    }
}

export default {
    common: {
        settings: "Einstellungen",
        success: "Erfolgreich",
        error: "Fehler",
        home: "Startseite",
        somethingWentWrong: "Etwas ist schiefgelaufen!",
        redirecting: "Weiterleiten...",
        accept: "Akzeptieren",
        decline: "Ablehnen",
        download: "Herunterladen",
        report: "Melden",
        copyId: "ID kopieren",
        all: "Alle",
    },

    // NOTE: It isn't necessary to return the count in the array, because a Intl formatted count is used in the actual html
    // it's here just for readability
    count: {
        downloads: (count: number) => {
            if (count === 1) return ["", count.toString(), "Download"];
            return ["", count.toString(), "Downloads"];
        },
        followers: (count: number) => {
            if (count === 1) return ["", count.toString(), "Follower"];
            return ["", count.toString(), "Followers"];
        },
        projects: (count: number) => {
            if (count === 1) return ["", count.toString(), "Projekt"];
            return ["", count.toString(), "Projekte"];
        },
        members: (count: number) => {
            if (count === 1) return ["", count.toString(), "Mitglied"];
            return ["", count.toString(), "Mitglieder"];
        },
    },

    navbar: {
        mod: "Mod",
        mods: "Mods",
        datamod: "Datamod",
        datamods: "Datamods",
        "resource-pack": "Resourcenpaket",
        "resource-packs": "Resourcenpakete",
        shader: "Shader",
        shaders: "Shader",
        modpack: "Modpack",
        modpacks: "Modpacks",
        plugin: "Plugin",
        plugins: "Plugins",
        signout: "Ausloggen",
        dashboard: "Dashboard",
        profile: "Profil",
        skipToMainContent: "Zum Hauptinhalt vorspringen",
    },

    homePage: {
        title: "Der Platz für Cosmic Reach {{projectType}}",
        desc: "Der beste Platz für deine Cosmic Reach Mods. Entdecke, spiele und erstelle Inhalte, alles an einem Ort.",
        exploreMods: "Entdecke Mods",
    },

    auth: {
        email: "Email",
        password: "Passwort",
        changePassword: "Passwort ändern",
        dontHaveAccount: "Du hast kein Konto?",
        alreadyHaveAccount: "Du hast bereits ein Konto?",
        forgotPassword: "Password vergessen?",
        signupWithProviders: "Registriere dich mit einem dieser Authentifizierungsbereitisteller:",
        aggrement: "Mit dem erstellen eines Kontos akzeptierst du unsere [Bedingungen](/legal/terms) und [Privatsphärebestimmungen](/legal/privacy).",
        invalidCode: "Ungültiger oder abgelaufener Code",
        didntRequest: "Nicht angefragt?",
        checkSessions: "Überprüfe angemeldete Sitzungen",
        confirmNewPass: "Neues Passwort bestätigen",
        confirmNewPassDesc:
            "Ein neues Passwort wurde letztens zu deinem Konto hinzufefügt und wartet auf Bestätigung. Bestätige unten, dass du das warst.",
        newPass: "Neues Passwort",
        newPass_label: "Neues Passwort eingeben",
        confirmPass: "Passwort bestätigen",
        confirmPass_label: "Passwort erneut eingeben",
        deleteAccount: "Konto löschen",
        deleteAccountDesc:
            "Durch das Löschen des Kontos werden alle deine Daten von unserer Datenbank entfernt. Es gibt kein Zurück, nachdem du dein Konto gelöscht hast.",
        enterEmail: "Email-Adresse eingeben",
    },

    settings: {
        account: "Konto",
        preferences: "Präferenzen",
        publicProfile: "Öffentliches Profil",
        accountAndSecurity: "Konto und Sicherheit",
        sessions: "Sitzungen",
        toggleFeatures: "Funktionen ein- und ausschalten",
        enableOrDisableFeatures: "Schalte bestimmte Funktionen für dieses Gerät ein oder aus.",
        viewTransitions: "Zeige Übergänge",
        viewTransitionsDesc: "Aktiviert Übergänge (morph), während dem Navigieren zwischen Seiten.",
        accountSecurity: "Konto-Sicherheit",
        changePassTitle: "Passwort vom Konto ändern",
        addPassDesc: "Füge ein Passwort hinzu, um den Passwortlogin zu ermöglichen.",
        manageAuthProviders: "Verwalte Authentifizierungsbereitsteller",
        manageProvidersDesc: "Füge Anmeldemethoden zum Konto hinzu oder entferne sie.",
        removePass: "Passwort entfernen",
        removePassTitle: "Passwort vom Konto entfernen",
        removePassDesc: "Nach dem entfernen des Passwort kannst du dich nicht mehr mit ihm anmelden.",
        enterCurrentPass: "Gebe das aktuelle Passwort ein",
        addPass: "Passwort hinzufügen",
        addPassDialogDesc: "Du wirst diese Passwort benutzen können,. um dich mit deinem Konto anzumelden.",
        manageProviders: "Verwalten",
        linkedProviders: "Verknüpfte Authentifizierungsbereitsteller",
        linkProvider: (provider: string) => `Verknüpfe ${provider} mit deinem Konto`,
        link: "verknüpfen", // Verb
        sureToDeleteAccount: "Bist du sicher, dass du dein Konto löschen willst?",
        profileInfo: "Profil",
        profileInfoDesc: (site: string) => `Dein Profil ist öffentlich sichtbar auf ${site}.`,
        profilePic: "Profilbild",
        bio: "Bio",
        bioDesc: "Eine kurze Beschreibung, um jedem ein wenig über dich zu erzählen.",
        visitYourProfile: "Profil besuchen",
        showIpAddr: "IP Adressen anzeigen",
        sessionsDesc:
            "These devices are currently logged into your account, you can revoke any session at any time. If you see something you don't recognize, immediately revoke the session and change the password of the associated auth provider.",
        ipHidden: "IP versteckt",
        lastAccessed: (when: string) => `Zuletzt ${when} zugegriffen`,
        created: (when: string) => `${capitalStart(when)} erstellt`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Sitzung erstellt über ${providerName}`,
        currSession: "Aktuelle Sitzung",
        revokeSession: "Sitzung beenden",
    },

    dashboard: {
        dashboard: "Dashboard",
        overview: "Übersicht",
        notifications: "Benachrichtigungen",
        activeReports: "Aktive Meldungen",
        analytics: "Analysen",
        projects: "Projekte",
        organizations: "Organisationen",
        collections: "Sammlungen",
        revenue: "Einnahmen",
        manage: "Verwalten",
        seeAll: "Alles anzeigen",
        viewNotifHistory: "Benachrichtungsverlauf anzeigen",
        noUnreadNotifs: "Du hast keine ungelesenen Benachrichtigungen.",
        totalDownloads: "Gesamtdownloads",
        fromProjects: (count: number) => `von ${count} Projekten`,
        totalFollowers: "Gesamtfollower",
        viewHistory: "Verlauf anzeigen",
        markAllRead: "Alle als gelesen markieren",
        markRead: "Als gelesen markieren",
        deleteNotif: "Benachrichtigung löschen",
        received: "Erhalten",
        history: "Verlauf",
        notifHistory: "Benachrichtigungsverlauf",
        createProjectInfo: "Du hast keine Projekte. Klicke auf den obigen Knopf, um eines zu erstellen.",
        type: "Typ",
        status: "Status",
        createProject: "Erstelle ein Projekt",
        creatingProject: "Erstellen eines Projektes",
        chooseProjectType: "Projekttyp wählen",
        projectTypeDesc: "Wähle den passenden Typ für dein Projekt",
        createOrg: "Organisation erstellen",
        createAnOrg: "Eine Organisation erstellen",
        creatingOrg: "Erstellen einer Organisation",
        enterOrgName: "Organisationsname eingeben",
        enterOrgDescription: "Gebe eine kurze Beschreibung für deine Organisation ein",
    },

    search: {
        // Search labels
        project: "Entdecke Projekte",
        mod: "Entdecke Mods",
        "resource-pack": "Entdecke Resourcenpakete",
        shader: "Entdecke Shader",
        plugin: "Entdecke Plugins",
        modpack: "Entdecke Modpacks",
        datamod: "Entdecke Datamods",

        // Sorting methods
        showPerPage: "Zeige pro Seite",
        sortBy: "Sortiere nach",
        relevance: "Relevanz",
        downloads: "Downloads",
        follow_count: "Followerzahl",
        recently_updated: "Zuletzt aktualisiert",
        recently_published: "Zuletzt veröffentlicht",

        filters: "Filter",
        searchFilters: "Durchsuche Filter",
        loaders: "Loaders",
        gameVersions: "Spielversionen",
        channels: "Kanäle",
        environment: "Umgebung",
        categories: "Kategorien",
        features: "Funktionen",
        resolutions: "Auflösung",
        performanceImpact: "Performance impact",
        license: "Lizens",
        openSourceOnly: "Nur Open Source",
        clearFilters: "Alle Filter entfernen",

        tags: tags,
    },

    project: {
        compatibility: "Kompatibilität",
        environments: "Umgebungen",
        reportIssues: "Fehler melden",
        viewSource: "Quellcode anzeigen",
        visitWiki: "Wiki besuchen",
        joinDiscord: "Discord Server beitreten",
        featuredVersions: "Vorgestellte Versionen",
        creators: "Ersteller",
        organization: "Organisation",
        project: "Projekt",
        details: "Details",
        updatedAt: (when: string) => `${capitalStart(when)} aktualisiert`, // eg: Updated 3 days ago
        publishedAt: (when: string) => `${capitalStart(when)} veröffentlicht`, // eg: Published 3 days ago
        gallery: "Gallerie",
        changelog: "Änderungsverlauf",
        versions: "Versionen",
        noProjectDesc: "Keine Projektbeschriebung vorhanden",
        uploadNewImg: "Neues Gallerie-Bild hochladen",
        uploadImg: "Gallerie-Bild hochladen",
        galleryOrderingDesc: "Image with higher ordering will be listed first.",
        featuredGalleryImgDesc:
            "A featured gallery image shows up in search and your project card. Only one gallery image can be featured.",
        addGalleryImg: "Gallerie-Bild hinzufügen",
        featureImg: "Bild vorstellen",
        unfeatureImg: "Bild nicht mehr vorstellen",
        sureToDeleteImg: "Willst du dieses Gallerie-Bild wirklich löschen?",
        deleteImgDesc: "This will remove this gallery image forever (like really forever).",
        editGalleryImg: "Gallerie-Bild bearbeiten",
        currImage: "Aktuelles Bild",

        // Version
        uploadVersion: "Version hochladen",
        uploadNewVersion: "Upload a new project version",
        showDevVersions: "Show dev versions",
        noProjectVersions: "No project versions found",
        stats: "Statistiken",
        published: "Veröffentlicht", // Used for table headers
        downloads: "Downloads", // Used for table headers
        openInNewTab: "In neuem Tab öffnen",
        copyLink: "Link kopieren",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} unterstützt ${version} für ${loader} nicht`;
        },
        downloadProject: (project: string) => `Lade ${project} herunter`,
        gameVersion: "Spielversion:",
        selectGameVersion: "Spielversion wählen",
        platform: "Platform:",
        selectPlatform: "Platform wählen",
        onlyAvailableFor: (project: string, platform: string) => `${project} ist nur für ${platform} verfügbar`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) => `Keine Versionen für ${gameVersion} auf ${loader} verfügbar`,
        declinedInvitation: "Abgelehnte Einladung",
        teamInvitationTitle: (teamType: string) => {
            const gender: Gender = ({ Organisation: "f", Projekt: "n" }[teamType] || "a") as Gender;
            return `Einladung, ${prepositions.dative[gender][0]} ${teamType} beizutreten`
        }, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) => {
            const gender: Gender = ({ Organisation: "f", Projekt: "n" }[teamType] || "a") as Gender;
            return `Du wurdest eingeladen, Mitglied ${prepositions.dative[gender][2]} ${teamType} mit der Rolle '${role}' zu sein.`
        },

        browse: {
            mod: "Durchsuche mods",
            datamod: "Durchsuche datamods",
            "resource-pack": "Durchsuche resource packs",
            shader: "Durchsuche shaders",
            modpack: "Durchsuche modpacks",
            plugin: "Durchsuche plugins",
        },

        rejected: "Abgelehnt",
        withheld: "Withheld",
        archivedMessage: (project: string) =>
            `${project} wurde archiviert. It will not receive any further updates unless the author decides to unarchive the project.`,
        publishingChecklist: {
            required: "Benötigt",
            suggestion: "Vorschlag",
            review: "Review",
            progress: "Fortschritt:",
            title: "Veröffentlichungs-Checkliste",
            uploadVersion: "Eine Version hochladen",
            uploadVersionDesc: "Wenigstens eine Version ist benötigt, um das Projekt zur Zulassung abzusenden.",
            addDescription: "Beschribung hinzufügen",
            addDescriptionDesc: "A description that clearly describes the project's purpose and function is required.",
            addIcon: "Add an icon",
            addIconDesc: "Your project should have a nice-looking icon to uniquely identify your project at a glance.",
            featureGalleryImg: "Feature a gallery image",
            featureGalleryImgDesc: "Featured gallery images may be the first impression of many users.",
            selectTags: "Select tags",
            selectTagsDesc: "Select all tags that apply to your project.",
            addExtLinks: "Add external links",
            addExtLinksDesc: "Add any relevant links, such as sources, issues, or a Discord invite.",
            selectLicense: "Select license",
            selectLicenseDesc: (projectType: string) => `Select the license your ${projectType} is distributed under.`,
            selectEnv: "Select supported environments",
            selectEnvDesc: (projectType: string) => `Select if the ${projectType} functions on the client-side and/or server-side.`,
            submitForReview: "Submit for review",
            submitForReviewDesc:
                "Your project is only viewable by members of the project. It must be reviewed by moderators in order to be published.",
            resubmitForReview: "Resubmit for review",
            resubmit_ApprovalRejected:
                "Your project has been rejected by our moderator. In most cases, you can resubmit for review after addressing the moderator's message.",
            resubmit_ProjectWithheld:
                "Your project has been withheld by our moderator. In most cases, you can resubmit for review after addressing the moderator's message.",
            visit: {
                versionsPage: "Visit versions page",
                descriptionSettings: "Visit description settings",
                generalSettings: "Visit general settings",
                galleryPage: "Visit gallery page",
                tagSettings: "Visit tag settings",
                linksSettings: "Visit links settings",
                licenseSettings: "Visit license settings",
                moderationPage: "Visit moderation page",
            },
        },
    },

    version: {
        deleteVersion: "Version löschen",
        sureToDelete: "Bist du sicher, dass du diese Version löschen willst?",
        deleteDesc: "This will remove this version forever (like really forever).",
        enterVersionTitle: "Enter the version title...",
        feature: "Feature version",
        unfeature: "Unfeature version",
        featured: "Featured",
        releaseChannel: "Release channel",
        versionNumber: "Version number",
        selectLoaders: "Select loaders",
        selectVersions: "Select versions",
        cantAddCurrProject: "You cannot add the current project as a dependency",
        cantAddDuplicateDep: "You cannot add the same dependency twice",
        addDep: "Add dependency",
        enterProjectId: "Enter the project ID/Slug",
        enterVersionId: "Enter the version ID/Slug",
        dependencies: "Dependencies",
        files: "Files",

        depencency: {
            required: "Benötigt",
            optional: "Optional",
            incompatible: "Unvollständig",
            embedded: "Eingebettet",
            required_desc: (version: string) => `Version ${version} ist benötigt`,
            optional_desc: (version: string) => `Version ${version} ist optional`,
            incompatible_desc: (version: string) => `Version ${version} ist inkompatibel`,
            embedded_desc: (version: string) => `Version ${version} ist eingebettet`,
        },

        primary: "Primär",
        noPrimaryFile: "Keine primäre Datei gewählt",
        chooseFile: "Datei wählen",
        replaceFile: "Datei ersetzen",
        uploadExtraFiles: "Zusätzliche Dateien hochladen",
        uploadExtraFilesDesc: "Used for additional files like sources, documentation, etc.",
        selectFiles: "Dateien wählen",
        primaryFileRequired: "Eine primäre Datei ist benötigt",
        metadata: "Metadaten",
        devReleasesNote: "NOTE:- Older dev releases will be automatically deleted after a new dev release is published.",
        publicationDate: "Veröffentlichungsdatum",
        publisher: "Veröffentlichender",
        versionID: "Versions ID",
        copySha1: "SHA-1 Hash kopieren",
        copySha512: "SHA-512 Hash kopieren",
        copyFileUrl: "Datei-URL kopieren",
    },

    projectSettings: {
        settings: "Projekteinstellungen",
        general: "Allgemein",
        tags: "Tags",
        links: "Links",
        members: "Mitglieder",
        view: "Zeige",
        upload: "Hochladen",
        externalLinks: "Externe Links",
        issueTracker: "Issue tracker",
        issueTrackerDesc: "A place for users to report bugs, issues, and concerns about your project.",
        sourceCode: "Quellcode",
        sourceCodeDesc: "A page/repository containing the source code for your project.",
        wikiPage: "Wiki page",
        wikiPageDesc: "A page containing information, documentation, and help for the project.",
        discordInvite: "Discord invite",
        discordInviteDesc: "An invitation link to your Discord server.",
        licenseDesc1: (projectType: string) =>
            `It is very important to choose a proper license for your ${projectType}. You may choose one from our list or provide a custom license. You may also provide a custom URL to your chosen license; otherwise, the license text will be displayed.`,
        licenseDesc2:
            "Enter a valid [SPDX license identifier](https://spdx.org/licenses) in the marked area. If your license does not have a SPDX identifier (for example, if you created the license yourself or if the license is Cosmic Reach specific), simply check the box and enter the name of the license instead.",
        selectLicense: "Select license",
        custom: "Custom",
        licenseName: "License name",
        licenseUrl: "License URL (optional)",
        spdxId: "SPDX identifier",
        doesntHaveSpdxId: "License does not have a SPDX identifier",
        tagsDesc: "Accurate tagging is important to help people find your mod. Make sure to select all tags that apply.",
        tagsDesc2: (projectType: string) => `Select all categories that reflect the themes or function of your ${projectType}.`,
        featuredCategories: "Featured categories",
        featuredCategoriesDesc: (count: number) => `You can feature up to ${count} of your most relevant tags.`,
        selectAtLeastOneCategory: "Select at least one category in order to feature a category.",
        projectInfo: "Project information",
        clientSide: "Client-side",
        clientSideDesc: (projectType: string) => `Select based on if your ${projectType} has functionality on the client side.`,
        serverSide: "Server-side",
        serverSideDesc: (projectType: string) => `Select based on if your ${projectType} has functionality on the logical server.`,
        unknown: "Unknown",
        required: "Required",
        optional: "Optional",
        unsupported: "Unsupported",
        visibilityDesc:
            "Listed and archived projects are visible in search. Unlisted projects are published, but not visible in search or on user profiles. Private projects are only accessible by members of the project.",
        ifApproved: "If approved by the moderators:",
        visibleInSearch: "Visible in search",
        visibleOnProfile: "Visible on profile",
        visibleViaUrl: "Visible via URL",
        visibleToMembersOnly: "Only members will be able to view the project",
        listed: "Listed",
        private: "Private",
        unlisted: "Unlisted",
        archived: "Archived",
        deleteProject: "Delete project",
        deleteProjectDesc: (site: string) =>
            `Removes your project from ${site}'s servers and search. Clicking on this will delete your project, so be extra careful!`,
        sureToDeleteProject: "Are you sure you want to delete this project?",
        deleteProjectDesc2:
            "If you proceed, all versions and any attached data will be removed from our servers. This may break other projects, so be careful.",
        typeToVerify: (projectName: string) => `Zum Verifizieren, gib unten **${projectName}** ein:`,
        typeHere: "Hier eingeben...",
        manageMembers: "Mitglieder verwalten",
        leftProjectTeam: "Du hast das Team verlassen",
        leaveOrg: "Organisation verlassen",
        leaveProject: "Projekt verlassen",
        leaveOrgDesc: "Entferne dich selbst als Mitglied von dieser Organisation.",
        leaveProjectDesc: "Entferne dich selbst als Mitglied von diesem Projekt.",
        sureToLeaveTeam: "Willst du dieses Team wirklich verlassen?",
        cantManageInvites: "Du hast keine Berechtigungen, Einladungen zu verwalten",
        inviteMember: "Mitglied einladen",
        inviteProjectMemberDesc: "Gib den Nutzernamen der Person ein, die du gerne als Mitglied zu diesem Projekt einladen würdest.",
        inviteOrgMemberDesc: "Gib den Nutzernamen der Person ein, die du gerne als Mitglied zu dieser Organisation einladen würdest.",
        invite: "Einladung",
        memberUpdated: "Mitglied erfolgreich aktualisiert",
        pending: "Ausstehend",
        role: "Rolle",
        roleDesc: "Der Titel der Rolle die dieses Mitglied für dieses Team spielt.",
        permissions: "Berechtigungen",
        perms: {
            upload_version: "Version hochladen",
            delete_version: "Version löschen",
            edit_details: "Details bearbeiten",
            edit_description: "Beschreibung bearbeiten",
            manage_invites: "Einladungen verwalten",
            remove_member: "Mitglied entfernen",
            edit_member: "Mitglied bearbeiten",
            delete_project: "Projekt löschen",
            view_analytics: "Analysen ansehen",
            view_revenue: "Einnahmen sehen",
        },
        owner: "Besitzer",
        removeMember: "Mitglied entfernen",
        transferOwnership: "Besitz übertragen",
        overrideValues: "Werte überschreiben",
        overrideValuesDesc: "Standardwerte der Organisation überschreiben und Berechtigungen und Rollen für den Nutzer für dieses Projekt festlegen.",
        projectNotManagedByOrg:
            "Dieses Projekt wird nicht von einer Organisation verwaltet. Wenn du einer Organisation angehörst, kannst du die Verwaltungsrechte an diese übertragen.",
        transferManagementToOrg: "Verwaltungsrechte übertragen",
        selectOrg: "Organisation wählen",
        projectManagedByOrg: (orgName: string) =>
            `Dieses Projekt wird von ${orgName} verwaltet. Die Standardwerte für Mitgleiderberechtigungen werden in den Organisationseinstellungen festgelegt. Du kannst sie unten überschreiben.`,
        removeFromOrg: "Aus Organisation entfernen",
        memberRemoved: "Mitglied erfolgreich entfernt",
        sureToRemoveMember: (memberName: string) => `Möchtest du ${memberName} wirklich aus diesem Team entfernen?`,
        ownershipTransfered: "Besitz erfolgreich übertragen",
        sureToTransferOwnership: (memberName: string) => `Möchtest du wirklich ${memberName} zum Besitzer machen?`,
    },

    organization: {
        orgDoesntHaveProjects: "Diese Organisation hat noch keine Projekte.",
        manageProjects: "Projekte verwalten",
        orgSettings: "Organizationseinstellungen",
        transferProjectsTip: "Du kannst über Projekteinstellungen > Mitglieder existierende Projekte zu dieser Organisation übertragen",
        noProjects_CreateOne: "Diese Organisation hat noch keine Projekte. Klicke auf den Knopf oben, um eines zu erstellen.",
        orgInfo: "Organisation",
        deleteOrg: "Organisation löschen",
        deleteOrgDesc:
            "Durch das Löschen deiner Organisation werden alle Projekte zum Organisationsinhaber verschoben. Das kann nicht rückgängig gemacht werden.",
        sureToDeleteOrg: "Bist du sicher, dass du diese Organisation löschen willst?",
        deleteOrgNamed: (orgName: string) => `Organisation ${orgName} löschen`,
        deletionWarning: "Dadurch wird die Organisation für immer gelöscht (also wirklich für immer immer).",

        perms: {
            edit_details: "Details bearbeiten",
            manage_invites: "Einladungen verwalten",
            remove_member: "Mitglied entfernen",
            edit_member: "Mitglied bearbeiten",
            add_project: "Projekt hinzufügen",
            remove_project: "Projekt entfernen",
            delete_organization: "Organisation löschen",
            edit_member_default_permissions: "Standard-Mitgliederberechtigungen bearbeiten",
        },
    },

    user: {
        moderator: "Moderator",
        doesntHaveProjects: (user: string) => `${user} hat noch keine Projekte.`,
        isntPartOfAnyOrgs: (user: string) => `${user} ist nicht Mitglied einer Organization.`,
        joined: (when: string) => `${capitalStart(when)} beigetreten`, // eg: Joined 2 months ago
    },

    footer: {
        company: "Firma",
        terms: "Nutzungsbedingunen",
        privacy: "Privatsphäre",
        rules: "Regeln",
        resources: "Resourcen",
        docs: "Dokumentation",
        status: "Status",
        support: "Support",
        socials: "Sociale Medien",
        about: "Über Uns",
        changeTheme: "Theme wechseln",
        siteOfferedIn: (site: string) => `${site} angeboten in:`,
    },

    legal: {
        legal: "Legal",
        rulesTitle: "Inhaltsregeln",
        contentRules: Rules,
        termsTitle: "Nutzungsbedingungen",
        copyrightPolicyTitle: "Copyright-Bestimmungen",
        securityNoticeTitle: "Sicherheitsinformation",
        privacyPolicyTitle: "Privatsphärebestimmungen",
    },

    moderation: {
        review: "Review projects",
        reports: "Meldungen",
        moderation: "Moderation",
        statistics: "Statistiken",
        authors: "Autoren",
        projectsInQueue: (count: number) => {
            if (count === 1) return "Es ist ein Projekt in der Warteschlange.";
            return `Es sind ${count} Projekte in der Warteschlange.`;
        },
        // hours will either be 24 or 48
        projectsQueuedFor: (count: number, hours: number) => {
            if (count === 1) return `Ein Projekt war über ${hours} Stunden in der Warteschlange.`;
            return `${count} Projekte waren über ${hours} Stunden in der Warteschlange.`;
        },
        submitted: (when: string) => `${capitalStart(when)} abgeschickt`, // eg: Submitted 4 hours ago, (the date string comes from the localized phrases defined at end of the file)
        viewProject: "Projekt anzeigen",
        awaitingApproval: "Project ist in der Warteschlange zur Zulassung",
        draft: "Entwurf",
        approve: "Zulassen",
        reject: "Ablehnen",
        withhold: "Zurückhalten",
    },

    form: {
        login: "Anmelden",
        login_withSpace: "Anmelden",
        signup: "Registrieren",
        email: "Email",
        username: "Nutzername",
        password: "Passwort",
        name: "Name",
        icon: "Icon",
        details: "Details",
        description: "Beschreibung",
        id: "ID",
        url: "URL",
        projectType: "Projekttyp",
        visibility: "Sichtbarkeit",
        summary: "Zusammenfassung",
        title: "Titel",
        ordering: "Sortierung",
        featured: "Vorgestellt",
        continue: "Fortfahren",
        submit: "Einreichen",
        remove: "Entfernen",
        confirm: "Bestätigen",
        edit: "Bearbeiten",
        delete: "Löschen",
        cancel: "Abbrechen",
        saveChanges: "Änderungen speichern",
        uploadIcon: "Icon hochladen",
        removeIcon: "Icon entfernen",
        noFileChosen: "Keine Datei gewählt",
        showAllVersions: "Zeige alle Versionen",
    },

    error: {
        sthWentWrong: "Ups! Etwas ist schiefgelaufen",
        errorDesc: "Sieht aus als wäre etwas kaputt. Während wir versuchen, das Problem zu lösen, kannst du versuchen, die Seite neu zu laden.",
        refresh: "Neu laden",
        pageNotFound: "404 | Seite nicht gefunden.",
        pageNotFoundDesc: "Sorry, wir konnten die Seite, nach der du gesucht hast, nicht finden.",
        projectNotFound: "Projekt nicht gefunden",
        projectNotFoundDesc: (type: string, slug: string) => `Ein/-e ${type} mit der ID "${slug}" existiert nicht.`,
    },

    editor: {
        heading1: "Überschrift 1",
        heading2: "Überschrift 2",
        heading3: "Überschrift 3",
        bold: "Fett",
        italic: "Italic",
        underline: "Unterstrichen",
        strikethrough: "Durchgestrichen",
        code: "Code",
        spoiler: "Spoiler",
        bulletedList: "Bulleted list",
        numberedList: "Numbered list",
        quote: "Zitat",
        insertLink: "Link einfügen",
        label: "Label",
        enterLabel: "Label eingeben",
        link: "Link", // Noun
        enterUrl: "Link-URL eingeben",
        insertImage: "Bild einfügen",
        imgAlt: "Beschriebung (alt-Text)",
        imgAltDesc: "Gib eine Beschreibung für das Bild ein",
        enterImgUrl: "Bild-URL eingeben",
        image: "Bild",
        inserYtVideo: "YouTube-Video einfügen",
        ytVideoUrl: "YouTube-Video-URL",
        enterYtUrl: "Gib die YouTube-Video-URL ein",
        video: "Video",
        preview: "Vorschau",
        insert: "Einfügen",
    },

    date: {
        justNow: "jetzt",
        minuteAgo: (mins: number) => {
            switch (mins) {
                case 1:
                    return "vor einer Minute";
                default:
                    return `vor ${mins} Minuten`;
            }
        },
        hourAgo: (hours: number) => {
            switch (hours) {
                case 1:
                    return "vor einer Stunde";
                default:
                    return `vor ${hours} Stunden`;
            }
        },
        dayAgo: (days: number) => {
            switch (days) {
                case 1:
                    return "gestern";
                default:
                    return `vor ${days} Tagen`;
            }
        },
        weekAgo: (weeks: number) => {
            switch (weeks) {
                case 1:
                    return "letzte Woche";
                default:
                    return `vor ${weeks} Wochen`;
            }
        },
        monthAgo: (months: number) => {
            switch (months) {
                case 1:
                    return "letzten Monat";
                default:
                    return `vor ${months} Monaten`;
            }
        },
        yearAgo: (years: number) => {
            switch (years) {
                case 1:
                    return "letztes Jahr";
                default:
                    return `vor ${years} Jahren`;
            }
        },
    },
} satisfies Locale;
