const Settings = function (renderer, gallery) {

    this.options = {};
    this.controls = [];
    this.renderer = renderer;
    this.gallery = gallery;
    this.submitBtn = null;


};

Settings.prototype.initControls = function (elem, controls, instance) {

    this.controls = controls;

    for (let i = this.controls.length - 1; i >= 0; i--) {

        const label = this.controls[i][2];
        const attribs = this.controls[i][3];

        let ctrl = document.createElement('input');
        for (let attr in attribs) {
            if (attribs.hasOwnProperty(attr)) {
                ctrl.setAttribute(attr, attribs[attr]);
                if (attr === 'value') {
                    instance.options[this.controls[i][0]] = attribs[attr]
                }
            }
        }
        ctrl.addEventListener(this.controls[i][1], this.updateSettings.bind(this, this.controls[i][0]));
        this.controls[i][4] = ctrl;

        elem.insertBefore(ctrl, elem.firstChild);

        if (label !== "") {
            let lab = document.createElement('label');
            lab.setAttribute('for', attribs.id);
            lab.innerHTML = label;
            elem.insertBefore(lab, elem.firstChild);
        }


    }

    const drawBtn = document.createElement('input');
    drawBtn.id = 'draw-btn';
    drawBtn.type = 'button';
    drawBtn.value = 'Draw Curve';
    drawBtn.addEventListener('click', this.draw.bind(this));
    elem.appendChild(drawBtn);

    const submit = document.createElement('input');
    submit.id = 'submit';
    submit.type = 'submit';
    submit.name = 'submit';
    submit.value = 'Save Curve';
    submit.disabled = true;
    this.submitBtn = submit;
    elem.appendChild(submit);
    elem.addEventListener('submit', this.saveCurve.bind(this));


};

Settings.prototype.saveCurve = function (e) {

    e.preventDefault();

    const copySVG = this.renderer.makeCopy(150);


    this.gallery.appendChild(copySVG);


};

Settings.prototype.updateControls = function () {

    for (let opt in this.options) {
        if (this.options.hasOwnProperty(opt)) {

            this.controls.forEach((ctrl) => {
                if (ctrl[0] === opt) {
                    if (ctrl[3].type === 'checkbox') {
                        ctrl[4].checked = this.options[opt];
                    } else {
                        ctrl[4].value = this.options[opt];
                    }

                }
            })

        }
    }

};

Settings.prototype.updateSettings = function (setting, e) {

    this.options[setting] = e.target.value;
    if (e.target.type === 'checkbox') {
        this.options[setting] = e.target.checked;
    }
    this.updateControls();
    if (this.renderer.isDrawing) {
        this.renderer.isDrawing = false
    }

};

Settings.prototype.clearDrawing = function () {

    if (this.renderer.isDrawing) {
        this.renderer.isDrawing = false
    }
    this.renderer.clearDrawing();

};

Settings.prototype.enableSave = function () {

    this.submitBtn.disabled = false;

};

Settings.prototype.draw = function () {

    this.submitBtn.disabled = true;
    this.renderer.draw(this.options, this.enableSave.bind(this));

};

