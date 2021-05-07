export default class TabView<T extends Element> { 
  currentTab: number; 
  parent: T; 
  tabs: HTMLCollectionOf<HTMLElement>; 
  constructor(parent: T, currentTab: number) { 
    this.parent = parent; 
    this.currentTab = currentTab; 
    this.tabs = this.parent.children as HTMLCollectionOf<HTMLElement>; 
    this.tab(currentTab); 
  } 
  tab(tab: number) { 
    for (const child of this.tabs) { child.hidden = true; } 
    this.tabs[this.currentTab=tab].hidden = false; 
  } 
} 