export default class OpenWebPage {
    static openWebPage(url, href) { open(url + href.parentElement.getElementsByTagName('a')[0].getAttribute('href')); }
    static openDocumentPage() { OpenWebPage.openWebPage('https://github.com/microsoft/language-server-protocol/blob/main/versions/protocol-2-x.md', this); }
    static openSpecificationPage() { OpenWebPage.openWebPage('https://microsoft.github.io/language-server-protocol/specifications/specification-current/', this); }
    static openDocumentationPage() { OpenWebPage.openWebPage('file:///C:/Users/yingcheng.wu/Downloads/vscode-languageserver-node-main/docs/modules.html', this); }
}
