export function addDomListener(node: Node | Window, event: string, listener: EventListener): () => void {
    node.addEventListener(event, listener);
    return () => {
        node.removeEventListener(event, listener);
    };
}
