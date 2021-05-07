export default class TabView {
    constructor(parent, currentTab) {
        this.parent = parent;
        this.currentTab = currentTab;
        this.tabs = this.parent.children;
        this.tab(currentTab);
    }
    tab(tab) {
        for (const child of this.tabs) {
            child.hidden = true;
        }
        this.tabs[this.currentTab = tab].hidden = false;
    }
}
