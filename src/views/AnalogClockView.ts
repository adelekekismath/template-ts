import { Position, TimeType } from '../models/Type';
import { Matrix3x3 } from '../utils/MatrixUtils';

export class AnalogClockView {
    private static readonly CLOCK_WRAPPER_CLASS = 'clock-wrapper clock-article';
    private static readonly CANVAS_SIZE = 300;
    private static readonly CLOCK_NUMBERS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

    private container: HTMLCanvasElement;
    private closeButton: HTMLButtonElement;
    private clockWrapper: HTMLElement;
    private clockFace: HTMLElement;
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
        this.center = { x: this.container.width / 2, y: this.container.height / 2 };
        this.radius = this.center.x - 10;
        this.drawClockFace();
        this.createNeedleContainers();
        this.clockFace.append(this.hourContainer, this.minuteContainer, this.secondContainer, this.closeButton, this.container);
        document.getElementById('clocks-container')?.appendChild(this.clockWrapper);
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

    drawClockFace() {
        this.clockFace = this.createElement('div', 'clock', `clock-face-${this.id}`);
        this.clockFace.style.width = `${this.radius * 2}px`;
        this.clockFace.style.height = `${this.radius * 2}px`;

        // Create numbers for the clock
        AnalogClockView.CLOCK_NUMBERS.forEach((number, index) => {
            const angle = ((index - 3) * Math.PI * 2) / 12; // Calculate angle for each number
            const x = this.radius + Math.cos(angle) * (this.radius - 30); // Adjust number's x position
            const y = this.radius + Math.sin(angle) * (this.radius - 30); // Adjust number's y position

            const numberElement = this.createElement('div', 'clock-number', `clock-number-${number}`);
            numberElement.innerText = number.toString();
            numberElement.style.left = `${x}px`;
            numberElement.style.top = `${y}px`;

            this.clockFace.appendChild(numberElement);
        });

        // Create hour markers (12 main markers)
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const x = this.radius + Math.cos(angle) * (this.radius - 15); // Adjusted radius for hour markers
            const y = this.radius + Math.sin(angle) * (this.radius - 15); // Adjusted radius for hour markers

            const marker = document.createElement('div');
            marker.classList.add('clock-marker');
            marker.style.transform += ` rotate(${(angle * 180) / Math.PI}deg)`;
            marker.style.left = `${x}px`;
            marker.style.top = `${y}px`;

            this.clockFace.appendChild(marker);
        }

        // Create minute markers (60 markers)
        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) continue; // Skip if it is an hour marker
            const angle = (i * Math.PI * 2) / 60;
            const x = this.radius + Math.cos(angle) * (this.radius - 10); // Adjusted radius for minute markers
            const y = this.radius + Math.sin(angle) * (this.radius - 10); // Adjusted radius for minute markers

            const smallMarker = document.createElement('div');
            smallMarker.classList.add('clock-small-marker');
            smallMarker.style.transform += ` rotate(${(angle * 270) / Math.PI}deg)`;
            smallMarker.style.left = `${x}px`;
            smallMarker.style.top = `${y}px`;

            this.clockFace.appendChild(smallMarker);
        }

        // Draw clock center point
        const centerPoint = this.createElement('div', 'clock-center', `clock-center-${this.id}`);
        this.clockFace.appendChild(centerPoint);
        this.clockWrapper.appendChild(this.clockFace);
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
