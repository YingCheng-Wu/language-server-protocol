export default class JSONWorker {
}
JSONWorker.workerURL = URL.createObjectURL(new Blob(["onmessage=(input)=>{ try { const output = eval('('+input.data+')'); postMessage({result: output}); } catch(e) { postMessage({error: e}); } };"], { type: 'application/javascript' }));
JSONWorker.worker = new Worker(JSONWorker.workerURL);
JSONWorker.normalize = (input) => new Promise((resolve, reject) => {
    try {
        const JSONString = JSON.stringify(JSON.parse(input), null, 2);
        resolve(input == JSONString ? false : JSONString);
    }
    catch (error) {
        function offListeners() { JSONWorker.worker.removeEventListener('message', onMessage); }
        function onMessage(messageEvent) {
            const data = messageEvent.data;
            offListeners();
            if (data.error) {
                reject(error);
            }
            else {
                resolve(JSON.stringify(data.result, null, 2));
            }
        }
        JSONWorker.worker.addEventListener('message', onMessage);
        JSONWorker.worker.postMessage(input);
    }
});
URL.revokeObjectURL(JSONWorker.workerURL);
