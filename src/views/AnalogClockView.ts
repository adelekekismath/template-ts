import { Position, TimeType } from '../models/Type';
import { Matrix3x3 } from '../utils/MatrixUtils';

export class AnalogClockView {

    private static readonly CLOCK_WRAPPER_CLASS = 'clock-wrapper clock-article';
    private static readonly CANVAS_SIZE = 300;
    private static readonly CLOCK_BORDER_COLOR = 'purple';
    private static readonly CLOCK_NUMBERS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

 
    private container: HTMLCanvasElement;
    private closeButton: HTMLButtonElement;
    private clockWrapper: HTMLElement;
    private hourContainer: HTMLElement;
    private minuteContainer: HTMLElement;
    private secondContainer: HTMLElement;
    private hourNeedle: HTMLElement;
    private minuteNeedle: HTMLElement;
    private secondNeedle: HTMLElement;

    
    private center: Position;
    private radius: number;
    private id: number;

    constructor(id: number) {
        this.id = id;
        this.clockWrapper = this.createElement('article', AnalogClockView.CLOCK_WRAPPER_CLASS, `analog-clock-wrapper-${this.id}`);
        this.closeButton = this.createButton('button', 'close-btn', `analog-close-button-${this.id}`, 'X');
        this.container = this.createCanvas();
        this.center = new Position(this.container.width / 2, this.container.height / 2);
        this.radius = this.center.x - 10;

        this.createNeedleContainers();
        this.clockWrapper.append(this.hourContainer, this.minuteContainer, this.secondContainer, this.closeButton, this.container);
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

    private createCanvas(): HTMLCanvasElement {
        const canvas = this.createElement('canvas') as HTMLCanvasElement;
        canvas.id = `analog-watch-${this.id}`;
        canvas.width = AnalogClockView.CANVAS_SIZE;
        canvas.height = AnalogClockView.CANVAS_SIZE;
        return canvas;
    }

    private createNeedleContainers(): void {
        this.hourContainer = this.createElement('div', 'hour-container', `hour-container-${this.id}`);
        this.minuteContainer = this.createElement('div', 'minute-container', `minute-container-${this.id}`);
        this.secondContainer = this.createElement('div', 'second-container', `second-container-${this.id}`);

        this.hourNeedle = this.createElement('div', 'hour-needle', `hour-needle-${this.id}`);
        this.minuteNeedle = this.createElement('div', 'minute-needle', `minute-needle-${this.id}`);
        this.secondNeedle = this.createElement('div', 'second-needle', `second-needle-${this.id}`);

        this.hourContainer.appendChild(this.hourNeedle);
        this.minuteContainer.appendChild(this.minuteNeedle);
        this.secondContainer.appendChild(this.secondNeedle);
    }

    drawClockFace(): void {
        const ctx = this.container.getContext('2d');
        if (!ctx) return;

        // Draw clock border
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = AnalogClockView.CLOCK_BORDER_COLOR;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // Draw clock numbers
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        AnalogClockView.CLOCK_NUMBERS.forEach((number, index) => {
            const angle = ((index - 3) * (Math.PI * 2)) / 12;
            const x = this.center.x + Math.cos(angle) * (this.radius - 28);
            const y = this.center.y + Math.sin(angle) * (this.radius - 28);
            ctx.fillText(number, x - 5, y + 5);
        });

        // Draw clock center point
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();

        // Draw hour markers
        this.drawMarkers(ctx, 12, 10, 20, '#3d3d3d', 2);

        // Draw minute markers
        this.drawMarkers(ctx, 60, 10, 15, '#6d6d6d', 1);
    }

    private drawMarkers(
        ctx: CanvasRenderingContext2D,
        count: number,
        startOffset: number,
        endOffset: number,
        color: string,
        lineWidth: number
    ): void {
        for (let i = 0; i < count; i++) {
            const angle = ((i - 3) * (Math.PI * 2)) / count;
            const x1 = this.center.x + Math.cos(angle) * (this.radius - startOffset);
            const y1 = this.center.y + Math.sin(angle) * (this.radius - startOffset);
            const x2 = this.center.x + Math.cos(angle) * (this.radius - endOffset);
            const y2 = this.center.y + Math.sin(angle) * (this.radius - endOffset);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.closePath();
        }
    }

    rotateNeedle(transformedMat: Matrix3x3, timeType: TimeType): void {
        const matrix = `matrix(${transformedMat[0][1]}, ${transformedMat[0][0]}, ${transformedMat[1][1]}, ${transformedMat[1][0]}, 0, 0)`;
        switch (timeType) {
            case TimeType.HOURS:
                this.hourContainer.style.transform = matrix;
                break;
            case TimeType.MINUTES:
                this.minuteContainer.style.transform = matrix;
                break;
            case TimeType.SECONDS:
                this.secondContainer.style.transform = matrix;
                break;
        }
    }

    addEventToCloseButton(handleCloseButton: () => void): void {
        this.closeButton.addEventListener('click', handleCloseButton);
    }

    deleteClock(): void {
        this.clockWrapper.remove();
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
