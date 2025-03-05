import { Button } from "@app/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import {
    BookmarkIcon,
    ExternalLinkIcon,
    PlusIcon,
    SquareArrowOutUpRightIcon,
    SquareArrowUpRightIcon,
} from "lucide-react";
import { useSession } from "~/hooks/session";
import useCollections from "./provider";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { useState } from "react";
import { Input } from "@app/components/ui/input";
import { useTranslation } from "~/locales/provider";
import CreateNewCollection_Dialog from "../dashboard/collections/new-collection";
import Link from "~/components/ui/link";

export function AddToCollection_Popup({ projectId }: { projectId: string }) {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useCollections();

    const [searchQuery, setSearchQuery] = useState("");

    if (!session?.id) return null;

    const bookmarked = ctx.collections.some((collection) => collection.projects.includes(projectId));

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary-inverted"
                    className="rounded-full w-11 h-11 p-0"
                    aria-label="Add to collection"
                >
                    <BookmarkIcon
                        aria-hidden
                        className="h-btn-icon-lg w-btn-icon-lg"
                        fill={bookmarked ? "currentColor" : "none"}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-3 min-w-fit gap-3">
                {ctx.collections.length > 5 ? (
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.collection.searchCollections}
                    />
                ) : null}

                <div className="py-2 px-3 rounded grid grid-cols-1 gap-1 bg-background">
                    {ctx.collections.map((collection) => {
                        if (
                            !collection.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                            !collection.id.toLowerCase().includes(searchQuery.toLowerCase())
                        ) {
                            return null;
                        }

                        const checked = collection.projects.includes(projectId);

                        return (
                            <div
                                key={collection.id}
                                className="flex items-center justify-between gap-2 group/collection-wrapper"
                            >
                                <LabelledCheckbox
                                    checked={checked}
                                    onCheckedChange={(checked) => {
                                        if (checked === true) {
                                            ctx.addProjectsToCollection(collection.id, [projectId]);
                                        } else {
                                            ctx.removeProjectsFromCollection(collection.id, [projectId]);
                                        }
                                    }}
                                >
                                    {collection.name}
                                </LabelledCheckbox>

                                <Link
                                    to={`/collection/${collection.id}`}
                                    className="text-extra-muted-foreground hover:text-muted-foreground opacity-0 group-hover/collection-wrapper:opacity-100 transition-none group-hover/collection-wrapper:transition-all"
                                    target="_blank"
                                >
                                    <SquareArrowOutUpRightIcon className="w-btn-icon h-btn-icon" />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <CreateNewCollection_Dialog>
                    <Button className="w-fit space-y-0 justify-start" variant="secondary" size="sm">
                        <PlusIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                        {t.dashboard.createCollection}
                    </Button>
                </CreateNewCollection_Dialog>
            </PopoverContent>
        </Popover>
    );
}
