export class Layout {

    navBtnElements = document.querySelectorAll("#layout-navigation a");
    accordionCategoryBtn = document.getElementById('accordion-button-category');
    accordionCategoryList = document.getElementById('collapseOne');
    constructor() {
        this.toggleClassButtonsNav();
    }
    toggleClassButtonsNav() {
        this.navBtnElements.forEach(btn=> {
            if (btn.href.replace(window.location.origin, '') === window.location.pathname) {
                btn.classList.add('active');
                if(btn.closest('#collapseOne')) {
                    this.accordionCategoryBtn.classList.remove('collapsed');
                    this.accordionCategoryList.classList.add('show');
                } else {
                    this.accordionCategoryBtn.classList.add('collapsed');
                    this.accordionCategoryList.classList.remove('show');
                }
            } else {
                btn.classList.remove('active');
            }
        });
    }
}