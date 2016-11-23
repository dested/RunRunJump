//"use strict";

import {Level} from "./level";
import {AssetManager} from "./assetManager";
import {KeyManager,Keys} from "./keyManager";

export class Hero {
    private level:Level;
    public x:number = 0;
    public y:number = 0;
    public xa:number = 0;
    public ya:number = 0;
    public facing:number = 1;
    public jumpTime:number = 0;
    public ducking:boolean = false;
    public sliding:boolean = false;
    private runTime:number = 0;
    private onGround:boolean = false;
    private xJumpSpeed:number = 0;
    private yJumpSpeed:number = 0;

    private width:number = 4;
    private height:number = 24;
    private mayJump:boolean = true;
    private wasOnGround:boolean = false;
    private xPic:number;
    private bumped:boolean;


    constructor(level:Level) {
        this.level = level;
    }

    tick():void {
        //console.log(this.x, this.y, this.xa, this.ya);
        var xSpeed = KeyManager.keys[Keys.Run] && !this.ducking ? 1.2 : .6;

        this.wasOnGround = this.onGround;

        var wasDucking = this.ducking;
        if (this.onGround) {
            this.ducking = KeyManager.keys[Keys.Down];
        }


        if (wasDucking && !this.ducking) {
            if (this.isBlocking(this.x, this.y - 16, 0, 0)) {
                this.ducking = true;
            }
        }


        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }


        if (KeyManager.keys[Keys.Jump] || (this.jumpTime < 0 && !this.onGround && !this.sliding)) {
            this.bumped = false;
            if (this.jumpTime < 0) {
                this.xa = this.xJumpSpeed;
                this.ya = -this.jumpTime * this.yJumpSpeed;
                this.jumpTime++;
            }
            else if (this.onGround && this.mayJump) {
                this.xJumpSpeed = 0;
                this.yJumpSpeed = -1.9;
                this.jumpTime = Math.abs(this.xa) > 8 ? 8 : 7;

                this.ya = this.jumpTime * this.yJumpSpeed;
                this.onGround = false;
                this.sliding = false;
            }
            else if (this.sliding && this.mayJump) {
                this.xJumpSpeed = -this.facing * 6.0;
                this.yJumpSpeed = -2.0;
                this.jumpTime = -6;
                this.xa = this.xJumpSpeed;
                this.ya = -this.jumpTime * this.yJumpSpeed;
                this.onGround = false;
                this.sliding = false;
                this.facing = -this.facing;
            }
            else if (this.jumpTime > 0) {
                this.xa += this.xJumpSpeed;
                this.ya = this.jumpTime * this.yJumpSpeed;
                this.jumpTime--;
            }
        } else {
            this.jumpTime = 0;
        }

        if (KeyManager.keys[Keys.Left] && (!this.ducking || (this.ducking && !this.onGround))) {
            if (this.facing == 1) this.sliding = false;
            this.xa -= xSpeed;
            if (this.jumpTime >= 0) this.facing = -1;
        }

        if (KeyManager.keys[Keys.Right] && (!this.ducking || (this.ducking && !this.onGround))) {
            if (this.facing == -1) this.sliding = false;
            this.xa += xSpeed;
            if (this.jumpTime >= 0) this.facing = 1;
        }

        if ((!KeyManager.keys[Keys.Left] && !KeyManager.keys[Keys.Right]) || this.ducking || this.ya < 0 || this.onGround) {
            this.sliding = false;
        }

        this.mayJump = (this.onGround || this.sliding) && !KeyManager.keys[Keys.Jump];

        this.runTime += (Math.abs(this.xa)) + 5;
        if (Math.abs(this.xa) < 0.5) {
            this.runTime = 0;
            this.xa = 0;
        }

        this.calcPic();

        if (this.sliding) {
            this.ya *= .5;
        }
        this.onGround = false;
        this.move(this.xa, 0, 'x');
        this.move(0, this.ya, 'y');
        if (this.onGround)this.ya = 0;

        this.ya *= HeroConstants.gravity;
        if (this.onGround) {
            this.xa *= HeroConstants.groundInertia;
        } else {
            this.xa *= HeroConstants.airInertia;
        }

        if (!this.onGround) {
            this.ya += 3;
        }

        if (Math.abs(this.ya) < 0.1) {
            this.ya = 0;
        }


    }

    private calcPic():void {
        var runFrame = ((this.runTime / 20) | 0) % 4;
        if (runFrame == 3) runFrame = 1;
        if (Math.abs(this.xa) >= 9) {
            runFrame += 3;
        }

        if (!this.onGround) {
            if (Math.abs(this.xa) >= 9) {
                runFrame = 7;
            }
            else runFrame = 6;
        }

        if (this.onGround && ((this.facing == -1 && this.xa > 0) || (this.facing == 1 && this.xa < 0))) {
            if (this.xa > 1 || this.xa < -1) runFrame = 9;

        }

        if (this.ducking) runFrame = 14;
        this.height = this.ducking ? 12 : 24;
        this.xPic = runFrame;
    }

    private move(xa:number, ya:number, type:string):boolean {


        while (xa > 8) {
            if (!this.move(8, 0, type)) return false;
            xa -= 8;
        }
        while (xa < -8) {
            if (!this.move(-8, 0, type)) return false;
            xa += 8;
        }
        while (ya > 8) {
            if (!this.move(0, 8, type)) return false;
            ya -= 8;
        }
        while (ya < -8) {
            if (!this.move(0, -8, type)) return false;
            ya += 8;
        }

        var collide = false;
        if (ya > 0 || (type == 'y' && ya == 0)) {
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, 0)) collide = true;
            else if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, 0)) collide = true;
            else if (this.isBlocking(this.x + xa - this.width, this.y + ya + 1, xa, ya)) collide = true;
            else if (this.isBlocking(this.x + xa + this.width, this.y + ya + 1, xa, ya)) collide = true;
        }
        if (ya < 0) {
            if (this.isBlocking(this.x + xa, this.y + ya - this.height, xa, ya)) collide = true;
            else if (collide || this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya)) collide = true;
            else if (collide || this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya)) collide = true;
        }
        if (xa > 0) {
            this.sliding = true;
            if (this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya)) collide = true;
            else this.sliding = false;
            if (this.isBlocking(this.x + xa + this.width, this.y + ya - this.height / 2, xa, ya)) collide = true;
            else this.sliding = false;
            if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, ya)) collide = true;
            else this.sliding = false;
        }
        if (xa < 0) {
            this.sliding = true;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya)) collide = true;
            else this.sliding = false;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height / 2, xa, ya)) collide = true;
            else this.sliding = false;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, ya)) collide = true;
            else this.sliding = false;
        }

        if (type == 'y' && ya == 0 && collide) {
            this.y = (((this.y - 1) / 16 + 1) | 0) * 16 - 1;
            this.onGround = true;
            return false;
        }
        if (collide) {
            if (xa < 0) {
                this.x = (((this.x - this.width) / 16) | 0) * 16 + this.width;
                this.xa = 0;
            }
            if (xa > 0) {
                this.x = (((this.x + this.width) / 16 + 1) | 0) * 16 - this.width - 1;
                this.xa = 0;
            }
            if (ya < 0) {
                this.y = (((this.y - this.height) / 16) | 0) * 16 + this.height;
                this.jumpTime = 0;
                this.ya = 0;
            }
            if (ya > 0) {
                this.y = (((this.y - 1) / 16 + 1) | 0) * 16 - 1;
                this.onGround = true;
            }
            return false;
        }
        else {
            this.x += xa;
            this.y += ya;
            return true;
        }
    }

    private isBlocking(_x:number, _y:number, xa:number, ya:number):boolean {

        var x = (_x / 16) | 0;
        var y = (_y / 16) | 0;
        if (x == ((this.x / 16) | 0) && y == ((this.y / 16) | 0))
            return false;

        var blocking = this.level.isBlocking(x, y, xa, ya);
        //console.log(x, y, blocking);

        //var block = this.level.getBlock(x, y);

        if (!this.bumped && blocking && ya < 0) {
            this.level.bump(x, y);
            this.bumped = true;
        }

        return blocking;


    }

    render(context:CanvasRenderingContext2D):void {


        context.save();
        var xPicO:number, yPicO:number, wPic:number, hPic:number;

        xPicO = 16;
        yPicO = 31;
        wPic = hPic = 32;

        this.calcPic();


        var xPixel = (this.x - xPicO);
        var yPixel = (this.y - yPicO);
        //console.log(xPixel, yPixel);
        var xFlipPic = this.facing == -1;

        context.translate(xPixel + (xFlipPic ? wPic : 0)/*- (int) Mario.instance.levelScene.xCam*/, yPixel);

        if (xFlipPic) {
            context.scale(-1, 1);
        }
        console.log(this.xa, this.ya);
        context.drawImage(AssetManager.getSheet('hero', this.xPic, 0), 0, 0);

        context.restore();
    }

}

export class HeroConstants {
    static gravity:number = .85;
    static groundInertia:number = .89;
    static airInertia:number = .89;

}

