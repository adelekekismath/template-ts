export class ClockView {
    protected clockWrapper: HTMLElement;
    protected closeButton: HTMLElement;

    constructor(id: number) {
        this.clockWrapper = this.createElement('div', 'clock-wrapper', `clock-wrapper-${id}`);
        this.closeButton = this.createButton('button', 'close-btn', `close-button-${id}`, '');
        this.closeButton.innerHTML= `<i class="fa-solid fa-xmark"></i>`;
    }

    protected createElement(tag: string, className?: string, id?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        return element;
    }

    protected createButton(tag: string, className: string, id: string, text: string): HTMLButtonElement {
        const button = this.createElement(tag, className, id) as HTMLButtonElement;
        button.textContent = text;
        return button;
    }

    getCloseButton(): HTMLElement {
        return this.closeButton;
    }

    makeDraggable(): void {
        this.clockWrapper.draggable = true;

        this.clockWrapper.addEventListener('dragstart', (event) => {
            this.clockWrapper.classList.add('dragging');
            event.dataTransfer!.setData('text/plain', this.clockWrapper.id);
            event.dataTransfer!.effectAllowed = 'move';
        });

        this.clockWrapper.addEventListener('dragend', () => {
            this.clockWrapper.classList.remove('dragging');
        });

        this.clockWrapper.addEventListener('dragover', (event) => event.preventDefault());

        this.clockWrapper.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer?.getData('text/plain');
            if (!draggedId || draggedId === this.clockWrapper.id) return;

            const draggedElement = document.getElementById(draggedId);
            const parent = this.clockWrapper.parentElement;

            if (draggedElement && parent) {
                const allClocks = Array.from(parent.children);

                // Find the index of the dropped element and the dragged element
                const droppedIndex = allClocks.indexOf(this.clockWrapper);
                const draggedIndex = allClocks.indexOf(draggedElement);

                if (droppedIndex > -1 && draggedIndex > -1) {
                    const droppedElement = parent.children[droppedIndex];

                   // Swap the dragged and dropped elements
                    if (droppedIndex < draggedIndex) {
                        const nextSibling = draggedElement.nextSibling;
                        parent.insertBefore(draggedElement, droppedElement);
                        parent.insertBefore(droppedElement, nextSibling);
                    } else {
                        const nextSibling = draggedElement.nextSibling;
                        parent.insertBefore(draggedElement, droppedElement.nextSibling);
                        parent.insertBefore(droppedElement, nextSibling);
                    }
                }
            }
        });
    }

    makeUndraggable(): void {
        this.clockWrapper.draggable = false;
    }
}