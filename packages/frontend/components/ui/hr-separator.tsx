const HorizontalSeparator = ({ text = "OR" }: { text?: string }) => {
    return (
        <div className="w-full flex items-center gap-4">
            <hr className="bg-shallow-background border-none w-full h-[0.1rem] flex-1" />
            <p className="shrink-0 text-sm text-extra-muted-foreground">{text}</p>
            <hr className="bg-shallow-background border-none w-full h-[0.1rem] flex-1" />
        </div>
    );
};

export default HorizontalSeparator;
