import { Card, CardHeader, CardTitle } from "@app/components/ui/card";
import { useTranslation } from "~/locales/provider";

export default function ReviewProjects() {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.review}</CardTitle>
            </CardHeader>
        </Card>
    );
}
