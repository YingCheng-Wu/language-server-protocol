export default class Hintdiv {
    constructor(hintdiv) {
        this.hintdivTimer = 0;
        this.hideHintdivTimer = 0;
        this.hintdiv = hintdiv;
    }
    hideHintdiv() {
        this.hintdiv.hidden = true;
        this.hideHintdivTimer = 0;
    }
    showHintdiv() {
        this.hintdiv.hidden = false;
        this.hintdiv.animate({ opacity: [0, 1] }, { duration: 1e2, fill: 'forwards' });
        this.hideHintdivTimer = setTimeout(this.hideHintdiv, 2e3);
    }
    showHint(target, text, options) {
        this.hintdiv.innerText = text;
        if (options) {
            if (options.direction == 'left') {
                this.hintdiv.className = 'hintdivleft';
                this.hintdiv.hidden = false;
                this.hintdiv.style.left = target.offsetLeft - this.hintdiv.offsetWidth + 'px';
                if (this.hideHintdivTimer === 0) {
                    this.hintdiv.hidden = true;
                }
            }
        }
        else {
            this.hintdiv.className = 'hintdivright';
            this.hintdiv.style.left = target.offsetLeft + target.offsetWidth + 'px';
        }
        this.hintdiv.style.top = Math.round(target.offsetTop + target.offsetHeight / 2) + 'px';
        if (this.hideHintdivTimer) {
            clearTimeout(this.hideHintdivTimer);
            this.hideHintdivTimer = setTimeout(this.hideHintdiv, 2e3);
        }
        else {
            clearTimeout(this.hintdivTimer);
            this.hintdivTimer = setTimeout(this.showHintdiv, 1e3);
        }
    }
}
