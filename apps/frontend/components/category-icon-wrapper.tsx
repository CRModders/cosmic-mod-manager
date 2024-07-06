import { lazy, Suspense } from "react";

const CategoryIcon = lazy(() => import("@/components/category-icons"));

const CategoryIconWrapper = ({ name }: { name: string }) => {
    return (
        <Suspense fallback={" "}>
            <CategoryIcon name={name} />
        </Suspense>
    );
};

export default CategoryIconWrapper;
