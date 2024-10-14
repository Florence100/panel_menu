class PanelMenu {
    constructor(rootNode) {
        this._rootNode = rootNode;
        this._primaryMenuItems = Array.from(this._rootNode.querySelector('[rel="panel-menu.main-menu"]').children);
        this._primaryMenuActiveItem = null;
        this._secondaryMenuActiveItem = null;
        this._plate = this._rootNode.querySelector('[rel="panel-menu.plate"]');
        this._plateIsShowed = false;
        this._addStyles();
        this._collectInstances();
        this._addListeners();
    }

    _addStyles() {
        const menuItemsCount = this._primaryMenuItems.length;
        this._primaryMenuItems.forEach((item) => {
            item.style.width = 100 / menuItemsCount + '%';
        })
    }

    _addListeners() {
        this._primaryMenuItems.forEach((item) => {
            item.addEventListener('mouseenter', this._mouseenterHandler.bind(this));
        })

        this._rootNode.addEventListener('mouseleave', this._mouseleaveHandler.bind(this));

        window.addEventListener('resize', this._resizeHandler.bind(this));
    }

    _mouseenterHandler(event) {
        const target = event.target;
        const isContainsSubMenu = target.querySelector('[rel="panel-menu.second-level-menu"]') ? true : false;

        if (isContainsSubMenu) {
            this._primaryMenuActiveItem = target;
            this._plateShow();
        } else {
            if (this._plateIsShowed) {
                this._primaryMenuActiveItem = null;
                this._plateHide();
            }
        }
    }

    _mouseleaveHandler() {
        if (this._plateIsShowed) {
            this._primaryMenuActiveItem = null;
            this._plateHide();
        }
    }

    _resizeHandler() {
        if (this._plateIsShowed) {
            this._plateShow();
        }
    }

    _plateShow() {
        if (!this._plateIsShowed) {
            this._plate.style.left = 'initial';
        }

        const activeTabIndex = this._primaryMenuItems.indexOf(this._primaryMenuActiveItem);
        const secondLevel = this._primaryMenuItems[activeTabIndex].querySelector('[rel="panel-menu.second-level-menu"]');
        const secondLevelWidth = secondLevel.clientWidth;
        const secondLevelHeight = secondLevel.scrollHeight;

        // 52px - mein menu height + overhanging panel height
        this._plate.style.height = secondLevelHeight + 52 + 'px';
        this._plate.style.width = secondLevelWidth + 'px';

        let offsetX = this._offsetXCalculate();
        this._plate.style.left = offsetX + 'px';

        this._plate.classList.add('isShowed');
        this._plateIsShowed = true;

        if (this._secondaryMenuActiveItem) {
            this._secondaryMenuActiveItem.classList.remove('isShowed');
        }
        this._secondaryMenuActiveItem = secondLevel;
        this._secondaryMenuActiveItem.classList.add('isShowed');
    }

    _plateHide() {
        this._plate.style.height = 0;
        this._plate.classList.remove('isShowed');
        this._secondaryMenuActiveItem?.classList.remove('isShowed');
        this._plateIsShowed = false;
    }

    _offsetXCalculate() {
        let offsetX = 0;
        const activeTabIndex = this._primaryMenuItems.indexOf(this._primaryMenuActiveItem);
        for (let j = 0; j < activeTabIndex; j++) {
            const width = this._primaryMenuItems[j].clientWidth;
            offsetX += width;
        }
        return offsetX;
    }

    _thirdLevelShow(thirdLevelNode) {
        const thirdLevelHeight = thirdLevelNode.scrollHeight;
        thirdLevelNode.style.height = thirdLevelHeight + 'px';
    }

    _thirdLevelHide(thirdLevelNode) {
        thirdLevelNode.style.height = 0;
    }

    _getRootNode() {
        return this._rootNode;
    }

    _collectInstances() {
        PanelMenu.instances.push(this);
    }

    static instances = [];

    static init() {
        const elements = document.querySelectorAll('[rel="control.panel-menu"]');
        elements.forEach(function(node) {
            new PanelMenu(node);
        })
    }

    static getInstance(node) {
        let result = null;

        if (node instanceof Node) {
            PanelMenu.instances.forEach(function(element) {
                if (element._rootNode === node | element._rootNode.contains(node)) {
                    result = element;
                    return result;
                }
            })
        }
        return result;
    }
}






