import type { Locale } from "../types";
import { Rules } from "./legal";
import tags from "./tags";

export default {
    common: {
        settings: "Configuraciones",
        success: "Éxito",
        error: "Error",
        home: "Inicio",
        somethingWentWrong: "¡Algo salió mal!",
        redirecting: "Redirigiendo...",
        accept: "Aceptar",
        decline: "Rechazar",
        download: "Descargar",
        report: "Reportar",
        copyId: "Copiar ID",
    },

    navbar: {
        mod: "mod",
        mods: "mods",
        datamod: "datamod",
        datamods: "datamods",
        "resource-pack": "paquete de recursos",
        "resource-packs": "paquetes de recursos",
        shader: "sombreado",
        shaders: "sombreados",
        modpack: "modpack",
        modpacks: "modpacks",
        plugin: "plugin",
        plugins: "plugins",
        signout: "Cerrar sesión",
        dashboard: "Tablero",
    },

    homePage: {
        title: "El lugar para Cosmic Reach",
        desc: "El mejor lugar para tus mods de Cosmic Reach. Descubre, juega y crea contenido, todo en un solo lugar.",
        exploreMods: "Explorar mods",
    },

    auth: {
        email: "Correo electrónico",
        password: "Contraseña",
        changePassword: "Cambiar contraseña",
        dontHaveAccount: "¿No tienes una cuenta?",
        alreadyHaveAccount: "¿Ya tienes una cuenta?",
        forgotPassword: "¿Olvidaste tu contraseña?",
        signupWithProviders: "Regístrate usando cualquiera de los proveedores de autenticación:",
        aggrement: "Al crear una cuenta, aceptas nuestros [Términos](/legal/terms) y [Política de Privacidad](/legal/privacy).",
        invalidCode: "Código inválido o expirado",
        didntRequest: "¿No solicitaste esto?",
        checkSessions: "Ver sesiones iniciadas",
        confirmNewPass: "Confirmar nueva contraseña",
        confirmNewPassDesc:
            "Se ha añadido recientemente una nueva contraseña a tu cuenta y está pendiente de confirmación. Confirma a continuación si fuiste tú.",
        newPass: "Nueva contraseña",
        newPass_label: "Introduce tu nueva contraseña",
        confirmPass: "Confirmar contraseña",
        confirmPass_label: "Reingresa tu contraseña",
        deleteAccount: "Eliminar cuenta",
        deleteAccountDesc:
            "Eliminar tu cuenta eliminará todos tus datos de nuestra base de datos. No hay vuelta atrás después de eliminar tu cuenta.",
        enterEmail: "Introduce tu dirección de correo electrónico",
    },

    settings: {
        preferences: "Preferencias",
        publicProfile: "Perfil público",
        accountAndSecurity: "Cuenta y seguridad",
        sessions: "Sesiones",
        toggleFeatures: "Activar o desactivar funciones",
        enableOrDisableFeatures: "Habilitar o deshabilitar ciertas funciones en este dispositivo.",
        viewTransitions: "Transiciones de vista",
        viewTransitionsDesc: "Habilita transiciones (morfosis y desvanecimiento) al navegar entre páginas.",
        accountSecurity: "Seguridad de la cuenta",
        changePassTitle: "Cambia la contraseña de tu cuenta",
        addPassDesc: "Añade una contraseña para usar el inicio de sesión con credenciales",
        manageAuthProviders: "Gestionar proveedores de autenticación",
        manageProvidersDesc: "Añadir o eliminar métodos de inicio de sesión de tu cuenta.",
        removePass: "Eliminar contraseña",
        removePassTitle: "Eliminar la contraseña de tu cuenta",
        removePassDesc: "Después de eliminar tu contraseña, no podrás usar credenciales para iniciar sesión en tu cuenta",
        enterCurrentPass: "Introduce tu contraseña actual",
        addPass: "Añadir contraseña",
        addPassDialogDesc: "Podrás usar esta contraseña para iniciar sesión en tu cuenta",
        manageProviders: "Gestionar proveedores",
        linkedProviders: "Proveedores de autenticación vinculados",
        linkProvider: (provider: string) => `Vincular ${provider} a tu cuenta`,
        link: "Vincular",
        sureToDeleteAccount: "¿Estás seguro de que quieres eliminar tu cuenta?",
        profileInfo: "Información del perfil",
        profileInfoDesc: (site: string) => `La información de tu perfil es visible públicamente en ${site}.`,
        profilePic: "Foto de perfil",
        bio: "Biografía",
        bioDesc: "Una breve descripción para contarle a todos un poco sobre ti.",
        visitYourProfile: "Visita tu perfil",
        showIpAddr: "Mostrar direcciones IP",
        sessionsDesc:
            "Estos dispositivos están actualmente conectados a tu cuenta, puedes revocar cualquier sesión en cualquier momento. Si ves algo que no reconoces, revoca la sesión inmediatamente y cambia la contraseña del proveedor de autenticación asociado.",
        ipHidden: "IP Oculta",
        lastAccessed: "Último acceso",
        created: "Creado", // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Sesión creada usando ${providerName}`,
        currSession: "Sesión actual",
        revokeSession: "Revocar sesión",
    },

    dashboard: {
        dashboard: "Tablero",
        overview: "Resumen",
        notifications: "Notificaciones",
        activeReports: "Reportes activos",
        analytics: "Analíticas",
        projects: "Proyectos",
        organizations: "Organizaciones",
        collections: "Colecciones",
        revenue: "Ingresos",
        manage: "Gestionar",
        seeAll: "Ver todo",
        viewNotifHistory: "Ver historial de notificaciones",
        noUnreadNotifs: "No tienes notificaciones sin leer.",
        totalDownloads: "Descargas totales",
        fromProjects: (count: number) => `de ${count} proyectos`,
        totalFollowers: "Seguidores totales",
        viewHistory: "Ver historial",
        markAllRead: "Marcar todo como leído",
        markRead: "Marcar como leído",
        deleteNotif: "Eliminar notificación",
        received: "Recibido",
        history: "Historial",
        notifHistory: "Historial de notificaciones",
        createProjectInfo: "No tienes proyectos. Haz clic en el botón de arriba para crear uno.",
        type: "Tipo",
        status: "Estado",
        createProject: "Crear un proyecto",
        creatingProject: "Creando un proyecto",
        chooseProjectType: "Elige el tipo de proyecto",
        projectTypeDesc: "Selecciona el tipo adecuado para tu proyecto",
        createOrg: "Crear organización",
        createAnOrg: "Crear una organización",
        creatingOrg: "Creando una organización",
        enterOrgName: "Introduce el nombre de la organización",
        enterOrgDescription: "Introduce una breve descripción para tu organización",
    },

    search: {
        // Search labels
        project: "Buscar proyectos",
        mod: "Buscar mods",
        "resource-pack": "Buscar paquetes de recursos",
        shader: "Buscar sombreados",
        plugin: "Buscar plugins",
        modpack: "Buscar modpacks",
        datamod: "Buscar datamods",

        // Sorting methods
        sortBy: "Ordenar por",
        relevance: "Relevancia",
        downloads: "Descargas",
        follow_count: "Cantidad de seguidores",
        recently_updated: "Recientemente actualizado",
        recently_published: "Recientemente publicado",

        filters: "Filtros",
        searchFilters: "Filtros de búsqueda",
        loaders: "Cargadores",
        gameVersions: "Versiones del juego",
        channels: "Canales",
        environment: "Entorno",
        categories: "Categorías",
        features: "Características",
        resolutions: "Resoluciones",
        performanceImpact: "Impacto en el rendimiento",
        license: "Licencia",
        openSourceOnly: "Solo código abierto",
        clearFilters: "Limpiar todos los filtros",

        tags: tags,
    },

    project: {
        compatibility: "Compatibilidad",
        environments: "Entornos",
        reportIssues: "Reportar problemas",
        viewSource: "Ver código fuente",
        visitWiki: "Visitar wiki",
        joinDiscord: "Unirse al servidor de discord",
        featuredVersions: "Versiones destacadas",
        creators: "Creadores",
        organization: "Organización",
        project: "Proyecto",
        details: "Detalles",
        updated: "Actualizado", // eg: Updated 3 days ago
        gallery: "Galería",
        changelog: "Registro de cambios",
        versions: "Versiones",
        noProjectDesc: "No se proporcionó descripción del proyecto",
        uploadNewImg: "Subir una nueva imagen a la galería",
        uploadImg: "Subir imagen a la galería",
        galleryOrderingDesc: "La imagen con mayor orden se listará primero.",
        featuredGalleryImgDesc:
            "Una imagen destacada de la galería aparece en la búsqueda y en la tarjeta de tu proyecto. Solo una imagen de la galería puede ser destacada.",
        addGalleryImg: "Añadir imagen a la galería",
        featureImg: "Destacar imagen",
        unfeatureImg: "Quitar imagen destacada",
        sureToDeleteImg: "¿Estás seguro de que quieres eliminar esta imagen de la galería?",
        deleteImgDesc: "Esto eliminará esta imagen de la galería para siempre (como realmente para siempre).",
        editGalleryImg: "Editar imagen de la galería",
        currImage: "Imagen actual",

        // Version
        uploadVersion: "Subir una versión",
        uploadNewVersion: "Subir una nueva versión del proyecto",
        showDevVersions: "Mostrar versiones de desarrollo",
        noProjectVersions: "No se encontraron versiones del proyecto",
        stats: "Estadísticas",
        published: "Publicado", // Used for table headers
        downloads: "Descargas", // Used for table headers
        openInNewTab: "Abrir en una nueva pestaña",
        copyLink: "Copiar enlace",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} no soporta ${version} para ${loader}`;
        },
        downloadProject: (project: string) => `Descargar ${project}`,
        gameVersion: "Versión del juego:",
        selectGameVersion: "Seleccionar versión del juego",
        platform: "Plataforma:",
        selectPlatform: "Seleccionar plataforma",
        onlyAvailableFor: (project: string, platform: string) => `${project} solo está disponible para ${platform}`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) => `No hay versiones disponibles para ${gameVersion} en ${loader}`,
        declinedInvitation: "Invitación rechazada",
        teamInvitationTitle: (teamType: string) => `Invitación para unirse a ${teamType}`, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) => `Has sido invitado a ser miembro de esta ${teamType} con el rol de '${role}'.`,

        browse: {
            mod: "Explorar mods",
            datamod: "Explorar datamods",
            "resource-pack": "Explorar paquetes de recursos",
            shader: "Explorar sombreados",
            modpack: "Explorar modpacks",
            plugin: "Explorar plugins",
        },
    },

    version: {
        deleteVersion: "Eliminar versión",
        sureToDelete: "¿Estás seguro de que quieres eliminar esta versión?",
        deleteDesc: "Esto eliminará esta versión para siempre (de verdad para siempre).",
        enterVersionTitle: "Introduce el título de la versión...",
        feature: "Destacar versión",
        unfeature: "Quitar de destacados",
        featured: "Destacado",
        releaseChannel: "Canal de lanzamiento",
        versionNumber: "Número de versión",
        selectLoaders: "Seleccionar cargadores",
        selectVersions: "Seleccionar versiones",
        cantAddCurrProject: "No puedes agregar el proyecto actual como una dependencia",
        cantAddDuplicateDep: "No puedes agregar la misma dependencia dos veces",
        addDep: "Agregar dependencia",
        enterProjectId: "Introduce el ID/Slug del proyecto",
        enterVersionId: "Introduce el ID/Slug de la versión",
        dependencies: "Dependencias",
        files: "Archivos",

        depencency: {
            required: "Requerido",
            optional: "Opcional",
            incompatible: "Incompatible",
            embedded: "Incorporado",
            required_desc: (version: string) => `La versión ${version} es requerida`,
            optional_desc: (version: string) => `La versión ${version} es opcional`,
            incompatible_desc: (version: string) => `La versión ${version} es incompatible`,
            embedded_desc: (version: string) => `La versión ${version} está incorporada`,
        },

        primary: "Primario",
        noPrimaryFile: "No se ha elegido archivo primario",
        chooseFile: "Elegir archivo",
        replaceFile: "Reemplazar archivo",
        uploadExtraFiles: "Subir archivos adicionales",
        uploadExtraFilesDesc: "Usado para archivos adicionales como fuentes, documentación, etc.",
        selectFiles: "Seleccionar archivos",
        primaryFileRequired: "Se requiere archivo primario",
        metadata: "Metadatos",
        devReleasesNote:
            "NOTA: Las versiones de desarrollo más antiguas se eliminarán automáticamente después de publicar una nueva versión de desarrollo.",
        publicationDate: "Fecha de publicación",
        publisher: "Editor",
        versionID: "ID de versión",
        copySha1: "Copiar hash SHA-1",
        copySha512: "Copiar hash SHA-512",
        copyFileUrl: "Copiar URL del archivo",
    },

    projectSettings: {
        settings: "Configuración del proyecto",
        general: "General",
        tags: "Etiquetas",
        links: "Enlaces",
        members: "Miembros",
        view: "Ver",
        upload: "Subir",
        externalLinks: "Enlaces externos",
        issueTracker: "Rastreador de problemas",
        issueTrackerDesc: "Un lugar para que los usuarios informen errores, problemas y preocupaciones sobre tu proyecto.",
        sourceCode: "Código fuente",
        sourceCodeDesc: "Una página/repositorio que contiene el código fuente de tu proyecto.",
        wikiPage: "Página wiki",
        wikiPageDesc: "Una página que contiene información, documentación y ayuda para el proyecto.",
        discordInvite: "Invitación de Discord",
        discordInviteDesc: "Un enlace de invitación a tu servidor de Discord.",
        licenseDesc1: (projectType: string) =>
            `Es muy importante elegir una licencia adecuada para tu ${projectType}. Puedes elegir una de nuestra lista o proporcionar una licencia personalizada. También puedes proporcionar una URL personalizada para tu licencia elegida; de lo contrario, se mostrará el texto de la licencia.`,
        licenseDesc2:
            "Introduce un identificador de licencia [SPDX](https://spdx.org/licenses) válido en el área marcada. Si tu licencia no tiene un identificador SPDX (por ejemplo, si creaste la licencia tú mismo o si la licencia es específica de Cosmic Reach), simplemente marca la casilla e introduce el nombre de la licencia en su lugar.",
        selectLicense: "Seleccionar licencia",
        custom: "Personalizado",
        licenseName: "Nombre de la licencia",
        licenseUrl: "URL de la licencia (opcional)",
        spdxId: "Identificador SPDX",
        doesntHaveSpdxId: "La licencia no tiene un identificador SPDX",
        tagsDesc:
            "El etiquetado preciso es importante para ayudar a las personas a encontrar tu mod. Asegúrate de seleccionar todas las etiquetas que correspondan.",
        tagsDesc2: (projectType: string) => `Selecciona todas las categorías que reflejen los temas o la función de tu ${projectType}.`,
        featuredCategories: "Categorías destacadas",
        featuredCategoriesDesc: (count: number) => `Puedes destacar hasta ${count} de tus etiquetas más relevantes.`,
        selectAtLeastOneCategory: "Selecciona al menos una categoría para destacar una categoría.",
        projectInfo: "Información del proyecto",
        clientSide: "Lado del cliente",
        clientSideDesc: (projectType: string) => `Selecciona según si tu ${projectType} tiene funcionalidad en el lado del cliente.`,
        serverSide: "Lado del servidor",
        serverSideDesc: (projectType: string) => `Selecciona según si tu ${projectType} tiene funcionalidad en el servidor lógico.`,
        unknown: "Desconocido",
        required: "Requerido",
        optional: "Opcional",
        unsupported: "No soportado",
        visibilityDesc:
            "Los proyectos listados y archivados son visibles en la búsqueda. Los proyectos no listados están publicados, pero no son visibles en la búsqueda ni en los perfiles de usuario. Los proyectos privados solo son accesibles por los miembros del proyecto.",
        ifApproved: "Si es aprobado por los moderadores:",
        visibleInSearch: "Visible en la búsqueda",
        visibleOnProfile: "Visible en el perfil",
        visibleViaUrl: "Visible a través de la URL",
        visibleToMembersOnly: "Solo los miembros podrán ver el proyecto",
        listed: "Listado",
        private: "Privado",
        unlisted: "No listado",
        archived: "Archivado",
        deleteProject: "Eliminar proyecto",
        deleteProjectDesc: (site: string) =>
            `Elimina tu proyecto de los servidores y la búsqueda de ${site}. Hacer clic en esto eliminará tu proyecto, ¡así que ten mucho cuidado!`,
        sureToDeleteProject: "¿Estás seguro de que quieres eliminar este proyecto?",
        deleteProjectDesc2:
            "Si continúas, todas las versiones y cualquier dato adjunto se eliminarán de nuestros servidores. Esto puede romper otros proyectos, así que ten cuidado.",
        typeToVerify: (projectName: string) => `Para verificar, escribe **${projectName}** a continuación:`,
    },

    footer: {
        company: "Compañía",
        terms: "Términos",
        privacy: "Privacidad",
        rules: "Reglas",
        resources: "Recursos",
        docs: "Documentos",
        status: "Estado",
        support: "Soporte",
        socials: "Redes sociales",
        about: "Acerca de",
        changeTheme: "Cambiar tema",
    },

    legal: {
        rulesTitle: "Reglas de contenido",
        rules: Rules,

        termsTitle: "Términos de uso",
        copyrightPolicyTitle: "Política de derechos de autor",
        securityNoticeTitle: "Aviso de seguridad",
        privacyPolicyTitle: "Política de privacidad",
    },

    form: {
        login: "Iniciar sesión",
        login_withSpace: "Iniciar sesión",
        signup: "Registrarse",
        email: "Correo electrónico",
        username: "Nombre de usuario",
        password: "Contraseña",
        name: "Nombre",
        icon: "Icono",
        details: "Detalles",
        description: "Descripción",
        id: "ID",
        url: "URL",
        projectType: "Tipo de proyecto",
        visibility: "Visibilidad",
        summary: "Resumen",
        title: "Título",
        ordering: "Orden",
        featured: "Destacado",
        continue: "Continuar",
        submit: "Enviar",
        remove: "Eliminar",
        confirm: "Confirmar",
        edit: "Editar",
        delete: "Eliminar",
        cancel: "Cancelar",
        saveChanges: "Guardar cambios",
        uploadIcon: "Subir icono",
        removeIcon: "Eliminar icono",
        noFileChosen: "No se ha elegido archivo",
        showAllVersions: "Mostrar todas las versiones",
    },

    error: {
        sthWentWrong: "¡Ups! Algo salió mal",
        errorDesc: "Parece que algo se rompió, mientras intentamos resolver el problema intenta refrescar la página.",
        refresh: "Refrescar",
        pageNotFound: "404 | Página no encontrada.",
        pageNotFoundDesc: "Lo sentimos, no pudimos encontrar la página que estás buscando.",
        projectNotFound: "Proyecto no encontrado",
        projectNotFoundDesc: (type: string, slug: string) => `El ${type} con el slug/ID "${slug}" no existe.`,
    },

    date: {
        justNow: "justo ahora",
        minuteAgo: (mins: number) => {
            switch (mins) {
                case 1:
                    return "hace un minuto";
                default:
                    return `hace ${mins} minutos`;
            }
        },
        hourAgo: (hours: number) => {
            switch (hours) {
                case 1:
                    return "hace una hora";
                default:
                    return `hace ${hours} horas`;
            }
        },
        dayAgo: (days: number) => {
            switch (days) {
                case 1:
                    return "ayer";
                default:
                    return `hace ${days} días`;
            }
        },
        weekAgo: (weeks: number) => {
            switch (weeks) {
                case 1:
                    return "la semana pasada";
                default:
                    return `hace ${weeks} semanas`;
            }
        },
        monthAgo: (months: number) => {
            switch (months) {
                case 1:
                    return "el mes pasado";
                default:
                    return `hace ${months} meses`;
            }
        },
        yearAgo: (years: number) => {
            switch (years) {
                case 1:
                    return "el año pasado";
                default:
                    return `hace ${years} años`;
            }
        },
    },
} satisfies Locale;
