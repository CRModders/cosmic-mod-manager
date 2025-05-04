import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <main className="w-full grid grid-cols-1">
            <MarkdownRenderBox
                className="max-w-[72ch] bright-heading mx-auto bg-card-background p-6 pt-0 rounded-lg"
                text={t.legal.aboutUs({
                    discordInvite: Config.DISCORD_INVITE
                })}
            />
        </main>
    );
}
