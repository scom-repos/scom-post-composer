import {
    Module,
    Styles,
    Label,
    MarkdownEditor,
    Button,
    Panel,
    GridLayout,
    Image,
    HStack,
    customElements,
    ControlElement,
    Container,
    Modal,
    Icon,
    VStack,
    Control,
    application,
    IPFS,
    StackLayout,
    IconName,
    Alert,
    moment
} from '@ijstech/components';
import { IPost, IPostData } from '@scom/scom-post';
import { extractWidgetUrl, getEmbedElement } from './global/index';
import assets from './assets';
import { ScomPostComposerUpload, ScomPostComposerWidget } from './components/index';
import { widgetPreviewStyle, modalStyle, alertStyle } from './index.css';
import { ScomStorage } from '@scom/scom-storage';
import EmojiPicker from '@scom/scom-emoji-picker';
import { ScomGifPicker } from '@scom/scom-gif-picker';
import translations from './translations.json';

const Theme = Styles.Theme.ThemeVars;

const MAX_SIZE = 232003 // characters (~226kb)

const regexImage = /!\[.*?\]\(data:image\/[^;]+;base64,([^)]+)\)/g;

const PostAudience: IPostAudience[] = [
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
]

type IReplyType = 'reply' | 'post' | 'quoted';
type onChangedCallback = (content: string) => void;
type onSubmitCallback = (content: string, medias: IPostData[]) => void;
type onPostAudienceChangedCallback = (value: string) => void;
type Action = {
    caption: string;
    icon?: { name: string, fill?: string; };
    tooltip?: string;
    onClick?: (e?: any) => void;
    hoveredColor?: string;
}

interface IPostAudience {
    title: string;
    icon: IconName;
    desc?: string;
    value: string;
}

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

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-post-composer']: ScomPostComposerElement;
        }
    }
}

@customElements('i-scom-post-composer')
export class ScomPostComposer extends Module {
    private pnlPostComposer: Panel;
    private mdEmoji: Modal;
    private mdPostAudience: Modal;
    private lbReplyTo: Label;
    private btnReply: Button;
    private btnPostAudience: Button;
    private pnlReplyTo: Panel;
    private gridReply: GridLayout;
    private imgReplier: Image;
    private pnlBorder: Panel;
    private pnlIcons: HStack;
    private pnlFocusedPost: Panel;
    private mdEditor: MarkdownEditor;
    private uploadForm: ScomPostComposerUpload;
    private iconMediaMobile: Icon;
    private iconGif: Icon;
    private iconEmoji: Icon;
    private iconWidget: Button;
    private pnlActions: VStack;
    private mdPostActions: Modal;
    private storageEl: ScomStorage;
    private widgetModule: ScomPostComposerWidget;
    private mdAlert: Alert;
    private emojiPicker: EmojiPicker;
    private gifPicker: ScomGifPicker;

    private _focusedPost: IPost;
    private _data: IReplyInput;
    private newReply: IPostData[] = [];
    private mobile: boolean;
    private _avatar: string;
    private autoFocus: boolean;
    private currentPostData: any;
    private gifCateInitState = 0;
    private _apiBaseUrl: string;
    private _isPostAudienceShown: boolean = false;
    private audience: IPostAudience = PostAudience[1];
    private manager: IPFS.FileManager;
    private _hasQuota = false;
    private isSubmitting: boolean;
    private errorMessage: string;
    private needToUploadMedia: boolean;
    private _env: string;

    public onChanged: onChangedCallback;
    public onSubmit: onSubmitCallback;
    public onCancel: () => void;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.onUpload = this.onUpload.bind(this);
        this.showStorage = this.showStorage.bind(this);
        this.onShowGifModal = this.onShowGifModal.bind(this);
        this.onGifSelected = this.onGifSelected.bind(this);
        this.onShowWidgets = this.onShowWidgets.bind(this);
        this.onShowDeleteWidget = this.onShowDeleteWidget.bind(this);
        this.handleSelectedEmoji = this.handleSelectedEmoji.bind(this);
    }

    static async create(options?: ScomPostComposerElement, parent?: Container) {
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

    set env(value: string) {
        this._env = value;
        if (this.widgetModule) this.widgetModule.env = value;
    }

    get hasQuota() {
        return this._hasQuota;
    }

    set hasQuota(value: boolean) {
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

    set replyTo(value: IPost) {
        this._data.replyTo = value;
    }

    get type() {
        return this._data.type ?? 'reply';
    }

    set type(value: IReplyType) {
        this._data.type = value ?? 'reply';
    }

    get placeholder() {
        return this._data.placeholder ?? '';
    }

    set placeholder(value: string) {
        this._data.placeholder = value ?? '';
        if (this.mdEditor) this.mdEditor.placeholder = this.placeholder;
    }

    get buttonCaption() {
        return this._data.buttonCaption ?? '';
    }

    set buttonCaption(value: string) {
        this._data.buttonCaption = value ?? '';
        if (this.btnReply) this.btnReply.caption = this.buttonCaption;
    }

    get isReplyToShown(): boolean {
        return this._data.isReplyToShown ?? false;
    }

    set isReplyToShown(value: boolean) {
        this._data.isReplyToShown = value ?? false;
    }

    get apiBaseUrl() {
        return this._apiBaseUrl;
    }

    set apiBaseUrl(value: string) {
        this._apiBaseUrl = value;
    }

    get postAudience() {
        return this.audience?.value;
    }

    private get isQuote() {
        return this.type === 'quoted';
    }

    get value() {
        return this._data.value;
    }

    set value(content: string) {
        this._data.value = content;
        this.mdEditor.value = content;
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value: string) {
        this._avatar = value || assets.fullPath('img/default_avatar.png');
        if (this.imgReplier) this.imgReplier.url = this._avatar;
    }

    get updatedValue() {
        return this.mdEditor.getMarkdownValue();
    }

    get isPostAudienceShown() {
        return this._isPostAudienceShown;
    }

    set isPostAudienceShown(value: boolean) {
        this._isPostAudienceShown = value;
        if (this.btnPostAudience) this.btnPostAudience.visible = value;
        if (!value && this.mdPostAudience?.visible) this.mdPostAudience.visible = false;
    }

    private removeShow(name: string) {
        if (this[name]) this[name].classList.remove('show');
    }

    private onShowModal2(target: Control, data: any, name: string) {
        this.currentPostData = data;
        if (this[name]) {
            this[name].parent = target;
            this[name].position = 'absolute';
            this[name].refresh();
            this[name].visible = true;
            this[name].classList.add('show');
        }
    }

    setData(value: IReplyInput) {
        this.clear();
        this._data = value;
        this.lbReplyTo.caption = `${this.replyTo?.author?.internetIdentifier || ''}`;
        if (this.placeholder) this.mdEditor.placeholder = this.placeholder;
        if (this.buttonCaption) this.btnReply.caption = this.buttonCaption;
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

    private resetEditor() {
        if (this.mdEditor) {
            this.mdEditor.value = '';
        }
    }

    private updateGrid() {
        this.gridReply.templateColumns = ['2.75rem', 'minmax(auto, calc(100% - 3.5rem))'];
        if (this.isQuote) {
            this.gridReply.templateAreas = [
                ['avatar', 'editor'],
                ['avatar', 'quoted'],
                ['avatar', 'reply'],
            ];
            this.isReplyToShown = false;
            this.pnlReplyTo.visible = false;
        } else {
            if (this.isReplyToShown && !this.pnlReplyTo.visible) {
                this.gridReply.templateAreas = [['avatar', 'editor', 'reply']];
                this.gridReply.templateColumns = ['2.75rem', 'minmax(auto, 1fr)', '5.5rem'];
            } else {
                this.gridReply.templateAreas = [
                    ['avatar', 'editor'],
                    ['avatar', 'reply'],
                ];
            }
        }
        this.pnlReplyTo.visible = this.isReplyToShown;
    }

    private onEditorChanged() {
        if (this.pnlIcons && !this.pnlIcons.visible) this.pnlIcons.visible = true;
        this._data.value = this.updatedValue;
        this.btnReply.enabled = !this.isSubmitting && !!this._data.value;
        if (this.onChanged) this.onChanged(this._data.value);
    }

    private extractImageMimeType(dataString: string) {
        const startIndex = dataString.indexOf('data:') + 5;
        const mimeType = dataString.substring(startIndex, dataString.indexOf(';', startIndex));
        return mimeType;
    }

    private async extractImageMarkdown(text: string) {
        let base64List = text.match(regexImage) || [];
        let imageList: { base64: string; fileName: string; path?: string }[] = [];
        const files = [];
        if (!base64List.length) {
            return [];
        }
        if (!this.hasQuota) {
            this.errorMessage = '$your_quota_insufficient_for_ipfs_media_upload';
            return [];
        }
        if (!this.storageEl) {
            this.storageEl = ScomStorage.getInstance();
            this.storageEl.onCancel = () => this.storageEl.closeModal();
        }
        let fileId = 1;
        const genFileId = () => Date.now() + fileId++;
        for (const base64 of base64List) {
            let fileName = `image-${moment(new Date()).format('YYYYMMDDhhmmssSSS')}.png`;
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
            let file: any = new File([byteArray], fileName, { type });
            file.path = `/${fileName}`;
            file.cid = await IPFS.hashFile(file);
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
            }
        })
        return imageList;
    }

    private async replaceBase64WithLinks(text: string) {
        if (!text) return text;
        const imageList = await this.extractImageMarkdown(text);
        if (!imageList.length) return text;
        let replacedBase64 = text.replace(regexImage, function (match) {
            let image = imageList.find(v => v.base64 === match);
            if (image && image.path) {
                return `![](${image.path})`;
            }
            return '';
        });
        return replacedBase64;
    }

    private updateSubmittingStatus(status: boolean) {
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

    private showAlert(status: string, title: string, content: string, onConfirm?: () => void) {
        this.mdAlert.status = status;
        this.mdAlert.title = title;
        this.mdAlert.content = content;
        this.mdAlert.onConfirm = () => onConfirm ? onConfirm() : {};
        this.mdAlert.showModal();
    }

    private async onReply() {
        if (!this._data.value) return;
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
            } else if (extractedText.length > MAX_SIZE) {
                const base64List = extractedText.match(regexImage) || [];
                if (base64List.length) {
                    this.showAlert('confirm', this.i18n.get('$excessed_max_post_size'), this.i18n.get("$in_order_to_please_confirm_the_upload_of_your_media_to_ipfs", {action}), () => {
                        this.needToUploadMedia = true;
                        this.onReply();
                    });
                } else {
                    this.showAlert('error', this.i18n.get('$failed_to', {action}), this.i18n.get('$excessed_max_post_size'), () => { });
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

    private async onUpload() {
        // const result = application.uploadFile(this.extensions);
        if (!this.uploadForm) {
            this.uploadForm = await ScomPostComposerUpload.create({
                onConfirm: this.onSetImage.bind(this)
            });
        }
        this.uploadForm.openModal({
            title: 'Insert Image',
            width: 400,
        })
    }

    private updateFocusedPost() {
        if (this.pnlFocusedPost && this.mobile) {
            this.renderActions();
            const onProfileClicked = (target: Control, data: any, event: Event) => this.onShowModal2(target, data, 'mdPostActions');
            const focusedPost = <i-scom-post
                id={this.focusedPost.id}
                data={this.focusedPost}
                type="short"
                overflowEllipse={true}
                limitHeight={true}
                isReply={true}
                onProfileClicked={onProfileClicked}
                apiBaseUrl={this.apiBaseUrl}
            ></i-scom-post>;
            this.pnlFocusedPost.clearInnerHTML();
            this.pnlFocusedPost.append(focusedPost);
            // focusedPost.renderShowMore();
            // focusedPost.init();
        }
    }

    private onSetImage(url: string) {
        const imgMd = `\n![](${url})\n`;
        this.value = this.updatedValue + imgMd;
        if (!this.btnReply.enabled) this.btnReply.enabled = true;
        this.uploadForm.closeModal();
    }

    private onCloseModal(name: string) {
        this[name].visible = false;
    }

    private onShowModal(name: string) {
        this[name].refresh();
        this[name].visible = true;
    }

    private async onShowGifModal() {
        if (!this.gifPicker) {
            this.gifPicker = new ScomGifPicker(undefined, {
                onGifSelected: this.onGifSelected
            });
        }
        this.gifPicker.openModal({
            border: { radius: '1rem' },
            maxWidth: '600px',
            height: '90vh',
            overflow: { y: 'auto' },
            padding: { top: 0, right: 0, left: 0, bottom: 0 },
            closeIcon: null,
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
            }
        });
        this.gifPicker.show();
    }

    private onGifSelected(gif: any) {
        this.gifPicker.closeModal();
        const imgMd = `\n![${gif.title || ""}](${gif.images.fixed_height.url})\n`;
        this.value = this.updatedValue + imgMd;
        if (!this.btnReply.enabled) this.btnReply.enabled = true;
    }

    private renderActions() {
        const actions: Action[] = [
            {
                caption: '$copy_note_link',
                icon: { name: 'copy' },
                tooltip: '$the_link_has_been_copied_successfully',
                onClick: (e) => {
                    if (typeof this.currentPostData !== 'undefined') {
                        application.copyToClipboard(`${window.location.origin}/#!/e/${this.currentPostData.id}`)
                    }
                    this.mdPostActions.visible = false;
                }
            },
            {
                caption: '$copy_note_text',
                icon: { name: 'copy' },
                tooltip: '$the_text_has_been_copied_successfully',
                onClick: (e) => {
                    application.copyToClipboard(this.currentPostData['eventData']?.content)
                    this.mdPostActions.visible = false;
                }
            },
            {
                caption: '$copy_note_id',
                icon: { name: 'copy' },
                tooltip: '$the_id_has_been_copied_successfully',
                onClick: (e) => {
                    if (typeof this.currentPostData !== 'undefined') {
                        application.copyToClipboard(this.currentPostData.id)
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
                        application.copyToClipboard(JSON.stringify(this.currentPostData['eventData']))
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
                        application.copyToClipboard(this.currentPostData.author.npub || '')
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
        ]
        this.pnlActions.clearInnerHTML();
        for (let i = 0; i < actions.length; i++) {
            const item: any = actions[i];
            this.pnlActions.appendChild(
                <i-hstack
                    horizontalAlignment="space-between"
                    verticalAlignment="center"
                    width="100%"
                    padding={{ top: '0.625rem', bottom: '0.625rem', left: '0.75rem', right: '0.75rem' }}
                    background={{ color: 'transparent' }}
                    border={{ radius: '0.5rem' }}
                    opacity={item.hoveredColor ? 1 : 0.667}
                    hover={{
                        backgroundColor: item.hoveredColor || Theme.action.hoverBackground,
                        opacity: 1
                    }}
                    onClick={item.onClick?.bind(this)}
                >
                    <i-label
                        caption={item.caption}
                        font={{ color: item.icon?.fill || Theme.text.primary, weight: 400, size: '0.875rem' }}
                    ></i-label>
                    <i-icon
                        name={item.icon.name}
                        width='0.75rem' height='0.75rem'
                        display='inline-flex'
                        fill={item.icon?.fill || Theme.text.primary}
                    ></i-icon>
                </i-hstack>
            )
        }
        this.pnlActions.appendChild(
            <i-hstack
                width="100%"
                horizontalAlignment="center"
                padding={{ top: 12, bottom: 12, left: 16, right: 16 }}
                visible={false}
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: { visible: true }
                    }
                ]}
            >
                <i-button
                    caption='$cancel'
                    width="100%" minHeight={44}
                    padding={{ left: 16, right: 16 }}
                    font={{ color: Theme.text.primary, weight: 600 }}
                    border={{ radius: '30px', width: '1px', style: 'solid', color: Theme.colors.secondary.light }}
                    grid={{ horizontalAlignment: 'center' }}
                    background={{ color: 'transparent' }}
                    boxShadow="none"
                    onClick={() => this.onCloseModal('mdPostActions')}
                ></i-button>
            </i-hstack>
        )
    }

    private async handleSelectedEmoji(value: string) {
        this.value = this.updatedValue + value;
    }

    private onEmojiMdOpen() {
        this.emojiPicker.clearSearch();
        this.mdEmoji.refresh();
    }

    private showStorage() {
        if (!this.hasQuota) {
            this.onUpload();
            return;
        }
        if (!this.storageEl) {
            this.storageEl = ScomStorage.getInstance();
            this.storageEl.onCancel = () => this.storageEl.closeModal();
        }
        this.storageEl.uploadMultiple = false;
        this.storageEl.onUploadedFile = (path: string) => {
            this.storageEl.closeModal();
            const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
            const ext = path.split('.').pop();
            if (imageTypes.includes(ext)) {
                this.mdEditor.value = this.updatedValue + '\n\n' + `![${path.split('/').pop()}](${path})` + '\n\n';
            } else {
                const linkMd = `[${path}](<${path}>)`;
                this.mdEditor.value = this.updatedValue + '\n\n' + linkMd + '\n\n';
            }
        }
        this.storageEl.onOpen = (path: string) => {
            this.storageEl.closeModal();
            const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
            const ext = path.split('.').pop();
            if (imageTypes.includes(ext)) {
                this.mdEditor.value = this.updatedValue + '\n\n' + `![${path.split('/').pop()}](${path})` + '\n\n';
            } else {
                const linkMd = `[${path}](<${path}>)`;
                this.mdEditor.value = this.updatedValue + '\n\n' + linkMd + '\n\n';
            }
        }
        this.storageEl.openModal({
            width: 800,
            maxWidth: '100%',
            height: '90vh',
            overflow: 'hidden',
            zIndex: 1000,
            closeIcon: { width: '1rem', height: '1rem', name: 'times', fill: Theme.text.primary, margin: { bottom: '0.5rem' } },
            class: modalStyle
        })
        this.storageEl.onShow();
    }

    private async onShowWidgets(widget?: { widgetUrl: string, icon: Icon }) {
        if (!this.widgetModule) {
            this.widgetModule = await ScomPostComposerWidget.create({
                env: this._env,
                onConfirm: (url: string) => {
                    if (url)
                        this.mdEditor.value = this.updatedValue + '\n\n' + url + '\n\n';
                    this.widgetModule.closeModal();
                },
                onUpdate: (oldUrl: string, newUrl: string) => {
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
        this.widgetModule.onRefresh = (maxWidth: string) => {
            modal.maxWidth = maxWidth;
            const wrapper: HTMLElement = modal.querySelector('.modal');
            if (wrapper) wrapper.style.maxWidth = maxWidth;
            modal.refresh();
        }
        if (widget) {
            const { icon, widgetUrl } = widget;
            this.widgetModule.onUpdate = (oldUrl: string, newUrl: string) => {
                if (newUrl) {
                    const editor = icon.closest('i-markdown-editor#mdEditor') as MarkdownEditor;
                    if (!editor) return;
                    const value = editor.getMarkdownValue();
                    editor.value = value.replace(`$$widget0 ${oldUrl}$$`, newUrl);
                }
                this.widgetModule.closeModal();
            }
            this.widgetModule.show(widgetUrl);
        } else {
            this.widgetModule.show();
        }
    }

    private onShowDeleteWidget(widget: string, icon: Icon) {
        const editor = icon.closest('i-markdown-editor#mdEditor') as MarkdownEditor;
        if (!editor) return;
        const alert = editor.closest('i-scom-post-composer')?.querySelector('i-alert') as Alert;
        if (!alert) {
            const value = editor.getMarkdownValue();
            editor.value = value.replace(`$$widget0 ${widget}$$`, '');
        } else {
            alert.status = 'confirm';
            alert.title = '$are_you_sure';
            alert.content = '$do_you_really_want_to_delete_this_widget';
            alert.onConfirm = () => {
                const value = editor.getMarkdownValue();
                editor.value = value.replace(`$$widget0 ${widget}$$`, '');
            }
            alert.showModal();
        }
    }

    private renderWidget(url: string) {
        let widgetData = extractWidgetUrl(url);
        const pnl = new Panel(undefined, { width: '100%' });
        pnl.classList.add(widgetPreviewStyle);
        const hStack = new HStack(pnl, {
            width: '100%',
            gap: '0.75rem',
            verticalAlignment: 'center',
            horizontalAlignment: 'end',
            margin: { bottom: '0.5rem' },
            padding: { left: '0.75rem', right: '0.75rem' }
        });
        const iconConfig = new Icon(hStack, {
            name: 'cog',
            fill: Theme.text.primary,
            width: '1rem',
            height: '1rem',
            cursor: 'pointer',
            tooltip: { content: 'Config' }
        });
        iconConfig.onClick = () => { this.onShowWidgets({ widgetUrl: url, icon: iconConfig }) };

        const iconDelete = new Icon(hStack, {
            name: 'trash',
            fill: '#e45a5a',
            width: '1rem',
            height: '1rem',
            cursor: 'pointer',
            tooltip: { content: 'Delete' }
        });
        iconDelete.onClick = () => { this.onShowDeleteWidget(url, iconDelete) };

        getEmbedElement({
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

    protected _handleClick(event: MouseEvent, stopPropagation?: boolean): boolean {
        this.pnlIcons.visible = true;
        if (this.isReplyToShown) {
            this.pnlReplyTo.visible = true;
            this.updateGrid();
        }
        return true;
    }

    private showPostAudienceModal() {
        this.onShowModal('mdPostAudience');
    }

    init() {
        this.i18n.init({...translations});
        super.init();
        this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
        this.onSubmit = this.getAttribute('onSubmit', true) || this.onSubmit;
        this.onCancel = this.getAttribute('onCancel', true) || this.onCancel;

        const apiBaseUrl = this.getAttribute('apiBaseUrl', true);
        if (apiBaseUrl) this.apiBaseUrl = apiBaseUrl;
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
        if (env) this._env = env;
        const isPostAudienceShown = this.getAttribute('isPostAudienceShown', true);
        if (isPostAudienceShown != null) {
            this._isPostAudienceShown = isPostAudienceShown;
        }
        if (mobile) {
            this.renderMobilePostComposer();
        } else {
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
                    } catch {
                        return text;
                    }
                },
            },
        ]
    }

    private async handleMobileCloseComposer() {
        if (this.onCancel)
            await this.onCancel();
    }

    private handlePostAudienceClick(audience: IPostAudience) {
        this.audience = audience;
        this.btnPostAudience.caption = audience.title;
        this.btnPostAudience.icon.name = audience.icon;
        this.onCloseModal('mdPostAudience')
    }

    private renderPostAudiences() {
        const panel: StackLayout = <i-stack direction="vertical"></i-stack>;
        for (let audience of PostAudience) {
            panel.appendChild(
                <i-stack
                    direction="horizontal"
                    alignItems="center"
                    width="100%"
                    padding={{ top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }}
                    background={{ color: 'transparent' }}
                    border={{ radius: '0.125rem' }}
                    gap="0.75rem"
                    cursor="pointer"
                    hover={{
                        fontColor: Theme.text.primary,
                        backgroundColor: Theme.action.hoverBackground
                    }}
                    onClick={() => this.handlePostAudienceClick(audience)}
                >
                    <i-icon
                        name={audience.icon}
                        width={'0.75rem'} height={'0.75rem'}
                        display='inline-flex'
                        fill={Theme.text.primary}
                    ></i-icon>
                    <i-stack direction="vertical" height="100%" minWidth={0} justifyContent="space-between" lineHeight="1.125rem">
                        <i-label
                            caption={audience.title || ""}
                            font={{ size: '0.9375rem', weight: 700 }}
                            textOverflow="ellipsis"
                            overflow="hidden"
                        ></i-label>
                        <i-label
                            caption={audience.desc || ""}
                            font={{ size: '0.75rem', weight: 400, color: Theme.text.secondary }}
                            lineHeight={'1rem'}
                            textOverflow="ellipsis"
                            overflow="hidden"
                        ></i-label>
                    </i-stack>
                </i-stack>
            )
        }
        return panel;
    }

    private renderMobilePostComposer() {
        const pnlPostAudiences = this.renderPostAudiences();
        const elm = <i-panel cursor='default'>
            <i-hstack
                justifyContent={'space-between'}
                alignItems={'center'}
                padding={{ left: '0.5rem', right: '0.5rem' }}
                position={'fixed'}
                top={0}
                zIndex={10}
                background={{ color: '#000' }}
                width={'100%'}
                border={{ bottom: { width: '.5px', style: 'solid', color: Theme.divider } }}
                height={50}
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: {
                            border: { bottom: { style: 'none' } }
                        }
                    }
                ]}
            >
                <i-button caption={"$cancel"} onClick={this.handleMobileCloseComposer.bind(this)}
                    padding={{ left: 5, right: 5, top: 5, bottom: 5 }} font={{ size: Theme.typography.fontSize }}
                    background={{ color: 'transparent' }} />
                <i-button id={"btnReply"}
                    caption={"$post"}
                    enabled={false}
                    onClick={this.onReply.bind(this)}
                    padding={{ left: '1rem', right: '1rem' }}
                    height={36}
                    background={{ color: Theme.colors.primary.main }}
                    font={{ size: Theme.typography.fontSize, color: Theme.colors.primary.contrastText, bold: true }}
                    border={{ radius: '30px' }} />
            </i-hstack>
            <i-hstack
                id="pnlReplyTo"
                visible={false}
                gap="0.5rem"
                verticalAlignment="center"
                padding={{ top: '0.25rem', bottom: '0.75rem', left: '3.25rem' }}
            >
                <i-label
                    caption="$replying_to"
                    font={{ size: '1rem', color: Theme.text.secondary }}
                ></i-label>
                <i-label
                    id="lbReplyTo"
                    link={{ href: '' }}
                    font={{ size: '1rem', color: Theme.colors.primary.main }}
                ></i-label>
            </i-hstack>
            <i-panel id={'pnlFocusedPost'} padding={{ top: 50 }}>

            </i-panel>
            <i-grid-layout
                id="gridReply"
                gap={{ column: '0.75rem' }}
                height={""}
                templateColumns={['2.75rem', 'minmax(auto, calc(100% - 3.5rem))']}
                templateRows={['auto']}
                templateAreas={[
                    ['avatar', 'editor'],
                    ['avatar', 'reply']
                ]}
                padding={{ left: '0.75rem' }}
            >
                <i-image
                    id="imgReplier"
                    grid={{ area: 'avatar' }}
                    width={'2.75rem'}
                    height={'2.75rem'}
                    display="block"
                    background={{ color: Theme.background.main }}
                    border={{ radius: '50%' }}
                    overflow={'hidden'}
                    margin={{ top: '0.75rem' }}
                    objectFit='cover'
                    url={this._avatar}
                    fallbackUrl={assets.fullPath('img/default_avatar.png')}
                ></i-image>
                <i-panel
                    grid={{ area: 'editor' }}
                    maxHeight={'45rem'}
                    overflow={{ x: 'hidden', y: 'auto' }}
                >
                    <i-markdown-editor
                        id="mdEditor"
                        width="100%"
                        viewer={false}
                        hideModeSwitch={true}
                        mode="wysiwyg"
                        toolbarItems={[]}
                        font={{ size: '1.25rem', color: Theme.text.primary }}
                        lineHeight={1.5}
                        padding={{ top: 12, bottom: 12, left: 0, right: 0 }}
                        background={{ color: 'transparent' }}
                        height="auto"
                        minHeight={0}
                        overflow={'hidden'}
                        overflowWrap="break-word"
                        onChanged={this.onEditorChanged.bind(this)}
                        cursor='text'
                        border={{ style: 'none' }}
                        visible={true}
                    ></i-markdown-editor>
                    {/* <i-vstack id="pnlMedias" /> */}
                </i-panel>

                {/* comment */}
                <i-hstack
                    id="pnlBorder"
                    horizontalAlignment="space-between"
                    grid={{ area: 'reply' }}
                    padding={{ top: '0.625rem', right: '0.5rem' }}
                >
                    <i-hstack
                        id="pnlIcons"
                        gap="4px" verticalAlignment="center"
                        visible={false}
                    >
                        <i-icon
                            id="iconMediaMobile"
                            name="image" width={28} height={28} fill={Theme.colors.primary.main}
                            border={{ radius: '50%' }}
                            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            tooltip={{ content: '$media', placement: 'bottom' }}
                            cursor="pointer"
                            onClick={this.showStorage}
                        ></i-icon>
                        <i-icon
                            id="iconGif"
                            name="images" width={28} height={28} fill={Theme.colors.primary.main}
                            border={{ radius: '50%' }}
                            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            tooltip={{ content: 'GIF', placement: 'bottom' }}
                            cursor="pointer"
                            onClick={this.onShowGifModal}
                        ></i-icon>
                        <i-panel>
                            <i-icon
                                id="iconEmoji"
                                name="smile" width={28} height={28} fill={Theme.colors.primary.main}
                                border={{ radius: '50%' }}
                                padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                tooltip={{ content: '$emoji', placement: 'bottom' }}
                                cursor="pointer"
                                onClick={() => this.onShowModal('mdEmoji')}
                            ></i-icon>
                            <i-modal
                                id="mdEmoji"
                                maxWidth={'100%'}
                                minWidth={320}
                                popupPlacement='bottomLeft'
                                showBackdrop={false}
                                border={{ radius: '1rem' }}
                                boxShadow='rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px'
                                padding={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                closeOnScrollChildFixed={true}
                                onOpen={this.onEmojiMdOpen.bind(this)}
                                visible={false}
                            >
                                <i-scom-emoji-picker id="emojiPicker" onEmojiSelected={this.handleSelectedEmoji}></i-scom-emoji-picker>
                            </i-modal>
                        </i-panel>
                        <i-icon
                            id="iconWidget"
                            width={28}
                            height={28}
                            name="shapes"
                            fill={Theme.colors.primary.main}
                            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            tooltip={{ content: '$widgets', placement: 'bottom' }}
                            cursor="pointer"
                            onClick={() => this.onShowWidgets()}
                        ></i-icon>
                    </i-hstack>
                    <i-panel>
                        <i-button
                            id="btnPostAudience"
                            height={32}
                            padding={{ left: '1rem', right: '1rem' }}
                            background={{ color: Theme.colors.secondary.main }}
                            font={{ color: Theme.colors.secondary.contrastText, bold: true }}
                            border={{ radius: '0.375rem' }}
                            caption={this.audience.title}
                            icon={{ width: 14, height: 14, name: this.audience.icon, fill: Theme.colors.secondary.contrastText }}
                            rightIcon={{ width: 14, height: 14, name: 'angle-down', fill: Theme.colors.secondary.contrastText }}
                            visible={this.isPostAudienceShown}
                            onClick={this.showPostAudienceModal.bind(this)}
                        ></i-button>
                        <i-modal
                            id="mdPostAudience"
                            maxWidth={'15rem'}
                            minWidth={'12.25rem'}
                            maxHeight={'27.5rem'}
                            popupPlacement='bottomRight'
                            showBackdrop={false}
                            border={{ radius: '0.5rem' }}
                            boxShadow="rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                            padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            overflow={{ y: 'hidden' }}
                            visible={false}
                        >
                            {pnlPostAudiences}
                        </i-modal>
                    </i-panel>
                </i-hstack>
            </i-grid-layout>

            <i-modal
                id="mdPostActions"
                visible={false}
                maxWidth={'15rem'}
                minWidth={'12.25rem'}
                popupPlacement='bottomRight'
                showBackdrop={false}
                border={{ radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider }}
                padding={{ top: '0.5rem', left: '0.5rem', right: '0.5rem', bottom: '0.5rem' }}
                mediaQueries={[
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
                ]}
                onClose={() => this.removeShow('mdPostActions')}
            >
                <i-vstack id="pnlActions" minWidth={0} maxHeight={'27.5rem'} overflow={{ y: 'auto' }} />
            </i-modal>
        </i-panel>;

        this.pnlPostComposer.append(elm);
    }

    private renderPostComposer() {
        const pnlPostAudiences = this.renderPostAudiences();
        this.pnlPostComposer.append(<i-panel padding={{ bottom: '0.75rem', top: '0.75rem' }} cursor='default'>
            <i-hstack
                id="pnlReplyTo"
                visible={false}
                gap="0.5rem"
                verticalAlignment="center"
                padding={{ top: '0.25rem', bottom: '0.75rem', left: '3.25rem' }}
            >
                <i-label
                    caption="$replying_to"
                    font={{ size: '1rem', color: Theme.text.secondary }}
                ></i-label>
                <i-label
                    id="lbReplyTo"
                    link={{ href: '' }}
                    font={{ size: '1rem', color: Theme.colors.primary.main }}
                ></i-label>
            </i-hstack>
            <i-grid-layout
                id="gridReply"
                gap={{ column: '0.75rem' }}
                templateColumns={['2.75rem', 'minmax(auto, calc(100% - 3.5rem))']}
                templateRows={['auto']}
                templateAreas={[
                    ['avatar', 'editor'],
                    ['avatar', 'reply']
                ]}
            >
                <i-image
                    id="imgReplier"
                    grid={{ area: 'avatar' }}
                    width={'2.75rem'}
                    height={'2.75rem'}
                    display="block"
                    background={{ color: Theme.background.main }}
                    border={{ radius: '50%' }}
                    overflow={'hidden'}
                    margin={{ top: '0.75rem' }}
                    objectFit='cover'
                    url={this._avatar}
                    fallbackUrl={assets.fullPath('img/default_avatar.png')}
                ></i-image>
                <i-panel
                    grid={{ area: 'editor' }}
                    maxHeight={'45rem'}
                    overflow={{ x: 'hidden', y: 'auto' }}
                >
                    <i-markdown-editor
                        id="mdEditor"
                        width="100%"
                        viewer={false}
                        hideModeSwitch={true}
                        mode="wysiwyg"
                        toolbarItems={[]}
                        font={{ size: '1.25rem', color: Theme.text.primary }}
                        lineHeight={1.5}
                        padding={{ top: 12, bottom: 12, left: 0, right: 0 }}
                        background={{ color: 'transparent' }}
                        height="auto"
                        minHeight={0}
                        overflow={'hidden'}
                        overflowWrap="break-word"
                        onChanged={this.onEditorChanged.bind(this)}
                        cursor='text'
                        border={{ style: 'none' }}
                        visible={true}
                    ></i-markdown-editor>
                </i-panel>

                {/* comment */}
                <i-hstack
                    id="pnlBorder"
                    horizontalAlignment="space-between"
                    grid={{ area: 'reply' }}
                    padding={{ top: '0.625rem' }}
                >
                    <i-hstack
                        id="pnlIcons"
                        gap="4px" verticalAlignment="center"
                        visible={false}
                    >
                        <i-icon
                            id="iconMediaMobile"
                            name="image" width={28} height={28} fill={Theme.colors.primary.main}
                            border={{ radius: '50%' }}
                            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            tooltip={{ content: '$media', placement: 'bottom' }}
                            cursor="pointer"
                            onClick={this.showStorage}
                        ></i-icon>
                        <i-icon
                            id="iconGif"
                            name="images" width={28} height={28} fill={Theme.colors.primary.main}
                            border={{ radius: '50%' }}
                            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            tooltip={{ content: 'GIF', placement: 'bottom' }}
                            cursor="pointer"
                            onClick={this.onShowGifModal}
                        ></i-icon>
                        <i-panel>
                            <i-icon
                                id="iconEmoji"
                                name="smile" width={28} height={28} fill={Theme.colors.primary.main}
                                border={{ radius: '50%' }}
                                padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                tooltip={{ content: '$emoji', placement: 'bottom' }}
                                cursor="pointer"
                                onClick={() => this.onShowModal('mdEmoji')}
                            ></i-icon>
                            <i-modal
                                id="mdEmoji"
                                maxWidth={'100%'}
                                minWidth={320}
                                popupPlacement='bottomLeft'
                                showBackdrop={false}
                                border={{ radius: '1rem' }}
                                boxShadow='rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px'
                                padding={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                closeOnScrollChildFixed={true}
                                onOpen={this.onEmojiMdOpen.bind(this)}
                                visible={false}
                            >
                                <i-scom-emoji-picker id="emojiPicker" onEmojiSelected={this.handleSelectedEmoji}></i-scom-emoji-picker>
                            </i-modal>
                        </i-panel>
                        <i-icon
                            id="iconWidget"
                            width={28}
                            height={28}
                            name="shapes"
                            fill={Theme.colors.primary.main}
                            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            tooltip={{ content: '$widgets', placement: 'bottom' }}
                            cursor="pointer"
                            onClick={() => this.onShowWidgets()}
                        ></i-icon>
                    </i-hstack>
                    <i-stack direction="horizontal" width="100%" alignItems="center" justifyContent="end" gap="0.5rem">
                        <i-panel>
                            <i-button
                                id="btnPostAudience"
                                height={32}
                                padding={{ left: '1rem', right: '1rem' }}
                                background={{ color: Theme.colors.secondary.main }}
                                font={{ color: Theme.colors.secondary.contrastText, bold: true }}
                                border={{ radius: '0.375rem' }}
                                caption={this.audience.title}
                                icon={{ width: 14, height: 14, name: this.audience.icon, fill: Theme.colors.secondary.contrastText }}
                                rightIcon={{ width: 14, height: 14, name: 'angle-down', fill: Theme.colors.secondary.contrastText }}
                                visible={this.isPostAudienceShown}
                                onClick={this.showPostAudienceModal.bind(this)}
                            ></i-button>
                            <i-modal
                                id="mdPostAudience"
                                maxWidth={'15rem'}
                                minWidth={'12.25rem'}
                                maxHeight={'27.5rem'}
                                popupPlacement='bottomRight'
                                showBackdrop={false}
                                border={{ radius: '0.5rem' }}
                                boxShadow="rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px"
                                padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                overflow={{ y: 'hidden' }}
                                visible={false}
                            >
                                {pnlPostAudiences}
                            </i-modal>
                        </i-panel>
                        <i-button
                            id="btnReply"
                            height={36}
                            padding={{ left: '1rem', right: '1rem' }}
                            background={{ color: Theme.colors.primary.main }}
                            font={{ color: Theme.colors.primary.contrastText, bold: true }}
                            border={{ radius: '30px' }}
                            enabled={false}
                            caption="$post"
                            onClick={this.onReply.bind(this)}
                        ></i-button>
                    </i-stack>
                </i-hstack>
            </i-grid-layout>
        </i-panel>)
    }

    render() {
        return (
            <i-panel id={'pnlPostComposer'}>
                <i-alert
                    id="mdAlert"
                    status="confirm"
                    title="$are_you_sure"
                    content="$do_you_really_want_to_delete_this_widget"
                    class={alertStyle}
                />
            </i-panel>
        );
    }
}
