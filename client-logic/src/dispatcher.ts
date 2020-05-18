/**
 * Simple (Event)Dispatcher class
 * Inspiered by https://medium.com/@LeoAref/simple-event-dispatcher-implementation-using-javascript-36d0eadf5a11
 */
export class Dispatcher {
    events: any;

    constructor() {
        this.events = {};
    }

    addEventListener(event: string, callback: (data?: any) => any) {
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            };
        }
        this.events[event].listeners.push(callback);
    }

    removeEventListener(event: string, callback: (data?: any) => any) {
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners = this.events[event].listeners.filter(
            (listener: string) => {
                return listener.toString() !== callback.toString();
            }
        );
    }

    dispatchEvent(event: string, data?: any) {
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners.forEach((listener: any) => {
            listener(data);
        });
    }
}