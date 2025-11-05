/**
 * @class
 * @classdesc Class representing the geometry of our whimsical ball. The most whimsical a ball can get.
 */
export class WhimsicalBall {
    /**
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} dx - This is the whimsical ball velocity (pixels per frame) horizontally.
     * @param {number} dy - This is the whimsical ball velocity (pixels per frame) vertically.
     * @param {number} radius - Whimsical ball radius.
     * @param {string} color - Whimsical ball color.
     */
    constructor(x, y, dx, dy, radius, color) {
        /** @type {number} @public */
        this.x = x;
        /** @type {number} @public */
        this.y = y;
        /** @type {number} @public */
        this.dx = dx;
        /** @type {number} @public */
        this.dy = dy;
        /** @type {number} @public */
        this.radius = radius;
        /** @type {string} @public */
        this.color = color;
    }
}
