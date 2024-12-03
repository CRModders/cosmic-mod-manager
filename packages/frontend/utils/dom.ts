function disablePathNavigations(e: KeyboardEvent) {
    if (e.altKey || e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
    }
}

export function disableInteractions() {
    document.documentElement.classList.add("disable-interactions");
    document.addEventListener("keydown", disablePathNavigations);
}

export function enableInteractions() {
    document.documentElement.classList.remove("disable-interactions");
    document.removeEventListener("keydown", disablePathNavigations);
}
