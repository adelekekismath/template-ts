import { Position, TimeType } from '../models/Type';

export class AnalogClockView {
    private static readonly CLOCK_WRAPPER_CLASS = 'clock-wrapper clock-article';
    private static readonly CANVAS_WIDTH = 300;
    private static readonly CANVAS_HEIGHT = 300;
    private static readonly CLOCK_BORDER_COLOR = 'purple';
    private static readonly HOUR_HAND_COLOR = 'teal';
    private static readonly MINUTE_HAND_COLOR = 'purple';
    private static readonly SECOND_HAND_COLOR = 'coral';
    private static readonly CLOCK_NUMBERS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    private container: HTMLCanvasElement;
    private closeButton: HTMLButtonElement;
    private clockWrapper: HTMLElement;
    private center: Position;
    private radius: number;
    private id: number;

    constructor(id: number) {
        this.id = id;
        this.clockWrapper = this.createElement('article', AnalogClockView.CLOCK_WRAPPER_CLASS, `analog-clock-wrapper-${this.id}`);
        this.closeButton = this.createButton('button', 'close-btn', `analog-close-button-${this.id}`, 'X');

        this.container = this.createElement('canvas') as HTMLCanvasElement;
        this.container.id = `analog-watch-${this.id}`;
        this.container.width = AnalogClockView.CANVAS_WIDTH;
        this.container.height = AnalogClockView.CANVAS_HEIGHT;
        this.center = { x: this.container.width / 2, y: this.container.height / 2 };
        this.radius = this.center.x - 10;

        this.clockWrapper.appendChild(this.closeButton);
        this.clockWrapper.appendChild(this.container);
        document.getElementById('clocks-container')?.appendChild(this.clockWrapper);

        this.drawClockFace();
    }

    private createElement(tag: string, className?: string, id?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        return element;
    }

    private createButton(tag: string, className: string, id: string, text: string): HTMLButtonElement {
        const button = this.createElement(tag, className, id) as HTMLButtonElement;
        button.textContent = text;
        return button;
    }

    addEventToCloseButton(handleCloseButton: () => void): void {
        this.closeButton.addEventListener('click', handleCloseButton);
    }

    deleteClock(): void {
        this.clockWrapper.remove();
    }

    drawClockFace(): void {
        const ctx = this.container.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = AnalogClockView.CLOCK_BORDER_COLOR;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';

        AnalogClockView.CLOCK_NUMBERS.forEach((number, index) => {
            const angle = ((index - 3) * (Math.PI * 2)) / 12;
            const x = this.center.x + Math.cos(angle) * (this.radius - 20);
            const y = this.center.y + Math.sin(angle) * (this.radius - 20);
            ctx.fillText(number, x - 5, y + 5);
        });
    }

    drawHandle(position: Position, type: TimeType): void {
        const ctx = this.container.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(this.center.x, this.center.y);
        ctx.lineTo(position.x, position.y);

        ctx.lineWidth = type === TimeType.HOURS ? 4 : type === TimeType.MINUTES ? 3 : 2;
        ctx.strokeStyle =
            type === TimeType.HOURS
                ? AnalogClockView.HOUR_HAND_COLOR
                : type === TimeType.MINUTES
                ? AnalogClockView.MINUTE_HAND_COLOR
                : AnalogClockView.SECOND_HAND_COLOR;

        ctx.stroke();
        ctx.closePath();
    }

    clear(): void {
        const ctx = this.container.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, this.container.width, this.container.height);
    }

    getClockWrapper(): HTMLElement {
        return this.clockWrapper;
    }

    getCloseButton(): HTMLElement {
        return this.closeButton;
    }

    getRadius(): number {
        return this.radius;
    }

    getCenter(): Position {
        return this.center;
    }
}
