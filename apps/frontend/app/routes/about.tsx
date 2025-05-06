import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <main className="w-full grid grid-cols-1">
            <MarkdownRenderBox
                className="max-w-[80ch] bright-heading mx-auto bg-card-background p-card-surround rounded-lg"
                text={t.legal.aboutUs({
                    discordInvite: Config.DISCORD_INVITE,
                    repoLink: Config.REPO_LINK,
                })}
            />
        </main>
    );
}
