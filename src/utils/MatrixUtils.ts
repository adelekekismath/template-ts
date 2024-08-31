import { Position } from "../models/Type";

export  type Matrix3x3 = number[][];

export function identityMatrix(): Matrix3x3 {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];
}

export function rotationMatrix(angle: number): Matrix3x3 {
    const rad = (Math.PI / 180) * angle;
    return [
        [Math.cos(rad), -Math.sin(rad), 0],
        [Math.sin(rad), Math.cos(rad), 0],
        [0, 0, 1],
    ];
}

export function translationMatrix(tx: number, ty: number): Matrix3x3 {
    return [
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1],
    ];
}

export function scalingMatrix(sx: number, sy: number): Matrix3x3 {
    return [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1],
    ];
}

export function multiplyMatrices(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
    const result: Matrix3x3 = identityMatrix();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            result[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
        }
    }
    return result;
}

export function inverseMatrix(m: Matrix3x3): Matrix3x3 | null {
    const det =
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    if (det === 0) return null;

    const invDet = 1 / det;
    const invMatrix: Matrix3x3 = [
        [
            (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
            (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
            (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet,
        ],
        [
            (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
            (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
            (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet,
        ],
        [
            (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
            (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
            (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet,
        ],
    ];

    return invMatrix;
}
