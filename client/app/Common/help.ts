///<reference path="../../typings/Compress.d.ts"/>


import {Point, IntersectingRectangle } from "./utils";
import {CanvasInformation  } from "./canvasInformation";
import {Color} from "./color";

export class Help {

    public static mod(j: number, n: number): number {
        return ((j % n) + n) % n;
    }
    public static scaleSprite(image: HTMLImageElement, scale: Point): CanvasInformation {
        let canv = CanvasInformation.create(image.width * scale.x, image.height * scale.y, true);
        canv.context.save();
        canv.context.scale(scale.x, scale.y);
        canv.context.drawImage(image, 0, 0);
        canv.context.restore();
        return canv;
    }
    public static scalePixelData(scale: Point, data: ImageData): ImageData {
        let Uint8ClampedArray: Uint8ClampedArray = data.data;
        let colors = new Array(Uint8ClampedArray.length / 4|0);
        for (let f: number = 0; f < Uint8ClampedArray.length; f += 4) {
            colors[f / 4|0] = (Help.colorObjectFromData(Uint8ClampedArray, f));
        }
        let d = CanvasInformation.create(1, 1, false).context.createImageData(data.width * scale.x, data.height * scale.y);
        Help.setDataFromColors(d.data, colors, scale, data.width, colors[0]);
        return d;
    }
    private static setDataFromColors(data: Uint8ClampedArray, colors: Color[], scale: Point, width: number, transparent: Color): void {
        for (let i: number = 0; i < colors.length; i++) {
            let curX = i % width;
            let curY = i / width|0;
            let g = colors[i];
            let isTrans = false;
            if (transparent) {
                if (g.R == transparent.R && g.G == transparent.G && g.B == transparent.B)
                    isTrans = true;
            }
            for (let j: number = 0; j < scale.x; j++) {
                for (let k: number = 0; k < scale.y; k++) {
                    let x = (curX * scale.x + j);
                    let y = (curY * scale.y + k);
                    let c = (x + y * (scale.x * width)) * 4;
                    if (isTrans) {
                        data[c + 0] = 0;
                        data[c + 1] = 0;
                        data[c + 2] = 0;
                        data[c + 3] = 0;
                        continue;
                    }
                    data[c] = g.R|0;
                    data[c + 1] = g.G | 0;
                    data[c + 2] = g.B | 0;
                    data[c + 3] = 255;
                }
            }
        }
    }
    private static getBase64Image(data: ImageData): string {
        let canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;
        let ctx = canvas.getContext("2d");
        ctx.putImageData(data, 0, 0);
        let dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }
    private static colorObjectFromData(data: Uint8ClampedArray, c: number): Color {
        let r = data[c];
        let g = data[c + 1];
        let b = data[c + 2];
        let a = data[c + 3];
        return new Color(r, g, b, a);
    }
    public static getImageData(image: HTMLImageElement): ImageData {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        let data = ctx.getImageData(0, 0, image.width, image.height);
        return data;
    }
    public static isLoaded(element: HTMLImageElement): boolean {
        return element.getAttribute("loaded") == "true";
    }
    public static loaded(element: HTMLImageElement, set: boolean ): void {
        element.setAttribute("loaded", set ? "true" : "false");
    }
    public static loadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        let sprite1 = new Image();
        sprite1.addEventListener("load",
            e => {
                Help.loaded(sprite1, true);
                if (complete)
                    complete(sprite1);
            },
            false);
        sprite1.src = src;
        return sprite1;
    }
    public static decodeString(lvl: string): string {
        return new Compressor().DecompressText(lvl);
    }
    public static fixAngle(angle: number): number {
        let fixedAng = Math.floor((256 - angle) * 1.4062) % 360 | 0;
        let flop = 360 - fixedAng;
        return Help.degToRad(flop);
    }
    public static degToRad(angle: number): number {
        return angle * Math.PI / 180;
    }
    public static sign(m: number): number {
        return m == 0 ? 0 : (m < 0 ? -1 : 1);
    }
    public static floor(spinDashSpeed: number): number {
        if (spinDashSpeed > 0)
            return ~~spinDashSpeed;
        return Math.floor(spinDashSpeed) | 0;
    }
    public static max(f1: number, f2: number): number {
        return f1 < f2 ? f2 : f1;
    }
    public static min(f1: number, f2: number): number {
        return f1 > f2 ? f2 : f1;
    }
    public static getCursorPosition(ev: JQueryEventObject): Point {
        if (ev.originalEvent && (<any>ev.originalEvent).targetTouches && (<any>ev.originalEvent).targetTouches.length > 0)
            ev = <any>((<any>ev.originalEvent).targetTouches[0]);
        if (ev.pageX && ev.pageY)
            return new Point(ev.pageX, ev.pageY);
        return new Point(ev.clientX, ev.clientY/*, 0, ev.Which == 3*/);
    }
    public static stringify(obj: Object): string {
        return JSON.stringify(obj,
            (key, value) => {
                if (key.indexOf("$") == 0)
                    return undefined;
                if (key == "image")
                    return undefined;
                if (key == "imageData")
                    return undefined;
                if (key == "oldScale")
                    return undefined;
                if (key == "sprite")
                    return undefined;
                if (key == "sprites")
                    return undefined;
                if (key == "index")
                    return undefined;
                if (key == "_style")
                    return undefined;
                else return value;
            });
    }
    public static safeResize(block: CanvasInformation, width: number, height: number): CanvasInformation {
        let m = CanvasInformation.create(width, height, false);
        m.context.drawImage(block.canvas, 0, 0);
        return m;
    }
    public static getQueryString(): { [key: string]: string } {
        let result: { [key: string]: string } = {};
        let queryString: string = window.location.search.substring(1);
        let re = new RegExp("/([^&=]+)=([^&]*)/g");
        let m;
        while ((m = re.exec(queryString)) != null) {
            result[(<any>window).decodeURIComponent(m[1])] = (<any>window).decodeURIComponent(m[2]);
        }
        return result;
    }
    static merge<T>(base: T, update: any ): T {
        for (let i in update) {
            base[i] = update[i];
        }
        return base;
    }

}

