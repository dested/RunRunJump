//"use strict";

import {Size} from "./utils";
export class AssetManager {


    private static assets:{[key:string]:HTMLImageElement};
    private static assetSheet:{[key:string]:HTMLCanvasElement[][]};

    static loadAssets():Promise<HTMLImageElement[]> {
        this.assets = {};
        this.assetSheet = {};
        return Promise.all([
            this.loadSheet("hero", "assets/game/hero-sheet.png", new Size(32, 32)),
            this.loadAsset("breakable", "assets/game/breakable.png"),
            this.loadAsset("solid", "assets/game/solid.png"),
            this.loadAsset("no-bottom", "assets/game/no-bottom.png"),
            this.loadSheet("spring", "assets/game/spring.png",new Size(16, 16)),
        ]);
    }

    private static loadAsset(key:string, url:string):Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve)=> {
            let image = new Image();

            image.onload = ()=> {
                this.assets[key] = image;
                resolve( );
            };
            image.src = url;
        });
    }

    private static loadSheet(key:string, url:string, dimensions:Size):Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve)=> {
            let image = new Image();
            image.onload = ()=> {

                var w = image.width / dimensions.width;
                var h = image.height / dimensions.height;

                this.assetSheet[key] = [];

                for (var x = 0; x < w; x++) {
                    this.assetSheet[key][x] = [];
                    for (var y = 0; y < h; y++) {
                        var canvas = document.createElement("canvas");
                        canvas.width = dimensions.width;
                        canvas.height = dimensions.height;
                        var context = canvas.getContext('2d');
                        context.drawImage(image, x * dimensions.width, y * dimensions.height, dimensions.width, dimensions.height, 0, 0, dimensions.width, dimensions.height);
                        this.assetSheet[key][x][y]=canvas;
                    }
                }
                resolve( );
            };
            image.src = url;
        });
    }

    static getAsset(key:string):HTMLImageElement {
        return this.assets[key];
    }

    static getSheet(key:string,x:number,y:number):HTMLCanvasElement {
        return this.assetSheet[key][x][y];
    }
}