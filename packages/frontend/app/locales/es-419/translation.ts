import type { Translation } from "~/locales/types";
import { Rules } from "./legal";
import tags from "./tags";

export default {
    common: {
        settings: "Ajustes",
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
        desc: "El mejor lugar para tus mods de Cosmic Reach. Descubre, juega y crea contenido, todo en un solo sitio.",
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
        checkSessions: "Revisar sesiones iniciadas",
        confirmNewPass: "Confirmar nueva contraseña",
        confirmNewPassDesc:
            "Recientemente se añadió una nueva contraseña a tu cuenta y está pendiente de confirmación. Confirma abajo si fuiste tú.",
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
        toggleFeatures: "Activar o desactivar funciones",
        enableOrDisableFeatures: "Activa o desactiva ciertas funciones en este dispositivo.",
        viewTransitions: "Ver transiciones",
        viewTransitionsDesc: "Habilita transiciones (morph y crossfade) al navegar entre páginas.",
        accountSecurity: "Seguridad de la cuenta",
        changePassTitle: "Cambiar la contraseña de tu cuenta",
        addPassDesc: "Añadir una contraseña para utilizar el inicio de sesión con credenciales",
        manageAuthProviders: "Gestionar proveedores de autenticación",
        manageProvidersDesc: "Añade o elimina métodos de inicio de sesión de tu cuenta.",
        removePass: "Eliminar contraseña",
        removePassTitle: "Eliminar la contraseña de tu cuenta",
        removePassDesc: "Después de eliminar tu contraseña, no podrás usar credenciales para iniciar sesión en tu cuenta",
        enterCurrentPass: "Ingresa tu contraseña actual",
        addPass: "Añadir contraseña",
        addPassDialogDesc: "Podrás usar esta contraseña para iniciar sesión en tu cuenta",
        manageProviders: "Gestionar proveedores",
        linkedProviders: "Proveedores de autenticación vinculados",
        linkProvider: (provider: string) => `Vincular ${provider} a tu cuenta`,
        link: "Vincular", // Verb
        sureToDeleteAccount: "¿Estás seguro de que quieres eliminar tu cuenta?",
        profileInfo: "Información del perfil",
        profileInfoDesc: (site: string) => `Tu información de perfil es visible públicamente en ${site}.`,
        profilePic: "Foto de perfil",
        bio: "Biografía",
        bioDesc: "Una breve descripción para contarle a todos un poco sobre ti.",
        visitYourProfile: "Visitar tu perfil",
        showIpAddr: "Mostrar direcciones IP",
        sessionsDesc:
            "Estos dispositivos están actualmente conectados a tu cuenta. Puedes revocar cualquier sesión en cualquier momento. Si ves algo que no reconoces, revoca la sesión inmediatamente y cambia la contraseña del proveedor de autenticación asociado.",
        ipHidden: "IP oculta",
        lastAccessed: (when: string) => `Último acceso ${when}`,
        created: (when: string) => `Creado ${when}`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Sesión creada usando ${providerName}`,
        currSession: "Sesión actual",
        revokeSession: "Revocar sesión",
    },

    dashboard: {
        dashboard: "Panel de control",
        overview: "Vista general",
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
        enterOrgName: "Ingresa el nombre de la organización",
        enterOrgDescription: "Ingresa una breve descripción de tu organización",
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
        recently_updated: "Actualizado recientemente",
        recently_published: "Publicado recientemente",

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
        clearFilters: "Limpiar todos los filtros",

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
        updatedAt: (when: string) => `Actualizado ${when}`, // eg: Updated 3 days ago
        publishedAt: (when: string) => `Publicado ${when}`, // eg: Published 3 days ago
        gallery: "Galería",
        changelog: "Registro de cambios",
        versions: "Versiones",
        noProjectDesc: "No se proporcionó una descripción del proyecto",
        uploadNewImg: "Subir una nueva imagen a la galería",
        uploadImg: "Subir imagen a la galería",
        galleryOrderingDesc: "Las imágenes con un orden más alto se mostrarán primero.",
        featuredGalleryImgDesc:
            "Solo se puede destacar una imagen de la galería, la cual aparecerá tanto en los resultados de búsqueda como en la tarjeta del proyecto.",
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
        showDevVersions: "Mostrar versiones en desarrollo",
        noProjectVersions: "No se encontraron versiones del proyecto",
        stats: "Estadísticas",
        published: "Publicado", // Used for table headers
        downloads: "Descargas", // Used for table headers
        openInNewTab: "Abrir en nueva pestaña",
        copyLink: "Copiar enlace",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} no es compatible con la versión ${version} de ${loader}`;
        },
        downloadProject: (project: string) => `Descargar ${project}`,
        gameVersion: "Versión del juego:",
        selectGameVersion: "Seleccionar versión del juego",
        platform: "Plataforma:",
        selectPlatform: "Seleccionar plataforma",
        onlyAvailableFor: (project: string, platform: string) => `${project} solo está disponible para ${platform}`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) => `No hay versiones disponibles para la ${gameVersion} en ${loader}`,
        declinedInvitation: "Invitación rechazada",
        teamInvitationTitle: (teamType: string) => `Invitación para unirse a ${teamType}`, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) =>
            `Has sido invitado a ser miembro de este ${teamType} con el rol de '${role}'.`,

        browse: {
            mod: "Explorar mods",
            datamod: "Explorar datamods",
            "resource-pack": "Explorar paquetes de recursos",
            shader: "Explorar shaders",
            modpack: "Explorar paquetes de mods",
            plugin: "Explorar plugins",
        },
    },

    version: {
        deleteVersion: "Eliminar versión",
        sureToDelete: "¿Estás seguro de que quieres eliminar esta versión?",
        deleteDesc: "Esto eliminará esta versión para siempre (de verdad, para siempre).",
        enterVersionTitle: "Ingresa el título de la versión...",
        feature: "Destacar versión",
        unfeature: "Quitar versión destacada",
        featured: "Destacada",
        releaseChannel: "Canal de lanzamiento",
        versionNumber: "Número de versión",
        selectLoaders: "Seleccionar cargadores",
        selectVersions: "Seleccionar versiones",
        cantAddCurrProject: "No puedes agregar el proyecto actual como dependencia",
        cantAddDuplicateDep: "No puedes agregar la misma dependencia dos veces",
        addDep: "Añadir dependencia",
        enterProjectId: "Ingresa el ID/Slug del proyecto",
        enterVersionId: "Ingresa el ID/Slug de la versión",
        dependencies: "Dependencias",
        files: "Archivos",

        depencency: {
            required: "Requerida",
            optional: "Opcional",
            incompatible: "Incompatible",
            embedded: "Incorporada",
            required_desc: (version: string) => `La versión ${version} es requerida`,
            optional_desc: (version: string) => `La versión ${version} es opcional`,
            incompatible_desc: (version: string) => `La versión ${version} es incompatible`,
            embedded_desc: (version: string) => `La versión ${version} está incorporada`,
        },

        primary: "Primario",
        noPrimaryFile: "No se ha elegido un archivo principal",
        chooseFile: "Elegir archivo",
        replaceFile: "Reemplazar archivo",
        uploadExtraFiles: "Subir archivos adicionales",
        uploadExtraFilesDesc: "Usado para archivos adicionales como fuentes, documentación, etc.",
        selectFiles: "Seleccionar archivos",
        primaryFileRequired: "Se requiere un archivo principal",
        metadata: "Metadatos",
        devReleasesNote: "NOTA: Las versiones en desarrollo antiguas serán eliminadas automáticamente después de que se publique una nueva versión en desarrollo.",
        publicationDate: "Fecha de publicación",
        publisher: "Editor",
        versionID: "ID de versión",
        copySha1: "Copiar hash SHA-1",
        copySha512: "Copiar hash SHA-512",
        copyFileUrl: "Copiar URL del archivo",
    },

    projectSettings: {
        settings: "Ajustes del proyecto",
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
        sourceCodeDesc: "Una página o repositorio que contiene el código fuente de tu proyecto.",
        wikiPage: "Página wiki",
        wikiPageDesc: "Una página que contiene información, documentación y ayuda para el proyecto.",
        discordInvite: "Invitación a Discord",
        discordInviteDesc: "Un enlace de invitación a tu servidor de Discord.",
        licenseDesc1: (projectType: string) =>
            `Es muy importante elegir una licencia adecuada para tu ${projectType}. Puedes elegir una de nuestra lista o proporcionar una licencia personalizada. También puedes proporcionar una URL personalizada para tu licencia elegida; de lo contrario, se mostrará el texto de la licencia.`,
        licenseDesc2:
            "Ingresa un [identificador de licencia SPDX](https://spdx.org/licenses) válido en el lugar indicado. Si tu licencia no tiene un identificador SPDX (por ejemplo, si creaste la licencia tú mismo o es específica de Cosmic Reach), simplemente marca la casilla e ingresa el nombre de la licencia.",
        selectLicense: "Seleccionar licencia",
        custom: "Personalizada",
        licenseName: "Nombre de la licencia",
        licenseUrl: "URL de la licencia (opcional)",
        spdxId: "Identificador SPDX",
        doesntHaveSpdxId: "La licencia no tiene un identificador SPDX",
        tagsDesc: "Es importante etiquetar correctamente para ayudar a las personas a encontrar tu mod. Asegúrate de seleccionar todas las etiquetas que correspondan.",
        tagsDesc2: (projectType: string) => `Selecciona todas las categorías que reflejen los temas o la función de tu ${projectType}.`,
        featuredCategories: "Categorías destacadas",
        featuredCategoriesDesc: (count: number) => `Puedes destacar hasta ${count} de tus etiquetas más relevantes.`,
        selectAtLeastOneCategory: "Selecciona al menos una categoría para destacar.",
        projectInfo: "Información del proyecto",
        clientSide: "Del lado del cliente",
        clientSideDesc: (projectType: string) => `Selecciona si tu ${projectType} tiene funcionalidad en el lado del cliente.`,
        serverSide: "Del lado del servidor",
        serverSideDesc: (projectType: string) => `Selecciona si tu ${projectType} tiene funcionalidad en el servidor lógico.`,
        unknown: "Desconocido",
        required: "Requerido",
        optional: "Opcional",
        unsupported: "No compatible",
        visibilityDesc:
            "Los proyectos listados y archivados son visibles en la búsqueda. Los proyectos no listados están publicados, pero no visibles en la búsqueda ni en los perfiles de los usuarios. Los proyectos privados solo son accesibles por los miembros del proyecto.",
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
            `Elimina tu proyecto de los servidores de ${site} y de la búsqueda. ¡Al hacer clic aquí, eliminarás tu proyecto, así que ten mucho cuidado!`,
        sureToDeleteProject: "¿Estás seguro de que quieres eliminar este proyecto?",
        deleteProjectDesc2:
            "Si procedes, todas las versiones y los datos adjuntos se eliminarán de nuestros servidores. Esto podría afectar a otros proyectos, así que ten cuidado.",
        typeToVerify: (projectName: string) => `Para verificar, escribe **${projectName}** abajo:`,
        typeHere: "Escribe aquí...",
        manageMembers: "Gestionar miembros",
        leftProjectTeam: "Has salido del equipo del proyecto",
        leaveOrg: "Salir de la organización",
        leaveProject: "Salir del proyecto",
        leaveOrgDesc: "Eliminarte como miembro de esta organización.",
        leaveProjectDesc: "Eliminarte como miembro de este proyecto.",
        sureToLeaveTeam: "¿Estás seguro de que quieres salir de este equipo?",
        cantManageInvites: "No tienes acceso para gestionar las invitaciones de miembros",
        inviteMember: "Invitar a un miembro",
        inviteProjectMemberDesc: "Introduce el nombre de usuario de la persona que deseas invitar a ser miembro de este proyecto.",
        inviteOrgMemberDesc: "Introduce el nombre de usuario de la persona que deseas invitar a ser miembro de esta organización.",
        invite: "Invitar",
        memberUpdated: "Miembro actualizado con éxito",
        pending: "Pendiente",
        role: "Rol",
        roleDesc: "El título del rol que este miembro desempeña para este proyecto.",
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
        overrideValuesDesc: "Sobrescribe los valores predeterminados de la organización y asigna permisos y roles personalizados a este usuario en el proyecto.",
        projectNotManagedByOrg:
            "Este proyecto no está gestionado por una organización. Si eres miembro de alguna organización, puedes transferir la gestión a una de ellas.",
        transferManagementToOrg: "Transferir gestión",
        selectOrg: "Seleccionar organización",
        projectManagedByOrg: (orgName: string) =>
            `Este proyecto está gestionado por ${orgName}. Los valores predeterminados para los permisos de los miembros se establecen en los ajustes de la organización. Puedes sobrescribirlos a continuación.`,
        removeFromOrg: "Eliminar de la organización",
        memberRemoved: "Miembro eliminado con éxito",
        sureToRemoveMember: (memberName: string) => `¿Estás seguro de que quieres eliminar a ${memberName} de este equipo?`,
        ownershipTransfered: "Propiedad transferida con éxito",
        sureToTransferOwnership: (memberName: string) => `¿Estás seguro de que quieres transferir la propiedad a ${memberName}?`,
    },

    organization: {
        orgDoesntHaveProjects: "Esta organización no tiene proyectos aún.",
        manageProjects: "Gestionar proyectos",
        orgSettings: "Ajustes de la organización",
        transferProjectsTip: "Puedes transferir tus proyectos existentes a esta organización desde: Ajustes del proyecto > Miembros",
        noProjects_CreateOne: "Esta organización no tiene proyectos. Haz clic en el botón de arriba para crear uno.",
        orgInfo: "Información de la organización",
        deleteOrg: "Eliminar organización",
        deleteOrgDesc:
            "Eliminar tu organización transferirá todos sus proyectos al propietario de la organización. Esta acción no se puede deshacer.",
        sureToDeleteOrg: "¿Estás seguro de que quieres eliminar esta organización?",
        deleteOrgNamed: (orgName: string) => `Eleminar organización ${orgName}`,
        deletionWarning: "Esto eliminará esta organización para siempre (de verdad, para siempre).",

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
            add_project: "Añadir proyecto",
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
        joined: (when: string) => `Se unió ${when}`, // eg: Joined 2 months ago
    },

    footer: {
        company: "Empresa",
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
        siteOfferedIn: (site: string) => `${site} ofrecido en:`,
    },

    legal: {
        rulesTitle: "Reglas de contenido",
        contentRules: Reglas,
        termsTitle: "Términos de uso",
        copyrightPolicyTitle: "Política de derechos de autor",
        securityNoticeTitle: "Aviso de seguridad",
        privacyPolicyTitle: "Política de privacidad",
    },

    form: {
        login: "Iniciar sesión",
        login_withSpace: "Inicia sesión",
        signup: "Registrarse",
        email: "Correo electrónico",
        username: "Nombre de usuario",
        password: "Contraseña",
        name: "Nombre",
        icon: "Ícono",
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
        uploadIcon: "Subir ícono",
        removeIcon: "Eliminar ícono",
        noFileChosen: "No se ha elegido ningún archivo",
        showAllVersions: "Mostrar todas las versiones",
    },

    error: {
        sthWentWrong: "¡Ups! Algo salió mal",
        errorDesc: "Algo falló. Mientras solucionamos el problema, intenta recargar la página.",
        refresh: "Recargar",
        pageNotFound: "404 | Página no encontrada.",
        pageNotFoundDesc: "Lo sentimos, no pudimos encontrar la página que estás buscando.",
        projectNotFound: "Proyecto no encontrado",
        projectNotFoundDesc: (type: string, slug: string) => `El ${type} con el slug/ID "${slug}" no existe.`,
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
        enterLabel: "Insertar etiquetar",
        link: "Enlace", // Noun
        enterUrl: "Ingresa la URL del enlace",
        insertImage: "Insertar imagen",
        imgAlt: "Descripción (texto alternativo)",
        imgAltDesc: "Escribe una descripción para la imagen",
        enterImgUrl: "Ingresa la URL de la imagen",
        image: "Imagen",
        inserYtVideo: "Insertar video de YouTube",
        ytVideoUrl: "URL del video de YouTube",
        enterYtUrl: "Ingresa la URL del video de YouTube",
        video: "Video",
        preview: "Vista previa",
        insert: "Insertar",
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
} satisfies Translation;
