//"use strict";

import {Hero} from "./hero";
import {AssetManager} from "./assetManager";
export class Level {
    private hero:Hero;
    private tiles:boolean[][];

    constructor() {
        console.log('hilevel');
        this.tiles = [];
        for (var x = 0; x < 100; x++) {
            this.tiles[x] = [];

            for (var y = 0; y < 30; y++) {
                this.tiles[x][y] = false;
            }
        }
        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 30; y += 1) {

/*
                if (Math.random() * 100 < 8) {
                    this.tiles[x][y] = true;
                    this.tiles[x - 1] && (this.tiles[x - 1][y] = true);
                    this.tiles[x + 1] && (this.tiles[x + 1][y] = true);
                }
                continue;
*/

                this.tiles[x][y] = (y == 25 );
                if (x == 37) {
                    this.tiles[x][y] = true;
                }
                if (x == 35 && y < 24 && y > 10) {
                    this.tiles[x][y] = true;
                }

                if (x == 29 && y < 21 && y > 7) {
                    this.tiles[x][y] = true;
                }

            }
        }
    }

    setHero(hero:Hero, x:Number, y:Number):void {
        this.hero = hero;
        this.hero.x = x;
        this.hero.y = y;
    }

    render(context:CanvasRenderingContext2D):void {

        this.hero.render(context);

        var blockAsset = AssetManager.getAsset('block');

        for (var x = 0; x < 100; x++) {
            for (var y = 0; y < 30; y++) {
                if (this.tiles[x][y]) {
                    context.drawImage(blockAsset, x * 16, y * 16);
                }
            }
        }


    }

    tick():void {
        this.hero.tick();
    }

    isBlocking(x:Number, y:Number, xa:Number, ya:Number):boolean {
        var block = this.tiles[x][y];


        return block;
        /*        var blocking = ((TILE_BEHAVIORS[block & 0xff]) & BIT_BLOCK_ALL) > 0;
         blocking |= (ya > 0) && ((TILE_BEHAVIORS[block & 0xff]) & BIT_BLOCK_UPPER) > 0;
         blocking |= (ya < 0) && ((TILE_BEHAVIORS[block & 0xff]) & BIT_BLOCK_LOWER) > 0;

         return blocking;*/
    }

    bump(x:Number, y:Number):void {
        this.tiles[x][y] = false;
    }
}
//http://gamedev.stackexchange.com/questions/74387/platformer-collision-detection-order
//http://hamaluik.com/posts/super-mario-world-physics/
//http://s276.photobucket.com/user/jdaster64/media/smw_physics.png.html