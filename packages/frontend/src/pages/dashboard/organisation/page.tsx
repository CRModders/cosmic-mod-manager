import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullWidthSpinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getdashboardOrgsListQuery } from "./loader";

const OrganisationDashboardPage = () => {
    const { data: organisations } = useQuery(getdashboardOrgsListQuery());

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="w-full flex flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <CardTitle>Organisations</CardTitle>

                <Button>
                    <PlusIcon className="w-btn-icon-md h-btn-icon-md" />
                    Create organisation
                </Button>
                {/* <CreateNewProjectDialog refetchProjectsList={refetchProjectsList} /> */}
            </CardHeader>
            <CardContent>{!organisations ? <FullWidthSpinner /> : <pre>{JSON.stringify(organisations, null, "    ")}</pre>}</CardContent>
        </Card>
    );
};

export const Component = OrganisationDashboardPage;
