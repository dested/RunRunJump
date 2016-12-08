//"use strict";

import {Hero} from "./hero";
import {AssetManager} from "./assetManager";
import {ITile} from "./runEngine";
import {Keys, KeyManager} from "./keyManager";
export class Level {
    public tiles: number[][];
    public hero: Hero;
    private levelWidth = 50;
    private levelHeight = 14 * 2;
    selectedTile: ITile;

    public viewPortX = 0;
    public viewPortY = 0;

    public viewPortWidth = 256*2;
    public viewPortHeight = 224*2;

    updateViewPort() {
        this.viewPortX = Math.max(this.hero.x - this.viewPortWidth / 2, 0);
        if (this.viewPortX + this.viewPortWidth > this.levelWidth * 16) {
            this.viewPortX = this.levelWidth * 16 - this.viewPortWidth;
        }

        this.viewPortY = Math.max(this.hero.y - this.viewPortHeight / 2, 0);
        if (this.viewPortY + this.viewPortHeight > this.levelHeight * 16) {
            this.viewPortY = this.levelHeight * 16 - this.viewPortHeight;
        }

    }

    constructor() {
        this.tiles = [];
        for (var x = 0; x < this.levelWidth; x++) {
            this.tiles[x] = [];

            for (var y = 0; y < this.levelHeight; y++) {
                this.tiles[x][y] = 0;
            }
        }
        for (var x = 0; x < this.levelWidth; x++) {
            for (var y = 0; y < this.levelHeight; y += 1) {

                this.tiles[x][y] = (y == this.levelHeight - 1 ? 1 : 0);

                if (x == 0) this.tiles[x][y] = 1;

                if (x == this.levelWidth - 1 && y < this.levelHeight && y >= 0) {
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
        this.updateViewPort();

        context.translate(-this.viewPortX, -this.viewPortY);

        var startX = (this.viewPortX / 16 | 0) * 16;
        var endX = Math.ceil((this.viewPortX + this.viewPortWidth ) / 16) * 16;
        var startY = (this.viewPortY / 16 | 0) * 16;
        var endY = Math.ceil((this.viewPortY + this.viewPortHeight ) / 16) * 16;
        for (let x = startX; x < endX; x += 16) {
            for (let y = startY; y < endY; y += 16) {
                var xPos = (x);
                var yPos = (y);
                context.drawImage(AssetManager.getAsset('empty'), xPos, yPos);
                switch (this.tiles[x / 16 | 0][y / 16 | 0]) {
                    case 0:
                        break;
                    case 1:
                        context.drawImage(AssetManager.getAsset('solid'), xPos, yPos);
                        break;
                    case 2:
                        context.drawImage(AssetManager.getAsset('breakable'), xPos, yPos);
                        break;
                    case 3:
                        context.drawImage(AssetManager.getAsset('no-bottom'), xPos, yPos);
                        break;
                    case 4:
                        context.drawImage(AssetManager.getSheet('spring', 0, 0), xPos, yPos);
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
            this.hero.ya = (KeyManager.keys[Keys.Jump]?-48:-32);
            return true;
        }
        return false;
    }

    click(x: number, y: number) {

        this.tiles[(x + this.viewPortX) / 16 | 0][(y + this.viewPortY) / 16 | 0] = this.selectedTile.index;

    }
}
//http://gamedev.stackexchange.com/questions/74387/platformer-collision-detection-order
//http://hamaluik.com/posts/super-mario-world-physics/
//http://s276.photobucket.com/user/jdaster64/media/smw_physics.png.html
