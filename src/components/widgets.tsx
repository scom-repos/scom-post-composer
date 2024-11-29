import {
    customElements,
    ControlElement,
    Styles,
    Module,
    StackLayout,
    Container,
    Label,
    Icon,
    Panel,
    Form,
    application,
    ComboBox,
    IComboItem,
    GridLayout,
    VStack,
} from '@ijstech/components';
import { chartWidgets, extractWidgetUrl, getWidgetEmbedUrl, IWidget, widgets } from '../global';
import { formStyle } from '../index.css';
import translations from '../translations.json';

const Theme = Styles.Theme.ThemeVars;

interface ScomPostComposerWidgetsElement extends ControlElement {
    env?: string;
    onConfirm?: (url: string) => void;
    onUpdate?: (oldUrl: string, newUrl: string) => void;
    onCloseButtonClick?: () => void;
    onRefresh?: (maxWidth: string) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-post-composer-widgets']: ControlElement;
        }
    }
}

@customElements('i-scom-post-composer-widgets')
export class ScomPostComposerWidget extends Module {
    private lblTitle: Label;
    private iconBack: Icon;
    private pnlWidgets: StackLayout;
    private pnlConfig: GridLayout;
    private pnlWidgetWrapper: VStack;
    private widgetWrapper: Panel;
    private lbNotePreview: Label;
    private pnlLoading: StackLayout;
    private actionForm: Form;
    private pnlCustomForm: StackLayout;
    private cbType: ComboBox;
    private customForm: any;
    private currentUrl: string;
    private _env: string;

    onConfirm: (url: string) => void;
    onUpdate: (oldUrl: string, newUrl: string) => void;
    onCloseButtonClick: () => void;
    onRefresh: (maxWidth: string) => void;

    static async create(options?: ScomPostComposerWidgetsElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    private handleCloseButtonClick() {
        if (this.onCloseButtonClick) this.onCloseButtonClick();
    }

    get env() {
        return this._env;
    }

    set env(value: string) {
        if (this._env !== value) {
            this._env = value;
            this.renderWidgets();
        }
    }

    init() {
        this.i18n.init({...translations});
        super.init();
        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.onConfirm = this.getAttribute('onConfirm', true) || this.onConfirm;
        this.onUpdate = this.getAttribute('onUpdate', true) || this.onUpdate;
        this.onCloseButtonClick = this.getAttribute('onCloseButtonClick', true) || this.onCloseButtonClick;
        this.onRefresh = this.getAttribute('onRefresh', true) || this.onRefresh;
        const env = this.getAttribute('env', true);
        if (env) this._env = env;
        this.renderWidgets();
    }

    show(url?: string) {
        if (url) {
            this.renderConfig(url);
        } else {
            this.back();
        }
    }

    private renderWidgets() {
        const isDevEnv = this._env === 'dev';
        const _widgets = widgets.filter(v => !(v.disabled || (v.isDevOnly && !isDevEnv)));
        this.pnlWidgets.clearInnerHTML();
        for (let widget of _widgets) {
            const icon = new Icon(undefined, { ...widget.icon, width: '1rem', height: '1rem' });
            this.pnlWidgets.appendChild(
                <i-stack
                    direction="horizontal"
                    width="100%"
                    padding={{ top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }}
                    border={{ radius: '0.375rem' }}
                    alignItems="center"
                    justifyContent="space-between"
                    hover={{
                        backgroundColor: Theme.action.activeBackground
                    }}
                    cursor="pointer"
                    onClick={() => this.handleWidgetClick(widget)}
                >
                    <i-stack direction="horizontal" alignItems="center" gap="1rem">
                        {icon}
                        <i-stack direction="vertical" gap="0.25rem">
                            <i-label caption={widget.title} font={{ size: '0.875rem', weight: 500 }}></i-label>
                            <i-label caption={widget.description} font={{ size: '0.75rem', weight: 400 }}></i-label>
                        </i-stack>
                    </i-stack>
                </i-stack>
            )
        }
    }

    private handleWidgetClick(widget: IWidget) {
        let widgetData: { data: any, url: string };
        if (widget.name === '@scom/scom-product') {
            if (location.hash.startsWith('#!/c/')) {
                const parts = location.hash.slice(5).split('/');
                const communityId = parts[0];
                const creatorId = parts[1];
                if (communityId && creatorId) {
                    widgetData = {
                        data: {
                            config: {
                                communityUri: `${communityId}/${creatorId}`
                            }
                        },
                        url: undefined
                    }
                }
            } else if (location.hash.startsWith('#!/n/') && application.store?.ensMap) {
                const parts = location.hash.slice(5).split('/');
                const name = parts[0];
                if (name) {
                    const value = application.store.ensMap[name];
                    if (value) {
                        const ids = value.split('/');
                        const isCommunity = ids.length > 1;
                        if (isCommunity) {
                            widgetData = {
                                data: {
                                    config: {
                                        communityUri: `${ids[0]}/${ids[1]}`
                                    }
                                },
                                url: undefined
                            }
                        }
                    }
                }
            }
        }
        this.selectWidget(widget, widgetData);
    }

    private back() {
        this.lblTitle.caption = this.i18n.get('$widgets');
        this.iconBack.visible = false;
        this.pnlWidgets.visible = true;
        this.pnlConfig.visible = false;
        this.pnlLoading.visible = false;
        this.actionForm.visible = false;
        if (this.onRefresh) this.onRefresh('50rem');
    }

    private renderConfig(url: string) {
        let widgetData = extractWidgetUrl(url);
        const { moduleName, data } = widgetData;
        this.selectWidget({ title: this.i18n.get('$config'), name: moduleName }, { data, url });
        this.iconBack.visible = false;
    }

    private async renderForm(module: string | string[], note?: string, widgetType?: string, widgetData?: { data: any, url: string }) {
        this.widgetWrapper.clearInnerHTML();
        this.pnlWidgetWrapper.visible = false;
        this.pnlCustomForm.clearInnerHTML();
        this.pnlCustomForm.visible = false;
        this.actionForm.visible = false;
        if (Array.isArray(module)) {
            this.pnlConfig.templateColumns = ['100%'];
            const items = module.map(type => ({ value: type, label: type.split('-')[1] }));
            this.pnlCustomForm.appendChild(
                <i-stack direction="vertical" width="100%" gap="0.625rem">
                    <i-label caption="$type"></i-label>
                    <i-combo-box
                        id="cbType"
                        items={items}
                        width={'100%'}
                        height={'2.625rem'}
                        onChanged={this.onTypeChanged}
                    ></i-combo-box>
                </i-stack>
            );
            this.pnlCustomForm.visible = true;
        } else {
            this.pnlConfig.templateColumns = innerWidth > 768 ? ['50%', '50%'] : ['100%'];
            await this.loadWidgetConfig(module, note, widgetType, widgetData);
        }
    }

    private getActions(elm: any, isChart: boolean, configuratorCustomData?: string) {
        const configs = elm.getConfigurators(configuratorCustomData) || [];
        let configurator, action;
        if (isChart) {
            configurator = configs.find((conf: any) => conf.target === 'Builders');
            action = configurator?.getActions && configurator.getActions().find((action: any) => action.name === 'Data');
        } else {
            configurator = configs.find((conf: any) => conf.target === 'Editor');
            action = configurator.getActions()?.[0];
        }
        return action;
    }

    private async loadWidgetConfig(module: string, note?: string, configuratorCustomData?: string, widgetData?: { data: any, url: string }) {
        const { data, url } = widgetData || {};
        this.currentUrl = url;
        this.pnlWidgetWrapper.visible = false;
        this.lbNotePreview.visible = !!note;
        this.lbNotePreview.caption = note || '';
        const elm: any = await application.createElement(module);
        this.pnlWidgetWrapper.visible = true;
        this.widgetWrapper.clearInnerHTML();
        this.widgetWrapper.appendChild(elm);
        if (elm?.getConfigurators) {
            const isChart = chartWidgets.includes(module);
            const action = this.getActions(elm, isChart, configuratorCustomData);
            const builder = elm.getConfigurators(configuratorCustomData).find((conf: any) => conf.target === 'Builders');
            const hasBuilder = builder && typeof builder.setData === 'function';
            if (action) {
                if (action.customUI) {
                    if (hasBuilder) {
                        builder.setData(data || {});
                    }
                    this.customForm = await action.customUI.render(hasBuilder ? { ...elm.getData() } : {}, async (result: boolean, data: any) => {
                        let setupData = {};
                        if (builder && typeof builder.setupData === 'function') {
                            const hasSetup = await builder.setupData(data);
                            if (!hasSetup) return;
                            setupData = builder.getData();
                        }
                        this.onSave(result, { ...data, ...setupData });
                    });
                    this.pnlCustomForm.append(this.customForm);
                    this.pnlCustomForm.visible = true;
                } else {
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
                                    if (!hasSetup) return;
                                    setupData = builder.getData();
                                }
                                const widgetUrl = getWidgetEmbedUrl(module, { ...formData, ...setupData });
                                if (url && this.onUpdate) {
                                    if (this.onUpdate) this.onUpdate(url, widgetUrl);
                                } else if (this.onConfirm) {
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
                                if (isTagChanged) return;
                            }
                            const validationResult = this.actionForm.validate(formData, this.actionForm.jsonSchema, { changing: false });
                            if (validationResult.valid) {
                                if (hasBuilder) {
                                    builder.setData(formData);
                                } else if (typeof elm.setData === 'function') {
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
                            } else if (typeof elm.setData === 'function') {
                                elm.setData(data);
                            }
                        } else if (hasBuilder) {
                            builder.setData({});
                            const elmData = await elm.getData();
                            this.actionForm.setFormData({ ...elmData });
                        }
                    })
                }
            }
        }
    }

    private getThemeValues(theme: any) {
        if (!theme || typeof theme !== 'object') return null;
        let values = {};
        for (let prop in theme) {
            if (theme[prop]) values[prop] = theme[prop];
        }
        return Object.keys(values).length ? values : null;
    }

    private compareThemes(oldValues: any, newValues: any) {
        for (let prop in newValues) {
            if (!oldValues.hasOwnProperty(prop) || newValues[prop] !== oldValues[prop]) {
                return true;
            }
        }
        return false;
    }

    private async onTypeChanged(target: ComboBox) {
        this.pnlConfig.templateColumns = innerWidth > 768 ? ['50%', '50%'] : ['100%'];
        const name = (target.selectedItem as IComboItem).value;
        if (this.customForm) this.customForm.remove();
        await this.loadWidgetConfig(name);
        if (this.onRefresh) this.onRefresh('90rem');
    }

    private onSave(result: boolean, data: any) {
        // data.title = this.inputTitle.value || '';
        if (this.cbType) {
            data.name = (this.cbType.selectedItem as IComboItem).value;
        }
        const url = getWidgetEmbedUrl(data.name, data);
        if (this.currentUrl) {
            if (this.onUpdate) this.onUpdate(this.currentUrl, url);
        } else if (this.onConfirm) {
            this.onConfirm(url);
        }
    }

    private async selectWidget(widget: IWidget, widgetData?: { data: any, url: string }) {
        this.lblTitle.caption = widget.title;
        this.iconBack.visible = true;
        this.pnlWidgets.visible = false;
        this.pnlConfig.visible = true;
        this.pnlLoading.visible = true;
        await this.renderForm(widget.name, widget.note, widget.configuratorCustomData, widgetData);
        this.pnlLoading.visible = false;
        if (this.onRefresh) this.onRefresh(Array.isArray(widget.name) ? '50rem' : '90rem');
    }

    render() {
        return (
            <i-stack
                direction="vertical"
                padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
                gap="1rem"
            >
                <i-stack
                    direction="horizontal"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={{ left: '0.5rem', right: '0.5rem' }}
                    gap="0.5rem"
                >
                    <i-stack direction="horizontal" alignItems="center" gap="0.5rem">
                        <i-icon
                            id="iconBack"
                            width="1rem"
                            height="1rem"
                            name="arrow-left"
                            fill={Theme.colors.primary.main}
                            onClick={this.back}
                            cursor="pointer"
                            visible={false}
                        ></i-icon>
                        <i-label id="lblTitle" caption="$widgets" font={{ size: '1.125rem', color: Theme.colors.primary.main }}></i-label>
                    </i-stack>
                    <i-icon
                        width="1rem"
                        height="1rem"
                        name="times"
                        fill={Theme.colors.primary.main}
                        onClick={this.handleCloseButtonClick}
                        cursor="pointer"
                    ></i-icon>
                </i-stack>
                <i-stack id="pnlWidgets" direction="vertical" gap="0.5rem"></i-stack>
                <i-grid-layout
                    id="pnlConfig"
                    visible={false}
                    gap={{ column: '0.5rem' }}
                    templateColumns={['50%', '50%']}
                    mediaQueries={[
                        {
                            maxWidth: '768px',
                            properties: {
                                templateColumns: ['100%']
                            }
                        }
                    ]}
                >
                    <i-vstack id="pnlWidgetWrapper" gap="0.25rem" horizontalAlignment="center">
                        <i-label id="lbWTitle" caption="$widget_preview" font={{ color: Theme.colors.primary.main, size: '1rem', bold: true }} />
                        <i-label id="lbWDesc" caption="$this_preview_will_update_real_time_as_the_config_on_the_right_changes" font={{ size: '0.75rem' }} opacity={0.75} />
                        <i-label id="lbNotePreview" visible={false} font={{ color: Theme.colors.error.main, size: '0.75rem' }} />
                        <i-panel id="widgetWrapper" />
                    </i-vstack>
                    <i-panel>
                        <i-form id="actionForm" visible={false} class={formStyle}></i-form>
                        <i-stack id="pnlCustomForm" direction="vertical" visible={false}></i-stack>
                        <i-stack
                            id="pnlLoading"
                            direction="vertical"
                            position="relative"
                            height="100%" width="100%"
                            minHeight={100}
                            class="i-loading-overlay"
                            visible={false}
                        >
                            <i-stack direction="vertical" class="i-loading-spinner" alignItems="center"
                                justifyContent="center">
                                <i-icon
                                    class="i-loading-spinner_icon"
                                    name="spinner"
                                    width={24}
                                    height={24}
                                    fill={Theme.colors.primary.main}
                                />
                            </i-stack>
                        </i-stack>
                    </i-panel>
                </i-grid-layout>
            </i-stack>
        )
    }
}