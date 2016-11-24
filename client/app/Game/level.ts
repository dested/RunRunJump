//"use strict";

import {Hero} from "./hero";
import {AssetManager} from "./assetManager";
export class Level {
    private hero: Hero;
    tiles: number[][];

    constructor() {
        this.tiles = [];
        for (var x = 0; x < 100; x++) {
            this.tiles[x] = [];

            for (var y = 0; y < 30; y++) {
                this.tiles[x][y] = 0;
            }
        }
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 30; y += 1) {

                this.tiles[x][y] = (y == 13 ? 1 : 0);

                if (x == 0) this.tiles[x][y] = 1;

                if (x == 15 && y < 21 && y >= 0) {
                    this.tiles[x][y] = 1;
                }

            }
        }
    }

    setHero(hero: Hero, x: number, y: number): void {
        this.hero = hero;
        this.hero.x = x;
        this.hero.y = y;
    }

    render(context: CanvasRenderingContext2D): void {


        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 30; y++) {
                switch (this.tiles[x][y]) {
                    case 0:
                        break;
                    case 1:
                        context.drawImage(AssetManager.getAsset('solid'), x * 16, y * 16);
                        break;
                    case 2:
                        context.drawImage(AssetManager.getAsset('breakable'), x * 16, y * 16);
                        break;
                    case 3:
                        context.drawImage(AssetManager.getAsset('no-bottom'), x * 16, y * 16);
                        break;
                    case 4:
                        context.drawImage(AssetManager.getSheet('spring', 0, 0), x * 16, y * 16);
                        break;
                }
            }
        }
        this.hero.render(context);
    }

    tick(): void {
        this.hero.tick();
    }

    isBlocking(x: number, y: number, xa: number, ya: number): boolean {
        switch (this.tiles[x][y]) {
            case 0:
                return false;
            case 1:
                return true;
            case 2:
                return true;
            case 3:
                if (ya < 0)return false;
                if (xa != 0)return false;
                if (xa != 0)return false;
                console.log(xa, ya);
                return true;
            case 4:
                return true;
        }

        /*        var blocking = ((TILE_BEHAVIORS[block & 0xff]) & BIT_BLOCK_ALL) > 0;
         blocking |= (ya > 0) && ((TILE_BEHAVIORS[block & 0xff]) & BIT_BLOCK_UPPER) > 0;
         blocking |= (ya < 0) && ((TILE_BEHAVIORS[block & 0xff]) & BIT_BLOCK_LOWER) > 0;

         return blocking;*/
    }

    bump(x: number, y: number, xa: number, ya: number): boolean {

        if (this.tiles[x][y] == 2 && ya < 0) {
            this.tiles[x][y] = 0;
        }

        if (this.tiles[x][y] == 4 && ya > 0) {
            this.hero.ya = -50;
            return true;
        }
        return false;
    }
}
//http://gamedev.stackexchange.com/questions/74387/platformer-collision-detection-order
//http://hamaluik.com/posts/super-mario-world-physics/
//http://s276.photobucket.com/user/jdaster64/media/smw_physics.png.html
