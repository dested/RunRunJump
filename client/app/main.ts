/// <reference path="../typings/Compress.d.ts" /> 
import {RunEngine} from "./game/RunEngine";
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Layout }   from './layout/Layout';
import {ObjectSelector} from "./layout/objectSelector/ObjectSelector";
import {LevelSelector} from "./layout/levelSelector/LevelSelector";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {HttpModule } from '@angular/http';

const platform = platformBrowserDynamic();


@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [Layout, ObjectSelector, LevelSelector],
    bootstrap: [Layout]
})
export class AppModule {
    constructor(){
        setTimeout(()=>{
            new RunEngine();
        },1)
    }
}
platform.bootstrapModule(AppModule);

 
