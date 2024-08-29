
import { TimeType } from '../models/Type';

export class AnalogClockView  {
    private container: HTMLCanvasElement;
    private static clockCounter = 0;
    private id: number;
    private closeButton: HTMLButtonElement;
    private clockWrapper: HTMLElement;
    private center: [number, number];
    private radius: number;

    constructor() {
        this.id = AnalogClockView.clockCounter++;
        this.clockWrapper = document.createElement('article');
        this.clockWrapper.id = `analog-clock-wrapper-${AnalogClockView.clockCounter}`;
        this.clockWrapper.className = 'clock-wrapper clock-article';

        this.closeButton = document.createElement('button');
        this.closeButton.id = `analog-close-button-${AnalogClockView.clockCounter}`;
        this.closeButton.className = 'close-btn';
        this.closeButton.textContent = 'X';

        this.container = document.createElement('canvas');
        this.container.id = `analog-watch-${AnalogClockView.clockCounter}`;
        //this.container.className = 'watch';

        this.container.width = 300;
        this.container.height = 300;
        this.center = [this.container.width / 2, this.container.height / 2];
        this.radius = this.center[0] - 10; // Simplified to ensure hands fit within the clock face

        this.clockWrapper.appendChild(this.closeButton);
        this.clockWrapper.appendChild(this.container);
        const clockContainer = document.getElementById('clocks-container');
        clockContainer.appendChild(this.clockWrapper);

        this.drawClockFace();
        this.makeDraggable();
    }

    addEventToCloseButton(handleCloseButton: () => void): void {
        this.closeButton.addEventListener('click', handleCloseButton);
    }

    deleteClock(): void {
        console.log('deleteClock', this.id);
        document.getElementById(`analog-clock-wrapper-${this.id + 1}`)?.remove();
    }

    drawClockFace() {
        const ctx = this.container.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'purple'; // Border color
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#000000'; // Couleur des chiffres
        ctx.font = '16px Arial'; // Police des chiffres
        const numbers = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        numbers.forEach((number, index) => {
            const angle = ((index - 3) * (Math.PI * 2)) / 12; // Calcul de l'angle
            const x = this.center[0] + Math.cos(angle) * (this.radius - 20); // Position X
            const y = this.center[1] + Math.sin(angle) * (this.radius - 20); // Position Y
            ctx.fillText(number, x - 5, y + 5); // Dessin du chiffre
        });
    }

    drawHandle(position: [number, number], angle: number, type: TimeType) {
        const [xPosition, yPosition] = position;
        const ctx = this.container.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(this.center[0], this.center[1]);
        ctx.lineTo(xPosition, yPosition);

        // Définir l'apparence de l'aiguille selon son type
        if (type === TimeType.HOURS) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'teal';
        } else if (type === TimeType.MINUTES) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'purple';
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'coral';
        }

        ctx.stroke();
        ctx.closePath();
    }

    clear() {
        const ctx = this.container.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, this.container.width, this.container.height);
    }

    getCloseButton(): HTMLElement {
        return this.closeButton;
    }

    getRadius(): number {
        return this.radius;
    }

    getCenter(): [number, number] {
        return this.center;
    }
    makeDraggable() {
        this.clockWrapper.draggable = true;

        this.clockWrapper.addEventListener('dragstart', (event) => {
            this.clockWrapper.classList.add('dragging'); // Add a class to style during drag
            event.dataTransfer!.setData('text/plain', this.clockWrapper.id);
            event.dataTransfer!.effectAllowed = 'move';
        });

        this.clockWrapper.addEventListener('dragend', () => {
            this.clockWrapper.classList.remove('dragging'); // Remove class when drag ends
        });

        this.clockWrapper.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.clockWrapper.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedId = event.dataTransfer?.getData('text/plain');
            if (draggedId && draggedId !== this.clockWrapper.id) {
                const draggedElement = document.getElementById(draggedId);
                const parent = this.clockWrapper.parentElement;

                if (draggedElement && parent) {
                    // Determine if the dragged element should be placed before or after the current element
                    if (this.clockWrapper.compareDocumentPosition(draggedElement) & Node.DOCUMENT_POSITION_PRECEDING) {
                        // If the dragged element comes before the this.clockWrapper in the DOM, insert after
                        parent.insertBefore(draggedElement, this.clockWrapper.nextSibling);
                    } else {
                        // If the dragged element comes after the this.clockWrapper in the DOM, insert before
                        parent.insertBefore(draggedElement, this.clockWrapper);
                    }
                }
            }
        });
    }
}
