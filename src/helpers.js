export const randomId = () => Math.random().toString(36).substring(2, 15);

export function insertHeaderNode(node) {
    const targets = [document.body, document.head, document.documentElement];
    for (let n = 0; n < targets.length; n++) {
        const target = targets[n];
        if (target) {
            if (target.firstElementChild) {
                target.insertBefore(node, target.firstElementChild);
            } else {
                target.appendChild(node);
            }
            break;
        }
    }
}
