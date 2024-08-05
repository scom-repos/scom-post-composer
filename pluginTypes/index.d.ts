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
    export const fetchGifs: (params: any) => Promise<any>;
    export const fetchReactionGifs: () => Promise<any>;
    export const getWidgetEmbedUrl: (module: string, data: any) => string;
    export const extractWidgetUrl: (url: string) => {
        moduleName: string;
        modifiedTime: any;
        data: any;
    };
    export const getEmbedElement: (postData: any, parent: Control) => Promise<any>;
    export interface IEmojiCategory {
        name: string;
        value: string;
        image?: string;
        groups?: string[];
    }
    export interface IEmoji {
        name: string;
        category: string;
        group: string;
        htmlCode: string[];
        unicode: string[];
    }
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
        disabled?: boolean;
    }
    export const emojiCategories: {
        name: string;
        value: string;
        image: string;
        groups: string[];
    }[];
    export const colorsMapper: {
        'rgb(255, 220, 93)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(247, 222, 206)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(243, 210, 162)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(213, 171, 136)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(175, 126, 87)': {
            htmlCode: string;
            unicode: string;
        };
        'rgb(124, 83, 62)': {
            htmlCode: string;
            unicode: string;
        };
    };
    export const fetchEmojis: (params: any) => Promise<any>;
    export const searchEmojis: (q: string, mapper: Map<string, any>) => any;
    export const chartWidgets: string[];
    export const widgets: IWidget[];
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
}
/// <amd-module name="@scom/scom-post-composer/components/widgets.tsx" />
declare module "@scom/scom-post-composer/components/widgets.tsx" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    interface ScomPostComposerWidgetsElement extends ControlElement {
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
        private iconClose;
        private pnlWidgets;
        private pnlConfig;
        private pnlWidgetWrapper;
        private pnlLoading;
        private actionForm;
        private pnlCustomForm;
        private cbType;
        private customForm;
        private currentUrl;
        onConfirm: (url: string) => void;
        onUpdate: (oldUrl: string, newUrl: string) => void;
        onCloseButtonClick: () => void;
        onRefresh: (maxWidth: string) => void;
        static create(options?: ScomPostComposerWidgetsElement, parent?: Container): Promise<ScomPostComposerWidget>;
        private handleCloseButtonClick;
        init(): void;
        show(url?: string): void;
        private renderWidgets;
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
        private mdGif;
        private mdPostAudience;
        private lbReplyTo;
        private btnReply;
        private btnPostAudience;
        private pnlReplyTo;
        private gridReply;
        private imgReplier;
        private pnlBorder;
        private pnlIcons;
        private gifCateLoading;
        private gridGif;
        private gridGifCate;
        private pnlGif;
        private pnlGifBack;
        private pnlGifClose;
        private inputGif;
        private bottomElm;
        private gridEmojiCate;
        private groupEmojis;
        private pnlColors;
        private lbEmoji;
        private pnlEmojiResult;
        private inputEmoji;
        private gifLoading;
        private autoPlaySwitch;
        private pnlFocusedPost;
        private selectedColor;
        private recent;
        private mdEditor;
        private uploadForm;
        private iconMedia;
        private iconMediaMobile;
        private pnlActions;
        private mdPostActions;
        private storageEl;
        private widgetModule;
        private mdAlert;
        private _focusedPost;
        private _data;
        private currentGifPage;
        private totalGifPage;
        private renderedMap;
        private bottomObserver;
        private newReply;
        private isEmojiSearching;
        private recentEmojis;
        private emojiCateMapper;
        private emojiGroupsData;
        private searchTimer;
        private mobile;
        private _avatar;
        private autoFocus;
        private currentPostData;
        private gifCateInitState;
        private emojiInitState;
        private _apiBaseUrl;
        private _isPostAudienceShown;
        private audience;
        private manager;
        private _hasQuota;
        onChanged: onChangedCallback;
        onSubmit: onSubmitCallback;
        onCancel: () => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomPostComposerElement, parent?: Container): Promise<ScomPostComposer>;
        setFocus(): void;
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
        private get hasRecentEmojis();
        private get emojiColors();
        private get currentEmojiColor();
        get value(): string;
        set value(content: string);
        get avatar(): string;
        set avatar(value: string);
        get updatedValue(): any;
        get isPostAudienceShown(): boolean;
        set isPostAudienceShown(value: boolean);
        private removeShow;
        private onShowModal2;
        private isRecent;
        setData(value: IReplyInput): void;
        clear(): void;
        private resetEditor;
        private clearObservers;
        private updateGrid;
        private onEditorChanged;
        private onReply;
        private onUpload;
        private updateFocusedPost;
        private onSetImage;
        private onCloseModal;
        private onShowModal;
        private onShowGifModal;
        private onGifMdOpen;
        private onGifMdClose;
        private renderGifCate;
        private onGifSelected;
        private onGifSearch;
        private onToggleMainGif;
        private renderGifs;
        private onGifPlayChanged;
        private onBack;
        private onCloseGifModal;
        private renderEmojis;
        private initEmojiGroup;
        private initEmojis;
        private renderEmojiCate;
        private renderEmojiGroup;
        private updateEmojiGroups;
        private filterGroups;
        private onRecentClear;
        private renderEmojiColors;
        private renderActions;
        private renderColor;
        private onEmojiColorSelected;
        private onEmojiCateSelected;
        private onEmojiSelected;
        private onEmojiSearch;
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
