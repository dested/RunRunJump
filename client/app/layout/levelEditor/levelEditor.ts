import {Component, OnInit, Input} from '@angular/core';
import {RunEngine, ITile} from "../../game/RunEngine";
import {Layout} from "../Layout";

@Component({
    selector: 'level-selector',
    templateUrl: 'app/layout/levelEditor/levelEditor.html',
})
export class LevelEditor implements OnInit {
    @Input() public layout: Layout;
    public tiles: ITile[];
    public selectedTile: ITile;

    constructor() {
        this.tiles = [{
            title: 'Erase',
            image: 'assets/game/erase.png',
            index: 0
        }, {
            title: 'Solid',
            image: 'assets/game/solid.png',
            index: 1
        }, {
            title: 'Breakable',
            image: 'assets/game/breakable.png',
            index: 2
        }, {
            title: 'No Bottom',
            image: 'assets/game/no-bottom.png',
            index: 3
        }, {
            title: 'Spring',
            image: 'assets/game/spring.png',
            index: 4
        }];
        setTimeout(()=>{
            this.selectTile(this.tiles[0]);
        },1)
    }

    ngOnInit() {
    }

    public selectTile(tile: ITile): void {
        document.getElementById('hiddenBox').focus();
        RunEngine.instance.selectedTile = tile;
        this.selectedTile = tile;
        this.layout.loading = false;
    }
}
