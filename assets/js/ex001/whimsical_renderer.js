import { WhimsicalBall } from "./whimsical_ball.js";
import { getRandomInt, getRandomColor } from "./whimsical_utils.js";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas#whimsical_canvas");

/**
 * @class
 * @classdesc A whimsical object to hold the whimsical avarage of frames per second.
 */
class WhimsicalAverageFPS {
    constructor() {
        /** @type {number[]} @private */
        this._framesSample = [];
        /** @type {number} @private */
        this._TimeSpent = 0;
    }

    /**
     * @returns {number} The total amount samples' time.
     */
    getSamplesTimeSpent = () => {
        return this._TimeSpent;
    };

    /**
     * @returns {number} Returns the avarage number of frames generated until now.
     */
    getAvarageFrames = () => {
        return (
            this._framesSample.reduce((a, b) => a + b, 0) /
            this._framesSample.length
        );
    };

    /**
     * Adds a new frame's sample to the pile of whimsical samples.
     *
     * @param {number} fps - Current frames per second.
     * @param {number} deltaTime - Frame's delta time.
     */
    pushSample = (fps, deltaTime) => {
        this._framesSample.push(fps);
        this._TimeSpent += deltaTime;
    };

    /**
     * Drops the oldest frame's timestamp.
     */
    dropOldestSample = () => {
        this._framesSample.shift();
    };
}

/**
 * @class
 * @classdesc A whimsical renderer to render whimsical objects.
 */
export class WhimsicalRenderer {
    constructor() {
        /** @type {HTMLCanvasElement} @private */
        this._canvas = canvas;
        /** @type {CanvasRenderingContext2D | null} @private */
        this._ctx = null;
        /** @type {WhimsicalBall[]} @private */
        this._whimsicalBalls = [];
        /** @type {number} @private */
        this._lastFrameTimestamp = 0;
        /** @type {WhimsicalAverageFPS} @private */
        this._avgFPS = new WhimsicalAverageFPS();

        // Let's leave our object in a usable state from the start of its construction.
        this._init();
        this._connectWhimsicalEvents();
    }

    /**
     * Run the main loop.
     */
    run = () => {
        // This is the equivalent to our graphical main loop in a game, I guess? Again, read the docs, kids!
        requestAnimationFrame(this._mainLoop);
    };

    /**
     * `WhimsicalRenderer`'s main loop.
     *
     * @private
     * @param {DOMHighResTimeStamp} timestamp - The doc says requestAnimationFrame passes this as argument.
     *
     * Warning: Check the docs, kids! On high high refresh-rate monitors this may run too fast.
     * Let's do something about it.
     *
     * See:
     * https://developer.mozilla.org/docs/Web/API/DedicatedWorkerGlobalScope/requestAnimationFrame
     */
    _mainLoop = (timestamp) => {
        // Edge case for our first frame, as there's no timestamp for the inexistent previous frame, the deltaTime will be 0.
        if (this._lastFrameTimestamp === 0) {
            this._lastFrameTimestamp = timestamp;
        }

        const deltaTime = (timestamp - this._lastFrameTimestamp) / 1000;
        // Update the time of the last frame before going to the next frame.
        this._lastFrameTimestamp = timestamp;

        // Clear the canvas, otherwise our whimsical balls would leave a trace.
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        // Updates our whimsical balls' position.
        this._updateWhimsicalBallsPosition(deltaTime);
        this._updateFPS(deltaTime);
        requestAnimationFrame(this._mainLoop);
    };

    /**
     * Put the `WhimsicalRenderer` in a usable state, initializing properties, events, etc.
     * This is internally called by `WhimsicalRenderer`'s constructor.
     *
     * @private
     */
    _init = () => {
        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;
        this._ctx = this._canvas.getContext("2d");
        this._whimsicalBalls = this._getWhimsicalBalls();
    };

    /**
     * Updates all whimsical balls position while checking for collision with canvas' walls.
     *
     * @private
     *
     * @param {number} deltaTime - The difference of time spent between the current and last frame.
     */
    _updateWhimsicalBallsPosition = (deltaTime) => {
        for (let i = 0; i < this._whimsicalBalls.length; ++i) {
            /** @type {WhimsicalBall} */
            const whimsical_ball = this._whimsicalBalls[i];
            /** @type {number} */
            const x = whimsical_ball.x;
            /** @type {number} */
            const y = whimsical_ball.y;
            /** @type {number} */
            const dx = whimsical_ball.dx;
            /** @type {number} */
            const dy = whimsical_ball.dy;
            /** @type {number} */
            const radius = whimsical_ball.radius;

            // Checks if the ball radius collided with left or right side of the canvas.
            if (x + radius > this._canvas.width || x - radius < 0) {
                // Go in the opposite direction horizontally.
                whimsical_ball.dx = -dx;
            }

            // Checks if the ball radius collided with top or bottom side of the canvas.
            if (y + radius > this._canvas.height || y - radius < 0) {
                // Invert the direction vertically.
                whimsical_ball.dy = -dy;
            }

            // Move the ball.
            // We must use the delta time here to garantee that no matter the monitor's refresh-rate,
            // the ball will always move at the same speed. Otherwise we would have whimsical balls moving
            // faster than they should with higher refresh-rate monitors, we don't want that. And this is
            // how we fix that warning in the documentation.
            //
            // See:
            // https://developer.mozilla.org/docs/Web/API/DedicatedWorkerGlobalScope/requestAnimationFrame
            whimsical_ball.x += whimsical_ball.dx * deltaTime;
            whimsical_ball.y += whimsical_ball.dy * deltaTime;
        }

        // Redraws all whimsical balls with their position updated.
        this._drawWhimsicalBalls();
    };

    /**
     * Draws all whimsical balls in the array.
     *
     * @private
     */
    _drawWhimsicalBalls = () => {
        for (let i = 0; i < this._whimsicalBalls.length; ++i) {
            // I think this must be like OpenGL's state machine? We only draw things in the current state? Idk...
            // Read the doc kids!
            this._ctx.beginPath();

            /** @type {WhimsicalBall} */
            const whimsical_ball = this._whimsicalBalls[i];
            /** @type {number} */
            const x = whimsical_ball.x;
            /** @type {number} */
            const y = whimsical_ball.y;
            /** @type {number} */
            const radius = whimsical_ball.radius;
            /** @type {string} */
            const color = whimsical_ball.color;

            // Set the ball's color.
            this._ctx.fillStyle = color;

            // Defines the circumference of the ball arc(x pos, y pos, ball's radius, starting angle, ending angle).
            this._ctx.arc(x, y, radius, 0, Math.PI * 2);
            // Fill the circle with our solid color.
            this._ctx.fill();

            // If my initial guess is right this must end the drawing state of our state machine.
            this._ctx.closePath();
        }
    };

    /**
     * Returns an array of N (random, between 6 and 12) whimsical balls elements.
     *
     * @private
     * @param {CanvasRenderingContext2D} canvas
     * @returns {WhimsicalBall[]}
     */
    _getWhimsicalBalls = () => {
        /** @type {WhimsicalBall[]} */
        let whimsical_balls = [];
        /** @type {number} */
        const nWhimsicalBalls = getRandomInt(12, 24);

        for (let i = 0; i < nWhimsicalBalls; ++i) {
            /** @type {number} */
            const radius = getRandomInt(10, 30);
            /** @type {number} */
            const x = getRandomInt(radius, this._canvas.width - radius);
            /** @type {number} */
            const y = getRandomInt(radius, this._canvas.height - radius);
            /** @type {number} */
            let dx = getRandomInt(-150, 150);
            /** @type {number} */
            let dy = getRandomInt(-150, 150);
            /** @type {string} */
            const color = getRandomColor();

            if (dx === 0) dx = 50;
            if (dy === 0) dy = 50;

            console.log(
                `WhimsicalBall[${i}]:(${x}, ${y}, ${dx}, ${dy}, ${radius}, ${color})`,
            );
            whimsical_balls.push(
                new WhimsicalBall(x, y, dx, dy, radius, color),
            );
        }

        return whimsical_balls;
    };

    /**
     * @private
     * @param {number} deltaTime - The difference of time spent between the current and last frame.
     */
    _updateFPS = (deltaTime) => {
        if (this._avgFPS.getSamplesTimeSpent() >= 1.0) {
            this._ctx.beginPath();
            /** @type {number} */
            const avgFPS = this._avgFPS.getAvarageFrames();
            /** @type {string} */
            const fpsText = `FPS: ${avgFPS.toFixed(1)}`;
            /** @type {number} */
            const baseFont = 20;
            /** @type {number} */
            const width = this._canvas.width;
            /** @type {number} */
            const height = this._canvas.height;
            /** @type {number} */
            const baseSize = Math.max(width, height);
            /** @type {number} */
            const fontSize = Math.floor((width / baseSize) * baseFont);
            /** @type {number} */
            const x = this._canvas.width - this._canvas.width * 0.01;
            /** @type {number} */
            const y = this._canvas.width * 0.01;

            this._ctx.font = `${fontSize}px Arial`;
            this._ctx.fillStyle = "#2d3e50";
            this._ctx.textAlign = "right";
            this._ctx.textBaseline = "top";
            this._ctx.fillText(fpsText, x, y);
            this._avgFPS.dropOldestSample();
            this._ctx.closePath();
        }

        this._avgFPS.pushSample(1 / deltaTime, deltaTime);
    };

    /**
     * Connect some events for interactivety and objects resizing dynamically.
     *
     * @private
     */
    _connectWhimsicalEvents = () => {
        // Let's connect some whimsical events.
        // This one is for when we click within the canvas area, then we checked if we clicked any whimsical ball.
        this._canvas.addEventListener("click", (ev) => {
            /** @type {DOMRect} */
            const rect = this._canvas.getBoundingClientRect();
            /** @type {number} */
            const pointerX = ev.clientX - rect.left;
            /** @type {number} */
            const pointerY = ev.clientY - rect.top;

            this._whimsicalBalls.forEach((whimsicalBall) => {
                /** @type {number} */
                const dx = pointerX - whimsicalBall.x;
                /** @type {number} */
                const dy = pointerY - whimsicalBall.y;

                // We're gonna use Pythagorean theorem to find the distance of our click to the whimsical ball.
                // The formula goes like: sqrt((x2 - x1)² + (y2 - y1)²).

                /** @type {number} */
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If the distance of the click is within the radius of our whimsical ball, we clicked the damn thing :D
                // It means math is mathing.
                if (distance < whimsicalBall.radius) {
                    whimsicalBall.color = getRandomColor();
                }
            });
        });

        // When the window is resized, we have to recalculate the whimsical balls size again
        // (they may get too big or too small for the new window size, so we must account for that).
        window.addEventListener("resize", () => {
            this._init();
        });
    };
}
