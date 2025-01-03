import type { Locale } from "~/locales/types";
import { Rules } from "./legal";
import tags from "./tags";

export default {
    common: {
        settings: "Configuración",
        success: "Éxito",
        error: "Error",
        home: "Inicio",
        somethingWentWrong: "¡Algo salió mal!",
        redirecting: "Redireccionando...",
        accept: "Aceptar",
        decline: "Rechazar",
        download: "Descargar",
        report: "Reportar",
        copyId: "Copiar ID",
        all: "Todo",
    },

    navbar: {
        mod: "mod",
        mods: "mods",
        datamod: "datamod",
        datamods: "datamods",
        "resource-pack": "paquete de recursos",
        "resource-packs": "paquetes de recursos",
        shader: "shader",
        shaders: "shaders",
        modpack: "paquete de mods",
        modpacks: "paquetes de mods",
        plugin: "plugin",
        plugins: "plugins",
        signout: "Cerrar sesión",
        dashboard: "Panel de control",
        profile: "Perfil",
        skipToMainContent: "Ir al contenido principal",
    },

    homePage: {
        title: "El lugar para {{projectType}} de Cosmic Reach",
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
        aggrement: "Al crear una cuenta, aceptas nuestros [Términos](/legal/terms) y [Política de privacidad](/legal/privacy).",
        invalidCode: "Código inválido o expirado",
        didntRequest: "¿No solicitaste esto?",
        checkSessions: "Verificar sesiones iniciadas",
        confirmNewPass: "Confirmar nueva contraseña",
        confirmNewPassDesc:
            "Recientemente se agregó una nueva contraseña a tu cuenta y está pendiente de confirmación. Confirma a continuación si fuiste tú.",
        newPass: "Nueva contraseña",
        newPass_label: "Ingresa tu nueva contraseña",
        confirmPass: "Confirmar contraseña",
        confirmPass_label: "Vuelve a ingresar tu contraseña",
        deleteAccount: "Eliminar cuenta",
        deleteAccountDesc:
            "Eliminar tu cuenta eliminará todos tus datos de nuestra base de datos. No hay vuelta atrás después de eliminar tu cuenta.",
        enterEmail: "Ingresa tu dirección de correo electrónico",
    },

    settings: {
        preferences: "Preferencias",
        publicProfile: "Perfil público",
        accountAndSecurity: "Cuenta y seguridad",
        sessions: "Sesiones",
        toggleFeatures: "Alternar funciones",
        enableOrDisableFeatures: "Habilita o deshabilita ciertas funciones en este dispositivo.",
        viewTransitions: "Ver transiciones",
        viewTransitionsDesc: "Habilita las transiciones (morph) al navegar entre páginas.",
        accountSecurity: "Seguridad de la cuenta",
        changePassTitle: "Cambia la contraseña de tu cuenta",
        addPassDesc: "Agrega una contraseña para usar el inicio de sesión con credenciales",
        manageAuthProviders: "Administrar proveedores de autenticación",
        manageProvidersDesc: "Agrega o elimina métodos de inicio de sesión de tu cuenta.",
        removePass: "Eliminar contraseña",
        removePassTitle: "Eliminar la contraseña de tu cuenta",
        removePassDesc: "Después de eliminar la contraseña, no podrás usar credenciales para iniciar sesión en tu cuenta",
        enterCurrentPass: "Ingresa tu contraseña actual",
        addPass: "Agregar contraseña",
        addPassDialogDesc: "Podrás usar esta contraseña para iniciar sesión en tu cuenta",
        manageProviders: "Administrar proveedores",
        linkedProviders: "Proveedores de autenticación vinculados",
        linkProvider: (provider: string) => `Vincular ${provider} a tu cuenta`,
        link: "Vincular", // Link as create a link
        sureToDeleteAccount: "¿Estás seguro de que quieres eliminar tu cuenta?",
        profileInfo: "Información de perfil",
        profileInfoDesc: (site: string) => `Tu información de perfil es visible públicamente en ${site}.`,
        profilePic: "Foto de perfil",
        bio: "Biografía",
        bioDesc: "Una breve descripción para contarles a todos un poco sobre ti.",
        visitYourProfile: "Visita tu perfil",
        showIpAddr: "Mostrar direcciones IP",
        sessionsDesc:
            "Estos dispositivos están actualmente iniciados sesión en tu cuenta, puedes revocar cualquier sesión en cualquier momento. Si ves algo que no reconoces, revoca inmediatamente la sesión y cambia la contraseña del proveedor de autenticación asociado.",
        ipHidden: "IP oculta",
        lastAccessed: (when: string) => `Último acceso ${when}`,
        created: (when: string) => `Creado ${when}`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Sesión creada usando ${providerName}`,
        currSession: "Sesión actual",
        revokeSession: "Revocar sesión",
    },

    dashboard: {
        dashboard: "Panel de control",
        overview: "Visión general",
        notifications: "Notificaciones",
        activeReports: "Reportes activos",
        analytics: "Analíticas",
        projects: "Proyectos",
        organizations: "Organizaciones",
        collections: "Colecciones",
        revenue: "Ingresos",
        manage: "Administrar",
        seeAll: "Ver todo",
        viewNotifHistory: "Ver historial de notificaciones",
        noUnreadNotifs: "No tienes notificaciones no leídas.",
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
        createProjectInfo: "No tienes ningún proyecto. Haz clic en el botón de arriba para crear uno.",
        type: "Tipo",
        status: "Estado",
        createProject: "Crear un proyecto",
        creatingProject: "Creando un proyecto",
        chooseProjectType: "Elige el tipo de proyecto",
        projectTypeDesc: "Selecciona el tipo apropiado para tu proyecto",
        createOrg: "Crear organización",
        createAnOrg: "Crear una organización",
        creatingOrg: "Creando una organización",
        enterOrgName: "Ingresa el nombre de la organización",
        enterOrgDescription: "Ingresa una breve descripción para tu organización",
    },

    search: {
        // Search labels
        project: "Buscar proyectos",
        mod: "Buscar mods",
        "resource-pack": "Buscar paquetes de recursos",
        shader: "Buscar shaders",
        plugin: "Buscar plugins",
        modpack: "Buscar paquetes de mods",
        datamod: "Buscar datamods",

        // Sorting methods
        showPerPage: "Mostrar por página",
        sortBy: "Ordenar por",
        relevance: "Relevancia",
        downloads: "Descargas",
        follow_count: "Seguidores",
        recently_updated: "Recientemente actualizado",
        recently_published: "Recientemente publicado",

        followers: "Seguidores",
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
        clearFilters: "Borrar todos los filtros",

        tags: tags,
    },

    project: {
        compatibility: "Compatibilidad",
        environments: "Entornos",
        reportIssues: "Informar problemas",
        viewSource: "Ver código fuente",
        visitWiki: "Visitar wiki",
        joinDiscord: "Unirse al servidor de Discord",
        featuredVersions: "Versiones destacadas",
        creators: "Creadores",
        organization: "Organización",
        project: "Proyecto",
        details: "Detalles",
        updatedAt: (when: string) => `Actualizado ${when}`, // ej.: Actualizado hace 3 días
        publishedAt: (when: string) => `Publicado ${when}`, // ej.: Publicado hace 3 días
        gallery: "Galería",
        changelog: "Registro de cambios",
        versions: "Versiones",
        noProjectDesc: "No se proporcionó descripción del proyecto",
        uploadNewImg: "Subir una nueva imagen de galería",
        uploadImg: "Subir imagen de galería",
        galleryOrderingDesc: "Las imágenes con un orden más alto se mostrarán primero.",
        featuredGalleryImgDesc:
            "Una imagen destacada de la galería aparece en la búsqueda y en la tarjeta de tu proyecto. Solo se puede destacar una imagen.",
        addGalleryImg: "Añadir imagen a la galería",
        featureImg: "Destacar imagen",
        unfeatureImg: "Quitar imagen destacada",
        sureToDeleteImg: "¿Estás seguro de que quieres eliminar esta imagen de la galería?",
        deleteImgDesc: "Esto eliminará esta imagen de la galería para siempre (de verdad, para siempre).",
        editGalleryImg: "Editar imagen de la galería",
        currImage: "Imagen actual",

        // Version
        uploadVersion: "Subir una versión",
        uploadNewVersion: "Subir una nueva versión del proyecto",
        showDevVersions: "Mostrar versiones de desarrollo",
        noProjectVersions: "No se encontraron versiones del proyecto",
        stats: "Estadísticas",
        published: "Publicado", // Usado para encabezados de tabla
        downloads: "Descargas", // Usado para encabezados de tabla
        openInNewTab: "Abrir en una nueva pestaña",
        copyLink: "Copiar enlace",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} no es compatible con ${version} para ${loader}`;
        },
        downloadProject: (project: string) => `Descargar ${project}`,
        gameVersion: "Versión del juego:",
        selectGameVersion: "Seleccionar versión del juego",
        platform: "Plataforma:",
        selectPlatform: "Seleccionar plataforma",
        onlyAvailableFor: (project: string, platform: string) => `${project} solo está disponible para ${platform}`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) => `No hay versiones disponibles para ${gameVersion} en ${loader}`,
        declinedInvitation: "Invitación rechazada",
        teamInvitationTitle: (teamType: string) => `Invitación para unirse a ${teamType}`, // teamType = organización | proyecto
        teamInviteDesc: (teamType: string, role: string) => `Has sido invitado a ser miembro de esta ${teamType} con el rol de '${role}'.`,

        browse: {
            mod: "Explorar mods",
            datamod: "Explorar datamods",
            "resource-pack": "Explorar paquetes de recursos",
            shader: "Explorar shaders",
            modpack: "Explorar modpacks",
            plugin: "Explorar plugins",
        },
    },

    version: {
        deleteVersion: "Eliminar versión",
        sureToDelete: "¿Estás seguro de que quieres eliminar esta versión?",
        deleteDesc: "Esto eliminará esta versión para siempre (de verdad, para siempre).",
        enterVersionTitle: "Introduce el título de la versión...",
        feature: "Destacar versión",
        unfeature: "Quitar versión destacada",
        featured: "Destacada",
        releaseChannel: "Canal de lanzamiento",
        versionNumber: "Número de versión",
        selectLoaders: "Seleccionar cargadores",
        selectVersions: "Seleccionar versiones",
        cantAddCurrProject: "No puedes añadir el proyecto actual como dependencia",
        cantAddDuplicateDep: "No puedes añadir la misma dependencia dos veces",
        addDep: "Añadir dependencia",
        enterProjectId: "Introduce el ID/Slug del proyecto",
        enterVersionId: "Introduce el ID/Slug de la versión",
        dependencies: "Dependencias",
        files: "Archivos",

        depencency: {
            required: "Requerida",
            optional: "Opcional",
            incompatible: "Incompatible",
            embedded: "Integrada",
            required_desc: (version: string) => `Se requiere la versión ${version}`,
            optional_desc: (version: string) => `La versión ${version} es opcional`,
            incompatible_desc: (version: string) => `La versión ${version} es incompatible`,
            embedded_desc: (version: string) => `La versión ${version} está integrada`,
        },

        primary: "Primario",
        noPrimaryFile: "No se eligió archivo primario",
        chooseFile: "Elegir archivo",
        replaceFile: "Reemplazar archivo",
        uploadExtraFiles: "Subir archivos adicionales",
        uploadExtraFilesDesc: "Usado para archivos adicionales como fuentes, documentación, etc.",
        selectFiles: "Seleccionar archivos",
        primaryFileRequired: "El archivo primario es obligatorio",
        metadata: "Metadatos",
        devReleasesNote:
            "NOTA: Las versiones de desarrollo más antiguas se eliminarán automáticamente después de que se publique una nueva versión de desarrollo.",
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
        issueTrackerDesc: "Un lugar para que los usuarios reporten errores, problemas y preocupaciones sobre tu proyecto.",
        sourceCode: "Código fuente",
        sourceCodeDesc: "Una página/repositorio que contiene el código fuente de tu proyecto.",
        wikiPage: "Página wiki",
        wikiPageDesc: "Una página con información, documentación y ayuda para el proyecto.",
        discordInvite: "Invitación de Discord",
        discordInviteDesc: "Un enlace de invitación a tu servidor de Discord.",
        licenseDesc1: (projectType: string) =>
            `Es muy importante elegir una licencia adecuada para tu ${projectType}. Puedes elegir una de nuestra lista o proporcionar una licencia personalizada. También puedes proporcionar una URL personalizada para tu licencia elegida; de lo contrario, se mostrará el texto de la licencia.`,
        licenseDesc2:
            "Ingresa un [identificador de licencia SPDX](https://spdx.org/licenses) válido en el área marcada. Si tu licencia no tiene un identificador SPDX (por ejemplo, si creaste la licencia tú mismo o es específica de Cosmic Reach), simplemente marca la casilla e ingresa el nombre de la licencia.",
        selectLicense: "Seleccionar licencia",
        custom: "Personalizado",
        licenseName: "Nombre de la licencia",
        licenseUrl: "URL de la licencia (opcional)",
        spdxId: "Identificador SPDX",
        doesntHaveSpdxId: "La licencia no tiene un identificador SPDX",
        tagsDesc:
            "Etiquetar con precisión es importante para ayudar a las personas a encontrar tu mod. Asegúrate de seleccionar todas las etiquetas aplicables.",
        tagsDesc2: (projectType: string) => `Selecciona todas las categorías que reflejen los temas o funciones de tu ${projectType}.`,
        featuredCategories: "Categorías destacadas",
        featuredCategoriesDesc: (count: number) => `Puedes destacar hasta ${count} de tus etiquetas más relevantes.`,
        selectAtLeastOneCategory: "Selecciona al menos una categoría para destacar una.",
        projectInfo: "Información del proyecto",
        clientSide: "Del lado del cliente",
        clientSideDesc: (projectType: string) => `Selecciona si tu ${projectType} tiene funcionalidad del lado del cliente.`,
        serverSide: "Del lado del servidor",
        serverSideDesc: (projectType: string) => `Selecciona si tu ${projectType} tiene funcionalidad en el servidor lógico.`,
        unknown: "Desconocido",
        required: "Requerido",
        optional: "Opcional",
        unsupported: "No compatible",
        visibilityDesc:
            "Los proyectos listados y archivados son visibles en la búsqueda. Los proyectos no listados están publicados, pero no son visibles en la búsqueda ni en los perfiles de usuario. Los proyectos privados solo son accesibles para los miembros del proyecto.",
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
            `Elimina tu proyecto de los servidores y la búsqueda de ${site}. ¡Al hacer clic aquí, eliminarás tu proyecto, así que ten mucho cuidado!`,
        sureToDeleteProject: "¿Estás seguro de que deseas eliminar este proyecto?",
        deleteProjectDesc2:
            "Si continúas, todas las versiones y cualquier dato adjunto serán eliminados de nuestros servidores. Esto podría afectar a otros proyectos, así que ten cuidado.",
        typeToVerify: (projectName: string) => `Para verificar, escribe **${projectName}** abajo:`,
        typeHere: "Escribe aquí...",
        manageMembers: "Gestionar miembros",
        leftProjectTeam: "Has salido del equipo",
        leaveOrg: "Salir de la organización",
        leaveProject: "Salir del proyecto",
        leaveOrgDesc: "Quítate como miembro de esta organización.",
        leaveProjectDesc: "Quítate como miembro de este proyecto.",
        sureToLeaveTeam: "¿Estás seguro de que deseas salir de este equipo?",
        cantManageInvites: "No tienes acceso para gestionar invitaciones de miembros",
        inviteMember: "Invitar a un miembro",
        inviteProjectMemberDesc: "Ingresa el nombre de usuario de la persona que deseas invitar como miembro de este proyecto.",
        inviteOrgMemberDesc: "Ingresa el nombre de usuario de la persona que deseas invitar como miembro de esta organización.",
        invite: "Invitar",
        memberUpdated: "Miembro actualizado con éxito",
        pending: "Pendiente",
        role: "Rol",
        roleDesc: "El título del rol que este miembro desempeña para este equipo.",
        permissions: "Permisos",
        perms: {
            upload_version: "Subir versión",
            delete_version: "Eliminar versión",
            edit_details: "Editar detalles",
            edit_description: "Editar descripción",
            manage_invites: "Gestionar invitaciones",
            remove_member: "Eliminar miembro",
            edit_member: "Editar miembro",
            delete_project: "Eliminar proyecto",
            view_analytics: "Ver análisis",
            view_revenue: "Ver ingresos",
        },
        owner: "Propietario",
        removeMember: "Eliminar miembro",
        transferOwnership: "Transferir propiedad",
        overrideValues: "Sobrescribir valores",
        overrideValuesDesc:
            "Sobrescribe los valores predeterminados de la organización y asigna permisos y roles personalizados a este usuario en el proyecto.",
        projectNotManagedByOrg:
            "Este proyecto no está gestionado por una organización. Si eres miembro de alguna organización, puedes transferir la gestión a una de ellas.",
        transferManagementToOrg: "Transferir gestión",
        selectOrg: "Seleccionar organización",
        projectManagedByOrg: (orgName: string) =>
            `Este proyecto está gestionado por ${orgName}. Los valores predeterminados para los permisos de los miembros están configurados en los ajustes de la organización. Puedes sobrescribirlos a continuación.`,
        removeFromOrg: "Eliminar de la organización",
        memberRemoved: "Miembro eliminado con éxito",
        sureToRemoveMember: (memberName: string) => `¿Estás seguro de que deseas eliminar a ${memberName} de este equipo?`,
        ownershipTransfered: "Propiedad transferida con éxito",
        sureToTransferOwnership: (memberName: string) => `¿Estás seguro de que deseas transferir la propiedad a ${memberName}?`,
    },

    organization: {
        orgDoesntHaveProjects: "Esta organización no tiene proyectos aún.",
        manageProjects: "Gestionar proyectos",
        orgSettings: "Configuración de la organización",
        transferProjectsTip: "Puedes transferir tus proyectos existentes a esta organización desde: Configuración del proyecto > Miembros",
        noProjects_CreateOne: "Esta organización no tiene proyectos. Haz clic en el botón de arriba para crear uno.",
        orgInfo: "Información de la organización",
        deleteOrg: "Eliminar organización",
        deleteOrgDesc:
            "Eliminar tu organización transferirá todos sus proyectos al propietario de la organización. Esta acción no se puede deshacer.",
        sureToDeleteOrg: "¿Estás seguro de que deseas eliminar esta organización?",
        deleteOrgNamed: (orgName: string) => `Eliminar la organización ${orgName}`,
        deletionWarning: "Esto eliminará esta organización para siempre (sí, para siempre).",

        membersCount: (count: number) => {
            switch (count) {
                case 1:
                    return "1 miembro";
                default:
                    return `${count} miembros`;
            }
        },
        perms: {
            edit_details: "Editar detalles",
            manage_invites: "Gestionar invitaciones",
            remove_member: "Eliminar miembro",
            edit_member: "Editar miembro",
            add_project: "Agregar proyecto",
            remove_project: "Eliminar proyecto",
            delete_organization: "Eliminar organización",
            edit_member_default_permissions: "Editar permisos predeterminados de miembro",
        },
    },

    user: {
        doesntHaveProjects: (user: string) => `${user} no tiene proyectos aún.`,
        isntPartOfAnyOrgs: (user: string) => `${user} no es miembro de ninguna organización.`,
        moderator: "Moderador",
        projectsCount: (count: number) => (count === 1 ? "1 proyecto" : `${count} proyectos`),
        downloads: (count: string) => `${count} descargas`,
        joined: (when: string) => `Se unió hace ${when}`, // Ejemplo: Se unió hace 2 meses
    },

    footer: {
        company: "Compañía",
        terms: "Términos",
        privacy: "Privacidad",
        rules: "Reglas",
        resources: "Recursos",
        docs: "Documentación",
        status: "Estado",
        support: "Soporte",
        socials: "Redes sociales",
        about: "Acerca de",
        changeTheme: "Cambiar tema",
        siteOfferedIn: (site: string) => `Ofrecido por ${site} en:`,
    },

    legal: {
        rulesTitle: "Reglas de Contenido",
        contentRules: Rules,
        termsTitle: "Términos de Uso",
        copyrightPolicyTitle: "Política de Derechos de Autor",
        securityNoticeTitle: "Aviso de Seguridad",
        privacyPolicyTitle: "Política de Privacidad",
    },

    form: {
        login: "Iniciar sesión",
        login_withSpace: "Iniciar Sesión",
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
        noFileChosen: "No se eligió ningún archivo",
        showAllVersions: "Mostrar todas las versiones",
    },

    error: {
        sthWentWrong: "¡Ups! Algo salió mal",
        errorDesc: "Parece que algo falló. Mientras intentamos resolver el problema, intenta refrescar la página.",
        refresh: "Refrescar",
        pageNotFound: "404 | Página no encontrada.",
        pageNotFoundDesc: "Lo sentimos, no pudimos encontrar la página que buscas.",
        projectNotFound: "Proyecto no encontrado",
        projectNotFoundDesc: (type, slug) => `El ${type} con el slug/ID "${slug}" no existe.`,
    },

    editor: {
        heading1: "Encabezado 1",
        heading2: "Encabezado 2",
        heading3: "Encabezado 3",
        bold: "Negrita",
        italic: "Cursiva",
        underline: "Subrayado",
        strikethrough: "Tachado",
        code: "Código",
        spoiler: "Spoiler",
        bulletedList: "Lista con viñetas",
        numberedList: "Lista numerada",
        quote: "Cita",
        insertLink: "Insertar enlace",
        label: "Etiqueta",
        enterLabel: "Introducir etiqueta",
        link: "Enlace", // Enlace como sustantivo (URL)
        enterUrl: "Introducir la URL del enlace",
        insertImage: "Insertar imagen",
        imgAlt: "Descripción (texto alternativo)",
        imgAltDesc: "Introduce una descripción para la imagen",
        enterImgUrl: "Introduce la URL de la imagen",
        image: "Imagen",
        inserYtVideo: "Insertar video de YouTube",
        ytVideoUrl: "URL del video de YouTube",
        enterYtUrl: "Introduce la URL del video de YouTube",
        video: "Video",
        preview: "Vista previa",
        insert: "Insertar",
    },

    date: {
        justNow: "justo ahora",
        minuteAgo: (mins) => {
            switch (mins) {
                case 1:
                    return "hace un minuto";
                default:
                    return `hace ${mins} minutos`;
            }
        },
        hourAgo: (hours) => {
            switch (hours) {
                case 1:
                    return "hace una hora";
                default:
                    return `hace ${hours} horas`;
            }
        },
        dayAgo: (days) => {
            switch (days) {
                case 1:
                    return "ayer";
                default:
                    return `hace ${days} días`;
            }
        },
        weekAgo: (weeks) => {
            switch (weeks) {
                case 1:
                    return "la semana pasada";
                default:
                    return `hace ${weeks} semanas`;
            }
        },
        monthAgo: (months) => {
            switch (months) {
                case 1:
                    return "el mes pasado";
                default:
                    return `hace ${months} meses`;
            }
        },
        yearAgo: (years) => {
            switch (years) {
                case 1:
                    return "el año pasado";
                default:
                    return `hace ${years} años`;
            }
        },
    },
} satisfies Locale;
