type GEBTN0 = { (target: Element, tag: 'a'): HTMLAnchorElement; (target: Element, tag: 'textarea'): HTMLTextAreaElement; (target: Element, tag: string): HTMLElement; }; 
const gEBTN = (target: Element, tag: string)=>target.getElementsByTagName(tag), 
gEBTN0:GEBTN0 = (target: Element, tag: string)=>target.getElementsByTagName(tag)[0]as any, 
dgEBI = (id: string)=>document.getElementById(id); 
function on(target: EventTarget, eventName: string, callback: EventListener|((arg: any)=>void), options?: boolean|AddEventListenerOptions) { target.addEventListener(eventName, callback, options); } 
function off(target: EventTarget, eventName: string, callback: EventListener|((arg: any)=>void), options?: boolean|EventListenerOptions) { target.removeEventListener(eventName, callback, options); } 
export {gEBTN, gEBTN0, dgEBI, on, off}; 