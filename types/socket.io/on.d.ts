import { Emitter } from "./component-emitter";
export declare function on(obj: Emitter<any, any>, ev: string, fn: (err?: any) => any): VoidFunction;
