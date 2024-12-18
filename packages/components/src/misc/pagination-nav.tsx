import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "~/ui/pagination";

interface Props {
    pagesCount: number;
    activePage: number;
    searchParamKey?: string;
    includeHashInURL?: boolean;
}

export default function PaginatedNavigation({ pagesCount, activePage, searchParamKey = "page", includeHashInURL }: Props) {
    function isPageActive(page: number | undefined) {
        return activePage === page;
    }

    function generateLinkHref(page: number) {
        const currUrl = new URL(window.location.href);
        if (page === 1) currUrl.searchParams.delete(searchParamKey);
        else currUrl.searchParams.set(searchParamKey, page.toString());

        return currUrl
            .toString()
            .replace(window.location.origin, "")
            .replace(window.location.hash, includeHashInURL === true ? window.location.hash : "");
    }

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
                <PaginationItem className="mr-1 sm:mr-2">
                    <PaginationPrevious to={activePage === 1 ? "" : generateLinkHref(activePage - 1)} />
                </PaginationItem>

                {pagesCount < 7 ? (
                    pages.map((page) => {
                        return (
                            <PaginationItem key={page}>
                                <PaginationLink to={generateLinkHref(page)} isActive={isPageActive(page)}>
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
                                    <PaginationLink to={generateLinkHref(page)} isActive={isPageActive(page)}>
                                        {page.toString()}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink to={generateLinkHref(pages[pagesCount - 1])} isActive={isPageActive(pages.at(-1))}>
                                {pages.at(-1)?.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                ) : activePage >= 5 && activePage <= pagesCount - 4 ? (
                    <>
                        <PaginationItem>
                            <PaginationLink to={generateLinkHref(1)} isActive={isPageActive(1)}>
                                1
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        {pages.slice(activePage - 2, activePage + 1).map((page) => {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink to={generateLinkHref(page)} isActive={isPageActive(page)}>
                                        {page.toString()}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink to={generateLinkHref(pages[pagesCount - 1])} isActive={isPageActive(pages.at(-1))}>
                                {pages.at(-1)?.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                ) : (
                    <>
                        <PaginationItem>
                            <PaginationLink to={generateLinkHref(1)} isActive={isPageActive(1)}>
                                1
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>

                        {pages.slice(-5).map((item) => {
                            return (
                                <PaginationItem key={item}>
                                    <PaginationLink to={generateLinkHref(item)} isActive={isPageActive(item)}>
                                        {item.toString()}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                    </>
                )}

                <PaginationItem className="ml-1 sm:ml-2">
                    <PaginationNext to={activePage > pagesCount - 1 ? "" : generateLinkHref(activePage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
