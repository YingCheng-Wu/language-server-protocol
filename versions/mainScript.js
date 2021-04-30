const gEBTN = (target, tag) => target.getElementsByTagName(tag), gEBTN0 = (target, tag) => target.getElementsByTagName(tag)[0], dgEBTN = (tag) => document.getElementsByTagName(tag), dgEBI = (id) => document.getElementById(id), trim = (input) => input.replace(/^\s+/, '').replace(/\s+$/, ''), remoteURL = 'http://localhost:58888/', remoteURLAPI = remoteURL + 'api/', remoteClangd = remoteURLAPI + 'clangd', remoteSaveDefaultValues = remoteURLAPI + 'saveDefaultValues', spinnerdiv = dgEBI('spinnerdiv'), entry = dgEBI('entry'), sampletextarea = dgEBI('sampletextarea'), resulttextarea = dgEBI('resulttextarea'), contentlength = dgEBI('contentlength'), invalidjson = dgEBI('invalidjson'), tableofcontents = dgEBI('tableofcontents'), listitem = dgEBI('listitem'), startrequest = dgEBI('startrequest');
function on(target, eventName, callback, options) { target.addEventListener(eventName, callback, options); }
function off(target, eventName, callback, options) { target.removeEventListener(eventName, callback, options); }
function showSpinner() { hideSpinner(); spinnerdiv.hidden = false; spinnerdiv.animate({ transform: 'rotate(360deg)' }, { duration: 1e3, iterations: Infinity }); }
function hideSpinner() { spinnerdiv.hidden = true; for (const animation of spinnerdiv.getAnimations()) {
    animation.cancel();
} }
function toggleTextarea() {
    const defaultTextarea = gEBTN(this.parentNode, 'default-textarea')[0];
    if (defaultTextarea.style.display == 'block') {
        defaultTextarea.animate({ height: ['16vh', '0'], easing: 'ease-in' }, 200);
        setTimeout(() => { defaultTextarea.style.display = ''; }, 200);
    }
    else {
        defaultTextarea.animate({ height: ['0', '16vh'], easing: 'ease-out' }, 200);
        defaultTextarea.style.display = 'block';
    }
}
function showEntry() {
    entry.showModal();
    sampletextarea.value = gEBTN0(gEBTN0(this.parentNode, 'default-textarea'), 'textarea').value;
    updateContentLength();
    sampletextarea.focus();
}
function startRequest() {
    resulttextarea.hidden = true;
    showSpinner();
    updateContentLength();
    fetch(remoteClangd, { method: 'POST', body: contentlength.value + '\r\n\r\n' + sampletextarea.value }).then(v => v.text()).then(result => { hideSpinner(); resulttextarea.value = result; resulttextarea.hidden = result ? false : true; });
}
function updateContentLength() {
    sampletextarea.value = sampletextarea.value.replace(/^\s+/, '').replace(/\s+$/, '');
    contentlength.value = 'Content-Length: ' + sampletextarea.value.length;
    jsObjectOrJSON(sampletextarea.value).then(result => {
        if (result) {
            invalidjson.innerText = '';
            sampletextarea.value = result;
            sampletextarea.animate({ backgroundColor: ['transparent', 'grey', 'transparent'] }, 400);
        }
        else {
            invalidjson.innerText = '';
        }
    }).catch((error) => { invalidjson.innerText = error.toString(); });
}
on(entry, 'click', e => { if (e.target == entry) {
    entry.close();
    hideSpinner();
    resulttextarea.hidden = true;
} });
on(startrequest, 'click', startRequest);
on(sampletextarea, 'change', updateContentLength);
function openWebPage(url, href) {
    open(url + gEBTN0(href.parentElement, 'a').getAttribute('href'));
}
function openDocumentPage() {
    openWebPage('https://github.com/microsoft/language-server-protocol/blob/main/versions/protocol-2-x.md', this);
}
function openSpecificationPage() {
    openWebPage('https://microsoft.github.io/language-server-protocol/specifications/specification-current/', this);
}
function openDocumentionPage() {
    openWebPage('file:///C:/Users/yingcheng.wu/Downloads/vscode-languageserver-node-main/docs/modules.html', this);
}
const defaultValues = Object.create(null);
fetch(remoteURL + 'exampleMethods.txt').then(v => v.text()).then(values => {
    const inputArray = trim(values).split('\r\n'), inputArrayLength = inputArray.length;
    for (let index = 0; index < inputArrayLength; index += 2) {
        defaultValues[JSON.parse('"' + inputArray[index].replace(/"/g, '\\"') + '"')] = JSON.parse('"' + inputArray[index + 1].replace(/"/g, '\\"') + '"');
    }
    for (const li of gEBTN(tableofcontents, 'li')) {
        const container = listitem.content.cloneNode(true), children = container.children;
        on(children[0], 'click', showEntry);
        on(children[1], 'click', toggleTextarea);
        on(children[2], 'click', openDocumentPage);
        on(children[3], 'click', openSpecificationPage);
        on(children[4], 'click', openDocumentionPage);
        const rpcMethod = gEBTN0(li, 'a').innerText;
        container.lastElementChild.firstElementChild.value = rpcMethod && defaultValues[rpcMethod] || '{"jsonrpc":"2.0","id":0,"method":"' + rpcMethod + '","params":{}}';
        li.appendChild(container);
    }
});
const workerURL = URL.createObjectURL(new Blob(['onmessage=(input)=>{ try { const output = eval(\'(\'+input.data+\')\'); postMessage({result: output}); } catch(e) { postMessage({error: e}); } };'], { type: 'application/javascript' })), JSONWorker = new Worker(workerURL), jsObjectOrJSON = (input) => new Promise((resolve, reject) => {
    try {
        JSON.parse(input);
        resolve();
    }
    catch (error) {
        function offListeners() { off(JSONWorker, 'message', onMessage); }
        function onMessage(messageEvent) {
            const data = messageEvent.data;
            offListeners();
            if (data.error) {
                reject(error);
            }
            else {
                resolve(JSON.stringify(data.result));
            }
        }
        on(JSONWorker, 'message', onMessage);
        JSONWorker.postMessage(input);
    }
});
URL.revokeObjectURL(workerURL);
function saveDefaultValues() {
    const defaultValuesArray = Object.entries(defaultValues).flat(), defaultValuesArrayLength = defaultValuesArray.length;
    for (let index = 0; index < defaultValuesArrayLength; index++) {
        defaultValuesArray[index] = JSON.stringify(defaultValuesArray[index]).slice(1, -1).replace(/\\"/g, '"');
    }
    return fetch(remoteSaveDefaultValues, { method: 'POST', body: defaultValuesArray.join('\n') });
}
