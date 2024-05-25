import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import LoadingUI from "./ui/spinner"


type Props = {
    children?: React.ReactNode;
    header?: string;
    footer?: React.ReactNode;
}

const FormCard = ({ children, header, footer }: Props) => {
    return (
        <Card className="relative w-full max-w-md">
            <CardHeader className="w-full flex items-center justify-start">
                <h1 className="w-full text-left text-xl font-semibold text-foreground-muted">
                    {header}
                </h1>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col items-center justify-center gap-4">
                    <Suspense fallback={<LoadingUI />}>
                        {children}
                    </Suspense>
                </div>

                {footer}
            </CardContent>
        </Card>
    )
}

export default FormCard