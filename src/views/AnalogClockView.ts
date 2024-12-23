import { ClockModel } from '../models/ClockModel';
import { Observer, Position, TimeType } from '../models/Type';
import { Matrix3x3 } from '../utils/MatrixUtils';
import { ClockView } from './ClockView';

export class AnalogClockView extends ClockView implements Observer {
    private static readonly CLOCK_WRAPPER_CLASS = 'clock-wrapper analog clock-article';
    private static readonly CLOCK_FACE_SIZE = 230;
    private static readonly CLOCK_NUMBERS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];


    private clockFace: HTMLElement;
    private hourContainer: HTMLElement;
    private minuteContainer: HTMLElement;
    private secondContainer: HTMLElement;
    private hourNeedle: HTMLElement;
    private minuteNeedle: HTMLElement;
    private secondNeedle: HTMLElement;
    private editButton: HTMLButtonElement;
    private isInEditMode: boolean = false;
    private minuteNeedleAngleBeforeDrag: number = 0;
    private minuteNeedleRotationCount: number = 0;
    private hasBeEdited: boolean = false;

    private center: Position;
    private radius: number;
    private id: number;

    constructor(id: number, private model : ClockModel) {
        super(id);
        this.model.addObserver(this);
        this.id = id;
        this.initializeClockWrapper();
        this.initializeClockFace();
        this.initializeNeedleContainers();

        const clocksContainer = document.getElementById('clocks-container');
        clocksContainer?.appendChild(this.clockWrapper);
    }

    private initializeClockWrapper(): void {
        this.clockWrapper = this.createElement('article', AnalogClockView.CLOCK_WRAPPER_CLASS, `analog-clock-wrapper-${this.id}`);
        this.editButton = this.createButton('button', 'edit-btn', `edit-button-${this.id}`, 'Edit Time');
        this.clockWrapper.appendChild(this.editButton);
        this.clockWrapper.appendChild(this.closeButton);
    }

    

    private initializeClockFace(): void {
        this.center = { x: AnalogClockView.CLOCK_FACE_SIZE / 2, y: AnalogClockView.CLOCK_FACE_SIZE / 2 };
        this.radius = this.center.x - 10;
        this.drawClockFace();
    }

    private initializeNeedleContainers(): void {
        this.createNeedleContainers();
        this.clockFace.append(this.hourContainer, this.minuteContainer, this.secondContainer);
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
        this.clockFace = document.createElement('div');
        this.clockFace.className = 'clock';
        this.clockFace.id = `clock-face-${this.id}`;
        this.clockFace.style.width = `${this.radius * 2}px`;
        this.clockFace.style.height = `${this.radius * 2}px`;

        const createClockNumber = (number: string, index: number) => {
            const angle = ((index - 3) * Math.PI * 2) / 12;
            const x = this.radius + Math.cos(angle) * (this.radius - 25);
            const y = this.radius + Math.sin(angle) * (this.radius - 25);

            const numberElement = document.createElement('div');
            numberElement.className = 'clock-number';
            numberElement.id = `clock-number-${number}`;
            numberElement.innerText = number;
            numberElement.style.left = `${x - 3}px`;
            numberElement.style.top = `${y - 3}px`;
            this.clockFace.appendChild(numberElement);
        };

        const createClockMarker = (i: number) => {
            const dialLine = document.createElement('div');
            dialLine.className = 'clock-marker';
            dialLine.id = `clock-marker-${i}`;

            if (i % 5 === 0) {
                dialLine.style.width = '2px';
                dialLine.style.height = '10px';
            }

            dialLine.style.left = `${this.radius}px`;
            dialLine.style.top = `${this.radius}px`;
            dialLine.style.transform = `rotate(${i * 6}deg) translateY(-${this.radius - 5}px)`;
            dialLine.style.transformOrigin = 'center top';

            this.clockFace.appendChild(dialLine);
        };

        // Create clock numbers
        AnalogClockView.CLOCK_NUMBERS.forEach(createClockNumber);

        // Create markers (60 markers, with every 5th marker larger for hours)
        for (let i = 0; i < 60; i++) {
            createClockMarker(i);
        }

        // Draw clock center point
        const centerPoint = document.createElement('div');
        centerPoint.className = 'clock-center';
        centerPoint.id = `clock-center-${this.id}`;
        this.clockFace.appendChild(centerPoint);


        this.clockWrapper.appendChild(this.clockFace);
    }

    // Rotate the needle based on the time
    update(data: { transformedMat: Matrix3x3, type: TimeType }): void {
        const { transformedMat, type } = data;
        const matrix = `matrix(${transformedMat[0][1]}, ${transformedMat[0][0]}, ${transformedMat[1][1]}, ${transformedMat[1][0]}, 0, 0)`;
        switch (type) {
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

    toggleEditMode(): void {
        this.isInEditMode = !this.isInEditMode;
    }

    activeEditMode(): void {
        this.isInEditMode = true;
        this.minuteNeedleAngleBeforeDrag = this.getMinuteNeedleTransform();
        this.editButton.textContent = 'Finish Edit';
    }

    deactivateEditMode(): void {
        this.editButton.textContent = 'Edit Time';
        this.minuteNeedleRotationCount = 0;
        this.minuteNeedleAngleBeforeDrag = 0;
        this.hasBeEdited = false;
    }

    getMinuteNeedleTransform(): number {
        return parseFloat(this.minuteContainer.style.transform.split(',')[0].split('(')[1]);
    }

    getMinuteNeedleTransformMatrix(): string {
        return window.getComputedStyle(this.minuteContainer).getPropertyValue('transform');
    }

    enableMinuteHandleDragging(): void {
        if (!this.isInEditMode) return;

        const calculateAngle = (e: MouseEvent): number => {
            const rect = this.clockFace.getBoundingClientRect();
            const centerX = rect.left + this.radius;
            const centerY = rect.top + this.radius;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            return (angle + 360 + 90) % 360; // Adjust angle relative to minute hand
        };

        const updateRotationCount = (adjustedAngle: number) => {
            if (this.minuteNeedleAngleBeforeDrag > 300 && adjustedAngle < 60) {
                this.minuteNeedleRotationCount++;
            } else if (this.minuteNeedleAngleBeforeDrag < 60 && adjustedAngle > 300) {
                this.minuteNeedleRotationCount--;
            }
        };

        const moveNeedle = (e: MouseEvent) => {
            const adjustedAngle = calculateAngle(e);
            updateRotationCount(adjustedAngle);

            this.minuteNeedleAngleBeforeDrag = adjustedAngle; // Update previous angle
            this.minuteContainer.style.transform = `rotate(${adjustedAngle}deg)`;
            this.hasBeEdited = true;
        };

        this.minuteContainer.addEventListener('mousedown', () => {
            if (!this.isInEditMode) return;

            document.addEventListener('mousemove', moveNeedle);

            document.addEventListener(
                'mouseup',
                () => {
                    document.removeEventListener('mousemove', moveNeedle);
                },
                { once: true }
            );
        });
    }

    // Ajout d'une méthode pour obtenir l'état du mode d'édition
    isEditModeActive(): boolean {
        return this.isInEditMode;
    }

    getEditButton(): HTMLButtonElement {
        return this.editButton;
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

    getMinuteNeedleRotationCount(): number {
        return this.minuteNeedleRotationCount;
    }

    hasClockBeenEdited(): boolean {
        return this.hasBeEdited;
    }
}
