/// <amd-module name="@scom/scom-post-composer/assets.ts" />
declare module "@scom/scom-post-composer/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-post-composer/global/index.ts" />
declare module "@scom/scom-post-composer/global/index.ts" {
    import { Control, IconName } from "@ijstech/components";
    export const getWidgetEmbedUrl: (module: string, data: any) => string;
    export const extractWidgetUrl: (url: string) => {
        moduleName: string;
        modifiedTime: any;
        data: any;
    };
    export const getEmbedElement: (postData: any, parent: Control) => Promise<any>;
    export interface IWidget {
        name: string | string[];
        icon?: {
            name: IconName;
        } | {
            image: {
                url: string;
                width: string;
                height: string;
                display: string;
            };
        };
        configuratorCustomData?: string;
        title: string;
        description?: string;
        note?: string;
        disabled?: boolean;
        isDevOnly?: boolean;
    }
    export const chartWidgets: string[];
    export const widgets: IWidget[];
}
/// <amd-module name="@scom/scom-post-composer/translations.json.ts" />
declare module "@scom/scom-post-composer/translations.json.ts" {
    const _default_1: {
        en: {
            anyone_on_or_off_nostr: string;
            are_you_sure: string;
            auto_play_gifs: string;
            cancel: string;
            chart: string;
            confirm: string;
            create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities: string;
            create_membership_nft: string;
            do_you_really_want_to_delete_this_widget: string;
            embed_community_product: string;
            embeded_youtube_video: string;
            emoji: string;
            enter_url: string;
            excessed_max_post_size: string;
            existing_membership_nft: string;
            failed_to: string;
            image: string;
            in_order_to_please_confirm_the_upload_of_your_media_to_ipfs: string;
            insert_a_chart_widget: string;
            insert_a_staking_widget: string;
            insert_a_swap_widget: string;
            insert_a_voting_widget: string;
            insert_an_image: string;
            insert_an_x_post: string;
            insert_an_xchain_widget: string;
            media: string;
            members_of_the_community: string;
            members: string;
            mint_a_membership_nft_for_gated_communities: string;
            mint_a_membership_nft_for_openswap_community: string;
            mp4_or_mov_file: string;
            oswap_troll_nft: string;
            post: string;
            product: string;
            public: string;
            reply: string;
            replying_to: string;
            Search_for_GIFs: string;
            something_went_wrong_when_uploading_your_media_to_ipfs: string;
            staking: string;
            swap: string;
            this_preview_will_update_real_time_as_the_config_on_the_right_changes: string;
            type: string;
            video_file: string;
            voting: string;
            widget_preview: string;
            widgets: string;
            will_only_work_after_a_successful_transaction: string;
            xchain: string;
            your_quota_insufficient_for_ipfs_media_upload: string;
            youtube_video: string;
        };
        "zh-hant": {
            anyone_on_or_off_nostr: string;
            are_you_sure: string;
            auto_play_gifs: string;
            cancel: string;
            chart: string;
            confirm: string;
            create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities: string;
            create_membership_nft: string;
            do_you_really_want_to_delete_this_widget: string;
            embed_community_product: string;
            embeded_youtube_video: string;
            emoji: string;
            enter_url: string;
            excessed_max_post_size: string;
            existing_membership_nft: string;
            failed_to: string;
            image: string;
            in_order_to_please_confirm_the_upload_of_your_media_to_ipfs: string;
            insert_a_chart_widget: string;
            insert_a_staking_widget: string;
            insert_a_swap_widget: string;
            insert_a_voting_widget: string;
            insert_an_image: string;
            insert_an_x_post: string;
            insert_an_xchain_widget: string;
            media: string;
            members_of_the_community: string;
            members: string;
            mint_a_membership_nft_for_gated_communities: string;
            mint_a_membership_nft_for_openswap_community: string;
            mp4_or_mov_file: string;
            oswap_troll_nft: string;
            post: string;
            product: string;
            public: string;
            reply: string;
            replying_to: string;
            Search_for_GIFs: string;
            something_went_wrong_when_uploading_your_media_to_ipfs: string;
            staking: string;
            swap: string;
            this_preview_will_update_real_time_as_the_config_on_the_right_changes: string;
            type: string;
            video_file: string;
            voting: string;
            widget_preview: string;
            widgets: string;
            will_only_work_after_a_successful_transaction: string;
            xchain: string;
            your_quota_insufficient_for_ipfs_media_upload: string;
            youtube_video: string;
        };
        vi: {
            anyone_on_or_off_nostr: string;
            are_you_sure: string;
            auto_play_gifs: string;
            cancel: string;
            chart: string;
            config: string;
            confirm: string;
            create_a_new_nft_index_to_mint_a_membership_nft_for_gated_communities: string;
            create_membership_nft: string;
            do_you_really_want_to_delete_this_widget: string;
            embed_community_product: string;
            embeded_youtube_video: string;
            emoji: string;
            enter_url: string;
            excessed_max_post_size: string;
            existing_membership_nft: string;
            failed_to: string;
            image: string;
            in_order_to_please_confirm_the_upload_of_your_media_to_ipfs: string;
            insert_a_chart_widget: string;
            insert_a_staking_widget: string;
            insert_a_swap_widget: string;
            insert_a_voting_widget: string;
            insert_an_image: string;
            insert_an_x_post: string;
            insert_an_xchain_widget: string;
            media: string;
            members_of_the_community: string;
            members: string;
            mint_a_membership_nft_for_gated_communities: string;
            mint_a_membership_nft_for_openswap_community: string;
            mp4_or_mov_file: string;
            oswap_troll_nft: string;
            post: string;
            product: string;
            public: string;
            reply: string;
            replying_to: string;
            Search_for_GIFs: string;
            something_went_wrong_when_uploading_your_media_to_ipfs: string;
            staking: string;
            swap: string;
            this_preview_will_update_real_time_as_the_config_on_the_right_changes: string;
            type: string;
            video_file: string;
            voting: string;
            widget_preview: string;
            widgets: string;
            will_only_work_after_a_successful_transaction: string;
            xchain: string;
            your_quota_insufficient_for_ipfs_media_upload: string;
            youtube_video: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-post-composer/components/form.tsx" />
declare module "@scom/scom-post-composer/components/form.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    interface ScomPostComposerUploadElement extends ControlElement {
        onConfirm: (url: string) => void;
        url?: string;
    }
    export interface IUploadForm {
        onConfirm: (url: string) => void;
        url?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-post-composer-upload']: ScomPostComposerUploadElement;
            }
        }
    }
    export class ScomPostComposerUpload extends Module {
        private inputUrl;
        private btnSubmit;
        private _data;
        static create(options?: ScomPostComposerUploadElement, parent?: Container): Promise<ScomPostComposerUpload>;
        constructor(parent?: Container, options?: any);
        get data(): IUploadForm;
        set data(value: IUploadForm);
        setData(value: IUploadForm): void;
        private onFormSubmit;
        private onInputChanged;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-post-composer/index.css.ts" />
declare module "@scom/scom-post-composer/index.css.ts" {
    export const modalStyle: string;
    export const formStyle: string;
    export const widgetPreviewStyle: string;
    export const alertStyle: string;
}
/// <amd-module name="@scom/scom-post-composer/components/widgets.tsx" />
declare module "@scom/scom-post-composer/components/widgets.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    interface ScomPostComposerWidgetsElement extends ControlElement {
        env?: string;
        onConfirm?: (url: string) => void;
        onUpdate?: (oldUrl: string, newUrl: string) => void;
        onCloseButtonClick?: () => void;
        onRefresh?: (maxWidth: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-post-composer-widgets']: ControlElement;
            }
        }
    }
    export class ScomPostComposerWidget extends Module {
        private lblTitle;
        private iconBack;
        private pnlWidgets;
        private pnlConfig;
        private pnlWidgetWrapper;
        private widgetWrapper;
        private lbNotePreview;
        private pnlLoading;
        private actionForm;
        private pnlCustomForm;
        private cbType;
        private customForm;
        private currentUrl;
        private _env;
        onConfirm: (url: string) => void;
        onUpdate: (oldUrl: string, newUrl: string) => void;
        onCloseButtonClick: () => void;
        onRefresh: (maxWidth: string) => void;
        static create(options?: ScomPostComposerWidgetsElement, parent?: Container): Promise<ScomPostComposerWidget>;
        private handleCloseButtonClick;
        get env(): string;
        set env(value: string);
        init(): void;
        show(url?: string): void;
        private renderWidgets;
        private handleWidgetClick;
        private back;
        private renderConfig;
        private renderForm;
        private getActions;
        private loadWidgetConfig;
        private getThemeValues;
        private compareThemes;
        private onTypeChanged;
        private onSave;
        private selectWidget;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-post-composer/components/index.ts" />
declare module "@scom/scom-post-composer/components/index.ts" {
    export { ScomPostComposerUpload } from "@scom/scom-post-composer/components/form.tsx";
    export { ScomPostComposerWidget } from "@scom/scom-post-composer/components/widgets.tsx";
}
/// <amd-module name="@scom/scom-post-composer" />
declare module "@scom/scom-post-composer" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IPost, IPostData } from '@scom/scom-post';
    type IReplyType = 'reply' | 'post' | 'quoted';
    type onChangedCallback = (content: string) => void;
    type onSubmitCallback = (content: string, medias: IPostData[]) => void;
    interface IReplyInput {
        replyTo?: IPost;
        isReplyToShown?: boolean;
        type?: IReplyType;
        placeholder?: string;
        buttonCaption?: string;
        value?: string;
    }
    interface ScomPostComposerElement extends ControlElement {
        env?: string;
        replyTo?: IPost;
        isReplyToShown?: boolean;
        type?: IReplyType;
        mobile?: boolean;
        placeholder?: string;
        buttonCaption?: string;
        onChanged?: onChangedCallback;
        onSubmit?: onSubmitCallback;
        onCancel?: () => void;
        focusedPost?: IPost;
        avatar?: string;
        autoFocus?: boolean;
        apiBaseUrl?: string;
        isPostAudienceShown?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-post-composer']: ScomPostComposerElement;
            }
        }
    }
    export class ScomPostComposer extends Module {
        private pnlPostComposer;
        private mdEmoji;
        private mdPostAudience;
        private lbReplyTo;
        private btnReply;
        private btnPostAudience;
        private pnlReplyTo;
        private gridReply;
        private imgReplier;
        private pnlBorder;
        private pnlIcons;
        private pnlFocusedPost;
        private mdEditor;
        private uploadForm;
        private iconMediaMobile;
        private iconGif;
        private iconEmoji;
        private iconWidget;
        private pnlActions;
        private mdPostActions;
        private storageEl;
        private widgetModule;
        private mdAlert;
        private emojiPicker;
        private gifPicker;
        private _focusedPost;
        private _data;
        private newReply;
        private mobile;
        private _avatar;
        private autoFocus;
        private currentPostData;
        private gifCateInitState;
        private _apiBaseUrl;
        private _isPostAudienceShown;
        private audience;
        private manager;
        private _hasQuota;
        private isSubmitting;
        private errorMessage;
        private needToUploadMedia;
        private _env;
        onChanged: onChangedCallback;
        onSubmit: onSubmitCallback;
        onCancel: () => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomPostComposerElement, parent?: Container): Promise<ScomPostComposer>;
        setFocus(): void;
        get env(): string;
        set env(value: string);
        get hasQuota(): boolean;
        set hasQuota(value: boolean);
        get focusedPost(): IPost;
        set focusedPost(value: IPost);
        get replyTo(): IPost;
        set replyTo(value: IPost);
        get type(): IReplyType;
        set type(value: IReplyType);
        get placeholder(): string;
        set placeholder(value: string);
        get buttonCaption(): string;
        set buttonCaption(value: string);
        get isReplyToShown(): boolean;
        set isReplyToShown(value: boolean);
        get apiBaseUrl(): string;
        set apiBaseUrl(value: string);
        get postAudience(): string;
        private get isQuote();
        get value(): string;
        set value(content: string);
        get avatar(): string;
        set avatar(value: string);
        get updatedValue(): any;
        get isPostAudienceShown(): boolean;
        set isPostAudienceShown(value: boolean);
        private removeShow;
        private onShowModal2;
        setData(value: IReplyInput): void;
        clear(): void;
        private resetEditor;
        private updateGrid;
        private onEditorChanged;
        private extractImageMimeType;
        private extractImageMarkdown;
        private replaceBase64WithLinks;
        private updateSubmittingStatus;
        private showAlert;
        private onReply;
        private onUpload;
        private updateFocusedPost;
        private onSetImage;
        private onCloseModal;
        private onShowModal;
        private onShowGifModal;
        private onGifSelected;
        private renderActions;
        private handleSelectedEmoji;
        private onEmojiMdOpen;
        private showStorage;
        private onShowWidgets;
        private onShowDeleteWidget;
        private renderWidget;
        protected _handleClick(event: MouseEvent, stopPropagation?: boolean): boolean;
        private showPostAudienceModal;
        init(): void;
        private handleMobileCloseComposer;
        private handlePostAudienceClick;
        private renderPostAudiences;
        private renderMobilePostComposer;
        private renderPostComposer;
        render(): any;
    }
}
