import type { Locale } from "../types";
import { Rules } from "./legal";

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
    },

    navbar: {
        mod: "mod",
        mods: "mods",
        datamod: "datamod",
        datamods: "datamods",
        resourcePack: "paquete de recursos",
        resourcePacks: "paquetes de recursos",
        shader: "shader",
        shaders: "shaders",
        modpack: "paquete de mods",
        modpacks: "paquetes de mods",
        plugin: "plugin",
        plugins: "plugins",
        signout: "Cerrar sesión",
        dashboard: "Panel de control",
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
        aggrement: "Al crear una cuenta, aceptas nuestros [Términos](/legal/terms) y [Política de privacidad](/legal/privacy).",
        invalidCode: "Código inválido o caducado",
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
        viewTransitionsDesc: "Habilita las transiciones (morfo y fundido cruzado) al navegar entre páginas.",
        accountSecurity: "Seguridad de la cuenta",
        changePassTitle: "Cambia la contraseña de tu cuenta",
        addPassDesc: "Agrega una contraseña para usar el inicio de sesión con credenciales",
        manageAuthProviders: "Administrar proveedores de autenticación",
        manageProvidersDesc: "Agrega o elimina métodos de inicio de sesión de tu cuenta.",
        removePass: "Eliminar contraseña",
        removePassTitle: "Eliminar la contraseña de tu cuenta",
        removePassDesc: "Después de eliminar tu contraseña, no podrás usar credenciales para iniciar sesión en tu cuenta",
        enterCurrentPass: "Ingresa tu contraseña actual",
        addPass: "Agregar contraseña",
        addPassDialogDesc: "Podrás usar esta contraseña para iniciar sesión en tu cuenta",
        manageProviders: "Administrar proveedores",
        linkedProviders: "Proveedores de autenticación vinculados",
        linkProvider: (provider: string) => `Vincular ${provider} a tu cuenta`,
        link: "Vincular",
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
        ipHidden: "IP oculto",
        lastAccessed: "Último acceso",
        created: "Creado",
        sessionCreatedUsing: (providerName: string) => `Sesión creada usando ${providerName}`,
        currSession: "Sesión actual",
        revokeSession: "Revocar sesión",
    },

    dashboard: {
        dashboard: "Panel de control",
        overview: "Visión general",
        notifications: "Notificaciones",
        activeReports: "Informes activos",
        analytics: "Análisis",
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
        history: "Historia",
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
        modpack: "Buscar modpacks",
        datamod: "Buscar datamods",

        // Sorting methods
        sortBy: "Ordenar por",
        relevance: "Relevancia",
        downloads: "Descargas",
        follow_count: "Seguidores",
        recently_updated: "Actualizado recientemente",
        recently_published: "Publicado recientemente",

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
    },

    project: {
        compatibility: "Compatibilidad",
        loaders: "Cargadores",
        environments: "Entornos",
        reportIssues: "Reportar problemas",
        viewSource: "Ver código fuente",
        visitWiki: "Visitar wiki",
        joinDiscord: "Unirse al servidor de Discord",
        featuredVersions: "Versiones destacadas",
        creators: "Creadores",
        organization: "Organización",
        details: "Detalles",
        updated: "Actualizado", // eg: Actualizado hace 3 días
        gallery: "Galería",
        changelog: "Registro de cambios",
        versions: "Versiones",
        noProjectDesc: "No se ha proporcionado una descripción del proyecto",
        uploadNewImg: "Subir una nueva imagen de galería",
        uploadImg: "Subir imagen de galería",
        galleryOrderingDesc: "La imagen con un orden más alto se mostrará primero.",
        featuredGalleryImgDesc:
            "Una imagen de galería destacada aparece en la búsqueda y en la tarjeta de tu proyecto. Solo se puede destacar una imagen de galería.",
        addGalleryImg: "Agregar imagen de galería",
        featureImg: "Destacar imagen",
        unfeatureImg: "Quitar de destacados",
        sureToDeleteImg: "¿Estás seguro de que quieres eliminar esta imagen de galería?",
        deleteImgDesc: "Esto eliminará esta imagen de galería para siempre (sí, para siempre).",
        editGalleryImg: "Editar imagen de galería",
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

        browse: {
            mod: "Explorar mods",
            datamod: "Explorar datamods",
            "resource-pack": "Explorar paquetes de recursos",
            shader: "Explorar shaders",
            modpack: "Explorar modpacks",
            plugin: "Explorar plugins",
        },
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
    },

    legal: {
        rulesTitle: "Normas de contenido",
        rules: Rules,

        termsTitle: "Términos de uso",
        copyrightPolicyTitle: "Política de derechos de autor",
        securityNoticeTitle: "Aviso de seguridad",
        privacyPolicyTitle: "Política de privacidad",
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
        ordering: "Ordenación",
        featured: "Destacado",
        continue: "Continuar",
        remove: "Eliminar",
        confirm: "Confirmar",
        edit: "Editar",
        delete: "Borrar",
        cancel: "Cancelar",
        saveChanges: "Guardar cambios",
        uploadIcon: "Subir icono",
        noFileChosen: "No se ha seleccionado ningún archivo",
        showAllVersions: "Mostrar todas las versiones",
    },

    error: {
        sthWentWrong: "¡Vaya! Algo salió mal",
        errorDesc: "Parece que algo se rompió, mientras intentamos resolver el problema, intenta actualizar la página.",
        refresh: "Actualizar",
        pageNotFound: "404 | Página no encontrada.",
        pageNotFoundDesc: "Lo sentimos, no pudimos encontrar la página que estás buscando.",
        projectNotFound: "Proyecto no encontrado",
        projectNotFoundDesc: (type: string, slug: string) => `El ${type} con el slug/ID "${slug}" no existe.`,
    },

    date: {
        justNow: "ahora mismo",
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
