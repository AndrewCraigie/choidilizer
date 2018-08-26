
let renderer;
let settings;

const clearGallery = function(){

    const gallery = document.getElementById('gallery');
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }

};

document.addEventListener('DOMContentLoaded', () => {

    const mainDrawing = document.getElementById('drawing');
    const drawWidth = 600;
    const drawHeight = 600;

    renderer = new Renderer(mainDrawing, drawWidth, drawHeight, drawWidth, false);
    renderer.init();

    const gallery = document.getElementById('gallery');

    settings = new Settings(renderer, gallery);

    const controls = [

        ['radius1', 'change', 'Radius 1', {
            id: 'radius1',
            type: 'range',
            min: '1',
            max: '300',
            step: '1',
            value: '200',
            class: 'slider'
        }],
        ['radius1', 'change', '', {
            id: 'radius1-num',
            type: 'number',
            min: '1',
            max: '300',
            step: '1',
            value: '200',
            class: 'num-control'
        }],
        ['radius2', 'change', 'Radius 2', {
            id: 'radius2',
            type: 'range',
            min: '-200',
            max: '200',
            step: '1',
            value: '75',
            class: 'slider'
        }],
        ['radius2', 'change', '', {
            id: 'radius2-num',
            type: 'number',
            min: '-200',
            max: '200',
            step: '1',
            value: '75',
            class: 'num-control'
        }],
        ['radius3', 'change', 'Radius 3', {
            id: 'radius3',
            type: 'range',
            min: '1',
            max: '100',
            step: '1',
            value: '20',
            class: 'slider'
        }],
        ['radius3', 'change', '', {
            id: 'radius3-num',
            type: 'number',
            min: '1',
            max: '100',
            step: '1',
            value: '20',
            class: 'num-control'
        }],
        ['rotations', 'change', 'Rotations', {
            id: 'rotations',
            type: 'range',
            min: '1',
            max: '300',
            step: '1',
            value: '5',
            class: 'slider'
        }],
        ['rotations', 'change', '', {
            id: 'rotations-num',
            type: 'number',
            min: '1',
            max: '300',
            step: '1',
            value: '5',
            class: 'num-control'
        }],
        ['animate', 'change', 'Animate', {
            id: 'animate',
            type: 'checkbox',
            checked: 'checked',
            value: 'animate',
            class: 'animate-check'
        }]

    ];

    const form = document.getElementById('form');
    settings.initControls(form, controls, settings);

    const clearGalleryBtn = document.getElementById('clear-gallery');
    clearGalleryBtn.addEventListener('click', clearGallery);



});
