import type { Locale } from "../types";
import { Rules } from "./legal";

export default {
    footer: {
        company: "Compañía",
        terms: "Términos",
        privacy: "Privacidad",
        rules: "Reglas",
        resources: "Recursos",
        docs: "Docs",
        status: "Estado",
        support: "Soporte",
        socials: "Redes sociales",
        about: "Acerca de",
    },

    legal: {
        rulesTitle: "Reglas de contenido",
        rules: Rules,

        termsTitle: "Términos de uso",
        copyrightPolicyTitle: "Política de derechos de autor",
        securityNoticeTitle: "Aviso de seguridad",
        privacyPolicyTitle: "Política de privacidad",
    },
} satisfies Locale;
