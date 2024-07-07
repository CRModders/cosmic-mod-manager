import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { LeftArrowIcon, RightArrowIcon } from "./icons";
import { Button } from "./ui/button";

export default function PaginatedNavigation({
    pagesCount,
    activePage,
    searchParamKey = "page",
    offsetMultiplier = 1,
}: { pagesCount: number; activePage: number; searchParamKey?: string; offsetMultiplier?: number }) {
    const generateLinkHref = (page: number) => {
        const currUrl = new URL(window.location.href);
        if (page === 1) currUrl.searchParams.delete(searchParamKey);
        else currUrl.searchParams.set(searchParamKey, (page * offsetMultiplier).toString());

        return currUrl.toString().replace(window.location.origin, "");
    };

    const pages = (() => {
        const list: number[] = new Array(pagesCount);
        for (let i = 0; i < pagesCount; i++) {
            list[i] = i + 1;
        }
        return list;
    })();
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {activePage === 1 ? (
                        <Button variant={"ghost"} disabled>
                            <LeftArrowIcon className="w-4 h-4" />
                        </Button>
                    ) : (
                        <PaginationPrevious to={generateLinkHref(activePage - 1)} />
                    )}
                </PaginationItem>

                {pagesCount < 7 ? (
                    pages.map((page) => {
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink to={generateLinkHref(page)} isActive={activePage === page}>
                                    {page.toString()}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })
                ) : activePage < 5 ? (
                    <>
                        {pages.slice(0, 5).map((page) => {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink to={generateLinkHref(page)} isActive={activePage === page}>
                                        {page.toString()}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                to={generateLinkHref(pages[pagesCount - 1])}
                                isActive={activePage === pages.at(-1)}
                            >
                                {pages.at(-1)?.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                ) : activePage >= 5 && activePage <= pagesCount - 4 ? (
                    <>
                        <PaginationItem>
                            <PaginationLink to={generateLinkHref(1)} isActive={activePage === 1}>
                                1
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        {pages.slice(activePage - 2, activePage + 1).map((page) => {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink to={generateLinkHref(page)} isActive={activePage === page}>
                                        {page.toString()}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink
                                to={generateLinkHref(pages[pagesCount - 1])}
                                isActive={activePage === pages.at(-1)}
                            >
                                {pages.at(-1)?.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                ) : (
                    <>
                        <PaginationItem>
                            <PaginationLink to={generateLinkHref(1)} isActive={activePage === 1}>
                                1
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        {pages.slice(-5).map((item) => {
                            return (
                                <PaginationItem key={item}>
                                    <PaginationLink to={generateLinkHref(item)} isActive={activePage === item}>
                                        {item.toString()}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                    </>
                )}

                <PaginationItem>
                    {activePage > pagesCount - 1 ? (
                        <Button variant={"ghost"} disabled>
                            <RightArrowIcon className="w-4 h-4" />
                        </Button>
                    ) : (
                        <PaginationNext to={generateLinkHref(activePage + 1)} />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
