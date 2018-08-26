const Renderer = function (elem, width, height, scaleWidth, gallery) {

    this.parentElement = elem;
    this.drawingWidth = width;
    this.drawingHeight = height;
    this.scale = scaleWidth / this.drawingWidth;

    this.drawing = null;
    this.progress = null;
    this.progressPercent = 1;

    this.currentFrame = 0;
    this.options = {};

    this.isDrawing = false;
    this.points = [];
    this.curves = [];

    this.isGallery = gallery;


};

Renderer.prototype.svgElement = function (options) {

    const ns = "http://www.w3.org/2000/svg";
    let svgElem = document.createElementNS(ns, options.type);
    const svgOptions = options.options;
    for (let option in svgOptions) {
        if (svgOptions.hasOwnProperty(option)) {
            svgElem.setAttribute(option, svgOptions[option]);
        }
    }
    return svgElem;

};

Renderer.prototype.init = function () {

    this.createDrawing();
    if (!this.isGallery){
        this.createProgress();
    }
    this.isDrawing = false;

};

Renderer.prototype.updateProgress = function (percent) {

    if (this.progress != null){
        this.progressPercent = Math.floor(percent);
        this.progress.setAttribute('style', `width:${this.progressPercent}%`);
        this.progress.innerHTML = `<p>${this.progressPercent}%</p>`;
    }

};

Renderer.prototype.createProgress = function () {

    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';

    this.progress = document.createElement('div');
    this.progress.id = 'progress';

    progressBar.appendChild(this.progress);
    this.parentElement.appendChild(progressBar);

    this.updateProgress(1);

};

Renderer.prototype.createDrawing = function () {

    const svgOptions = {
        type: 'svg',
        options: {
            class: 'svg-drawing',
            viewbox: `0 0 ${this.drawingWidth} ${this.drawingHeight}`,
            xlmns: 'http://www.w3.org/2000/svg',
            width: `${this.drawingWidth}px`,
            height: `${this.drawingHeight}px`
        }
    };

    const svgWrapper = document.createElement('div');
    svgWrapper.classList.add('svg-wrapper');

    this.drawing = this.svgElement(svgOptions);
    svgWrapper.appendChild(this.drawing);

    this.parentElement.appendChild(svgWrapper);
};

Renderer.prototype.clearDrawing = function () {

    while (this.drawing.firstChild) {
        this.drawing.removeChild(this.drawing.firstChild);
    }

};

Renderer.prototype.draw = function(options, callback){


    this.isDrawing = false;
    this.clearDrawing();

    this.options = options;

    // Calculate the points
    this.calculatePoints();

    // Calculate curve points
    this.calculateCurves();

    // Start the animation
    this.isDrawing = true;
    this.currentFrame = 1;

    // Call animation until complete
    this.drawFrame(callback);


};

Renderer.prototype.drawFrame = function(callback){

    let g = this.svgElement({
       type: 'g',
       options: {
           transform: `scale(${this.scale})`
       }
    });


    let d = '';
    let lastCurve = '';


    if (this.options.animate){
        this.progressPercent = (this.currentFrame / this.curves.length) * 100;
        this.updateProgress(this.progressPercent);

        if (this.currentFrame < this.curves.length){

            this.clearDrawing();

            for (let i = 0; i < this.currentFrame; i++){
                d += this.curves[i];
                lastCurve = this.curves[i];
            }

        } else {

            this.isDrawing = false;
            this.drawing.firstChild.removeChild(this.drawing.firstChild.firstChild);

            callback();
            console.log('Drawing complete');
        }

        if (lastCurve !== ''){

            const penX = lastCurve[0].split(" ")[1];
            const penY = lastCurve[0].split(" ")[2];

            const penOptions = {
                type: 'circle',
                options: {
                    cx: `${penX}`,
                    cy: `${penY}`,
                    r: '10',
                    stroke: 'red',
                    "stroke-width": '1',
                    fill: 'red'
                }
            };

            const pen = this.svgElement(penOptions);
            pen.id = 'pen';
            g.appendChild(pen);
            //this.drawing.appendChild(pen);
            this.drawing.appendChild(g);

        }

        const pathOptions = {
            type: 'path',
            options: {
                d: d,
                fill: 'transparent',
                stroke: 'blue'
            }
        };

        const path = this.svgElement(pathOptions);

        g.appendChild(path)
        //this.drawing.appendChild(path);
        this.drawing.appendChild(g);

        this.currentFrame ++;

        if (this.isDrawing){
            // Need to bind this - 'renderer' as call to window changes context
            window.requestAnimationFrame(this.drawFrame.bind(this, callback));
        }
    } else {

        this.clearDrawing();

        for (let i = 0; i < this.curves.length; i++){
            d += this.curves[i];
        }

        const pathOptions = {
            type: 'path',
            options: {
                d: d,
                fill: 'transparent',
                stroke: 'blue'
            }
        };

        const path = this.svgElement(pathOptions);

        g.appendChild(path);
        //this.drawing.appendChild(path);
        this.drawing.appendChild(g);
        this.isDrawing = false;
        this.progressPercent = 100;
        this.updateProgress(this.progressPercent);
        callback();

    }

};

Renderer.prototype.calculatePoints = function(){

    this.points = [];
    const maxAngle = Math.PI * parseInt(this.options.rotations);

    for (let i = 0; i < maxAngle; i+= 0.2){

        this.points.push(this.pathPoint(i));

    }

};

Renderer.prototype.pathPoint = function(theta){

    const x = (this.options.radius1 - this.options.radius2) *
        Math.cos(theta) +
        this.options.radius3 *
        Math.cos((this.options.radius1 - this.options.radius2) *
            theta / Math.abs(this.options.radius2)) +
        (this.drawingWidth * 0.5);

    const y = (this.options.radius1 - this.options.radius2) *
        Math.sin(theta) - this.options.radius3 *
        Math.sin((this.options.radius1 - this.options.radius2) *
            theta / Math.abs(this.options.radius2)) +
        (this.drawingHeight * 0.5);


    return [x, y];

};

Renderer.prototype.controlLine = function(pointA, pointB){

    const lenX = pointB[0] - pointA[0];
    const lenY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lenX, 2) + Math.pow(lenY, 2)),
        angle: Math.atan2(lenY, lenX)
    }

};

Renderer.prototype.controlPoint = function(curr, prev, next, rev){

    const p = prev || curr;
    const n = next || curr;

    const smooth = 0.2;

    const line = this.controlLine(p, n);
    const len = line.length * smooth;
    const ang = line.angle + (rev ? Math.PI : 0);

    const x = curr[0] + Math.cos(ang) * len;
    const y = curr[1] + Math.sin(ang) * len;
    return [x, y]

};

Renderer.prototype.calculateCurves = function(){

    this.curves = [];

    this.curves = this.points.map((p, i, arr) => {

        if (i === 0) {  // First point
            return [`M ${p[0]} ${p[1]}`];
        } else {
            // start control point
            const [startX, startY] = this.controlPoint(arr[i - 1], arr[i - 2], p);
            // end control point
            const [endX, endY] = this.controlPoint(p, arr[i - 1], arr[i + 1], true);
            return [`C ${startX} ${startY} ${endX} ${endY} ${p[0]} ${p[1]}`];
        }

    });


};

Renderer.prototype.makeCopy = function(width){

    const scale = width / this.drawingWidth;

    let svg = `<g transform="scale(${scale})">`;
    svg += this.drawing.innerHTML;
    svg += "</g>";

    const svgOptions = {
        type: 'svg',
        options: {
            id: 'new-svg',
            viewbox: `0 0 ${width} ${width}`,
            xlmns: 'http://www.w3.org/2000/svg',
            width: `${width}`,
            height: `${width}`
        }
    };

    let copySVG = this.svgElement(svgOptions);
    copySVG.innerHTML = svg;

    return copySVG;

};
