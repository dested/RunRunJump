/// <reference path="../../typings/keyboardjs.d.ts" />

import {CanvasInformation} from "../common/canvasInformation";
import {AssetManager} from "./assetManager";
import {KeyManager} from "./keyManager";
import {Level} from "./level";
import {Hero} from "./hero";

export class RunEngine {
    static instance: RunEngine;
    private fpsMeter;

    constructor() {

        this.fpsMeter = new (<any>window).FPSMeter(document.getElementById('canvasBox'), {
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

    private level: Level;
    private hero: Hero;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    start() {
        console.log('hi');

        this.level = new Level();
        this.hero = new Hero(this.level);
        this.level.setHero(this.hero, 32, 32);


        this.canvas = <HTMLCanvasElement>document.getElementById('spriteLayer');
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


    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private renderFrame() {
        window.requestAnimationFrame(() => {

            this.context.save();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.scale(3, 3);
            this.context.msImageSmoothingEnabled = false;
            this.context.imageSmoothingEnabled = false;
            this.level.render(this.context);
            this.context.restore();
            this.fpsMeter.tick();
            this.renderFrame();
        });
    }


}