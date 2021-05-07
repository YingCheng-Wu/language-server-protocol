import RemoteURL from './RemoteURL.js'; 
import {gEBTN0} from './GEBTN0.js'; 
enum MethodTypeIndex { 'client-notification', 'client-request', 'server-notification', 'server-request' } 
export default class DefaultValues { 
  static methodIconIndex = {arrow_right: 0, leftwards_arrow_with_hook: 1, arrow_left: 2, arrow_right_hook: 3}; 
  static methodMessages = ['Client Notification', 'Client Request', 'Server Notification', 'Server Request']; 
  static defaultValues = Object.create(null)as {[method: string]: string}; 
  static methodTypeIndex = MethodTypeIndex; 
  static saveDefaultValues() { 
    const defaultValuesArray = Object.entries(DefaultValues.defaultValues).flat(), 
    defaultValuesArrayLength = defaultValuesArray.length; 
    for (let index = 0; index<defaultValuesArrayLength; index++) { 
      defaultValuesArray[index] = JSON.stringify(defaultValuesArray[index]).slice(1, -1).replace(/\\"/g, '"'); 
    } 
    return fetch(RemoteURL.saveDefaultValues, {method: 'POST', body: defaultValuesArray.join('\r\n')}); 
  } 
  static updateDefaultValues(saveButton: HTMLElement) { 
    const defaultTextarea = saveButton.parentNode as HTMLDivElement, 
    methodString = gEBTN0(defaultTextarea.parentElement!, 'a').innerText; 
    DefaultValues.defaultValues[methodString] = gEBTN0(defaultTextarea, 'textarea').value; 
    return DefaultValues.saveDefaultValues(); 
  } 
} 