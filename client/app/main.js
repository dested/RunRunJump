"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../typings/Compress.d.ts" /> 
var RunEngine_1 = require("./game/RunEngine");
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var Layout_1 = require('./layout/Layout');
var ObjectSelector_1 = require("./layout/objectSelector/ObjectSelector");
var LevelSelector_1 = require("./layout/levelSelector/LevelSelector");
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var platform = platform_browser_dynamic_1.platformBrowserDynamic();
var AppModule = (function () {
    function AppModule() {
        setTimeout(function () {
            new RunEngine_1.RunEngine();
        }, 1);
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule],
            declarations: [Layout_1.Layout, ObjectSelector_1.ObjectSelector, LevelSelector_1.LevelSelector],
            bootstrap: [Layout_1.Layout]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
platform.bootstrapModule(AppModule);
