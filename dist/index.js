var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-post-composer/global/index.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.searchEmojis = exports.fetchEmojis = exports.colorsMapper = exports.emojiCategories = exports.fetchReactionGifs = exports.fetchGifs = void 0;
    ///<amd-module name='@scom/scom-post-composer/global/index.ts'/> 
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
            const response = await fetch(`http://api.giphy.com/v1/gifs/search?${queries}`);
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
        const groups = Array.from(mapper);
        let result = [];
        for (let group of groups) {
            const filteredGroup = [...group].filter(emoji => emoji.name.toLowerCase().includes(keyword));
            result = [...result, ...filteredGroup];
        }
        return result;
    };
    exports.searchEmojis = searchEmojis;
});
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
define("@scom/scom-post-composer/components/form.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposerUpload = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomPostComposerUpload = class ScomPostComposerUpload extends components_2.Module {
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
        (0, components_2.customElements)('i-scom-post-composer-upload')
    ], ScomPostComposerUpload);
    exports.ScomPostComposerUpload = ScomPostComposerUpload;
});
define("@scom/scom-post-composer/components/index.ts", ["require", "exports", "@scom/scom-post-composer/components/form.tsx"], function (require, exports, form_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposerUpload = void 0;
    Object.defineProperty(exports, "ScomPostComposerUpload", { enumerable: true, get: function () { return form_1.ScomPostComposerUpload; } });
});
define("@scom/scom-post-composer", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/global/index.ts", "@scom/scom-post-composer/assets.ts", "@scom/scom-post-composer/components/index.ts"], function (require, exports, components_3, index_1, assets_1, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposer = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomPostComposer = class ScomPostComposer extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            // private extensions: string[] = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tiff', 'tif', 'mp4', 'webm', 'ogg', 'avi', 'mkv', 'mov', 'm3u8'];
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
            this.onRecentClear = this.onRecentClear.bind(this);
            this.onEmojiColorSelected = this.onEmojiColorSelected.bind(this);
            this.onUpload = this.onUpload.bind(this);
            this.onGifPlayChanged = this.onGifPlayChanged.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        setFocus() {
            this.mdEditor.setFocus();
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
            this.postEditor.setValue(content);
        }
        get avatar() {
            return this._avatar;
        }
        set avatar(value) {
            this._avatar = value || assets_1.default.fullPath('img/default_avatar.png');
            if (this.imgReplier)
                this.imgReplier.url = this._avatar;
        }
        get updatedValue() {
            return this.typeSwitch.checked ? this.postEditor.value : this.mdEditor.getMarkdownValue();
        }
        get isAttachmentDisabled() {
            return this._isAttachmentDisabled;
        }
        set isAttachmentDisabled(value) {
            this._isAttachmentDisabled = value;
            if (this.iconMedia) {
                this.iconMedia.visible = this.iconMedia.enabled = !value;
            }
            if (this.iconMediaMobile) {
                this.iconMediaMobile.visible = this.iconMediaMobile.enabled = !value;
            }
        }
        isRecent(category) {
            return category.value === 'recent';
        }
        disableMarkdownEditor() {
            console.log('[scom-post-composer] disableMarkdownEditor');
            this.typeSwitch.visible = false;
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
            this.typeSwitch.checked = false;
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
            if (this.postEditor) {
                this.postEditor.value = '';
                this.postEditor.visible = this.typeSwitch.checked;
                if (!this.postEditor.visible) {
                    this.postEditor.onHide();
                }
            }
            if (this.mdEditor) {
                this.mdEditor.value = '';
                this.mdEditor.visible = !this.typeSwitch.checked;
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
                this.onSubmit(this._data.value, [...this.newReply]);
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
                title: 'Upload',
                width: 400,
            });
        }
        updateFocusedPost() {
            if (this.pnlFocusedPost && this.mobile) {
                const focusedPost = this.$render("i-scom-post", { id: this.focusedPost.id, data: this.focusedPost, type: "short", overflowEllipse: true, limitHeight: true, isReply: true });
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
        onGifMdOpen() {
            this.autoPlaySwitch.checked = true;
            this.onToggleMainGif(true);
        }
        onGifMdClose() {
            this.clearObservers();
        }
        async renderGifCate() {
            this.gridGifCate.clearInnerHTML();
            const { data = [] } = await (0, index_1.fetchReactionGifs)();
            const limitedList = [...data].slice(0, 8);
            for (let cate of limitedList) {
                this.gridGifCate.appendChild(this.$render("i-panel", { overflow: 'hidden', onClick: () => this.onGifSearch(cate.name) },
                    this.$render("i-image", { url: cate.gif.images['480w_still'].url, width: '100%', display: 'block' }),
                    this.$render("i-label", { caption: cate.name, font: { size: '1.25rem', weight: 700 }, position: "absolute", bottom: "0px", display: "block", width: '100%', padding: { left: '0.5rem', top: '0.5rem', right: '0.5rem', bottom: '0.5rem' } })));
            }
        }
        onGifSelected(gif) {
            this.onCloseModal('mdGif');
            const imgMd = `\n![${gif.images.original.url}](${gif.images.original_still.url})\n`;
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
                this.iconGif.name = 'times';
            }
            else {
                this.bottomObserver.observe(this.bottomElm);
                this.iconGif.name = 'arrow-left';
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
        onIconGifClicked(icon) {
            if (icon.name === 'times') {
                this.onCloseModal('mdGif');
            }
            else {
                this.pnlGif.visible = false;
                this.gridGifCate.visible = true;
            }
        }
        async renderEmojis() {
            this.recentEmojis = {};
            this.emojiCateMapper = new Map();
            this.renderEmojiCate();
            for (let category of index_1.emojiCategories) {
                this.renderEmojiGroup(this.groupEmojis, category);
            }
            this.renderColor(this.emojiColors[0]);
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
                if (!this.emojiGroupsData.has(category.value)) {
                    const list = await (0, index_1.fetchEmojis)({ category: category.value });
                    this.emojiGroupsData.set(category.value, JSON.parse(JSON.stringify(list)));
                }
                data = this.filterGroups(this.emojiGroupsData.get(category.value));
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
        onEmojiMdOpen() {
            this.pnlEmojiResult.visible = false;
            this.groupEmojis.visible = true;
            this.inputEmoji.value = '';
            this.lbEmoji.caption = '';
            this.isEmojiSearching = false;
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
        onTypeChanged(target) {
            this.postEditor.setValue(this._data.value);
            this.mdEditor.value = this._data.value;
            this.postEditor.visible = target.checked;
            this.mdEditor.visible = !target.checked;
            if (!this.postEditor.visible) {
                this.postEditor.onHide();
            }
        }
        _handleClick(event, stopPropagation) {
            this.pnlIcons.visible = true;
            if (this.isReplyToShown) {
                this.pnlReplyTo.visible = true;
                this.updateGrid();
            }
            return true;
        }
        // position={'absolute'} top={0} height={'100vh'} zIndex={999}
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            this.onSubmit = this.getAttribute('onSubmit', true) || this.onSubmit;
            this.onCancel = this.getAttribute('onCancel', true) || this.onCancel;
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
            this.isAttachmentDisabled = this.getAttribute('isAttachmentDisabled', true, false);
            if (mobile) {
                this.renderMobilePostComposer();
            }
            else {
                this.renderPostComposer();
            }
            this.setData({ isReplyToShown, replyTo, type, placeholder, buttonCaption });
            this.renderGifCate();
            this.renderEmojis();
            // if(this.autoFocus) {
            this.mdEditor.autofocus = this.autofocus;
            if (this.autoFocus)
                this.mdEditor.setFocus();
            // }
            // this.updateFocusedPost();
        }
        async handleMobileCloseComposer() {
            if (this.onCancel)
                await this.onCancel();
        }
        renderMobilePostComposer() {
            const elm = this.$render("i-panel", { cursor: 'default' },
                this.$render("i-hstack", { justifyContent: 'space-between', alignItems: 'center', padding: { left: '0.5rem', right: '0.5rem' }, position: 'fixed', top: 0, zIndex: 10, background: { color: '#000' }, width: '100%', border: { bottom: { width: '.5px', style: 'solid', color: Theme.divider } }, height: 50 },
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
                    this.$render("i-image", { id: "imgReplier", grid: { area: 'avatar' }, width: '2.75rem', height: '2.75rem', display: "block", background: { color: Theme.background.main }, border: { radius: '50%' }, overflow: 'hidden', margin: { top: '0.75rem' }, objectFit: 'cover', url: this._avatar, fallbackUrl: assets_1.default.fullPath('img/default_avatar.png') }),
                    this.$render("i-panel", { grid: { area: 'editor' }, maxHeight: '45rem', overflow: { x: 'hidden', y: 'auto' } },
                        this.$render("i-markdown-editor", { id: "mdEditor", width: "100%", viewer: false, hideModeSwitch: true, mode: "wysiwyg", toolbarItems: [], font: { size: '1.25rem', color: Theme.text.primary }, lineHeight: 1.5, padding: { top: 12, bottom: 12, left: 0, right: 0 }, background: { color: 'transparent' }, height: "auto", minHeight: 0, overflow: 'hidden', overflowWrap: "break-word", onChanged: this.onEditorChanged.bind(this), cursor: 'text', border: { style: 'none' }, visible: true }),
                        this.$render("i-scom-editor", { id: "postEditor", width: "100%", font: { size: '1.25rem', color: Theme.text.primary }, cursor: 'text', visible: false, onChanged: this.onEditorChanged.bind(this) })),
                    this.$render("i-hstack", { id: "pnlBorder", horizontalAlignment: "space-between", grid: { area: 'reply' }, padding: { top: '0.625rem' } },
                        this.$render("i-hstack", { id: "pnlIcons", gap: "4px", verticalAlignment: "center", visible: false },
                            this.$render("i-icon", { id: "iconMediaMobile", name: "image", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Media', placement: 'bottom' }, visible: !this.isAttachmentDisabled, enabled: !this.isAttachmentDisabled, onClick: this.onUpload.bind(this) }),
                            this.$render("i-icon", { name: "images", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'GIF', placement: 'bottom' }, onClick: () => this.onShowModal('mdGif') }),
                            this.$render("i-panel", null,
                                this.$render("i-icon", { name: "smile", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Emoji', placement: 'bottom' }, onClick: () => this.onShowModal('mdEmoji') }),
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
                            this.$render("i-switch", { id: "typeSwitch", height: 28, display: "inline-flex", grid: { verticalAlignment: 'center' }, tooltip: { content: 'Change editor', placement: 'bottom' }, uncheckedTrackColor: Theme.divider, checkedTrackColor: Theme.colors.primary.main, onChanged: this.onTypeChanged.bind(this) })))),
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
                        this.$render("i-hstack", { verticalAlignment: "center", height: 53, margin: { top: 8, bottom: 8 }, padding: { right: '1rem', left: '1rem' }, position: "sticky", zIndex: 2, top: '0px', background: { color: Theme.background.modal } },
                            this.$render("i-panel", { stack: { basis: '56px' } },
                                this.$render("i-icon", { id: "iconGif", name: "times", cursor: 'pointer', width: 20, height: 20, fill: Theme.colors.secondary.main, onClick: this.onIconGifClicked.bind(this) })),
                            this.$render("i-hstack", { verticalAlignment: "center", padding: { left: '0.75rem', right: '0.75rem' }, border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, minHeight: 40, width: '100%', background: { color: Theme.input.background }, gap: "4px" },
                                this.$render("i-icon", { width: 16, height: 16, name: 'search', fill: Theme.text.secondary }),
                                this.$render("i-input", { id: "inputGif", placeholder: 'Search for Gifs', width: '100%', height: '100%', captionWidth: '0px', border: { style: 'none' }, showClearButton: true, onClearClick: () => this.onToggleMainGif(true), onKeyUp: (target) => this.onGifSearch(target.value) }))),
                        this.$render("i-card-layout", { id: "gridGifCate", cardMinWidth: '18rem', cardHeight: '9.375rem' }),
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
            this.pnlPostComposer.append(this.$render("i-panel", { padding: { bottom: '0.75rem', top: '0.75rem' }, cursor: 'default' },
                this.$render("i-hstack", { id: "pnlReplyTo", visible: false, gap: "0.5rem", verticalAlignment: "center", padding: { top: '0.25rem', bottom: '0.75rem', left: '3.25rem' } },
                    this.$render("i-label", { caption: "Replying to", font: { size: '1rem', color: Theme.text.secondary } }),
                    this.$render("i-label", { id: "lbReplyTo", link: { href: '' }, font: { size: '1rem', color: Theme.colors.primary.main } })),
                this.$render("i-grid-layout", { id: "gridReply", gap: { column: '0.75rem' }, templateColumns: ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'], templateRows: ['auto'], templateAreas: [
                        ['avatar', 'editor'],
                        ['avatar', 'reply']
                    ] },
                    this.$render("i-image", { id: "imgReplier", grid: { area: 'avatar' }, width: '2.75rem', height: '2.75rem', display: "block", background: { color: Theme.background.main }, border: { radius: '50%' }, overflow: 'hidden', margin: { top: '0.75rem' }, objectFit: 'cover', url: this._avatar, fallbackUrl: assets_1.default.fullPath('img/default_avatar.png') }),
                    this.$render("i-panel", { grid: { area: 'editor' }, maxHeight: '45rem', overflow: { x: 'hidden', y: 'auto' } },
                        this.$render("i-markdown-editor", { id: "mdEditor", width: "100%", viewer: false, hideModeSwitch: true, mode: "wysiwyg", toolbarItems: [], font: { size: '1.25rem', color: Theme.text.primary }, lineHeight: 1.5, padding: { top: 12, bottom: 12, left: 0, right: 0 }, background: { color: 'transparent' }, height: "auto", minHeight: 0, overflow: 'hidden', overflowWrap: "break-word", onChanged: this.onEditorChanged.bind(this), cursor: 'text', border: { style: 'none' }, visible: true }),
                        this.$render("i-scom-editor", { id: "postEditor", width: "100%", font: { size: '1.25rem', color: Theme.text.primary }, cursor: 'text', visible: false, onChanged: this.onEditorChanged.bind(this) })),
                    this.$render("i-hstack", { id: "pnlBorder", horizontalAlignment: "space-between", grid: { area: 'reply' }, padding: { top: '0.625rem' } },
                        this.$render("i-hstack", { id: "pnlIcons", gap: "4px", verticalAlignment: "center", visible: false },
                            this.$render("i-icon", { id: "iconMediaMobile", name: "image", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Media', placement: 'bottom' }, visible: !this.isAttachmentDisabled, enabled: !this.isAttachmentDisabled, onClick: this.onUpload.bind(this) }),
                            this.$render("i-icon", { name: "images", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'GIF', placement: 'bottom' }, onClick: () => this.onShowModal('mdGif') }),
                            this.$render("i-panel", null,
                                this.$render("i-icon", { name: "smile", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'Emoji', placement: 'bottom' }, onClick: () => this.onShowModal('mdEmoji') }),
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
                            this.$render("i-switch", { id: "typeSwitch", height: 28, display: "inline-flex", grid: { verticalAlignment: 'center' }, tooltip: { content: 'Change editor', placement: 'bottom' }, uncheckedTrackColor: Theme.divider, checkedTrackColor: Theme.colors.primary.main, onChanged: this.onTypeChanged.bind(this) })),
                        this.$render("i-button", { id: "btnReply", height: 36, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '30px' }, enabled: false, margin: { left: 'auto' }, caption: "Post", onClick: this.onReply.bind(this) }))),
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
                        this.$render("i-hstack", { verticalAlignment: "center", height: 53, margin: { top: 8, bottom: 8 }, padding: { right: '1rem', left: '1rem' }, position: "sticky", zIndex: 2, top: '0px', background: { color: Theme.background.modal } },
                            this.$render("i-panel", { stack: { basis: '56px' } },
                                this.$render("i-icon", { id: "iconGif", name: "times", cursor: 'pointer', width: 20, height: 20, fill: Theme.colors.secondary.main, onClick: this.onIconGifClicked.bind(this) })),
                            this.$render("i-hstack", { verticalAlignment: "center", padding: { left: '0.75rem', right: '0.75rem' }, border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, minHeight: 40, width: '100%', background: { color: Theme.input.background }, gap: "4px" },
                                this.$render("i-icon", { width: 16, height: 16, name: 'search', fill: Theme.text.secondary }),
                                this.$render("i-input", { id: "inputGif", placeholder: 'Search for Gifs', width: '100%', height: '100%', captionWidth: '0px', border: { style: 'none' }, showClearButton: true, onClearClick: () => this.onToggleMainGif(true), onKeyUp: (target) => this.onGifSearch(target.value) }))),
                        this.$render("i-card-layout", { id: "gridGifCate", cardMinWidth: '18rem', cardHeight: '9.375rem' }),
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
            return (this.$render("i-panel", { id: 'pnlPostComposer' }));
        }
    };
    ScomPostComposer = __decorate([
        (0, components_3.customElements)('i-scom-post-composer')
    ], ScomPostComposer);
    exports.ScomPostComposer = ScomPostComposer;
});
