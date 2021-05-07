import RemoteURL from './RemoteURL.js';
import { gEBTN0 } from './GEBTN0.js';
var MethodTypeIndex;
(function (MethodTypeIndex) {
    MethodTypeIndex[MethodTypeIndex["client-notification"] = 0] = "client-notification";
    MethodTypeIndex[MethodTypeIndex["client-request"] = 1] = "client-request";
    MethodTypeIndex[MethodTypeIndex["server-notification"] = 2] = "server-notification";
    MethodTypeIndex[MethodTypeIndex["server-request"] = 3] = "server-request";
})(MethodTypeIndex || (MethodTypeIndex = {}));
export default class DefaultValues {
    static saveDefaultValues() {
        const defaultValuesArray = Object.entries(DefaultValues.defaultValues).flat(), defaultValuesArrayLength = defaultValuesArray.length;
        for (let index = 0; index < defaultValuesArrayLength; index++) {
            defaultValuesArray[index] = JSON.stringify(defaultValuesArray[index]).slice(1, -1).replace(/\\"/g, '"');
        }
        return fetch(RemoteURL.saveDefaultValues, { method: 'POST', body: defaultValuesArray.join('\r\n') });
    }
    static updateDefaultValues(saveButton) {
        const defaultTextarea = saveButton.parentNode, methodString = gEBTN0(defaultTextarea.parentElement, 'a').innerText;
        DefaultValues.defaultValues[methodString] = gEBTN0(defaultTextarea, 'textarea').value;
        return DefaultValues.saveDefaultValues();
    }
}
DefaultValues.methodIconIndex = { arrow_right: 0, leftwards_arrow_with_hook: 1, arrow_left: 2, arrow_right_hook: 3 };
DefaultValues.methodMessages = ['Client Notification', 'Client Request', 'Server Notification', 'Server Request'];
DefaultValues.defaultValues = Object.create(null);
DefaultValues.methodTypeIndex = MethodTypeIndex;
