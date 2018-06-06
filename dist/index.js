"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * This class handles drawing of progress bar
 * @author Charles Bodman
 *
 */
var CanvasProgressBar = /** @class */ (function () {
    /**
     * The contructor of the canvas progress bar creates it's on canvas reference.
     */
    function CanvasProgressBar() {
        var _this = this;
        /**
         * Progress bar color
         */
        this.barColor = '#00FF00';
        /**
         * Progress bar line color
         */
        this.stripeColor = 'rgba(255,255,255,0.3)';
        /**
         * Flag for whether canvas bar is animating or not
         */
        this.animating = false;
        /**
         * Animation Options
         * @type {CanvasProgressBarAnimationOptions}
         */
        this.animationOptions = {
            from: 0,
            to: 100,
            speed: 1000,
            stripeSpeed: 1
        };
        /**
         * Animation percent progress elapsed
         */
        this.animationPercentElapsed = 0;
        /**
         * Last animation timestamp
         */
        this.lastAnimationTimeStamp = 0;
        /**
         * Animate the progress bar
         */
        this.loop = function () {
            if (_this.animating) {
                var currentTime = Date.now();
                var delta = currentTime - _this.lastAnimationTimeStamp;
                var animationOptions = _this.animationOptions;
                var progressPercent = (((animationOptions.from / 100) + _this.animationPercentElapsed));
                _this.draw(progressPercent);
                console.log(progressPercent);
                if (progressPercent < (animationOptions.to / 100)) {
                    _this.animationPercentElapsed += (((100 / animationOptions.speed) * delta) / 100);
                }
                _this.lastAnimationTimeStamp = currentTime;
                window.requestAnimationFrame(_this.loop);
            }
        };
        var canvas = document.createElement('canvas');
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
    }
    /**
     * Sets the size of the canvas element
     * @param {Number} width
     * @param {Numbers} height
     */
    CanvasProgressBar.prototype.setSize = function (width, height) {
        var canvas = this.canvas;
        canvas.width = width;
        canvas.height = height;
    };
    /**
     * Returns the canvas
     * @returns {HTMLCanvasElement}
     */
    CanvasProgressBar.prototype.getCanvas = function () {
        return this.canvas;
    };
    /**
    * Starts the drawing process
    */
    CanvasProgressBar.prototype.draw = function (percent) {
        this.drawProgressBar(percent);
    };
    /**
     * Animates the progress bar
     * @param {CanvasProgressBarAnimationOptions} options
     */
    CanvasProgressBar.prototype.animate = function (options) {
        this.animationOptions = __assign({}, this.animationOptions, options);
        this.animationPercentElapsed = 0;
        this.animating = true;
        this.lastAnimationTimeStamp = Date.now();
        this.loop();
    };
    /**
     * Stops the animation loop
     */
    CanvasProgressBar.prototype.stopAnimation = function () {
        this.animating = false;
    };
    /**
     * Set Bar Color
     * @param {String[]} colors
     * Setting multiple colours will create a simple top down linear gradient
     */
    CanvasProgressBar.prototype.setColors = function (colorOptions) {
        if (colorOptions.bar) {
            var barColor = colorOptions.bar;
            if (colorOptions.bar.length === 1) {
                this.barColor = barColor[0];
            }
            else {
                this.barColor = this.createLinearGradient(barColor);
            }
        }
        if (colorOptions.stripes) {
            this.stripeColor = colorOptions.stripes;
        }
    };
    /**
     * Creates a canvas linear gradient
     * @param {String[]} colors
     */
    CanvasProgressBar.prototype.createLinearGradient = function (colors) {
        var canvas = this.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var colorsCount = colors.length;
        if (this.canvasCtx === null) {
            throw new Error('Canvas context is null');
        }
        var gradient = this.canvasCtx.createLinearGradient(0, 0, 0, height);
        for (var i = 0; i < colorsCount; i++) {
            gradient.addColorStop(i / (colorsCount - 1), colors[i]);
        }
        return gradient;
    };
    /**
     * Draws the progress bar
     * @param {Number} progress
     */
    CanvasProgressBar.prototype.drawProgressBar = function (progress) {
        var canvasCtx = this.canvasCtx;
        var canvas = this.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var fillWidth = width * progress;
        if (canvasCtx !== null) {
            canvasCtx.save();
            // Clear progress bar
            canvasCtx.clearRect(0, 0, width, height);
            // Create clipping
            canvasCtx.beginPath();
            canvasCtx.rect(0, 0, fillWidth, height);
            canvasCtx.strokeStyle = this.barColor;
            canvasCtx.stroke();
            canvasCtx.clip();
            // Fill Bar
            canvasCtx.fillStyle = this.barColor;
            canvasCtx.fillRect(0, 0, width, height);
            // Draw overlay lines -> / / / /
            this.drawOverlayLines();
            // Restore context
            canvasCtx.restore();
        }
    };
    /**
     * Draws overlay lines
     */
    CanvasProgressBar.prototype.drawOverlayLines = function () {
        var canvas = this.canvas;
        var canvasCtx = this.canvasCtx;
        var width = canvas.width;
        var height = canvas.height;
        var overlayLines = 5;
        var lineWidth = 30;
        var spread = width / overlayLines;
        if (canvasCtx !== null) {
            canvasCtx.beginPath();
            var overlayAnimationOffset = -(Date.now() / 10) % spread;
            for (var i = 0; i <= overlayLines; i++) {
                var offset = (i * spread) + (overlayAnimationOffset);
                canvasCtx.strokeStyle = this.stripeColor;
                canvasCtx.lineWidth = lineWidth;
                canvasCtx.moveTo(0 + offset - lineWidth, height + lineWidth);
                canvasCtx.lineTo(spread + offset + lineWidth, -lineWidth);
            }
            canvasCtx.stroke();
        }
    };
    return CanvasProgressBar;
}());
var canvasProgressBar = new CanvasProgressBar();
canvasProgressBar.setSize(450, 25);
canvasProgressBar.setColors({ bar: ['#94f407', '#36a804'] });
canvasProgressBar.animate({
    from: 20,
    to: 100,
    speed: 1000
});
setTimeout(function () {
    canvasProgressBar.stopAnimation();
}, 500);
var app = document.getElementById("app");
if (app !== null) {
    app.appendChild(canvasProgressBar.getCanvas());
}