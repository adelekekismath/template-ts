import { ClockView } from '../views/ClockView';
import { TimeType } from '../views/ClockView';


export class AnalogClockView extends ClockView {
    private container: HTMLCanvasElement;
    private static clockCounter = 0;
    private id: number;
    private clockWrapper: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor() {
        super();

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
    }

    addEventToCloseButton(handleCloseButton: () => void): void {
        this.closeButton.addEventListener('click', handleCloseButton);
    }

    makeDraggable(): void {
        throw new Error('Method not implemented.');
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

    drawHandle(lengthRatio: number, position: [number, number], angle : number, type: TimeType) {
        const [xPosition, yPosition] = position;
        const ctx = this.container.getContext('2d');
        if (!ctx) return;

        // const length = this.radius * lengthRatio; // longueur constante, liée au ratio
        // const radian = (Math.PI / 180) * (angle-90);
        // const xPosition = this.center[0] + length * Math.cos(radian);
        // const yPosition = this.center[1] + length * Math.sin(radian);

        // Dessiner l'aiguille
        const finalXPosition = xPosition + this.center[0];
        const finalYPostion = yPosition + this.center[1];
        ctx.beginPath();
        ctx.moveTo(this.center[0], this.center[1]);
        ctx.lineTo(finalXPosition, finalYPostion);

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

    blinkElement(type: TimeType): void {
        throw new Error('Method not implemented.');
    }

    stopBlinkElement(): void {
        throw new Error('Method not implemented.');
    }

    init(): void {
        throw new Error('Method not implemented.');
    }

    displayTime(time: string): void {
        throw new Error('Method not implemented.');
    }
}
