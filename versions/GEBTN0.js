const gEBTN = (target, tag) => target.getElementsByTagName(tag), gEBTN0 = (target, tag) => target.getElementsByTagName(tag)[0], dgEBI = (id) => document.getElementById(id);
function on(target, eventName, callback, options) { target.addEventListener(eventName, callback, options); }
function off(target, eventName, callback, options) { target.removeEventListener(eventName, callback, options); }
export { gEBTN, gEBTN0, dgEBI, on, off };
