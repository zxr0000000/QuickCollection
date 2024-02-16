import { defineStore } from "pinia"
import { BaseStore, action, getter, transfer } from "../base/baseStore"

@transfer
class PluginManager extends BaseStore {
    constructor() {
        super({
            name: 'lxy'
        })
        console.log(this)
    }

    $HHH = {}

    @getter
    getName() {
    }

    @action
    logName() {

    }
}

export const usePluginManager = defineStore('PluginManager', new PluginManager())