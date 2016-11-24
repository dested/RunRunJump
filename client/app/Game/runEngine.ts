/// <reference path="../../typings/keyboardjs.d.ts" />

import {AssetManager} from "./assetManager";
import {KeyManager} from "./keyManager";
import {Level} from "./level";
import {Hero} from "./hero";

export class RunEngine {
    static instance: RunEngine;

    private fpsMeter;

    constructor() {

        let canvasBox = document.getElementById('canvasBox');
        this.fpsMeter = new (<any>window).FPSMeter(canvasBox, {
            right: '5px',
            left: 'auto',
            heat: 1
        });


        RunEngine.instance = this;
        KeyManager.start();
        AssetManager.loadAssets().then(() => {
            this.start();
        });
    }

    level: Level;
    private hero: Hero;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    start() {
        console.log('hi');

        this.level = new Level();
        this.hero = new Hero(this.level);
        this.level.setHero(this.hero, 32, 224*2-16);

        var mouseDown = false;

        this.canvas = <HTMLCanvasElement>document.getElementById('spriteLayer');
        this.canvas.onmousedown = (ev) => {
            let w = this.canvas.clientWidth / this.canvas.width;
            let h = this.canvas.clientHeight / this.canvas.height;

            let x = (ev.clientX  / w) ;
            let y = (ev.clientY  / h) ;
            this.click(x, y);
            mouseDown = true;
        };
        this.canvas.onmousemove = (ev) => {
            if (!mouseDown)return;

            let w = this.canvas.clientWidth / this.canvas.width;
            let h = this.canvas.clientHeight / this.canvas.height;

            let x = (ev.clientX  / w) ;
            let y = (ev.clientY  / h) ;
            this.click(x, y);
        };
        this.canvas.onmouseup = (ev) => {
            mouseDown = false;
        };

        this.context = this.canvas.getContext('2d');


        window.addEventListener('resize', this.resizeCanvas, false);

        setInterval(() => {
            this.tick();

        }, 1000 / 24);
        this.renderFrame();
        this.resizeCanvas();
    }

    private tick(): void {
        this.level.tick();
    }


    private resizeCanvas(): void {/*
     this.canvas.width = window.innerWidth;
     this.canvas.height = window.innerHeight;*/
    }

    private renderFrame() {
        window.requestAnimationFrame(() => {
            this.context.save();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.msImageSmoothingEnabled = false;
            (<any>this.context).imageSmoothingEnabled = false;
            this.level.render(this.context);
            this.context.restore();
            this.fpsMeter.tick();
            this.renderFrame();
        });
    }

    private click(x: number, y: number) {
        this.level.click(x,y)
    }
}
export interface ITile {
    image: string;
    index: number;
    title: string;
}