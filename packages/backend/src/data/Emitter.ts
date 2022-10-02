import { EventEmitter } from "eventemitter3";

export const Emits = {
    GlobalsUpdate: "globals_update"
}

export class Emitter extends EventEmitter {
    async emitGlobalsUpdate() {
        return this.emit(Emits.GlobalsUpdate)
    }

    async onGlobalsUpdate(cb: () => unknown) {
        this.on(Emits.GlobalsUpdate, cb);
    }

    async offGlobalsUpdate(cb: () => unknown) {
        this.off(Emits.GlobalsUpdate, cb);
    }
}

export const $emitter = new Emitter();