///<reference path="../../typings/keyboardjs.d.ts"/>

//"use strict";

export class KeyManager {

    static keys:boolean[];

    static start() {

        this.keys = [];

        keyboardJS.bind('left', (e)=> {
            e.preventRepeat();
            this.keys[Keys.Left] = true;
        }, (e)=> {
            this.keys[Keys.Left] = false;
        });
        keyboardJS.bind('right', (e)=> {
            e.preventRepeat();
            this.keys[Keys.Right] = true;
        }, (e)=> {
            this.keys[Keys.Right] = false;
        });
        keyboardJS.bind('up', (e)=> {
            e.preventRepeat();
            this.keys[Keys.Up] = true;
        }, (e)=> {
            this.keys[Keys.Up] = false;
        });
        keyboardJS.bind('down', (e)=> {
            e.preventRepeat();
            this.keys[Keys.Down] = true;
        }, (e)=> {
            this.keys[Keys.Down] = false;
        });
        keyboardJS.bind('s', (e)=> {
            e.preventRepeat();
            this.keys[Keys.Run] = true;
        }, (e)=> {
            this.keys[Keys.Run] = false;
        });
        keyboardJS.bind('d', (e)=> {
            e.preventRepeat();
            this.keys[Keys.Jump] = true;
        }, (e)=> {
            this.keys[Keys.Jump] = false;
        });
    }
}
export enum Keys{
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
    Run = 4,
    Jump = 5
}