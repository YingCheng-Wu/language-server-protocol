import TabView from './TabView.js'; 
import OpenWebPage from './OpenWebPage.js'; 
import Hintdiv from './Hintdiv.js'; 
import {dgEBI, gEBTN, gEBTN0, on} from './GEBTN0.js'; 
import DefaultValues from './DefaultValues.js'; 
import RemoteURL from './RemoteURL.js'; 
import JSONWorker from './JSONWorker.js'; 
const trim = (input: string)=>input.replace(/^\s+/, '').replace(/\s+$/, ''), 
spinnerdiv = dgEBI('spinnerdiv')as HTMLDivElement, 
entry = dgEBI('entry')as HTMLDialogElement, 
sampletextarea = dgEBI('sampletextarea')as HTMLTextAreaElement, 
resulttextarea = dgEBI('resulttextarea')as HTMLTextAreaElement, 
contentlength = dgEBI('contentlength')as HTMLInputElement, 
invalidjson = dgEBI('invalidjson')as HTMLDivElement, 
tableofcontents = dgEBI('tableofcontents')as HTMLDivElement, 
listitem = dgEBI('listitem')as HTMLTemplateElement, 
startrequest = dgEBI('startrequest')as HTMLButtonElement, 
hintdiv = dgEBI('hintdiv')as HTMLDivElement, 
methodtypeh3 = dgEBI('methodtypeh3')as HTMLHeadingElement, 
methodstringh3 = dgEBI('methodstringh3')as HTMLHeadingElement, 
editmode = dgEBI('editmode')as HTMLDivElement, 
codebeautify = dgEBI('codebeautify')as HTMLButtonElement, 
resultpre = dgEBI('resultpre')as HTMLPreElement, 
contentlengthspan = dgEBI('contentlengthspan')as HTMLSpanElement, 
editsyntaxpre = dgEBI('editsyntaxpre')as HTMLPreElement, 
resultlengthdiv = dgEBI('resultlengthdiv')as HTMLDivElement, 
resultlengthspan = dgEBI('resultlengthspan')as HTMLSpanElement, 
resultbeautify = dgEBI('resultbeautify')as HTMLButtonElement, 
resulttabs = dgEBI('resulttabs')as HTMLDivElement, 
resultdiv = dgEBI('resultdiv')as HTMLDivElement; 
function showSpinner() { 
  hideSpinner(); 
  spinnerdiv.hidden = false; 
  spinnerdiv.animate({transform: 'rotate(360deg)'}, {duration: 1e3, iterations: Infinity}); 
} 
function hideSpinner() { 
  spinnerdiv.hidden = true; 
  for (const animation of spinnerdiv.getAnimations()) { animation.cancel(); } 
} 
function toggleTextarea() { 
  const defaultTextarea = gEBTN(this.parentNode, 'default-textarea')[0]as HTMLElement; 
  if (defaultTextarea.style.display=='block') { 
    on(defaultTextarea.animate({height: [defaultTextarea.offsetHeight+'px', '0'], easing: 'ease-in-out'}, {duration: 2e2}), 'finish', ()=>{ defaultTextarea.removeAttribute('style'); }); 
  } else { 
    defaultTextarea.style.display = 'block'; 
    defaultTextarea.animate({height: ['0', defaultTextarea.offsetHeight+'px'], easing: 'ease-in-out'}, 2e2); 
  } 
} 
function updateTextareaHeight(textarea: HTMLTextAreaElement) { 
  const height = textarea.style.height; 
  textarea.style.height = ''; 
  const scrollHeight = textarea.scrollHeight+10+'px'; 
  textarea.style.height = height; 
  textarea.style.overflow = 'hidden'; 
  on(textarea.animate({height: scrollHeight}, 2e2), 'finish', ()=>{ 
    textarea.style.height = scrollHeight; 
    textarea.style.overflow = ''; 
  }); 
} 
function updateContentLength() { 
  sampletextarea.value = trim(sampletextarea.value); 
  if (contentlength.hidden) { sampletextarea.focus(); } 
  const length = new Blob([sampletextarea.value]).size; 
  contentlength.value = 'Content-Length: '+length; 
  contentlengthspan.innerText = length.toString(); 
  JSONWorker.normalize(sampletextarea.value).then(result=>{ 
    invalidjson.hidden = true; invalidjson.innerText = ''; 
    if (result) { 
      sampletextarea.value = result; 
      sampletextarea.animate({backgroundColor: ['transparent', 'grey', 'transparent']}, 400); 
    } 
    updateTextareaHeight(sampletextarea); 
  }).catch((error)=>{ invalidjson.innerText = error.toString(); invalidjson.hidden = false; }); 
} 
function showEntry(this: HTMLElement) { 
  const li = this.parentNode as HTMLLIElement, methodstring = gEBTN0(li, 'a').innerText; 
  entry.showModal(); 
  methodtypeh3.innerText = DefaultValues.methodMessages[DefaultValues.methodTypeIndex[li.firstChild!.nodeName.toLowerCase()]]; 
  if (methodstringh3.innerText!=methodstring) { 
    methodstringh3.innerText = methodstring; 
    sampletextarea.value = gEBTN0(gEBTN0(this.parentElement!, 'default-textarea'), 'textarea').value; 
  } 
  updateContentLength(); 
  sampletextarea.focus(); 
} 
function showEntryFromChild() { showEntry.call(this.parentNode); } 
on(entry, 'pointerdown', (evt: MouseEvent)=>{ 
  if (evt.target==entry) { entry.close(); hideSpinner(); resultdiv.hidden = true; } 
}); 
declare const hljs: {highlightElement(element: Element): void; }; 
on(startrequest, 'click', ()=>{ 
  resultdiv.hidden = true; 
  showSpinner(); 
  updateContentLength(); 
  fetch(RemoteURL.clangd, {method: 'POST', body: contentlength.value+'\r\n\r\n'+sampletextarea.value}).then(v=>v.text()).then(async result=>{ 
    const index = result.indexOf('Content-Length:'), indexrn = result.indexOf('\r\n\r\n'); 
    hideSpinner(); 
    if (index===0&&indexrn>-1) { 
      resultlengthspan.innerText = result.slice(index+15, indexrn); 
      resulttextarea.value = result.slice(0, indexrn+3)+(resultpre.innerText = JSON.stringify(JSON.parse(result.slice(indexrn+3)), null, 2)); 
      resultlengthdiv.hidden = false; 
    } else { 
      resultlengthdiv.hidden = true; 
      resultpre.innerText = resulttextarea.value = result; 
    } 
    hljs.highlightElement(resultpre); 
    resultdiv.hidden = !result; 
    updateTextareaHeight(resulttextarea); 
  }); 
}); 
on(sampletextarea, 'change', updateContentLength); 
on(sampletextarea, 'select', ()=>{ 
  const {value, selectionStart, selectionEnd} = sampletextarea; 
  if (contentlength.hidden) { 
    const startIndex = value.indexOf('\n\n'), startRange = selectionStart-startIndex; 
    if (startRange<3&&startRange>0) { 
      sampletextarea.selectionStart = startIndex+2; 
      sampletextarea.selectionEnd = value.length; 
    } else if (startRange===0||startRange<0&&selectionEnd>startIndex) { 
      sampletextarea.select(); 
    } else if (selectionEnd===value.length) {
      if (selectionStart>=startIndex) { sampletextarea.selectionStart = startIndex+2; } else { sampletextarea.selectionStart = 0; } 
    } 
  } else if (selectionStart===0&&selectionEnd===value.length) { 
    sampletextarea.removeAttribute('class'); 
    sampletextarea.style.height = sampletextarea.offsetHeight+contentlength.offsetHeight+'px'; 
    contentlength.hidden = true; 
    sampletextarea.value = contentlength.value+'\r\n\r\n'+value; 
    sampletextarea.select(); 
  } 
}); 
on(sampletextarea, 'focus', ()=>{ 
  const {value} = sampletextarea; 
  if (contentlength.hidden) { 
    const index = value.indexOf('\n\n'); 
    sampletextarea.value = index>0?value.slice(index+2):''; 
    sampletextarea.className = 'sampletextarea'; 
    contentlength.hidden = false; 
    sampletextarea.style.height = sampletextarea.offsetHeight-contentlength.offsetHeight+'px'; 
  } 
}); 
const editMode = new TabView(editmode, 0), resultTabs = new TabView(resulttabs, 0); 
on(codebeautify, 'click', ()=>{ 
  sampletextarea.focus(); 
  if (editMode.currentTab===0) { 
    editsyntaxpre.innerText = sampletextarea.value; 
    hljs.highlightElement(editsyntaxpre); 
    editMode.tab(1); 
    codebeautify.style.color = '#9cdcfe'; 
  } else if (editMode.currentTab===1) { 
    editMode.tab(0); 
    if (invalidjson.hidden) { 
      sampletextarea.value = JSON.stringify(JSON.parse(sampletextarea.value), null, 2); 
      updateTextareaHeight(sampletextarea); 
    } 
    codebeautify.style.color = '#999'; 
  } 
}); 
on(resultbeautify, 'click', ()=>{ 
  if (resultTabs.currentTab===0) { 
    resultTabs.tab(1); 
    resultbeautify.style.color = '#999'; 
    updateTextareaHeight(resulttextarea); 
  } else if (resultTabs.currentTab===1) { 
    resultTabs.tab(0); 
    resultbeautify.style.color = '#9cdcfe'; 
  } 
}); 
class showHintdiv { 
  static Hintdiv = new Hintdiv(hintdiv); 
  static showPlayButtonHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Try it out'); } 
  static showEditButtonHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Edit request'); } 
  static showDocIconHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Show specification'); } 
  static showSpecIconHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Open documentation'); } 
  static showMoreIconHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Look for the definition'); } 
  static showPlayButtonInDeTeHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Try it out', {direction: 'left'}); } 
  static showSaveButtonHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, 'Save', {direction: 'left'}); } 
  static showMethodMessageHint(this: HTMLElement) { showHintdiv.Hintdiv.showHint(this, DefaultValues.methodMessages[DefaultValues.methodTypeIndex[this.nodeName.toLowerCase()]]); } 
  static updateDefaultValues(this: HTMLElement) { DefaultValues.updateDefaultValues(this).then(response=>{ if (response.status===200) { showHintdiv.Hintdiv.showHint(this, 'Okay', {direction: 'left'}); } }); } 
} 
fetch(RemoteURL.remoteURL+'exampleMethods.txt').then(v=>v.text()).then(values=>{ 
  const inputArray = trim(values).split('\r\n'), inputArrayLength = inputArray.length; 
  for (let index = 0; index<inputArrayLength; index += 2) { 
    DefaultValues.defaultValues[JSON.parse('"'+inputArray[index].replace(/"/g, '\\"')+'"')] = JSON.parse('"'+inputArray[index+1].replace(/"/g, '\\"')+'"'); 
  } 
  for (const li of gEBTN(tableofcontents, 'li')) { 
    const container = listitem.content.cloneNode(true)as DocumentFragment, 
    children = container.children, 
    [playButton, editButton, docIcon, specIcon, moreIcon, defaultTextarea] = children, 
    [, playButtonInDeTe, saveButton] = defaultTextarea.children, 
    click = 'click', hover = 'pointerenter'; 
    on(playButton, click, showEntry); on(playButton, hover, showHintdiv.showPlayButtonHint); 
    on(editButton, click, toggleTextarea); on(editButton, hover, showHintdiv.showEditButtonHint); 
    on(docIcon, click, OpenWebPage.openDocumentPage); on(docIcon, hover, showHintdiv.showDocIconHint); 
    on(specIcon, click, OpenWebPage.openSpecificationPage); on(specIcon, hover, showHintdiv.showSpecIconHint); 
    on(moreIcon, click, OpenWebPage.openDocumentationPage); on(moreIcon, hover, showHintdiv.showMoreIconHint); 
    on(playButtonInDeTe, click, showEntryFromChild); on(playButtonInDeTe, hover, showHintdiv.showPlayButtonInDeTeHint)
    on(saveButton, click, showHintdiv.updateDefaultValues); on(saveButton, hover, showHintdiv.showSaveButtonHint); 
    const methodString = (gEBTN0(li, 'a')as HTMLAnchorElement).innerText, 
    methodElement = li.firstElementChild!, 
    methodTypeString = DefaultValues.methodTypeIndex[DefaultValues.methodIconIndex[methodElement.getAttribute('alias')!]], 
    methodTypeElement = document.createElement(methodTypeString); 
    methodElement.replaceWith(methodTypeElement); 
    on(methodTypeElement, hover, showHintdiv.showMethodMessageHint); 
    (container.lastElementChild!.firstElementChild as HTMLTextAreaElement).value = methodString&&DefaultValues.defaultValues[methodString]||'{"jsonrpc":"2.0",'+(methodTypeString.split('-')[1]=='request'?'"id":0,':'')+'"method":"'+methodString+'","params":{}}'; 
    li.appendChild(container); 
  } 
}); 