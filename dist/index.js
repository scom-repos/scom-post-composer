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
    exports.widgets = exports.chartWidgets = exports.getEmbedElement = exports.extractWidgetUrl = exports.getWidgetEmbedUrl = void 0;
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
        if (elm.ready)
            await elm.ready();
        const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf) => conf.target === 'Builders' || conf.target === 'Editor') : null;
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
    exports.chartWidgets = ['@scom/scom-pie-chart', '@scom/scom-line-chart', '@scom/scom-bar-chart', '@scom/scom-area-chart', '@scom/scom-mixed-chart', '@scom/scom-scatter-chart', '@scom/scom-counter'];
    exports.widgets = [
        {
            name: exports.chartWidgets,
            icon: { name: 'chart-line' },
            title: '$chart',
            description: '$insert_a_chart_widget',
            disabled: true
        },
        {
            name: '@scom/scom-swap',
            icon: { name: 'exchange-alt' },
            title: '$swap',
            description: '$insert_a_swap_widget',
            isDevOnly: true
        },
        {
            name: '@scom/scom-staking',
            icon: { name: 'hand-holding-usd' },
            title: '$staking',
            description: '$insert_a_staking_widget',
            disabled: true
        },
        {
            name: '@scom/scom-xchain-widget',
            icon: { name: 'exchange-alt' },
            title: '$xchain',
            description: '$insert_an_xchain_widget',
            disabled: true
        },
        {
            name: '@scom/scom-voting',
            icon: { name: 'vote-yea' },
            title: '$voting',
            description: '$insert_a_voting_widget',
            disabled: true
        },
        {
            name: '@scom/scom-nft-minter',
            icon: { name: 'gavel' },
            title: '$create_membership_nft',
            description: '$create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities',
            note: '$will_only_work_after_a_successful_transaction',
            configuratorCustomData: 'new1155',
            isDevOnly: true
        },
        {
            name: '@scom/scom-nft-minter',
            icon: { name: 'gavel' },
            title: '$existing_membership_nft',
            description: '$mint_a_membership_nft_for_gated_communities',
            configuratorCustomData: 'customNft',
            isDevOnly: true
        },
        {
            name: '@scom/oswap-nft-widget',
            icon: { name: 'campground' },
            title: '$oswap_troll_nft',
            description: '$mint_a_membership_nft_for_openswap_community',
            disabled: true
        },
        {
            name: '@scom/scom-video',
            icon: { name: 'video' },
            title: '$youtube_video',
            description: '$embeded_youtube_video',
            configuratorCustomData: "defaultLinkYoutube"
        },
        {
            name: '@scom/scom-video',
            icon: { name: 'video' },
            title: '$video_file',
            description: '$mp4_or_mov_file',
            configuratorCustomData: "defaultLinkMp4"
        },
        {
            name: '@scom/scom-image',
            icon: { name: 'image' },
            title: '$image',
            description: '$insert_an_image',
            isDevOnly: true
        },
        {
            name: '@scom/scom-twitter-post',
            icon: { image: { url: assets_1.default.fullPath('img/twitter.svg'), width: '100%', height: '100%', display: 'inline-block' } },
            title: 'X',
            description: '$insert_an_x_post'
        },
        {
            name: '@scom/scom-product',
            icon: { name: 'box-open' },
            title: '$product',
            description: '$embed_community_product',
            isDevOnly: true
        }
    ];
});
define("@scom/scom-post-composer/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-post-composer/translations.json.ts'/> 
    exports.default = {
        en: {
            "anyone_on_or_off_nostr": "Anyone on or off Nostr",
            "are_you_sure": "Are you sure?",
            "auto_play_gifs": "Auto-play GIFs",
            "cancel": "Cancel",
            "chart": "Chart",
            "confirm": "Confirm",
            "create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities": "Create a new NFT index to Mint a membership NFT for gated communities",
            "create_membership_nft": "Create Membership NFT",
            "do_you_really_want_to_delete_this_widget": "Do you really want to delete this widget?",
            "embeded_youtube_video": "Embeded YouTube video",
            "emoji": "Emoji",
            "enter_url": "Enter URL",
            "excessed_max_post_size": "Excessed max post size!",
            "existing_membership_nft": "Existing Membership NFT",
            "failed_to": "Failed to {{action}}",
            "image": "Image",
            "in_order_to_please_confirm_the_upload_of_your_media_to_ipfs": "In order to {{action}}, please confirm the upload of your media to IPFS?",
            "insert_a_chart_widget": "Insert a chart widget",
            "insert_a_staking_widget": "Insert a staking widget",
            "insert_a_swap_widget": "Insert a swap widget",
            "insert_a_voting_widget": "Insert a voting widget",
            "insert_an_image": "Insert an image",
            "insert_an_x_post": "Insert an X post",
            "insert_an_xchain_widget": "Insert an xchain widget",
            "media": "Media",
            "members_of_the_community": "Members of the community",
            "members": "Members",
            "mint_a_membership_nft_for_gated_communities": "Mint a membership NFT for gated communities",
            "mint_a_membership_nft_for_openswap_community": "Mint a membership NFT for OpenSwap community",
            "mp4_or_mov_file": ".mp4 or .mov file",
            "oswap_troll_nft": "Oswap Troll NFT",
            "post": "Post",
            "public": "Public",
            "reply": "Reply",
            "replying_to": "Replying to",
            "Search_for_GIFs": "Search for GIFs",
            "something_went_wrong_when_uploading_your_media_to_ipfs": "Something went wrong when uploading your media to IPFS!",
            "staking": "Staking",
            "swap": "Swap",
            "this_preview_will_update_real_time_as_the_config_on_the_right_changes": "This preview will update real-time as the config on the right changes",
            "type": "Type",
            "video_file": "Video file",
            "voting": "Voting",
            "widget_preview": "Widget Preview",
            "widgets": "Widgets",
            "will_only_work_after_a_successful_transaction": "Will only work after a successful transaction",
            "xchain": "Xchain",
            "your_quota_insufficient_for_ipfs_media_upload": "Your quota insufficient for IPFS media upload!",
            "youtube_video": "YouTube Video",
            "product": "Product",
            "embed_community_product": "Embed community product"
        },
        "zh-hant": {
            "anyone_on_or_off_nostr": "任何人在Nostr上或關閉",
            "are_you_sure": "你確定嗎？",
            "auto_play_gifs": "自動播放GIF",
            "cancel": "取消",
            "chart": "圖表",
            "confirm": "確認",
            "create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities": "創建一個新的NFT索引以為有門控社區的會員NFT鑄造",
            "create_membership_nft": "創建會員NFT",
            "do_you_really_want_to_delete_this_widget": "您真的要刪除這個小部件嗎？",
            "embeded_youtube_video": "嵌入YouTube視頻",
            "emoji": "表情符號",
            "enter_url": "輸入網址",
            "excessed_max_post_size": "超過最大帖子大小！",
            "existing_membership_nft": "現有會員NFT",
            "failed_to": "無法{{action}}",
            "image": "圖片",
            "in_order_to_please_confirm_the_upload_of_your_media_to_ipfs": "為了{{action}}，請確認將您的媒體上傳到IPFS？",
            "insert_a_chart_widget": "插入圖表小部件",
            "insert_a_staking_widget": "插入質押小部件",
            "insert_a_swap_widget": "插入交換小部件",
            "insert_a_voting_widget": "插入投票小部件",
            "insert_an_image": "插入圖片",
            "insert_an_x_post": "插入X帖子",
            "insert_an_xchain_widget": "插入xchain小部件",
            "media": "媒體",
            "members_of_the_community": "社區成員",
            "members": "成員",
            "mint_a_membership_nft_for_gated_communities": "為有門控社區鑄造會員NFT",
            "mint_a_membership_nft_for_openswap_community": "為OpenSwap社區鑄造會員NFT",
            "mp4_or_mov_file": ".mp4或.mov文件",
            "oswap_troll_nft": "Oswap Troll NFT",
            "post": "發布",
            "public": "公開",
            "reply": "回覆",
            "replying_to": "回覆",
            "Search_for_GIFs": "搜索GIF",
            "something_went_wrong_when_uploading_your_media_to_ipfs": "上傳媒體到IPFS時出錯！",
            "staking": "質押",
            "swap": "交換",
            "this_preview_will_update_real_time_as_the_config_on_the_right_changes": "此預覽將實時更新，因為右側的配置更改",
            "type": "類型",
            "video_file": "視頻文件",
            "voting": "投票",
            "widget_preview": "小部件預覽",
            "widgets": "小部件",
            "will_only_work_after_a_successful_transaction": "僅在成功交易後才能使用",
            "xchain": "X鏈",
            "your_quota_insufficient_for_ipfs_media_upload": "您的配額不足以上傳IPFS媒體！",
            "youtube_video": "YouTube視頻",
            "product": "產品",
            "embed_community_product": "嵌入社群產品"
        },
        "vi": {
            "anyone_on_or_off_nostr": "Bất kỳ ai trên hoặc ngoài Nostr",
            "are_you_sure": "Bạn có chắc chắn không?",
            "auto_play_gifs": "Tự động chạy GIF",
            "cancel": "Hủy",
            "chart": "Biểu đồ",
            "config": "Cấu hình",
            "confirm": "Xác nhận",
            "create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities": "Tạo chỉ mục NFT mới để đúc NFT thành viên cho các cộng đồng có kiểm soát",
            "create_membership_nft": "Tạo NFT Thành Viên",
            "do_you_really_want_to_delete_this_widget": "Bạn có chắc chắn muốn xóa tiện ích này không?",
            "embeded_youtube_video": "Nhúng Youtube video",
            "emoji": "Biểu tượng",
            "enter_url": "Nhập URL",
            "excessed_max_post_size": "Vượt quá kích thước tối đa của bài đăng!",
            "existing_membership_nft": "NFT Thành Viên Hiện Có",
            "failed_to": "Thất bại khi {{action}}",
            "image": "Hình ảnh",
            "in_order_to_please_confirm_the_upload_of_your_media_to_ipfs": "Để {{action}}, xin hãy xác nhận để tải phương tiện lên IPFS?",
            "insert_a_chart_widget": "Chèn tiện ích biểu đồ",
            "insert_a_staking_widget": "Chèn tiện ích staking",
            "insert_a_swap_widget": "Chèn tiện ích hoán đổi",
            "insert_a_voting_widget": "Chèn tiện ích bình chọn",
            "insert_an_image": "Chèn hình ảnh",
            "insert_an_x_post": "Chèn bài đăng X",
            "insert_an_xchain_widget": "Chèn tiện ích xchain",
            "media": "Phương tiện",
            "members_of_the_community": "Thành viên cộng đồng",
            "members": "Thành viên",
            "mint_a_membership_nft_for_gated_communities": "Đúc NFT thành viên cho các cộng đồng có kiểm soát",
            "mint_a_membership_nft_for_openswap_community": "Đúc NFT Thành Viên cho cộng đồng OpenSwap",
            "mp4_or_mov_file": "Tệp .mp4 hoặc .mov",
            "oswap_troll_nft": "NFT Troll OSwap",
            "post": "Đăng",
            "public": "Công khai",
            "reply": "Phản hồi",
            "replying_to": "Phản hồi đến",
            "Search_for_GIFs": "Tìm kiếm GIF",
            "something_went_wrong_when_uploading_your_media_to_ipfs": "Có lỗi khi tải phương tiện lên IPFS!",
            "staking": "Staking",
            "swap": "Hoán đổi",
            "this_preview_will_update_real_time_as_the_config_on_the_right_changes": "Xem trước sẽ cập nhật đồng bộ theo cấu hình bên phải",
            "type": "Loại",
            "video_file": "Tệp video",
            "voting": "Bình chọn",
            "widget_preview": "Xem trước tiện ích",
            "widgets": "Tiện ích",
            "will_only_work_after_a_successful_transaction": "Sẽ hoạt động sau khi thực hiện giao dịch thành công",
            "xchain": "Xchain",
            "your_quota_insufficient_for_ipfs_media_upload": "Dung lượng của bạn không đủ để tải phương tiện lên IPFS!",
            "youtube_video": "Youtube video",
            "product": "Sản phẩm",
            "embed_community_product": "Nhúng sản phẩm cộng đồng"
        }
    };
});
define("@scom/scom-post-composer/components/form.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/translations.json.ts"], function (require, exports, components_3, translations_json_1) {
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
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            const onConfirm = this.getAttribute('onConfirm', true);
            const url = this.getAttribute('url', true);
            if (onConfirm)
                this.setData({ onConfirm, url });
        }
        render() {
            return (this.$render("i-vstack", { gap: "1rem", padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                this.$render("i-input", { id: "inputUrl", placeholder: '$enter_url', width: '100%', height: '2rem', border: { radius: '0.5rem' }, padding: { left: '0.5rem', right: '0.5rem' }, onChanged: this.onInputChanged }),
                this.$render("i-hstack", { horizontalAlignment: 'end' },
                    this.$render("i-panel", null,
                        this.$render("i-button", { id: "btnSubmit", height: 36, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '0.5rem' }, enabled: false, caption: "$confirm", onClick: this.onFormSubmit })))));
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
    exports.alertStyle = exports.widgetPreviewStyle = exports.formStyle = exports.modalStyle = void 0;
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
    exports.alertStyle = components_4.Styles.style({
        $nest: {
            'i-vstack i-label': {
                textAlign: 'center'
            }
        }
    });
});
define("@scom/scom-post-composer/components/widgets.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/global/index.ts", "@scom/scom-post-composer/index.css.ts", "@scom/scom-post-composer/translations.json.ts"], function (require, exports, components_5, global_1, index_css_1, translations_json_2) {
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
        get env() {
            return this._env;
        }
        set env(value) {
            if (this._env !== value) {
                this._env = value;
                this.renderWidgets();
            }
        }
        init() {
            this.i18n.init({ ...translations_json_2.default });
            super.init();
            this.onTypeChanged = this.onTypeChanged.bind(this);
            this.onConfirm = this.getAttribute('onConfirm', true) || this.onConfirm;
            this.onUpdate = this.getAttribute('onUpdate', true) || this.onUpdate;
            this.onCloseButtonClick = this.getAttribute('onCloseButtonClick', true) || this.onCloseButtonClick;
            this.onRefresh = this.getAttribute('onRefresh', true) || this.onRefresh;
            const env = this.getAttribute('env', true);
            if (env)
                this._env = env;
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
            const isDevEnv = this._env === 'dev';
            const _widgets = global_1.widgets.filter(v => !(v.disabled || (v.isDevOnly && !isDevEnv)));
            this.pnlWidgets.clearInnerHTML();
            for (let widget of _widgets) {
                const icon = new components_5.Icon(undefined, { ...widget.icon, width: '1rem', height: '1rem' });
                this.pnlWidgets.appendChild(this.$render("i-stack", { direction: "horizontal", width: "100%", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, border: { radius: '0.375rem' }, alignItems: "center", justifyContent: "space-between", hover: {
                        backgroundColor: Theme.action.activeBackground
                    }, cursor: "pointer", onClick: () => this.handleWidgetClick(widget) },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "1rem" },
                        icon,
                        this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                            this.$render("i-label", { caption: widget.title, font: { size: '0.875rem', weight: 500 } }),
                            this.$render("i-label", { caption: widget.description, font: { size: '0.75rem', weight: 400 } })))));
            }
        }
        handleWidgetClick(widget) {
            let widgetData;
            if (widget.name === '@scom/scom-product') {
                if (location.hash.startsWith('#!/c/')) {
                    const parts = location.hash.slice(5).split('/');
                    const communityId = parts[0];
                    const creatorId = parts[1];
                    if (communityId && creatorId) {
                        widgetData = {
                            data: {
                                config: {
                                    creatorId: creatorId,
                                    communityId: communityId
                                }
                            },
                            url: undefined
                        };
                    }
                }
                else if (location.hash.startsWith('#!/n/') && components_5.application.store?.ensMap) {
                    const parts = location.hash.slice(5).split('/');
                    const name = parts[0];
                    if (name) {
                        const value = components_5.application.store.ensMap[name];
                        if (value) {
                            const ids = value.split('/');
                            const isCommunity = ids.length > 1;
                            if (isCommunity) {
                                widgetData = {
                                    data: {
                                        config: {
                                            creatorId: ids[1],
                                            communityId: ids[0]
                                        }
                                    },
                                    url: undefined
                                };
                            }
                        }
                    }
                }
            }
            this.selectWidget(widget, widgetData);
        }
        back() {
            this.lblTitle.caption = this.i18n.get('$widgets');
            this.iconBack.visible = false;
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
            this.selectWidget({ title: this.i18n.get('$config'), name: moduleName }, { data, url });
            this.iconBack.visible = false;
        }
        async renderForm(module, note, widgetType, widgetData) {
            this.widgetWrapper.clearInnerHTML();
            this.pnlWidgetWrapper.visible = false;
            this.pnlCustomForm.clearInnerHTML();
            this.pnlCustomForm.visible = false;
            this.actionForm.visible = false;
            if (Array.isArray(module)) {
                this.pnlConfig.templateColumns = ['100%'];
                const items = module.map(type => ({ value: type, label: type.split('-')[1] }));
                this.pnlCustomForm.appendChild(this.$render("i-stack", { direction: "vertical", width: "100%", gap: "0.625rem" },
                    this.$render("i-label", { caption: "$type" }),
                    this.$render("i-combo-box", { id: "cbType", items: items, width: '100%', height: '2.625rem', onChanged: this.onTypeChanged })));
                this.pnlCustomForm.visible = true;
            }
            else {
                this.pnlConfig.templateColumns = innerWidth > 768 ? ['50%', '50%'] : ['100%'];
                await this.loadWidgetConfig(module, note, widgetType, widgetData);
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
        async loadWidgetConfig(module, note, configuratorCustomData, widgetData) {
            const { data, url } = widgetData || {};
            this.currentUrl = url;
            this.pnlWidgetWrapper.visible = false;
            this.lbNotePreview.visible = !!note;
            this.lbNotePreview.caption = note || '';
            const elm = await components_5.application.createElement(module);
            this.pnlWidgetWrapper.visible = true;
            this.widgetWrapper.clearInnerHTML();
            this.widgetWrapper.appendChild(elm);
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
                                caption: '$confirm',
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
            this.pnlWidgets.visible = false;
            this.pnlConfig.visible = true;
            this.pnlLoading.visible = true;
            await this.renderForm(widget.name, widget.note, widget.configuratorCustomData, widgetData);
            this.pnlLoading.visible = false;
            if (this.onRefresh)
                this.onRefresh(Array.isArray(widget.name) ? '50rem' : '90rem');
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, gap: "1rem" },
                this.$render("i-stack", { direction: "horizontal", alignItems: "center", justifyContent: "space-between", padding: { left: '0.5rem', right: '0.5rem' }, gap: "0.5rem" },
                    this.$render("i-stack", { direction: "horizontal", alignItems: "center", gap: "0.5rem" },
                        this.$render("i-icon", { id: "iconBack", width: "1rem", height: "1rem", name: "arrow-left", fill: Theme.colors.primary.main, onClick: this.back, cursor: "pointer", visible: false }),
                        this.$render("i-label", { id: "lblTitle", caption: "$widgets", font: { size: '1.125rem', color: Theme.colors.primary.main } })),
                    this.$render("i-icon", { width: "1rem", height: "1rem", name: "times", fill: Theme.colors.primary.main, onClick: this.handleCloseButtonClick, cursor: "pointer" })),
                this.$render("i-stack", { id: "pnlWidgets", direction: "vertical", gap: "0.5rem" }),
                this.$render("i-grid-layout", { id: "pnlConfig", visible: false, gap: { column: '0.5rem' }, templateColumns: ['50%', '50%'], mediaQueries: [
                        {
                            maxWidth: '768px',
                            properties: {
                                templateColumns: ['100%']
                            }
                        }
                    ] },
                    this.$render("i-vstack", { id: "pnlWidgetWrapper", gap: "0.25rem", horizontalAlignment: "center" },
                        this.$render("i-label", { id: "lbWTitle", caption: "$widget_preview", font: { color: Theme.colors.primary.main, size: '1rem', bold: true } }),
                        this.$render("i-label", { id: "lbWDesc", caption: "$this_preview_will_update_real_time_as_the_config_on_the_right_changes", font: { size: '0.75rem' }, opacity: 0.75 }),
                        this.$render("i-label", { id: "lbNotePreview", visible: false, font: { color: Theme.colors.error.main, size: '0.75rem' } }),
                        this.$render("i-panel", { id: "widgetWrapper" })),
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
define("@scom/scom-post-composer", ["require", "exports", "@ijstech/components", "@scom/scom-post-composer/global/index.ts", "@scom/scom-post-composer/assets.ts", "@scom/scom-post-composer/components/index.ts", "@scom/scom-post-composer/index.css.ts", "@scom/scom-storage", "@scom/scom-gif-picker", "@scom/scom-post-composer/translations.json.ts"], function (require, exports, components_6, index_1, assets_2, index_2, index_css_2, scom_storage_1, scom_gif_picker_1, translations_json_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPostComposer = void 0;
    const Theme = components_6.Styles.Theme.ThemeVars;
    const MAX_SIZE = 232003; // characters (~226kb)
    const regexImage = /!\[.*?\]\(data:image\/[^;]+;base64,([^)]+)\)/g;
    const PostAudience = [
        {
            title: '$public',
            icon: 'globe-americas',
            desc: '$anyone_on_or_off_nostr',
            value: 'public'
        },
        {
            title: '$members',
            icon: 'user-friends',
            desc: '$members_of_the_community',
            value: 'members'
        }
    ];
    let ScomPostComposer = class ScomPostComposer extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.newReply = [];
            this.gifCateInitState = 0;
            this._isPostAudienceShown = false;
            this.audience = PostAudience[1];
            this._hasQuota = false;
            this.onUpload = this.onUpload.bind(this);
            this.showStorage = this.showStorage.bind(this);
            this.onShowGifModal = this.onShowGifModal.bind(this);
            this.onGifSelected = this.onGifSelected.bind(this);
            this.onShowWidgets = this.onShowWidgets.bind(this);
            this.onShowDeleteWidget = this.onShowDeleteWidget.bind(this);
            this.handleSelectedEmoji = this.handleSelectedEmoji.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        setFocus() {
            this.mdEditor.setFocus();
        }
        get env() {
            return this._env;
        }
        set env(value) {
            this._env = value;
            if (this.widgetModule)
                this.widgetModule.env = value;
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
            if (this.mdEditor)
                this.mdEditor.placeholder = this.placeholder;
        }
        get buttonCaption() {
            return this._data.buttonCaption ?? '';
        }
        set buttonCaption(value) {
            this._data.buttonCaption = value ?? '';
            if (this.btnReply)
                this.btnReply.caption = this.buttonCaption;
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
        }
        resetEditor() {
            if (this.mdEditor) {
                this.mdEditor.value = '';
            }
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
            this.btnReply.enabled = !this.isSubmitting && !!this._data.value;
            if (this.onChanged)
                this.onChanged(this._data.value);
        }
        extractImageMimeType(dataString) {
            const startIndex = dataString.indexOf('data:') + 5;
            const mimeType = dataString.substring(startIndex, dataString.indexOf(';', startIndex));
            return mimeType;
        }
        async extractImageMarkdown(text) {
            let base64List = text.match(regexImage) || [];
            let imageList = [];
            const files = [];
            if (!base64List.length) {
                return [];
            }
            if (!this.hasQuota) {
                this.errorMessage = '$your_quota_insufficient_for_ipfs_media_upload';
                return [];
            }
            if (!this.storageEl) {
                this.storageEl = scom_storage_1.ScomStorage.getInstance();
                this.storageEl.onCancel = () => this.storageEl.closeModal();
            }
            let fileId = 1;
            const genFileId = () => Date.now() + fileId++;
            for (const base64 of base64List) {
                let fileName = `image-${(0, components_6.moment)(new Date()).format('YYYYMMDDhhmmssSSS')}.png`;
                imageList.push({
                    fileName,
                    base64
                });
                let base64Image = base64.match(/data:image\/[^;]+;base64,([^)]+)/)[1];
                let byteCharacters = atob(base64Image);
                let byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                let byteArray = new Uint8Array(byteNumbers);
                let type = this.extractImageMimeType(base64);
                let file = new File([byteArray], fileName, { type });
                file.path = `/${fileName}`;
                file.cid = await components_6.IPFS.hashFile(file);
                file.uid = genFileId();
                files.push(file);
            }
            const data = await this.storageEl.uploadFiles(files);
            if (!data.length || data.length < files.length) {
                this.errorMessage = '$something_went_wrong_when_uploading_your_media_to_ipfs';
                return [];
            }
            imageList = imageList.map(img => {
                const fileInfo = data.find(v => v.fileName === img.fileName);
                return {
                    ...img,
                    path: fileInfo?.path || ''
                };
            });
            return imageList;
        }
        async replaceBase64WithLinks(text) {
            if (!text)
                return text;
            const imageList = await this.extractImageMarkdown(text);
            if (!imageList.length)
                return text;
            let replacedBase64 = text.replace(regexImage, function (match) {
                let image = imageList.find(v => v.base64 === match);
                if (image && image.path) {
                    return `![](${image.path})`;
                }
                return '';
            });
            return replacedBase64;
        }
        updateSubmittingStatus(status) {
            this.isSubmitting = status;
            this.btnReply.rightIcon.spin = status;
            this.btnReply.rightIcon.visible = status;
            this.btnReply.enabled = !status && !!this._data.value;
            const icons = [
                this.iconMediaMobile,
                this.iconGif,
                this.iconEmoji,
                this.iconWidget
            ];
            for (const icon of icons) {
                if (icon) {
                    icon.enabled = !status;
                    icon.cursor = status ? 'not-allowed' : 'pointer';
                }
            }
        }
        showAlert(status, title, content, onConfirm) {
            this.mdAlert.status = status;
            this.mdAlert.title = title;
            this.mdAlert.content = content;
            this.mdAlert.onConfirm = () => onConfirm ? onConfirm() : {};
            this.mdAlert.showModal();
        }
        async onReply() {
            if (!this._data.value)
                return;
            if (this.onSubmit) {
                this._data.value = this.updatedValue;
                let extractedText = this._data.value.replace(/\$\$widget0\s+(.*?)\$\$/g, '$1');
                this.updateSubmittingStatus(true);
                const action = (this.buttonCaption || 'post').toLowerCase();
                if (this.needToUploadMedia) {
                    this.needToUploadMedia = false;
                    extractedText = await this.replaceBase64WithLinks(extractedText);
                    if (this.errorMessage) {
                        this.showAlert('error', `Failed to ${action}`, this.errorMessage, () => { });
                        this.updateSubmittingStatus(false);
                        return;
                    }
                }
                else if (extractedText.length > MAX_SIZE) {
                    const base64List = extractedText.match(regexImage) || [];
                    if (base64List.length) {
                        this.showAlert('confirm', this.i18n.get('$excessed_max_post_size'), this.i18n.get("$in_order_to_please_confirm_the_upload_of_your_media_to_ipfs", { action }), () => {
                            this.needToUploadMedia = true;
                            this.onReply();
                        });
                    }
                    else {
                        this.showAlert('error', this.i18n.get('$failed_to', { action }), this.i18n.get('$excessed_max_post_size'), () => { });
                    }
                    this.updateSubmittingStatus(false);
                    return;
                }
                const plainText = extractedText.replace(/!\[(.*?)]\((https?:\/\/\S+)\)/g, function (match, p1, p2) {
                    return p2 || p1;
                });
                this.onSubmit(plainText, [...this.newReply]);
            }
            this.resetEditor();
            this.updateSubmittingStatus(false);
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
            if (!this.gifPicker) {
                this.gifPicker = new scom_gif_picker_1.ScomGifPicker(undefined, {
                    onGifSelected: this.onGifSelected
                });
            }
            const modal = this.gifPicker.openModal({
                border: { radius: '1rem' },
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: { y: 'auto' },
                padding: { top: 0, right: 0, left: 0, bottom: 0 },
                mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            showBackdrop: true,
                            popupPlacement: 'top',
                            zIndex: 999,
                            maxHeight: '100dvh',
                            maxWidth: '100%',
                            height: '100%',
                            width: '100%',
                            border: { radius: 0 }
                        }
                    }
                ],
                onClose: () => {
                    this.gifPicker.clear();
                    if (this.refreshTimer)
                        clearTimeout(this.refreshTimer);
                }
            });
            this.gifPicker.show();
            this.refreshTimer = setTimeout(() => {
                modal.refresh();
            }, 1000);
        }
        onGifSelected(gif) {
            this.gifPicker.closeModal();
            const imgMd = `\n![${gif.title || ""}](${gif.images.fixed_height.url})\n`;
            this.value = this.updatedValue + imgMd;
            if (!this.btnReply.enabled)
                this.btnReply.enabled = true;
        }
        renderActions() {
            const actions = [
                {
                    caption: '$copy_note_link',
                    icon: { name: 'copy' },
                    tooltip: '$the_link_has_been_copied_successfully',
                    onClick: (e) => {
                        if (typeof this.currentPostData !== 'undefined') {
                            components_6.application.copyToClipboard(`${window.location.origin}/#!/e/${this.currentPostData.id}`);
                        }
                        this.mdPostActions.visible = false;
                    }
                },
                {
                    caption: '$copy_note_text',
                    icon: { name: 'copy' },
                    tooltip: '$the_text_has_been_copied_successfully',
                    onClick: (e) => {
                        components_6.application.copyToClipboard(this.currentPostData['eventData']?.content);
                        this.mdPostActions.visible = false;
                    }
                },
                {
                    caption: '$copy_note_id',
                    icon: { name: 'copy' },
                    tooltip: '$the_id_has_been_copied_successfully',
                    onClick: (e) => {
                        if (typeof this.currentPostData !== 'undefined') {
                            components_6.application.copyToClipboard(this.currentPostData.id);
                        }
                        this.mdPostActions.visible = false;
                    }
                },
                {
                    caption: '$copy_raw_data',
                    icon: { name: 'copy' },
                    tooltip: '$the_raw_data_has_been_copied_successfully',
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
                    caption: '$copy_user_public_key',
                    icon: { name: 'copy' },
                    tooltip: '$the_public_key_has_been_copied_successfully',
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
                this.$render("i-button", { caption: '$cancel', width: "100%", minHeight: 44, padding: { left: 16, right: 16 }, font: { color: Theme.text.primary, weight: 600 }, border: { radius: '30px', width: '1px', style: 'solid', color: Theme.colors.secondary.light }, grid: { horizontalAlignment: 'center' }, background: { color: 'transparent' }, boxShadow: "none", onClick: () => this.onCloseModal('mdPostActions') })));
        }
        async handleSelectedEmoji(value) {
            this.value = this.updatedValue + value;
        }
        onEmojiMdOpen() {
            this.emojiPicker.clearSearch();
            this.mdEmoji.refresh();
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
                    this.mdEditor.value = this.updatedValue + '\n\n' + `![${path.split('/').pop()}](${path})` + '\n\n';
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
                    this.mdEditor.value = this.updatedValue + '\n\n' + `![${path.split('/').pop()}](${path})` + '\n\n';
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
                    env: this._env,
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
                width: window.matchMedia('(max-width: 767px)').matches ? '100vdw' : '90%',
                maxWidth: '50rem',
                padding: { top: 0, bottom: 0, left: 0, right: 0 },
                popupPlacement: 'top',
                closeOnBackdropClick: true,
                closeIcon: null,
                mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            width: '100dvw',
                            maxWidth: '100dvw',
                            height: '100dvh',
                            maxHeight: '100dvh',
                            overflow: { y: 'auto' }
                        }
                    }
                ]
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
                alert.status = 'confirm';
                alert.title = '$are_you_sure';
                alert.content = '$do_you_really_want_to_delete_this_widget';
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
            this.i18n.init({ ...translations_json_3.default });
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
            const env = this.getAttribute('env', true);
            if (env)
                this._env = env;
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
                    this.$render("i-button", { caption: "$cancel", onClick: this.handleMobileCloseComposer.bind(this), padding: { left: 5, right: 5, top: 5, bottom: 5 }, font: { size: Theme.typography.fontSize }, background: { color: 'transparent' } }),
                    this.$render("i-button", { id: "btnReply", caption: "$post", enabled: false, onClick: this.onReply.bind(this), padding: { left: '1rem', right: '1rem' }, height: 36, background: { color: Theme.colors.primary.main }, font: { size: Theme.typography.fontSize, color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '30px' } })),
                this.$render("i-hstack", { id: "pnlReplyTo", visible: false, gap: "0.5rem", verticalAlignment: "center", padding: { top: '0.25rem', bottom: '0.75rem', left: '3.25rem' } },
                    this.$render("i-label", { caption: "$replying_to", font: { size: '1rem', color: Theme.text.secondary } }),
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
                            this.$render("i-icon", { id: "iconMediaMobile", name: "image", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: '$media', placement: 'bottom' }, cursor: "pointer", onClick: this.showStorage }),
                            this.$render("i-icon", { id: "iconGif", name: "images", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'GIF', placement: 'bottom' }, cursor: "pointer", onClick: this.onShowGifModal }),
                            this.$render("i-panel", null,
                                this.$render("i-icon", { id: "iconEmoji", name: "smile", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: '$emoji', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowModal('mdEmoji') }),
                                this.$render("i-modal", { id: "mdEmoji", maxWidth: '100%', minWidth: 320, popupPlacement: 'bottomLeft', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, closeOnScrollChildFixed: true, onOpen: this.onEmojiMdOpen.bind(this), visible: false },
                                    this.$render("i-scom-emoji-picker", { id: "emojiPicker", onEmojiSelected: this.handleSelectedEmoji }))),
                            this.$render("i-icon", { id: "iconWidget", width: 28, height: 28, name: "shapes", fill: Theme.colors.primary.main, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: '$widgets', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowWidgets() })),
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
                    this.$render("i-vstack", { id: "pnlActions", minWidth: 0, maxHeight: '27.5rem', overflow: { y: 'auto' } })));
            this.pnlPostComposer.append(elm);
        }
        renderPostComposer() {
            const pnlPostAudiences = this.renderPostAudiences();
            this.pnlPostComposer.append(this.$render("i-panel", { padding: { bottom: '0.75rem', top: '0.75rem' }, cursor: 'default' },
                this.$render("i-hstack", { id: "pnlReplyTo", visible: false, gap: "0.5rem", verticalAlignment: "center", padding: { top: '0.25rem', bottom: '0.75rem', left: '3.25rem' } },
                    this.$render("i-label", { caption: "$replying_to", font: { size: '1rem', color: Theme.text.secondary } }),
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
                            this.$render("i-icon", { id: "iconMediaMobile", name: "image", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: '$media', placement: 'bottom' }, cursor: "pointer", onClick: this.showStorage }),
                            this.$render("i-icon", { id: "iconGif", name: "images", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: 'GIF', placement: 'bottom' }, cursor: "pointer", onClick: this.onShowGifModal }),
                            this.$render("i-panel", null,
                                this.$render("i-icon", { id: "iconEmoji", name: "smile", width: 28, height: 28, fill: Theme.colors.primary.main, border: { radius: '50%' }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: '$emoji', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowModal('mdEmoji') }),
                                this.$render("i-modal", { id: "mdEmoji", maxWidth: '100%', minWidth: 320, popupPlacement: 'bottomLeft', showBackdrop: false, border: { radius: '1rem' }, boxShadow: 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px', padding: { top: 0, left: 0, right: 0, bottom: 0 }, closeOnScrollChildFixed: true, onOpen: this.onEmojiMdOpen.bind(this), visible: false },
                                    this.$render("i-scom-emoji-picker", { id: "emojiPicker", onEmojiSelected: this.handleSelectedEmoji }))),
                            this.$render("i-icon", { id: "iconWidget", width: 28, height: 28, name: "shapes", fill: Theme.colors.primary.main, padding: { top: 5, bottom: 5, left: 5, right: 5 }, tooltip: { content: '$widgets', placement: 'bottom' }, cursor: "pointer", onClick: () => this.onShowWidgets() })),
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", justifyContent: "end", gap: "0.5rem" },
                            this.$render("i-panel", null,
                                this.$render("i-button", { id: "btnPostAudience", height: 32, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.secondary.main }, font: { color: Theme.colors.secondary.contrastText, bold: true }, border: { radius: '0.375rem' }, caption: this.audience.title, icon: { width: 14, height: 14, name: this.audience.icon, fill: Theme.colors.secondary.contrastText }, rightIcon: { width: 14, height: 14, name: 'angle-down', fill: Theme.colors.secondary.contrastText }, visible: this.isPostAudienceShown, onClick: this.showPostAudienceModal.bind(this) }),
                                this.$render("i-modal", { id: "mdPostAudience", maxWidth: '15rem', minWidth: '12.25rem', maxHeight: '27.5rem', popupPlacement: 'bottomRight', showBackdrop: false, border: { radius: '0.5rem' }, boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px", padding: { top: 0, bottom: 0, left: 0, right: 0 }, overflow: { y: 'hidden' }, visible: false }, pnlPostAudiences)),
                            this.$render("i-button", { id: "btnReply", height: 36, padding: { left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, bold: true }, border: { radius: '30px' }, enabled: false, caption: "$post", onClick: this.onReply.bind(this) }))))));
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlPostComposer' },
                this.$render("i-alert", { id: "mdAlert", status: "confirm", title: "$are_you_sure", content: "$do_you_really_want_to_delete_this_widget", class: index_css_2.alertStyle })));
        }
    };
    ScomPostComposer = __decorate([
        (0, components_6.customElements)('i-scom-post-composer')
    ], ScomPostComposer);
    exports.ScomPostComposer = ScomPostComposer;
});
