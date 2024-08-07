var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-post-composer/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-post-composer/global/index.ts", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/assets.ts"], function (require, exports, components_2, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.widgets = exports.chartWidgets = exports.searchEmojis = exports.fetchEmojis = exports.colorsMapper = exports.emojiCategories = exports.getEmbedElement = exports.extractWidgetUrl = exports.getWidgetEmbedUrl = exports.fetchReactionGifs = exports.fetchGifs = void 0;
    const fetchGifs = async (params) => {
        if (!params.offset)
            params.offset = 0;
        if (!params.limit)
            params.limit = 40;
        params.api_key = 'K0QfKNGrvsuY9nPKE1vn9lEGapWEY4eR';
        const queries = params ? new URLSearchParams({
            ...params
        }).toString() : '';
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?${queries}`);
            return await response.json();
        }
        catch {
            return null;
        }
    };
    exports.fetchGifs = fetchGifs;
    const fetchReactionGifs = async () => {
        const params = {
            api_key: 'K0QfKNGrvsuY9nPKE1vn9lEGapWEY4eR'
        };
        const queries = new URLSearchParams({ ...params }).toString();
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/categories/reactions?${queries}`);
            return await response.json();
        }
        catch {
            return null;
        }
    };
    exports.fetchReactionGifs = fetchReactionGifs;
    const WIDGET_URL = 'https://widget.noto.fan';
    const getWidgetEmbedUrl = (module, data) => {
        if (module) {
            const widgetData = {
                module: {
                    name: module
                },
                properties: { ...data },
                modifiedTime: Date.now()
            };
            const encodedWidgetDataString = encodeURIComponent(window.btoa(JSON.stringify(widgetData)));
            const moduleName = module.slice(1);
            return `${WIDGET_URL}/#!/${moduleName}/${encodedWidgetDataString}`;
        }
        return '';
    };
    exports.getWidgetEmbedUrl = getWidgetEmbedUrl;
    const extractWidgetUrl = (url) => {
        const rule = /https?:\/\/widget\.\S+\/scom\/\S+\/\S+/g;
        let match = rule.exec(url);
        let widgetUrl = match && match[0] || '';
        if (!widgetUrl)
            return null;
        let arr = widgetUrl.split('/scom/');
        let paths = arr[1].split('/');
        const moduleName = `@scom/${paths[0]}`;
        let data;
        try {
            const dataBase64 = decodeURIComponent(paths.slice(1).join('/'));
            data = JSON.parse(atob(dataBase64));
            if ('properties' in data) {
                data = { ...data.properties };
            }
        }
        catch (err) { }
        return {
            moduleName,
            modifiedTime: data?.modifiedTime,
            data: { ...data }
        };
    };
    exports.extractWidgetUrl = extractWidgetUrl;
    const getEmbedElement = async (postData, parent) => {
        const { module, data } = postData;
        if (parent.ready)
            await parent.ready();
        const elm = await components_2.application.createElement(module, true);
        if (!elm)
            throw new Error('not found');
        elm.parent = parent;
        const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf) => conf.target === 'Builders' || conf.target === 'Editor') : null;
        if (elm.ready)
            await elm.ready();
        elm.maxWidth = '100%';
        elm.maxHeight = '100%';
        if (builderTarget?.setData && data.properties) {
            await builderTarget.setData(data.properties);
        }
        const { dark, light } = data.properties || {};
        let tag = {};
        const darkTheme = getThemeValues(dark);
        const lightTheme = getThemeValues(light);
        if (darkTheme) {
            tag['dark'] = darkTheme;
        }
        if (lightTheme) {
            tag['light'] = lightTheme;
        }
        tag = { ...tag, ...data.tag };
        if (builderTarget?.setTag && Object.keys(tag).length) {
            await builderTarget.setTag(tag);
        }
        return elm;
    };
    exports.getEmbedElement = getEmbedElement;
    const getThemeValues = (theme) => {
        if (!theme || typeof theme !== 'object')
            return null;
        let values = {};
        for (let prop in theme) {
            if (theme[prop])
                values[prop] = theme[prop];
        }
        return Object.keys(values).length ? values : null;
    };
    exports.emojiCategories = [
        {
            name: 'Recent',
            value: 'recent',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f551.svg',
            groups: []
        },
        {
            name: 'Smileys & Emotion',
            value: 'smileys-and-people',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f600.svg',
            groups: ['body', 'cat-face', 'clothing', 'creature-face', 'emotion', 'face-negative', 'face-neutral', 'face-positive', 'face-positive', 'face-role', 'face-sick', 'family', 'monkey-face', 'person', 'person-activity', 'person-gesture', 'person-role', 'skin-tone']
        },
        {
            name: 'Animals & nature',
            value: 'animals-and-nature',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f43b.svg',
            groups: ['animal-amphibian', 'animal-bird', 'animal-bug', 'animal-mammal', 'animal-marine', 'animal-reptile', 'plant-flower', 'plant-other']
        },
        {
            name: 'Food & drink',
            value: 'food-and-drink',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f354.svg',
            groups: ['dishware', 'drink', 'food-asian', 'food-fruit', 'food-prepared', 'food-sweat', 'food-vegetable']
        },
        {
            name: 'Activity',
            value: 'activities',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/26bd.svg',
            groups: ["activities"]
        },
        {
            name: 'Travel & places',
            value: 'travel-and-places',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f698.svg',
            groups: ["travel-and-places"]
        },
        {
            name: 'Objects',
            value: 'objects',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f4a1.svg',
            groups: ["objects"]
        },
        {
            name: 'Symbols',
            value: 'symbols',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f523.svg',
            groups: ["symbols"]
        },
        {
            name: 'Flags',
            value: 'flags',
            image: 'https://abs-0.twimg.com/emoji/v2/svg/1f6a9.svg',
            groups: ["flags"]
        }
    ];
    exports.colorsMapper = {
        'rgb(255, 220, 93)': {
            htmlCode: '',
            unicode: ''
        },
        'rgb(247, 222, 206)': {
            htmlCode: '&#127995;',
            unicode: 'U+1F3FB'
        },
        'rgb(243, 210, 162)': {
            htmlCode: '&#127996;',
            unicode: 'U+1F3FC'
        },
        'rgb(213, 171, 136)': {
            htmlCode: '&#127997;',
            unicode: 'U+1F3FD'
        },
        'rgb(175, 126, 87)': {
            htmlCode: '&#127998;',
            unicode: 'U+1F3FE'
        },
        'rgb(124, 83, 62)': {
            htmlCode: '&#127999;',
            unicode: 'U+1F3FF'
        }
    };
    const EMOJI_BASE_URL = 'https://emojihub.yurace.pro/api/all';
    const fetchEmojis = async (params) => {
        try {
            const uri = `${EMOJI_BASE_URL}/category/${params.category}`;
            const response = await fetch(`${uri}`);
            return await response.json();
        }
        catch {
            return [];
        }
    };
    exports.fetchEmojis = fetchEmojis;
    const searchEmojis = (q, mapper) => {
        const keyword = q.toLowerCase();
        const categoryName = exports.emojiCategories.find(cate => cate.name.toLowerCase().includes(keyword))?.name;
        if (categoryName)
            return mapper.get(categoryName);
        const groups = mapper.values();
        let result = [];
        for (let group of groups) {
            const filteredGroup = [...group].filter(emoji => emoji.name.toLowerCase().includes(keyword));
            result = [...result, ...filteredGroup];
        }
        return result;
    };
    exports.searchEmojis = searchEmojis;
    exports.chartWidgets = ['@scom/scom-pie-chart', '@scom/scom-line-chart', '@scom/scom-bar-chart', '@scom/scom-area-chart', '@scom/scom-mixed-chart', '@scom/scom-scatter-chart', '@scom/scom-counter'];
    exports.widgets = [
        {
            name: exports.chartWidgets,
            icon: { name: 'chart-line' },
            title: 'Chart',
            description: 'Insert a chart widget',
            disabled: true
        },
        {
            name: '@scom/scom-swap',
            icon: { name: 'exchange-alt' },
            title: 'Swap',
            description: 'Insert a swap widget',
            disabled: true
        },
        {
            name: '@scom/scom-staking',
            icon: { name: 'hand-holding-usd' },
            title: 'Staking',
            description: 'Insert a staking widget',
            disabled: true
        },
        {
            name: '@scom/scom-xchain-widget',
            icon: { name: 'exchange-alt' },
            title: 'Xchain',
            description: 'Insert an xchain widget',
            disabled: true
        },
        {
            name: '@scom/scom-voting',
            icon: { name: 'vote-yea' },
            title: 'Voting',
            description: 'Insert a voting widget',
            disabled: true
        },
        {
            name: '@scom/scom-nft-minter',
            icon: { name: 'gavel' },
            title: 'Create Membership NFT',
            description: 'Create a new NFT index to Mint a membership NFT for gated communities',
            configuratorCustomData: 'new1155'
        },
        {
            name: '@scom/scom-nft-minter',
            icon: { name: 'gavel' },
            title: 'Existing Membership NFT',
            description: 'Mint a membership NFT for gated communities',
            configuratorCustomData: 'customNft'
        },
        {
            name: '@scom/oswap-nft-widget',
            icon: { name: 'campground' },
            title: 'Oswap Troll NFT',
            description: 'Mint a membership NFT for OpenSwap community',
            disabled: true
        },
        {
            name: '@scom/scom-video',
            icon: { name: 'video' },
            title: 'YouTube Video',
            description: 'embeded YouTube video',
            configuratorCustomData: "defaultLinkYoutube"
        },
        {
            name: '@scom/scom-video',
            icon: { name: 'video' },
            title: 'Video file',
            description: '.mp4 or .mov file',
            configuratorCustomData: "defaultLinkMp4"
        },
        {
            name: '@scom/scom-image',
            icon: { name: 'image' },
            title: 'Image',
            description: 'Insert an image'
        },
        {
            name: '@scom/scom-twitter-post',
            icon: { image: { url: assets_1.default.fullPath('img/twitter.svg'), width: '100%', height: '100%', display: 'inline-block' } },
            title: 'X',
            description: 'Insert an X post'
        }
    ];
});
define("@scom/scom-post-composer/components/form.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposerUpload = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomPostComposerUpload = class ScomPostComposerUpload extends components_3.Module {
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        constructor(parent, options) {
            super(parent, options);
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
        }
        setData(value) {
            this._data = value;
            this.inputUrl.value = value.url || '';
        }
        onFormSubmit() {
            const { onConfirm } = this.data;
            if (onConfirm)
                onConfirm(this.inputUrl.value);
            this.inputUrl.value = '';
        }
        onInputChanged(target) {
            this.btnSubmit.enabled = !!target.value;
        }
        init() {
            super.init();
            const onConfirm = this.getAttribute('onConfirm', true);
            const url = this.getAttribute('url', true);
            if (onConfirm)
                this.setData({ onConfirm, url });
        }
        render() {
            return (this.$render("i-vstack", { gap: "1rem", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-input", { id: "inputUrl", placeholder: 'Enter URL', width: '100%', height: '2rem', border: { radius: '0.5rem' }, padding: { left: '0.5rem', right: '0.5rem' }, onChanged: this.onInputChanged }),
                this.$render("i-hstack", { horizontalAlignment: 'end' },
                    this.$render("i-panel", null,
                        this.$render("i-button", { id: "btnSubmit", height: 36, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '0.5rem' }, enabled: false, caption: "Confirm", onClick: this.onFormSubmit })))));
        }
    };
    ScomPostComposerUpload = __decorate([
        (0, components_3.customElements)('i-scom-post-composer-upload')
    ], ScomPostComposerUpload);
    exports.ScomPostComposerUpload = ScomPostComposerUpload;
});
define("@scom/scom-post-composer/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.widgetPreviewStyle = exports.formStyle = exports.modalStyle = void 0;
    exports.modalStyle = components_4.Styles.style({
        $nest: {
            '.modal > div:nth-child(2)': {
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            },
            'i-scom-storage': {
                display: 'block',
                width: '100%',
                height: 'calc(100% - 1.5rem)',
                overflow: 'hidden'
            }
        }
    });
    exports.formStyle = components_4.Styles.style({
        $nest: {
            'i-scom-token-input > i-hstack > i-vstack': {
                margin: '0 !important'
            }
        }
    });
    exports.widgetPreviewStyle = components_4.Styles.style({
        boxSizing: 'border-box !important',
        $nest: {
            '*': {
                boxSizing: 'border-box !important'
            },
            'img': {
                margin: 'inherit !important'
            }
        }
    });
});
define("@scom/scom-post-composer/components/widgets.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/global/index.ts", "@scom/scom-post-composer/index.css.ts"], function (require, exports, components_5, global_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposerWidget = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomPostComposerWidget = class ScomPostComposerWidget extends components_5.Module {
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        handleCloseButtonClick() {
            if (this.onCloseButtonClick)
                this.onCloseButtonClick();
        }
        init() {
            super.init();
            this.onTypeChanged = this.onTypeChanged.bind(this);
            this.onConfirm = this.getAttribute('onConfirm', true) || this.onConfirm;
            this.onUpdate = this.getAttribute('onUpdate', true) || this.onUpdate;
            this.onCloseButtonClick = this.getAttribute('onCloseButtonClick', true) || this.onCloseButtonClick;
            this.onRefresh = this.getAttribute('onRefresh', true) || this.onRefresh;
            this.renderWidgets();
        }
        show(url) {
            if (url) {
                this.renderConfig(url);
            }
            else {
                this.back();
            }
        }
        renderWidgets() {
            const _widgets = global_1.widgets.filter(v => !v.disabled);
            this.pnlWidgets.clearInnerHTML();
            for (let widget of _widgets) {
                const icon = new components_5.Icon(undefined, { ...widget.icon, width: '1rem', height: '1rem' });
                this.pnlWidgets.appendChild(this.$render("i-stack", { direction: "horizontal", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, border: { radius: '0.375rem' }, alignItems: "center", justifyContent: "space-between", hover: {
                        backgroundColor: Theme.action.activeBackground
                    }, cursor: "pointer", onClick: () => this.selectWidget(widget) },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "1rem" },
                        icon,
                        this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                            this.$render("i-label", { caption: widget.title, font: { size: '0.875rem', weight: 500 } }),
                            this.$render("i-label", { caption: widget.description, font: { size: '0.75rem', weight: 400 } })))));
            }
        }
        back() {
            this.lblTitle.caption = 'Widgets';
            this.iconBack.visible = false;
            this.iconClose.visible = true;
            this.pnlWidgets.visible = true;
            this.pnlConfig.visible = false;
            this.pnlLoading.visible = false;
            this.actionForm.visible = false;
            if (this.onRefresh)
                this.onRefresh('50rem');
        }
        renderConfig(url) {
            let widgetData = (0, global_1.extractWidgetUrl)(url);
            const { moduleName, data } = widgetData;
            this.selectWidget({ title: 'Config', name: moduleName }, { data, url });
            this.iconBack.visible = false;
            this.iconClose.visible = true;
        }
        async renderForm(module, widgetType, widgetData) {
            this.pnlWidgetWrapper.clearInnerHTML();
            this.pnlWidgetWrapper.visible = false;
            this.pnlCustomForm.clearInnerHTML();
            this.pnlCustomForm.visible = false;
            this.actionForm.visible = false;
            if (Array.isArray(module)) {
                this.pnlConfig.templateColumns = ['100%'];
                const items = module.map(type => ({ value: type, label: type.split('-')[1] }));
                this.pnlCustomForm.appendChild(this.$render("i-stack", { direction: "vertical", width: "100%", gap: "0.625rem" },
                    this.$render("i-label", { caption: "Type" }),
                    this.$render("i-combo-box", { id: "cbType", items: items, width: '100%', height: '2.625rem', onChanged: this.onTypeChanged })));
                this.pnlCustomForm.visible = true;
            }
            else {
                this.pnlConfig.templateColumns = innerWidth > 768 ? ['50%', '50%'] : ['100%'];
                await this.loadWidgetConfig(module, widgetType, widgetData);
            }
        }
        getActions(elm, isChart, configuratorCustomData) {
            const configs = elm.getConfigurators(configuratorCustomData) || [];
            let configurator, action;
            if (isChart) {
                configurator = configs.find((conf) => conf.target === 'Builders');
                action = configurator?.getActions && configurator.getActions().find((action) => action.name === 'Data');
            }
            else {
                configurator = configs.find((conf) => conf.target === 'Editor');
                action = configurator.getActions()?.[0];
            }
            return action;
        }
        async loadWidgetConfig(module, configuratorCustomData, widgetData) {
            const { data, url } = widgetData || {};
            this.currentUrl = url;
            this.pnlWidgetWrapper.visible = false;
            const elm = await components_5.application.createElement(module);
            this.pnlWidgetWrapper.clearInnerHTML();
            this.pnlWidgetWrapper.visible = true;
            this.pnlWidgetWrapper.appendChild(elm);
            if (elm?.getConfigurators) {
                const isChart = global_1.chartWidgets.includes(module);
                const action = this.getActions(elm, isChart, configuratorCustomData);
                const builder = elm.getConfigurators(configuratorCustomData).find((conf) => conf.target === 'Builders');
                const hasBuilder = builder && typeof builder.setData === 'function';
                if (action) {
                    if (action.customUI) {
                        if (hasBuilder) {
                            builder.setData(data || {});
                        }
                        this.customForm = await action.customUI.render(hasBuilder ? { ...elm.getData() } : {}, async (result, data) => {
                            let setupData = {};
                            if (builder && typeof builder.setupData === 'function') {
                                const hasSetup = await builder.setupData(data);
                                if (!hasSetup)
                                    return;
                                setupData = builder.getData();
                            }
                            this.onSave(result, { ...data, ...setupData });
                        });
                        this.pnlCustomForm.append(this.customForm);
                        this.pnlCustomForm.visible = true;
                    }
                    else {
                        this.actionForm.uiSchema = action.userInputUISchema;
                        this.actionForm.jsonSchema = action.userInputDataSchema;
                        this.actionForm.formOptions = {
                            columnWidth: '100%',
                            columnsPerRow: 1,
                            confirmButtonOptions: {
                                caption: 'Confirm',
                                backgroundColor: Theme.colors.primary.main,
                                fontColor: Theme.colors.primary.contrastText,
                                padding: { top: '0.5rem', bottom: '0.5rem', right: '1rem', left: '1rem' },
                                border: { radius: '0.5rem' },
                                hide: false,
                                onClick: async () => {
                                    const formData = await this.actionForm.getFormData();
                                    let setupData = {};
                                    if (builder && typeof builder.setupData === 'function') {
                                        const hasSetup = await builder.setupData(formData);
                                        if (!hasSetup)
                                            return;
                                        setupData = builder.getData();
                                    }
                                    const widgetUrl = (0, global_1.getWidgetEmbedUrl)(module, { ...formData, ...setupData });
                                    if (url && this.onUpdate) {
                                        if (this.onUpdate)
                                            this.onUpdate(url, widgetUrl);
                                    }
                                    else if (this.onConfirm) {
                                        this.onConfirm(widgetUrl);
                                    }
                                }
                            },
                            onChange: async () => {
                                const formData = await this.actionForm.getFormData();
                                if (typeof elm.setTag === 'function' && formData) {
                                    const oldTag = typeof elm.getTag === 'function' ? await elm.getTag() : {};
                                    const oldDark = this.getThemeValues(oldTag?.dark);
                                    const oldLight = this.getThemeValues(oldTag?.light);
                                    const { dark, light } = formData;
                                    let tag = {};
                                    const darkTheme = this.getThemeValues(dark);
                                    const lightTheme = this.getThemeValues(light);
                                    let isTagChanged = false;
                                    if (darkTheme) {
                                        tag['dark'] = darkTheme;
                                        isTagChanged = this.compareThemes(oldDark, darkTheme);
                                    }
                                    if (lightTheme) {
                                        tag['light'] = lightTheme;
                                        if (!isTagChanged) {
                                            isTagChanged = this.compareThemes(oldLight, lightTheme);
                                        }
                                    }
                                    if (Object.keys(tag).length) {
                                        elm.setTag(tag);
                                    }
                                    if (isTagChanged)
                                        return;
                                }
                                const validationResult = this.actionForm.validate(formData, this.actionForm.jsonSchema, { changing: false });
                                if (validationResult.valid) {
                                    if (hasBuilder) {
                                        builder.setData(formData);
                                    }
                                    else if (typeof elm.setData === 'function') {
                                        elm.setData(formData);
                                    }
                                }
                            },
                            customControls: action.customControls,
                            dateTimeFormat: {
                                date: 'YYYY-MM-DD',
                                time: 'HH:mm:ss',
                                dateTime: 'MM/DD/YYYY HH:mm'
                            }
                        };
                        this.actionForm.renderForm();
                        this.actionForm.clearFormData();
                        this.actionForm.visible = true;
                        // Set default data
                        setTimeout(async () => {
                            if (data) {
                                this.actionForm.setFormData({ ...data });
                                const { dark, light, tag } = data;
                                let widgetTag = {};
                                const darkTheme = this.getThemeValues(dark);
                                const lightTheme = this.getThemeValues(light);
                                if (darkTheme) {
                                    widgetTag['dark'] = darkTheme;
                                }
                                if (lightTheme) {
                                    widgetTag['light'] = lightTheme;
                                }
                                widgetTag = { ...widgetTag, ...tag };
                                if (typeof elm.setTag === 'function' && Object.keys(widgetTag).length) {
                                    elm.setTag(widgetTag);
                                }
                                if (hasBuilder) {
                                    builder.setData(data);
                                }
                                else if (typeof elm.setData === 'function') {
                                    elm.setData(data);
                                }
                            }
                            else if (hasBuilder) {
                                builder.setData({});
                                const elmData = await elm.getData();
                                this.actionForm.setFormData({ ...elmData });
                            }
                        });
                    }
                }
            }
        }
        getThemeValues(theme) {
            if (!theme || typeof theme !== 'object')
                return null;
            let values = {};
            for (let prop in theme) {
                if (theme[prop])
                    values[prop] = theme[prop];
            }
            return Object.keys(values).length ? values : null;
        }
        compareThemes(oldValues, newValues) {
            for (let prop in newValues) {
                if (!oldValues.hasOwnProperty(prop) || newValues[prop] !== oldValues[prop]) {
                    return true;
                }
            }
            return false;
        }
        async onTypeChanged(target) {
            this.pnlConfig.templateColumns = innerWidth > 768 ? ['50%', '50%'] : ['100%'];
            const name = target.selectedItem.value;
            if (this.customForm)
                this.customForm.remove();
            await this.loadWidgetConfig(name);
            if (this.onRefresh)
                this.onRefresh('90rem');
        }
        onSave(result, data) {
            // data.title = this.inputTitle.value || '';
            if (this.cbType) {
                data.name = this.cbType.selectedItem.value;
            }
            const url = (0, global_1.getWidgetEmbedUrl)(data.name, data);
            if (this.currentUrl) {
                if (this.onUpdate)
                    this.onUpdate(this.currentUrl, url);
            }
            else if (this.onConfirm) {
                this.onConfirm(url);
            }
        }
        async selectWidget(widget, widgetData) {
            this.lblTitle.caption = widget.title;
            this.iconBack.visible = true;
            this.iconClose.visible = false;
            this.pnlWidgets.visible = false;
            this.pnlConfig.visible = true;
            this.pnlLoading.visible = true;
            await this.renderForm(widget.name, widget.configuratorCustomData, widgetData);
            this.pnlLoading.visible = false;
            if (this.onRefresh)
                this.onRefresh(Array.isArray(widget.name) ? '50rem' : '90rem');
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, gap: "1rem" },
                this.$render("i-stack", { direction: "horizontal", alignItems: "center", justifyContent: "space-between", padding: { left: '0.5rem', right: '0.5rem' }, gap: "0.5rem" },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.5rem" },
                        this.$render("i-icon", { id: "iconBack", width: "1rem", height: "1rem", name: "arrow-left", fill: Theme.colors.primary.main, onClick: this.back, cursor: "pointer", visible: false }),
                        this.$render("i-label", { id: "lblTitle", caption: "Widgets", font: { size: '1.125rem', color: Theme.colors.primary.main } })),
                    this.$render("i-icon", { id: "iconClose", width: "1rem", height: "1rem", name: "times", fill: Theme.colors.primary.main, onClick: this.handleCloseButtonClick, cursor: "pointer" })),
                this.$render("i-stack", { id: "pnlWidgets", direction: "vertical", gap: "0.5rem" }),
                this.$render("i-grid-layout", { id: "pnlConfig", visible: false, gap: { column: '0.5rem' }, templateColumns: ['50%', '50%'], mediaQueries: [
                        {
                            maxWidth: '768px',
                            properties: {
                                templateColumns: ['100%']
                            }
                        }
                    ] },
                    this.$render("i-panel", { id: "pnlWidgetWrapper" }),
                    this.$render("i-panel", null,
                        this.$render("i-form", { id: "actionForm", visible: false, class: index_css_1.formStyle }),
                        this.$render("i-stack", { id: "pnlCustomForm", direction: "vertical", visible: false }),
                        this.$render("i-stack", { id: "pnlLoading", direction: "vertical", position: "relative", height: "100%", width: "100%", minHeight: 100, class: "i-loading-overlay", visible: false },
                            this.$render("i-stack", { direction: "vertical", class: "i-loading-spinner", alignItems: "center", justifyContent: "center" },
                                this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main })))))));
        }
    };
    ScomPostComposerWidget = __decorate([
        (0, components_5.customElements)('i-scom-post-composer-widgets')
    ], ScomPostComposerWidget);
    exports.ScomPostComposerWidget = ScomPostComposerWidget;
});
define("@scom/scom-post-composer/components/index.ts", ["require", "exports", "@scom/scom-post-composer/components/form.tsx", "@scom/scom-post-composer/components/widgets.tsx"], function (require, exports, form_1, widgets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposerWidget = exports.ScomPostComposerUpload = void 0;
    Object.defineProperty(exports, "ScomPostComposerUpload", { enumerable: true, get: function () { return form_1.ScomPostComposerUpload; } });
    Object.defineProperty(exports, "ScomPostComposerWidget", { enumerable: true, get: function () { return widgets_1.ScomPostComposerWidget; } });
});
define("@scom/scom-post-composer", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/global/index.ts", "@scom/scom-post-composer/assets.ts", "@scom/scom-post-composer/components/index.ts", "@scom/scom-post-composer/index.css.ts", "@scom/scom-storage"], function (require, exports, components_6, index_1, assets_2, index_2, index_css_2, scom_storage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposer = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    const PostAudience = [
        {
            title: 'Public',
            icon: 'globe-americas',
            desc: 'Anyone on or off Nostr',
            value: 'public'
        },
        {
            title: 'Members',
            icon: 'user-friends',
            desc: 'Members of the community',
            value: 'members'
        }
    ];
    let ScomPostComposer = class ScomPostComposer extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.currentGifPage = 0;
            this.totalGifPage = 1;
            this.renderedMap = {};
            this.bottomObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting)
                        return;
                    if (this.currentGifPage < this.totalGifPage) {
                        ++this.currentGifPage;
                        this.renderGifs(this.inputGif.value || '', this.autoPlaySwitch.checked);
                    }
                    // else {
                    //   this.clearObservers();
                    // }
                });
            }, {
                root: null,
                rootMargin: "20px",
                threshold: 0.9
            });
            this.newReply = [];
            this.isEmojiSearching = false;
            this.recentEmojis = {};
            this.emojiCateMapper = new Map();
            this.emojiGroupsData = new Map();
            this.gifCateInitState = 0;
            this.emojiInitState = 0;
            this._isPostAudienceShown = false;
            this.audience = PostAudience[1];
            this._hasQuota = false;
            this.onRecentClear = this.onRecentClear.bind(this);
            this.onEmojiColorSelected = this.onEmojiColorSelected.bind(this);
            this.onUpload = this.onUpload.bind(this);
            this.onGifPlayChanged = this.onGifPlayChanged.bind(this);
            this.showStorage = this.showStorage.bind(this);
            this.onShowGifModal = this.onShowGifModal.bind(this);
            this.onShowWidgets = this.onShowWidgets.bind(this);
            this.onShowDeleteWidget = this.onShowDeleteWidget.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        setFocus() {
            this.mdEditor.setFocus();
        }
        get hasQuota() {
            return this._hasQuota;
        }
        set hasQuota(value) {
            this._hasQuota = value;
        }
        get focusedPost() {
            return this._focusedPost;
        }
        set focusedPost(value) {
            this._focusedPost = value;
            this.updateFocusedPost();
        }
        get replyTo() {
            return this._data.replyTo;
        }
        set replyTo(value) {
            this._data.replyTo = value;
        }
        get type() {
            return this._data.type ?? 'reply';
        }
        set type(value) {
            this._data.type = value ?? 'reply';
        }
        get placeholder() {
            return this._data.placeholder ?? '';
        }
        set placeholder(value) {
            this._data.placeholder = value ?? '';
        }
        get buttonCaption() {
            return this._data.buttonCaption ?? '';
        }
        set buttonCaption(value) {
            this._data.buttonCaption = value ?? '';
        }
        get isReplyToShown() {
            return this._data.isReplyToShown ?? false;
        }
        set isReplyToShown(value) {
            this._data.isReplyToShown = value ?? false;
        }
        get apiBaseUrl() {
            return this._apiBaseUrl;
        }
        set apiBaseUrl(value) {
            this._apiBaseUrl = value;
        }
        get postAudience() {
            return this.audience?.value;
        }
        get isQuote() {
            return this.type === 'quoted';
        }
        get hasRecentEmojis() {
            return !!Object.values(this.recentEmojis).length;
        }
        get emojiColors() {
            return Object.keys(index_1.colorsMapper);
        }
        get currentEmojiColor() {
            return this.selectedColor?.background?.color || this.emojiColors[0];
        }
        get value() {
            return this._data.value;
        }
        set value(content) {
            this._data.value = content;
            this.mdEditor.value = content;
        }
        get avatar() {
            return this._avatar;
        }
        set avatar(value) {
            this._avatar = value || assets_2.default.fullPath('img/default_avatar.png');
            if (this.imgReplier)
                this.imgReplier.url = this._avatar;
        }
        get updatedValue() {
            return this.mdEditor.getMarkdownValue();
        }
        get isPostAudienceShown() {
            return this._isPostAudienceShown;
        }
        set isPostAudienceShown(value) {
            this._isPostAudienceShown = value;
            if (this.btnPostAudience)
                this.btnPostAudience.visible = value;
            if (!value && this.mdPostAudience?.visible)
                this.mdPostAudience.visible = false;
        }
        removeShow(name) {
            if (this[name])
                this[name].classList.remove('show');
        }
        onShowModal2(target, data, name) {
            this.currentPostData = data;
            if (this[name]) {
                this[name].parent = target;
                this[name].position = 'absolute';
                this[name].refresh();
                this[name].visible = true;
                this[name].classList.add('show');
            }
        }
        isRecent(category) {
            return category.value === 'recent';
        }
        setData(value) {
            this.clear();
            this._data = value;
            this.lbReplyTo.caption = `${this.replyTo?.author?.internetIdentifier || ''}`;
            if (this.placeholder)
                this.mdEditor.placeholder = this.placeholder;
            if (this.buttonCaption)
                this.btnReply.caption = this.buttonCaption;
            this.updateGrid();
        }
        clear() {
            this.resetEditor();
            this.pnlReplyTo.visible = false;
            this.lbReplyTo.caption = '';
            this.pnlBorder.border = {
                top: {
                    width: '1px',
                    style: 'none',
                    color: Theme.divider,
                }
            };
            this.currentGifPage = 1;
            this.totalGifPage = 1;
            // this.pnlMedias.clearInnerHTML();
            this.emojiGroupsData = new Map();
        }
        resetEditor() {
            if (this.mdEditor) {
                this.mdEditor.value = '';
            }
        }
        clearObservers() {
            this.bottomElm.visible = false;
            this.bottomObserver.unobserve(this.bottomElm);
            this.renderedMap = {};
        }
        updateGrid() {
            this.gridReply.templateColumns = ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'];
            if (this.isQuote) {
                this.gridReply.templateAreas = [
                    ['avatar', 'editor'],
                    ['avatar', 'quoted'],
                    ['avatar', 'reply'],
                ];
                this.isReplyToShown = false;
                this.pnlReplyTo.visible = false;
            }
            else {
                if (this.isReplyToShown && !this.pnlReplyTo.visible) {
                    this.gridReply.templateAreas = [['avatar', 'editor', 'reply']];
                    this.gridReply.templateColumns = ['2.75rem', 'minmax(auto, 1fr)', '5.5rem'];
                }
                else {
                    this.gridReply.templateAreas = [
                        ['avatar', 'editor'],
                        ['avatar', 'reply'],
                    ];
                }
            }
            this.pnlReplyTo.visible = this.isReplyToShown;
        }
        onEditorChanged() {
            if (this.pnlIcons && !this.pnlIcons.visible)
                this.pnlIcons.visible = true;
            this._data.value = this.updatedValue;
            this.btnReply.enabled = !!this._data.value;
            if (this.onChanged)
                this.onChanged(this._data.value);
        }
        onReply() {
            if (this.onSubmit) {
                this._data.value = this.updatedValue;
                const extractedText = this._data.value.replace(/\$\$widget0\s+(.*?)\$\$/g, '$1');
                this.onSubmit(extractedText, [...this.newReply]);
            }
            this.resetEditor();
            // this.pnlMedias.clearInnerHTML();
        }
        async onUpload() {
            // const result = application.uploadFile(this.extensions);
            if (!this.uploadForm) {
                this.uploadForm = await index_2.ScomPostComposerUpload.create({
                    onConfirm: this.onSetImage.bind(this)
                });
            }
            this.uploadForm.openModal({
                title: 'Insert Image',
                width: 400,
            });
        }
        updateFocusedPost() {
            if (this.pnlFocusedPost && this.mobile) {
                this.renderActions();
                const onProfileClicked = (target, data, event) => this.onShowModal2(target, data, 'mdPostActions');
                const focusedPost = this.$render("i-scom-post", { id: this.focusedPost.id, data: this.focusedPost, type: "short", overflowEllipse: true, limitHeight: true, isReply: true, onProfileClicked: onProfileClicked, apiBaseUrl: this.apiBaseUrl });
                this.pnlFocusedPost.clearInnerHTML();
                this.pnlFocusedPost.append(focusedPost);
                // focusedPost.renderShowMore();
                // focusedPost.init();
            }
        }
        onSetImage(url) {
            const imgMd = `\n![](${url})\n`;
            this.value = this.updatedValue + imgMd;
            if (!this.btnReply.enabled)
                this.btnReply.enabled = true;
            this.uploadForm.closeModal();
        }
        onCloseModal(name) {
            this[name].visible = false;
        }
        onShowModal(name) {
            this[name].refresh();
            this[name].visible = true;
        }
        async onShowGifModal() {
            if (!this.gifCateInitState) {
                this.gifCateInitState = 1;
                this.renderGifCate();
            }
            this.onShowModal('mdGif');
        }
        onGifMdOpen() {
            this.autoPlaySwitch.checked = true;
            this.onToggleMainGif(true);
        }
        onGifMdClose() {
            this.clearObservers();
        }
        async renderGifCate() {
            this.gridGifCate.clearInnerHTML();
            this.gifCateLoading.visible = true;
            const { data = [] } = await (0, index_1.fetchReactionGifs)();
            const limitedList = [...data].slice(0, 8);
            this.gifCateLoading.visible = false;
            this.gridGifCate.visible = true;
            for (let cate of limitedList) {
                this.gridGifCate.appendChild(this.$render("i-panel", { overflow: 'hidden', onClick: () => this.onGifSearch(cate.name) },
                    this.$render("i-image", { url: cate.gif.images['480w_still'].url, width: '100%', display: 'block' }),
                    this.$render("i-label", { caption: cate.name, font: { size: '1.25rem', weight: 700 }, position: "absolute", bottom: "0px", display: "block", width: '100%', padding: { left: '0.5rem', top: '0.5rem', right: '0.5rem', bottom: '0.5rem' } })));
            }
        }
        onGifSelected(gif) {
            this.onCloseModal('mdGif');
            const imgMd = `\n![${gif.images.fixed_height.url}](${gif.images.fixed_height_still.url})\n`;
            this.value = this.updatedValue + imgMd;
            if (!this.btnReply.enabled)
                this.btnReply.enabled = true;
            // let index = this.newReply.length;
            // const mediaWrap = <i-panel margin={{bottom: '0.5rem'}} overflow={'hidden'} opacity={0.7}>
            //   <i-image width={'100%'} height={'auto'} display="block" url={gif.images.original_still.url}></i-image>
            //   <i-icon
            //     name="times" width={'1.25rem'} height={'1.25rem'} fill={Theme.text.primary}
            //     border={{radius: '50%'}}
            //     padding={{top: 5, bottom: 5, left: 5, right: 5}}
            //     background={{color: 'rgba(15, 20, 25, 0.75)'}}
            //     position='absolute' right="10px" top="10px" zIndex={2}
            //     cursor="pointer"
            //     onClick={() => {
            //       mediaWrap.remove();
            //       this.newReply.splice(index, 1);
            //     }}
            //   ></i-icon>
            // </i-panel>;
            // mediaWrap.parent = this.pnlMedias;
            // this.pnlMedias.appendChild(mediaWrap);
            // const getPostData = (render: boolean) => {
            //   return {
            //     module: '@scom/scom-image',
            //     data: {
            //       "properties": {
            //         url: render ? gif.images.original_still.url : gif.images.original.url
            //       },
            //       "tag": {
            //         "width": "100%",
            //         "height": "auto",
            //         "pt": 0,
            //         "pb": 0,
            //         "pl": 0,
            //         "pr": 0
            //       }
            //     }
            //   }
            // }
            // this.newReply.push(getPostData(false));
        }
        onGifSearch(q) {
            this.onToggleMainGif(false);
            this.inputGif.value = q;
            this.renderGifs(q, this.autoPlaySwitch.checked);
        }
        onToggleMainGif(value) {
            this.gridGifCate.visible = value;
            this.pnlGif.visible = !value;
            this.currentGifPage = 1;
            this.totalGifPage = 1;
            if (value) {
                this.bottomObserver.unobserve(this.bottomElm);
                this.pnlGifBack.visible = false;
                this.pnlGifClose.visible = true;
            }
            else {
                this.bottomObserver.observe(this.bottomElm);
                this.pnlGifBack.visible = true;
                this.pnlGifClose.visible = false;
            }
            this.gridGif.clearInnerHTML();
            this.renderedMap = {};
            this.mdGif.refresh();
        }
        async renderGifs(q, autoplay) {
            if (this.renderedMap[this.currentGifPage])
                return;
            this.gifLoading.visible = true;
            this.renderedMap[this.currentGifPage] = true;
            const params = { q, offset: this.currentGifPage - 1 };
            const { data = [], pagination: { total_count, count } } = await (0, index_1.fetchGifs)(params);
            this.totalGifPage = Math.ceil(total_count / count);
            this.bottomElm.visible = this.totalGifPage > 1;
            for (let gif of data) {
                this.gridGif.appendChild(this.$render("i-panel", { onClick: () => this.onGifSelected(gif), width: "100%", overflow: 'hidden' },
                    this.$render("i-image", { url: autoplay ? gif.images.fixed_height.url : gif.images.fixed_height_still.url, width: '100%', height: '100%', objectFit: 'cover', display: 'block' })));
            }
            this.gifLoading.visible = false;
            this.mdGif.refresh();
        }
        onGifPlayChanged(target) {
            this.renderGifs(this.inputGif.value, target.checked);
        }
        onBack() {
            this.pnlGif.visible = false;
            this.gridGifCate.visible = true;
            this.pnlGifBack.visible = false;
            this.pnlGifClose.visible = true;
        }
        onCloseGifModal() {
            this.onCloseModal('mdGif');
        }
        async renderEmojis() {
            this.recentEmojis = {};
            this.emojiCateMapper = new Map();
            this.renderEmojiCate();
            this.renderColor(this.emojiColors[0]);
        }
        async initEmojiGroup(category) {
            if (this.isRecent(category) && !this.hasRecentEmojis)
                return;
            if (!this.emojiGroupsData.has(category.value)) {
                const list = await (0, index_1.fetchEmojis)({ category: category.value });
                this.emojiGroupsData.set(category.value, JSON.parse(JSON.stringify(list)));
            }
            this.renderEmojiGroup(this.groupEmojis, category);
        }
        async initEmojis() {
            for (let category of index_1.emojiCategories) {
                await this.initEmojiGroup(category);
            }
        }
        async renderEmojiCate() {
            this.gridEmojiCate.clearInnerHTML();
            for (let category of index_1.emojiCategories) {
                const cateEl = (this.$render("i-vstack", { id: `cate-${category.value}`, overflow: 'hidden', cursor: 'pointer', opacity: 0.5, padding: { top: '0.25rem', bottom: '0.25rem' }, horizontalAlignment: "center", position: 'relative', class: "emoji-cate", gap: '0.5rem', onClick: (target) => this.onEmojiCateSelected(target, category) },
                    this.$render("i-image", { url: category.image, width: '1.25rem', height: '1.25rem', display: 'block' }),
                    this.$render("i-hstack", { visible: false, border: { radius: '9999px' }, height: '0.25rem', width: '100%', position: 'absolute', bottom: "0px", background: { color: Theme.colors.primary.main } })));
                this.gridEmojiCate.appendChild(cateEl);
                this.emojiCateMapper.set(`cate-${category.value}`, cateEl);
            }
        }
        async renderEmojiGroup(parent, category) {
            const group = (this.$render("i-vstack", { id: `${category.value}`, border: { bottom: { width: '1px', style: 'solid', color: Theme.divider } }, gap: "0.75rem", class: "emoji-group" },
                this.$render("i-hstack", { padding: { top: '0.75rem', left: '0.75rem', right: '0.75rem', bottom: '0.75rem' }, position: "sticky", top: "0px", width: '100%', zIndex: 9, background: { color: Theme.background.modal }, verticalAlignment: "center", horizontalAlignment: "space-between" },
                    this.$render("i-label", { caption: category.name, font: { size: '1.063rem', weight: 700 }, wordBreak: "break-word" }),
                    this.$render("i-button", { caption: "Clear all", font: { size: '0.9rem', weight: 700, color: Theme.colors.primary.main }, cursor: 'pointer', boxShadow: 'none', padding: { left: '0.75rem', right: '0.75rem' }, lineHeight: '1.25rem', border: { radius: '9999px' }, background: { color: Theme.colors.info.light }, visible: this.isRecent(category) && this.hasRecentEmojis, onClick: this.onRecentClear }))));
            const itemWrap = this.$render("i-grid-layout", { id: `group-${category.value}`, columnsPerRow: 9, padding: { left: '0.75rem', right: '0.75rem', bottom: '0.75rem' } });
            group.append(itemWrap);
            parent.appendChild(group);
            let data = [];
            if (this.isRecent(category)) {
                data = Object.values(this.recentEmojis);
            }
            else if (category.value === 'search') {
                const result = (0, index_1.searchEmojis)(this.inputEmoji.value, this.emojiGroupsData);
                data = this.filterGroups(result);
            }
            else {
                data = this.filterGroups(this.emojiGroupsData.get(category.value) || []);
            }
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                itemWrap.appendChild(this.$render("i-panel", { width: '1.5rem', height: '1.5rem', onClick: (target, event) => this.onEmojiSelected(event, item) },
                    this.$render("i-label", { caption: item.htmlCode.join(''), display: "inline-block" })));
            }
            if (this.isRecent(category)) {
                this.recent = group;
                parent.insertAdjacentElement('afterbegin', group);
            }
        }
        updateEmojiGroups() {
            for (let i = 1; i < index_1.emojiCategories.length; i++) {
                const category = index_1.emojiCategories[i];
                const gridElm = this.groupEmojis.querySelector(`#group-${category.value}`);
                if (!gridElm)
                    continue;
                gridElm.clearInnerHTML();
                const data = this.filterGroups(this.emojiGroupsData.get(category.value));
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    gridElm.appendChild(this.$render("i-panel", { width: '1.5rem', height: '1.5rem', onClick: (target, event) => this.onEmojiSelected(event, item) },
                        this.$render("i-label", { caption: item.htmlCode.join(''), display: "inline-block" })));
                }
            }
        }
        filterGroups(data) {
            const colorHtmlCode = index_1.colorsMapper[this.currentEmojiColor].htmlCode;
            return [...data].filter(item => {
                if (colorHtmlCode) {
                    return item.htmlCode.includes(colorHtmlCode);
                }
                else {
                    const itemLength = item.htmlCode?.length;
                    return itemLength && itemLength !== 2;
                }
            });
        }
        onRecentClear() {
            this.recentEmojis = {};
            if (this.recent) {
                this.recent.clearInnerHTML();
                this.recent = null;
            }
            if (this.gridEmojiCate?.children[1]) {
                this.onEmojiCateSelected(this.gridEmojiCate.children[1], index_1.emojiCategories[1]);
            }
        }
        renderEmojiColors() {
            this.pnlColors.clearInnerHTML();
            for (let color of this.emojiColors) {
                this.renderColor(color);
            }
        }
        renderActions() {
            const actions = [
                {
                    caption: 'Copy note link',
                    icon: { name: 'copy' },
                    tooltip: 'The link has been copied successfully',
                    onClick: (e) => {
                        if (typeof this.currentPostData !== 'undefined') {
                            components_6.application.copyToClipboard(`${window.location.origin}/#!/e/${this.currentPostData.id}`);
                        }
                        this.mdPostActions.visible = false;
                    }
                },
                {
                    caption: 'Copy note text',
                    icon: { name: 'copy' },
                    tooltip: 'The text has been copied successfully',
                    onClick: (e) => {
                        components_6.application.copyToClipboard(this.currentPostData['eventData']?.content);
                        this.mdPostActions.visible = false;
                    }
                },
                {
                    caption: 'Copy note ID',
                    icon: { name: 'copy' },
                    tooltip: 'The ID has been copied successfully',
                    onClick: (e) => {
                        if (typeof this.currentPostData !== 'undefined') {
                            components_6.application.copyToClipboard(this.currentPostData.id);
                        }
                        this.mdPostActions.visible = false;
                    }
                },
                {
                    caption: 'Copy raw data',
                    icon: { name: 'copy' },
                    tooltip: 'The raw data has been copied successfully',
                    onClick: (e) => {
                        if (typeof this.currentPostData !== 'undefined') {
                            components_6.application.copyToClipboard(JSON.stringify(this.currentPostData['eventData']));
                        }
                        this.mdPostActions.visible = false;
                    }
                },
                // {
                //     caption: 'Broadcast note',
                //     icon: { name: "broadcast-tower" }
                // },
                {
                    caption: 'Copy user public key',
                    icon: { name: 'copy' },
                    tooltip: 'The public key has been copied successfully',
                    onClick: (e) => {
                        if (typeof this.currentPostData !== 'undefined') {
                            components_6.application.copyToClipboard(this.currentPostData.author.npub || '');
                        }
                        this.mdPostActions.visible = false;
                    }
                },
                // {
                //     caption: 'Mute user',
                //     icon: { name: "user-slash", fill: Theme.colors.error.main },
                //     hoveredColor: 'color-mix(in srgb, var(--colors-error-main) 25%, var(--background-paper))'
                // },
                // {
                //     caption: 'Report user',
                //     icon: { name: "exclamation-circle", fill: Theme.colors.error.main },
                //     hoveredColor: 'color-mix(in srgb, var(--colors-error-main) 25%, var(--background-paper))'
                // }
            ];
            this.pnlActions.clearInnerHTML();
            for (let i = 0; i < actions.length; i++) {
                const item = actions[i];
                this.pnlActions.appendChild(this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", width: "100%", padding: { top: '0.625rem', bottom: '0.625rem', left: '0.75rem', right: '0.75rem' }, background: { color: 'transparent' }, border: { radius: '0.5rem' }, opacity: item.hoveredColor ? 1 : 0.667, hover: {
                        backgroundColor: item.hoveredColor || Theme.action.hoverBackground,
                        opacity: 1
                    }, onClick: item.onClick?.bind(this) },
                    this.$render("i-label", { caption: item.caption, font: { color: item.icon?.fill || Theme.text.primary, weight: 400, size: '0.875rem' } }),
                    this.$render("i-icon", { name: item.icon.name, width: '0.75rem', height: '0.75rem', display: 'inline-flex', fill: item.icon?.fill || Theme.text.primary })));
            }
            this.pnlActions.appendChild(this.$render("i-hstack", { width: "100%", horizontalAlignment: "center", padding: { top: 12, bottom: 12, left: 16, right: 16 }, visible: false, mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: { visible: true }
                    }
                ] },
                this.$render("i-button", { caption: 'Cancel', width: "100%", minHeight: 44, padding: { left: 16, right: 16 }, font: { color: Theme.text.primary, weight: 600 }, border: { radius: '30px', width: '1px', style: 'solid', color: Theme.colors.secondary.light }, grid: { horizontalAlignment: 'center' }, background: { color: 'transparent' }, boxShadow: "none", onClick: () => this.onCloseModal('mdPostActions') })));
        }
        renderColor(color) {
            const isCurrentColor = color === this.currentEmojiColor;
            const colorEl = (this.$render("i-panel", { background: { color }, border: { radius: '50%' }, width: '1.188rem', height: '1.188rem', padding: { left: '0.35rem' }, stack: { grow: '0', shrink: '0', basis: '1.188rem' }, boxShadow: `${isCurrentColor ? 'rgb(29, 155, 240) 0px 0px 0px 2px' : 'none'}`, onClick: this.onEmojiColorSelected },
                this.$render("i-icon", { name: 'check', width: '0.5rem', height: '0.5rem', lineHeight: '0.35rem', fill: 'rgb(21, 32, 43)', visible: isCurrentColor })));
            if (isCurrentColor)
                this.selectedColor = colorEl;
            this.pnlColors.appendChild(colorEl);
        }
        onEmojiColorSelected(target) {
            if (!this.pnlColors?.children || this.pnlColors?.children?.length < 2) {
                this.renderEmojiColors();
                return;
            }
            if (this.selectedColor) {
                this.selectedColor.boxShadow = 'none';
                const icon = this.selectedColor.querySelector('i-icon');
                if (icon)
                    icon.visible = false;
            }
            target.boxShadow = 'rgb(29, 155, 240) 0px 0px 0px 2px';
            const icon = target.querySelector('i-icon');
            if (icon)
                icon.visible = true;
            this.selectedColor = target;
            this.updateEmojiGroups();
        }
        onEmojiCateSelected(target, category) {
            if (!target)
                return;
            const preventSelected = this.isEmojiSearching || (this.isRecent(category) && !this.recent?.children[1]?.innerHTML);
            if (preventSelected)
                return;
            const cates = this.querySelectorAll('.emoji-cate');
            for (let cateEl of cates) {
                cateEl.opacity = 0.5;
                cateEl.children[1].visible = false;
            }
            target.children[1].visible = true;
            target.opacity = 1;
            if (this.isRecent(category)) {
                this.groupEmojis.scrollTo({ top: 0 });
            }
            else {
                const groupEl = this.querySelector(`#${category.value}`);
                if (groupEl) {
                    this.groupEmojis.scrollTo({ top: groupEl.offsetTop });
                }
            }
        }
        async onEmojiSelected(event, emoji) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this.lbEmoji.caption = `${emoji.htmlCode.join('')}`;
            const newSpan = document.createElement('span');
            newSpan.innerHTML = `<span style='font-size:1.25rem;'>${emoji.htmlCode.join('')}</span>`;
            this.value = this.updatedValue + '\n' + newSpan.innerHTML;
            this.recentEmojis[emoji.name] = emoji;
            const parent = event.target.closest('.emoji-group');
            if (parent) {
                this.groupEmojis.scrollTo({ top: parent.offsetTop + event.clientY });
            }
        }
        async onEmojiSearch() {
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
            if (!this.inputEmoji.value) {
                this.pnlEmojiResult.visible = false;
                this.groupEmojis.visible = true;
                this.lbEmoji.caption = '';
                this.isEmojiSearching = false;
                this.mdEmoji.refresh();
            }
            else {
                this.pnlEmojiResult.visible = true;
                this.groupEmojis.visible = false;
                this.pnlEmojiResult.clearInnerHTML();
                this.searchTimer = setTimeout(() => {
                    const category = {
                        name: 'Search results',
                        value: 'search'
                    };
                    this.renderEmojiGroup(this.pnlEmojiResult, category);
                    this.mdEmoji.refresh();
                }, 100);
                this.isEmojiSearching = true;
            }
        }
        onEmojiMdOpen() {
            this.pnlEmojiResult.visible = false;
            this.groupEmojis.visible = true;
            this.inputEmoji.value = '';
            this.lbEmoji.caption = '';
            this.isEmojiSearching = false;
            if (!this.emojiInitState) {
                this.emojiInitState = 1;
                this.initEmojis();
            }
            else {
                if (this.hasRecentEmojis) {
                    const recent = this.groupEmojis.querySelector('#recent');
                    recent && this.groupEmojis.removeChild(recent);
                    this.renderEmojiGroup(this.groupEmojis, index_1.emojiCategories[0]);
                }
                else {
                    this.recent && this.recent.clearInnerHTML();
                }
                const index = this.hasRecentEmojis ? 0 : 1;
                if (this.gridEmojiCate?.children?.length) {
                    this.onEmojiCateSelected(this.gridEmojiCate.children[index], index_1.emojiCategories[index]);
                }
                this.pnlColors.clearInnerHTML();
                this.renderColor(this.currentEmojiColor);
                this.mdEmoji.refresh();
            }
        }
        showStorage() {
            if (!this.hasQuota) {
                this.onUpload();
                return;
            }
            if (!this.storageEl) {
                this.storageEl = scom_storage_1.ScomStorage.getInstance();
                this.storageEl.onCancel = () => this.storageEl.closeModal();
            }
            this.storageEl.uploadMultiple = false;
            this.storageEl.onUploadedFile = (path) => {
                this.storageEl.closeModal();
                const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
                const ext = path.split('.').pop();
                if (imageTypes.includes(ext)) {
                    this.mdEditor.value = this.updatedValue + '\n\n' + `![${path.split('/').pop()}](<${path}>)` + '\n\n';
                }
                else {
                    const linkMd = `[${path}](<${path}>)`;
                    this.mdEditor.value = this.updatedValue + '\n\n' + linkMd + '\n\n';
                }
            };
            this.storageEl.onOpen = (path) => {
                this.storageEl.closeModal();
                const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
                const ext = path.split('.').pop();
                if (imageTypes.includes(ext)) {
                    this.mdEditor.value = this.updatedValue + '\n\n' + `![${path.split('/').pop()}](<${path}>)` + '\n\n';
                }
                else {
                    const linkMd = `[${path}](<${path}>)`;
                    this.mdEditor.value = this.updatedValue + '\n\n' + linkMd + '\n\n';
                }
            };
            this.storageEl.openModal({
                width: 800,
                maxWidth: '100%',
                height: '90vh',
                overflow: 'hidden',
                zIndex: 1000,
                closeIcon: { width: '1rem', height: '1rem', name: 'times', fill: Theme.text.primary, margin: { bottom: '0.5rem' } },
                class: index_css_2.modalStyle
            });
            this.storageEl.onShow();
        }
        async onShowWidgets(widget) {
            if (!this.widgetModule) {
                this.widgetModule = await index_2.ScomPostComposerWidget.create({
                    onConfirm: (url) => {
                        if (url)
                            this.mdEditor.value = this.updatedValue + '\n\n' + url + '\n\n';
                        this.widgetModule.closeModal();
                    },
                    onUpdate: (oldUrl, newUrl) => {
                        if (newUrl) {
                            this.mdEditor.value = this.updatedValue.replace(`$$widget0 ${oldUrl}$$`, newUrl);
                        }
                        this.widgetModule.closeModal();
                    },
                    onCloseButtonClick: () => {
                        this.widgetModule.closeModal();
                    }
                });
            }
            const modal = this.widgetModule.openModal({
                width: '90%',
                maxWidth: '50rem',
                padding: { top: 0, bottom: 0, left: 0, right: 0 },
                closeOnBackdropClick: true,
                closeIcon: null
            });
            this.widgetModule.onRefresh = (maxWidth) => {
                modal.maxWidth = maxWidth;
                const wrapper = modal.querySelector('.modal');
                if (wrapper)
                    wrapper.style.maxWidth = maxWidth;
                modal.refresh();
            };
            if (widget) {
                const { icon, widgetUrl } = widget;
                this.widgetModule.onUpdate = (oldUrl, newUrl) => {
                    if (newUrl) {
                        const editor = icon.closest('i-markdown-editor#mdEditor');
                        if (!editor)
                            return;
                        const value = editor.getMarkdownValue();
                        editor.value = value.replace(`$$widget0 ${oldUrl}$$`, newUrl);
                    }
                    this.widgetModule.closeModal();
                };
                this.widgetModule.show(widgetUrl);
            }
            else {
                this.widgetModule.show();
            }
        }
        onShowDeleteWidget(widget, icon) {
            const editor = icon.closest('i-markdown-editor#mdEditor');
            if (!editor)
                return;
            const alert = editor.closest('i-scom-post-composer')?.querySelector('i-alert');
            if (!alert) {
                const value = editor.getMarkdownValue();
                editor.value = value.replace(`$$widget0 ${widget}$$`, '');
            }
            else {
                alert.onConfirm = () => {
                    const value = editor.getMarkdownValue();
                    editor.value = value.replace(`$$widget0 ${widget}$$`, '');
                };
                alert.showModal();
            }
        }
        renderWidget(url) {
            let widgetData = (0, index_1.extractWidgetUrl)(url);
            const pnl = new components_6.Panel(undefined, { width: '100%' });
            pnl.classList.add(index_css_2.widgetPreviewStyle);
            const hStack = new components_6.HStack(pnl, {
                width: '100%',
                gap: '0.75rem',
                verticalAlignment: 'center',
                horizontalAlignment: 'end',
                margin: { bottom: '0.5rem' },
                padding: { left: '0.75rem', right: '0.75rem' }
            });
            const iconConfig = new components_6.Icon(hStack, {
                name: 'cog',
                fill: Theme.text.primary,
                width: '1rem',
                height: '1rem',
                cursor: 'pointer',
                tooltip: { content: 'Config' }
            });
            iconConfig.onClick = () => { this.onShowWidgets({ widgetUrl: url, icon: iconConfig }); };
            const iconDelete = new components_6.Icon(hStack, {
                name: 'trash',
                fill: '#e45a5a',
                width: '1rem',
                height: '1rem',
                cursor: 'pointer',
                tooltip: { content: 'Delete' }
            });
            iconDelete.onClick = () => { this.onShowDeleteWidget(url, iconDelete); };
            (0, index_1.getEmbedElement)({
                module: widgetData.moduleName,
                data: {
                    properties: {
                        ...widgetData.data
                    },
                    tag: {
                        width: '100%'
                    }
                }
            }, pnl);
            return pnl;
        }
        _handleClick(event, stopPropagation) {
            this.pnlIcons.visible = true;
            if (this.isReplyToShown) {
                this.pnlReplyTo.visible = true;
                this.updateGrid();
            }
            return true;
        }
        showPostAudienceModal() {
            this.onShowModal('mdPostAudience');
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            this.onSubmit = this.getAttribute('onSubmit', true) || this.onSubmit;
            this.onCancel = this.getAttribute('onCancel', true) || this.onCancel;
            const apiBaseUrl = this.getAttribute('apiBaseUrl', true);
            if (apiBaseUrl)
                this.apiBaseUrl = apiBaseUrl;
            const replyTo = this.getAttribute('replyTo', true);
            const type = this.getAttribute('type', true, 'reply');
            const isReplyToShown = this.getAttribute('isReplyToShown', true, false);
            const placeholder = this.getAttribute('placeholder', true);
            const buttonCaption = this.getAttribute('buttonCaption', true);
            this.autoFocus = this.getAttribute('autoFocus', true);
            this.focusedPost = this.getAttribute('focusedPost', true);
            const mobile = this.getAttribute('mobile', true);
            this.mobile = mobile;
            this.avatar = this.getAttribute('avatar', true);
            const isPostAudienceShown = this.getAttribute('isPostAudienceShown', true);
            if (isPostAudienceShown != null) {
                this._isPostAudienceShown = isPostAudienceShown;
            }
            if (mobile) {
                this.renderMobilePostComposer();
            }
            else {
                this.renderPostComposer();
            }
            this.setData({ isReplyToShown, replyTo, type, placeholder, buttonCaption });
            this.renderEmojis();
            // if(this.autoFocus) {
            this.mdEditor.autoFocus = this.autoFocus;
            if (this.autoFocus)
                this.mdEditor.setFocus();
            // }
            // this.updateFocusedPost();
            const self = this;
            this.mdEditor.widgetRules = [
                {
                    rule: /https?:\/\/widget\.\S+\/scom\/\S+\/\S+/g,
                    toDOM(text) {
                        try {
                            const widget = self.renderWidget(text);
                            return widget;
                        }
                        catch {
                            return text;
                        }
                    },
                },
            ];
        }
        async handleMobileCloseComposer() {
            if (this.onCancel)
                await this.onCancel();
        }
        handlePostAudienceClick(audience) {
            this.audience = audience;
            this.btnPostAudience.caption = audience.title;
            this.btnPostAudience.icon.name = audience.icon;
            this.onCloseModal('mdPostAudience');
        }
        renderPostAudiences() {
            const panel = this.$render("i-stack", { direction: "vertical" });
            for (let audience of PostAudience) {
                panel.appendChild(this.$render("i-stack", { direction: "horizontal", alignItems: "center", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, background: { color: 'transparent' }, border: { radius: '0.125rem' }, gap: "0.75rem", cursor: "pointer", hover: {
                        fontColor: Theme.text.primary,
                        backgroundColor: Theme.action.hoverBackground
                    }, onClick: () => this.handlePostAudienceClick(audience) },
                    this.$render("i-icon", { name: audience.icon, width: '0.75rem', height: '0.75rem', display: 'inline-flex', fill: Theme.text.primary }),
                    this.$render("i-stack", { direction: "vertical", height: "100%", minWidth: 0, justifyContent: "space-between", lineHeight: "1.125rem" },
                        this.$render("i-label", { caption: audience.title || "", font: { size: '0.9375rem', weight: 700 }, textOverflow: "ellipsis", overflow: "hidden" }),
                        this.$render("i-label", { caption: audience.desc || "", font: { size: '0.75rem', weight: 400, color: Theme.text.secondary }, lineHeight: '1rem', textOverflow: "ellipsis", overflow: "hidden" }))));
            }
            return panel;
        }
        renderMobilePostComposer() {
            const pnlPostAudiences = this.renderPostAudiences();
            const elm = this.$render("i-panel", { cursor: 'default' },
                this.$render("i-hstack", { justifyContent: 'space-between', alignItems: 'center', padding: { left: '0.5rem', right: '0.5rem' }, position: 'fixed', top: 0, zIndex: 10, background: { color: '#000' }, width: '100%', border: { bottom: { width: '.5px', style: 'solid', color: Theme.divider } }, height: 50, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                border: { bottom: { style: 'none' } }
                            }
                        }
                    ] },
                    this.$render("i-button", { caption: "Cancel", onClick: this.handleMobileCloseComposer.bind(this), padding: { left: 5, right: 5, top: 5, bottom: 5 }, font: { size: Theme.typography.fontSize }, background: { color: 'transparent' } }),
                    this.$render("i-button", { id: "btnReply", caption: "Post", enabled: false, onClick: this.onReply.bind(this), padding: { left: '1rem', right: '1rem' }, height: 36, background: { color: Theme.colors.primary.main }, font: { size: Theme.typography.fontSize, color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '30px' } })),
                this.$render("i-hstack", { id: "pnlReplyTo", visible: false, gap: "0.5rem", verticalAlignment: "center", padding: { top: '0.25rem', bottom: '0.75rem', left: '3.25rem' } },
                    this.$render("i-label", { caption: "Replying to", font: { size: '1rem', color: Theme.text.secondary } }),
                    this.$render("i-label", { id: "lbReplyTo", link: { href: '' }, font: { size: '1rem', color: Theme.colors.primary.main } })),
                this.$render("i-panel", { id: 'pnlFocusedPost', padding: { top: 50 } }),
                this.$render("i-grid-layout", { id: "gridReply", gap: { column: '0.75rem' }, height: "", templateColumns: ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'], templateRows: ['auto'], templateAreas: [
                        ['avatar', 'editor'],
                        ['avatar', 'reply']
                    ], padding: { left: '0.75rem' } },
                    this.$render("i-image", { id: "imgReplier", grid: { area: 'avatar' }, width: '2.75rem', height: '2.75rem', display: "block", background: { color: Theme.background.main }, border: { radius: '50%' }, overflow: 'hidden', margin: { top: '0.75rem' }, objectFit: 'cover', url: this._avatar, fallbackUrl: assets_2.default.fullPath('img/default_avatar.png') }),
                    this.$render("i-panel", { grid: { area: 'editor' }, maxHeight: '45rem', overflow: { x: 'hidden', y: 'auto' } },
                        this.$render("i-markdown-editor", { id: "mdEditor", width: "100%", viewer: false, hideModeSwitch: true, mode: "wysiwyg", toolbarItems: [], font: { size: '1.25rem', color: Theme.text.primary }, lineHeight: 1.5, padding: { top: 12, bottom: 12, left: 0, right: 0 }, background: { color: 'transparent' }, height: "auto", minHeight: 0, overflow: 'hidden', overflowWrap: "break-word", onChanged: this.onEditorChanged.bind(this), cursor: 'text', border: { style: 'none' }, visible: true })),
                    this.$render("i-hstack", { id: "pnlBorder", horizontalAlignment: "space-between", grid: { area: 'reply' }, padding: { top: '0.625rem', right: '0.5rem' } },
                        this.$render("i-hstack", { id: "pnlIcons", gap: "4px", verticalAlignment: "center", visible: false },
                            this.$render("i-icon", { id: "iconMediaMobile", name: "image", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Media', placement: 'bottom' }, cursor: "pointer", onClick: this.showStorage }),
                            this.$render("i-icon", { name: "images", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'GIF', placement: 'bottom' }, cursor: "pointer", onClick: this.onShowGifModal }),
                            this.$render("i-panel", null,
                                this.$render("i-icon", { name: "smile", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Emoji', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowModal('mdEmoji') }),
                                this.$render("i-modal", { id: "mdEmoji", maxWidth: '100%', minWidth: 320, popupPlacement: 'bottomRight', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, closeOnScrollChildFixed: true, onOpen: this.onEmojiMdOpen.bind(this), visible: false },
                                    this.$render("i-vstack", { position: 'relative', padding: { left: '0.25rem', right: '0.25rem' } },
                                        this.$render("i-hstack", { verticalAlignment: "center", border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, minHeight: 40, width: '100%', background: { color: Theme.input.background }, padding: { left: '0.75rem', right: '0.75rem' }, margin: { top: '0.25rem', bottom: '0.25rem' }, gap: "4px" },
                                            this.$render("i-icon", { width: '1rem', height: '1rem', name: 'search', fill: Theme.text.secondary }),
                                            this.$render("i-input", { id: "inputEmoji", placeholder: 'Search emojis', width: '100%', height: '100%', border: { style: 'none' }, captionWidth: '0px', showClearButton: true, onClearClick: this.onEmojiMdOpen.bind(this), onKeyUp: this.onEmojiSearch.bind(this) })),
                                        this.$render("i-grid-layout", { id: "gridEmojiCate", verticalAlignment: "center", columnsPerRow: 9, margin: { top: 4 }, grid: { verticalAlignment: 'center', horizontalAlignment: 'center' }, border: { bottom: { width: '1px', style: 'solid', color: Theme.divider } } }),
                                        this.$render("i-vstack", { id: "groupEmojis", maxHeight: 400, overflow: { y: 'auto' } }),
                                        this.$render("i-vstack", { id: "pnlEmojiResult", border: { bottom: { width: '1px', style: 'solid', color: Theme.divider } }, maxHeight: 400, overflow: { y: 'auto' }, minHeight: 200, gap: "0.75rem", visible: false }),
                                        this.$render("i-hstack", { bottom: "0px", left: "0px", position: "absolute", width: '100%', verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: '0.75rem', left: '0.75rem', right: '0.75rem', bottom: '0.75rem' }, gap: "0.75rem", zIndex: 20, background: { color: Theme.background.modal }, border: {
                                                radius: '0 0 1rem 1rem',
                                                top: { width: '1px', style: 'solid', color: Theme.divider }
                                            } },
                                            this.$render("i-label", { id: "lbEmoji", width: '1.25rem', height: '1.25rem', display: "inline-block" }),
                                            this.$render("i-hstack", { id: "pnlColors", verticalAlignment: "center", gap: '0.25rem', overflow: 'hidden', cursor: "pointer", padding: {
                                                    top: '0.25rem',
                                                    left: '0.25rem',
                                                    right: '0.25rem',
                                                    bottom: '0.25rem'
                                                } }))))),
                            this.$render("i-icon", { width: 28, height: 28, name: "shapes", fill: Theme.colors.primary.main, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Widgets', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowWidgets() })),
                        this.$render("i-panel", null,
                            this.$render("i-button", { id: "btnPostAudience", height: 32, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.secondary.main }, font: { color: Theme.colors.secondary.contrastText, bold: true }, border: { radius: '0.375rem' }, caption: this.audience.title, icon: { width: 14, height: 14, name: this.audience.icon, fill: Theme.colors.secondary.contrastText }, rightIcon: { width: 14, height: 14, name: 'angle-down', fill: Theme.colors.secondary.contrastText }, visible: this.isPostAudienceShown, onClick: this.showPostAudienceModal.bind(this) }),
                            this.$render("i-modal", { id: "mdPostAudience", maxWidth: '15rem', minWidth: '12.25rem', maxHeight: '27.5rem', popupPlacement: 'bottomRight', showBackdrop: false, border: { radius: '0.5rem' }, boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px", padding: { top: 0, bottom: 0, left: 0, right: 0 }, overflow: { y: 'hidden' }, visible: false }, pnlPostAudiences)))),
                this.$render("i-modal", { id: "mdPostActions", visible: false, maxWidth: '15rem', minWidth: '12.25rem', popupPlacement: 'bottomRight', showBackdrop: false, border: { radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider }, padding: { top: '0.5rem', left: '0.5rem', right: '0.5rem', bottom: '0.5rem' }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                showBackdrop: true,
                                popupPlacement: 'bottom',
                                position: 'fixed',
                                zIndex: 999,
                                maxWidth: '100%',
                                width: '100%',
                                maxHeight: '50vh',
                                overflow: { y: 'auto' },
                                border: { radius: '16px 16px 0 0' }
                            }
                        }
                    ], onClose: () => this.removeShow('mdPostActions') },
                    this.$render("i-vstack", { id: "pnlActions", minWidth: 0, maxHeight: '27.5rem', overflow: { y: 'auto' } })),
                this.$render("i-modal", { id: "mdGif", border: { radius: '1rem' }, maxWidth: '600px', maxHeight: '90vh', overflow: { y: 'auto' }, padding: { top: 0, right: 0, left: 0, bottom: 0 }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                showBackdrop: true,
                                popupPlacement: 'top',
                                position: 'fixed',
                                zIndex: 999,
                                maxWidth: '100%',
                                height: '100%',
                                width: '100%',
                                border: { radius: 0 }
                            }
                        }
                    ], onOpen: this.onGifMdOpen.bind(this), onClose: this.onGifMdClose.bind(this) },
                    this.$render("i-vstack", null,
                        this.$render("i-hstack", { verticalAlignment: "center", height: 53, margin: { top: 8, bottom: 8 }, padding: { right: '0.5rem', left: '0.5rem' }, position: "sticky", zIndex: 2, top: '0px', background: { color: Theme.background.modal } },
                            this.$render("i-panel", { id: "pnlGifBack", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, cursor: 'pointer', onClick: this.onBack.bind(this), visible: false },
                                this.$render("i-icon", { name: "arrow-left", width: 20, height: 20, fill: Theme.colors.secondary.main })),
                            this.$render("i-hstack", { verticalAlignment: "center", padding: { left: '0.75rem', right: '0.75rem' }, border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, minHeight: 40, width: '100%', background: { color: Theme.input.background }, gap: "4px" },
                                this.$render("i-icon", { width: 16, height: 16, name: 'search', fill: Theme.text.secondary }),
                                this.$render("i-input", { id: "inputGif", placeholder: 'Search for Gifs', width: '100%', height: '100%', captionWidth: '0px', border: { style: 'none' }, showClearButton: true, onClearClick: () => this.onToggleMainGif(true), onKeyUp: (target) => this.onGifSearch(target.value) })),
                            this.$render("i-panel", { id: "pnlGifClose", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, cursor: 'pointer', onClick: this.onCloseGifModal.bind(this) },
                                this.$render("i-icon", { name: "times", width: 20, height: 20, fill: Theme.colors.secondary.main }))),
                        this.$render("i-panel", { id: "gifCateLoading", height: 600 },
                            this.$render("i-stack", { direction: "vertical", height: "100%", width: "100%", class: "i-loading-overlay", background: { color: Theme.background.modal } },
                                this.$render("i-stack", { direction: "vertical", class: "i-loading-spinner", alignItems: "center", justifyContent: "center" },
                                    this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main })))),
                        this.$render("i-card-layout", { id: "gridGifCate", cardMinWidth: '18rem', cardHeight: '9.375rem', visible: false }),
                        this.$render("i-vstack", { id: "pnlGif", visible: false },
                            this.$render("i-hstack", { horizontalAlignment: "space-between", gap: "0.5rem", padding: { left: '0.75rem', right: '0.75rem', top: '0.75rem', bottom: '0.75rem' } },
                                this.$render("i-label", { caption: "Auto-play GIFs", font: { color: Theme.text.secondary, size: '0.9rem' } }),
                                this.$render("i-switch", { id: "autoPlaySwitch", checked: true, uncheckedTrackColor: Theme.divider, checkedTrackColor: Theme.colors.primary.main, onChanged: this.onGifPlayChanged.bind(this) })),
                            this.$render("i-panel", { id: "topElm", width: '100%' }),
                            this.$render("i-card-layout", { id: "gridGif", autoRowSize: "auto", autoColumnSize: "auto", cardHeight: 'auto', columnsPerRow: 4 }),
                            this.$render("i-panel", { id: "bottomElm", width: '100%', minHeight: 20 },
                                this.$render("i-vstack", { id: "gifLoading", padding: { top: '0.5rem', bottom: '0.5rem' }, visible: false, height: "100%", width: "100%", class: "i-loading-overlay", background: { color: Theme.background.modal } },
                                    this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                        this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main }))))))),
                this.$render("i-modal", { id: "mdWidgets", border: { radius: '1rem' }, maxWidth: '600px', maxHeight: '90vh', overflow: { y: 'auto' }, padding: { top: 0, right: 0, left: 0, bottom: 0 }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                showBackdrop: true,
                                popupPlacement: 'top',
                                position: 'fixed',
                                zIndex: 999,
                                maxWidth: '100%',
                                height: '100%',
                                width: '100%',
                                border: { radius: 0 }
                            }
                        }
                    ] },
                    this.$render("i-vstack", null,
                        this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", padding: { right: '1rem', left: '1rem', top: '1rem', bottom: '1rem' } },
                            this.$render("i-label", { caption: 'SCOM Widgets', font: { color: Theme.colors.primary.main, size: '1rem', bold: true } }),
                            this.$render("i-icon", { name: "times", cursor: 'pointer', width: 20, height: 20, fill: Theme.colors.secondary.main, onClick: () => this.onCloseModal('mdWidgets') })))));
            this.pnlPostComposer.append(elm);
        }
        renderPostComposer() {
            const pnlPostAudiences = this.renderPostAudiences();
            this.pnlPostComposer.append(this.$render("i-panel", { padding: { bottom: '0.75rem', top: '0.75rem' }, cursor: 'default' },
                this.$render("i-hstack", { id: "pnlReplyTo", visible: false, gap: "0.5rem", verticalAlignment: "center", padding: { top: '0.25rem', bottom: '0.75rem', left: '3.25rem' } },
                    this.$render("i-label", { caption: "Replying to", font: { size: '1rem', color: Theme.text.secondary } }),
                    this.$render("i-label", { id: "lbReplyTo", link: { href: '' }, font: { size: '1rem', color: Theme.colors.primary.main } })),
                this.$render("i-grid-layout", { id: "gridReply", gap: { column: '0.75rem' }, templateColumns: ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'], templateRows: ['auto'], templateAreas: [
                        ['avatar', 'editor'],
                        ['avatar', 'reply']
                    ] },
                    this.$render("i-image", { id: "imgReplier", grid: { area: 'avatar' }, width: '2.75rem', height: '2.75rem', display: "block", background: { color: Theme.background.main }, border: { radius: '50%' }, overflow: 'hidden', margin: { top: '0.75rem' }, objectFit: 'cover', url: this._avatar, fallbackUrl: assets_2.default.fullPath('img/default_avatar.png') }),
                    this.$render("i-panel", { grid: { area: 'editor' }, maxHeight: '45rem', overflow: { x: 'hidden', y: 'auto' } },
                        this.$render("i-markdown-editor", { id: "mdEditor", width: "100%", viewer: false, hideModeSwitch: true, mode: "wysiwyg", toolbarItems: [], font: { size: '1.25rem', color: Theme.text.primary }, lineHeight: 1.5, padding: { top: 12, bottom: 12, left: 0, right: 0 }, background: { color: 'transparent' }, height: "auto", minHeight: 0, overflow: 'hidden', overflowWrap: "break-word", onChanged: this.onEditorChanged.bind(this), cursor: 'text', border: { style: 'none' }, visible: true })),
                    this.$render("i-hstack", { id: "pnlBorder", horizontalAlignment: "space-between", grid: { area: 'reply' }, padding: { top: '0.625rem' } },
                        this.$render("i-hstack", { id: "pnlIcons", gap: "4px", verticalAlignment: "center", visible: false },
                            this.$render("i-icon", { id: "iconMediaMobile", name: "image", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Media', placement: 'bottom' }, cursor: "pointer", onClick: this.showStorage }),
                            this.$render("i-icon", { name: "images", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'GIF', placement: 'bottom' }, cursor: "pointer", onClick: this.onShowGifModal }),
                            this.$render("i-panel", null,
                                this.$render("i-icon", { name: "smile", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Emoji', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowModal('mdEmoji') }),
                                this.$render("i-modal", { id: "mdEmoji", maxWidth: '100%', minWidth: 320, popupPlacement: 'bottomRight', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, closeOnScrollChildFixed: true, onOpen: this.onEmojiMdOpen.bind(this), visible: false },
                                    this.$render("i-vstack", { position: 'relative', padding: { left: '0.25rem', right: '0.25rem' } },
                                        this.$render("i-hstack", { verticalAlignment: "center", border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, minHeight: 40, width: '100%', background: { color: Theme.input.background }, padding: { left: '0.75rem', right: '0.75rem' }, margin: { top: '0.25rem', bottom: '0.25rem' }, gap: "4px" },
                                            this.$render("i-icon", { width: '1rem', height: '1rem', name: 'search', fill: Theme.text.secondary }),
                                            this.$render("i-input", { id: "inputEmoji", placeholder: 'Search emojis', width: '100%', height: '100%', border: { style: 'none' }, captionWidth: '0px', showClearButton: true, onClearClick: this.onEmojiMdOpen.bind(this), onKeyUp: this.onEmojiSearch.bind(this) })),
                                        this.$render("i-grid-layout", { id: "gridEmojiCate", verticalAlignment: "center", columnsPerRow: 9, margin: { top: 4 }, grid: { verticalAlignment: 'center', horizontalAlignment: 'center' }, border: { bottom: { width: '1px', style: 'solid', color: Theme.divider } } }),
                                        this.$render("i-vstack", { id: "groupEmojis", maxHeight: 400, overflow: { y: 'auto' } }),
                                        this.$render("i-vstack", { id: "pnlEmojiResult", border: { bottom: { width: '1px', style: 'solid', color: Theme.divider } }, maxHeight: 400, overflow: { y: 'auto' }, minHeight: 200, gap: "0.75rem", visible: false }),
                                        this.$render("i-hstack", { bottom: "0px", left: "0px", position: "absolute", width: '100%', verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: '0.75rem', left: '0.75rem', right: '0.75rem', bottom: '0.75rem' }, gap: "0.75rem", zIndex: 20, background: { color: Theme.background.modal }, border: {
                                                radius: '0 0 1rem 1rem',
                                                top: { width: '1px', style: 'solid', color: Theme.divider }
                                            } },
                                            this.$render("i-label", { id: "lbEmoji", width: '1.25rem', height: '1.25rem', display: "inline-block" }),
                                            this.$render("i-hstack", { id: "pnlColors", verticalAlignment: "center", gap: '0.25rem', overflow: 'hidden', cursor: "pointer", padding: {
                                                    top: '0.25rem',
                                                    left: '0.25rem',
                                                    right: '0.25rem',
                                                    bottom: '0.25rem'
                                                } }))))),
                            this.$render("i-icon", { width: 28, height: 28, name: "shapes", fill: Theme.colors.primary.main, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Widgets', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowWidgets() })),
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "end", gap: "0.5rem" },
                            this.$render("i-panel", null,
                                this.$render("i-button", { id: "btnPostAudience", height: 32, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.secondary.main }, font: { color: Theme.colors.secondary.contrastText, bold: true }, border: { radius: '0.375rem' }, caption: this.audience.title, icon: { width: 14, height: 14, name: this.audience.icon, fill: Theme.colors.secondary.contrastText }, rightIcon: { width: 14, height: 14, name: 'angle-down', fill: Theme.colors.secondary.contrastText }, visible: this.isPostAudienceShown, onClick: this.showPostAudienceModal.bind(this) }),
                                this.$render("i-modal", { id: "mdPostAudience", maxWidth: '15rem', minWidth: '12.25rem', maxHeight: '27.5rem', popupPlacement: 'bottomRight', showBackdrop: false, border: { radius: '0.5rem' }, boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px", padding: { top: 0, bottom: 0, left: 0, right: 0 }, overflow: { y: 'hidden' }, visible: false }, pnlPostAudiences)),
                            this.$render("i-button", { id: "btnReply", height: 36, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '30px' }, enabled: false, caption: "Post", onClick: this.onReply.bind(this) })))),
                this.$render("i-modal", { id: "mdGif", border: { radius: '1rem' }, maxWidth: '600px', maxHeight: '90vh', overflow: { y: 'auto' }, padding: { top: 0, right: 0, left: 0, bottom: 0 }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                showBackdrop: true,
                                popupPlacement: 'top',
                                position: 'fixed',
                                zIndex: 999,
                                maxWidth: '100%',
                                height: '100%',
                                width: '100%',
                                border: { radius: 0 }
                            }
                        }
                    ], onOpen: this.onGifMdOpen.bind(this), onClose: this.onGifMdClose.bind(this) },
                    this.$render("i-vstack", null,
                        this.$render("i-hstack", { verticalAlignment: "center", height: 53, margin: { top: 8, bottom: 8 }, padding: { right: '0.5rem', left: '0.5rem' }, position: "sticky", zIndex: 2, top: '0px', background: { color: Theme.background.modal } },
                            this.$render("i-panel", { id: "pnlGifBack", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, cursor: 'pointer', onClick: this.onBack.bind(this), visible: false },
                                this.$render("i-icon", { name: "arrow-left", width: 20, height: 20, fill: Theme.colors.secondary.main })),
                            this.$render("i-hstack", { verticalAlignment: "center", padding: { left: '0.75rem', right: '0.75rem' }, border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, minHeight: 40, width: '100%', background: { color: Theme.input.background }, gap: "4px" },
                                this.$render("i-icon", { width: 16, height: 16, name: 'search', fill: Theme.text.secondary }),
                                this.$render("i-input", { id: "inputGif", placeholder: 'Search for Gifs', width: '100%', height: '100%', captionWidth: '0px', border: { style: 'none' }, showClearButton: true, onClearClick: () => this.onToggleMainGif(true), onKeyUp: (target) => this.onGifSearch(target.value) })),
                            this.$render("i-panel", { id: "pnlGifClose", padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, cursor: 'pointer', onClick: this.onCloseGifModal.bind(this) },
                                this.$render("i-icon", { name: "times", width: 20, height: 20, fill: Theme.colors.secondary.main }))),
                        this.$render("i-panel", { id: "gifCateLoading", height: 600 },
                            this.$render("i-stack", { direction: "vertical", height: "100%", width: "100%", class: "i-loading-overlay", background: { color: Theme.background.modal } },
                                this.$render("i-stack", { direction: "vertical", class: "i-loading-spinner", alignItems: "center", justifyContent: "center" },
                                    this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main })))),
                        this.$render("i-card-layout", { id: "gridGifCate", cardMinWidth: '18rem', cardHeight: '9.375rem', visible: false }),
                        this.$render("i-vstack", { id: "pnlGif", visible: false },
                            this.$render("i-hstack", { horizontalAlignment: "space-between", gap: "0.5rem", padding: { left: '0.75rem', right: '0.75rem', top: '0.75rem', bottom: '0.75rem' } },
                                this.$render("i-label", { caption: "Auto-play GIFs", font: { color: Theme.text.secondary, size: '0.9rem' } }),
                                this.$render("i-switch", { id: "autoPlaySwitch", checked: true, uncheckedTrackColor: Theme.divider, checkedTrackColor: Theme.colors.primary.main, onChanged: this.onGifPlayChanged.bind(this) })),
                            this.$render("i-panel", { id: "topElm", width: '100%' }),
                            this.$render("i-card-layout", { id: "gridGif", autoRowSize: "auto", autoColumnSize: "auto", cardHeight: 'auto', columnsPerRow: 4 }),
                            this.$render("i-panel", { id: "bottomElm", width: '100%', minHeight: 20 },
                                this.$render("i-vstack", { id: "gifLoading", padding: { top: '0.5rem', bottom: '0.5rem' }, visible: false, height: "100%", width: "100%", class: "i-loading-overlay", background: { color: Theme.background.modal } },
                                    this.$render("i-vstack", { class: "i-loading-spinner", horizontalAlignment: "center", verticalAlignment: "center" },
                                        this.$render("i-icon", { class: "i-loading-spinner_icon", name: "spinner", width: 24, height: 24, fill: Theme.colors.primary.main }))))))),
                this.$render("i-modal", { id: "mdWidgets", border: { radius: '1rem' }, maxWidth: '600px', maxHeight: '90vh', overflow: { y: 'auto' }, padding: { top: 0, right: 0, left: 0, bottom: 0 }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                showBackdrop: true,
                                popupPlacement: 'top',
                                position: 'fixed',
                                zIndex: 999,
                                maxWidth: '100%',
                                height: '100%',
                                width: '100%',
                                border: { radius: 0 }
                            }
                        }
                    ] },
                    this.$render("i-vstack", null,
                        this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", padding: { right: '1rem', left: '1rem', top: '1rem', bottom: '1rem' } },
                            this.$render("i-label", { caption: 'SCOM Widgets', font: { color: Theme.colors.primary.main, size: '1rem', bold: true } }),
                            this.$render("i-icon", { name: "times", cursor: 'pointer', width: 20, height: 20, fill: Theme.colors.secondary.main, onClick: () => this.onCloseModal('mdWidgets') }))))));
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlPostComposer' },
                this.$render("i-alert", { id: "mdAlert", status: "confirm", title: "Are you sure?", content: "Do you really want to delete this widget?" })));
        }
    };
    ScomPostComposer = __decorate([
        (0, components_6.customElements)('i-scom-post-composer')
    ], ScomPostComposer);
    exports.ScomPostComposer = ScomPostComposer;
});
