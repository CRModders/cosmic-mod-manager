import { useProjectType } from "~/hooks/project";
import SearchPage from "~/pages/search/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { PageUrl } from "~/utils/urls";

export default SearchPage;

export function meta() {
    const type = `${useProjectType()}s`;

    return MetaTags({
        title: `Search ${type}`,
        description: `Search and download your favorite cosmic reach ${type} with ease here on ${Config.SITE_NAME_SHORT} (${Config.SITE_NAME_LONG}).`,
        url: `${Config.FRONTEND_URL}${PageUrl(type)}`,
        image: Config.SITE_ICON,
        suffixTitle: true,
    });
}
