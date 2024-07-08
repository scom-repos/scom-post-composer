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
} from '@ijstech/components';
import { chartWidgets, getWidgetEmbedUrl, IWidget, widgets } from '../global';
import { formStyle } from '../index.css';

const Theme = Styles.Theme.ThemeVars;

interface ScomPostComposerWidgetsElement extends ControlElement {
    onConfirm?: (url: string) => void;
    onCloseButtonClick?: () => void;
    onRefresh?: () => void;
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
    private iconClose: Icon;
    private pnlWidgets: StackLayout;
    private pnlForm: Panel;
    private pnlLoading: StackLayout;
    private actionForm: Form;
    private pnlCustomForm: StackLayout;
    private cbType: ComboBox;
    private customForm: any;

    onConfirm: (url: string) => void;
    onCloseButtonClick: () => void;
    onRefresh: () => void;

    static async create(options?: ScomPostComposerWidgetsElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    private handleCloseButtonClick() {
        if (this.onCloseButtonClick) this.onCloseButtonClick();
    }

    init() {
        super.init();
        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.onConfirm = this.getAttribute('onConfirm', true) || this.onConfirm;
        this.onCloseButtonClick = this.getAttribute('onCloseButtonClick', true) || this.onCloseButtonClick;
        this.onRefresh = this.getAttribute('onRefresh', true) || this.onRefresh;
        this.renderWidgets();
    }

    show() {
        this.back();
    }

    private renderWidgets() {
        this.pnlWidgets.clearInnerHTML();
        for (let widget of widgets) {
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
                    onClick={() => this.selectWidget(widget)}
                >
                    <i-stack direction="horizontal" alignItems="center" gap="1rem">
                        <i-icon width="1rem" height="1rem" name={widget.icon}></i-icon>
                        <i-stack direction="vertical" gap="0.25rem">
                            <i-label caption={widget.title} font={{ size: '0.875rem', weight: 500 }}></i-label>
                            <i-label caption={widget.description} font={{ size: '0.75rem', weight: 400 }}></i-label>
                        </i-stack>
                    </i-stack>
                </i-stack>
            )
        }
    }

    private back() {
        this.lblTitle.caption = 'Widgets';
        this.iconBack.visible = false;
        this.iconClose.visible = true;
        this.pnlWidgets.visible = true;
        this.pnlForm.visible = false;
        this.pnlLoading.visible = false;
        this.actionForm.visible = false;
    }

    private async renderForm(module: string | string[]) {
        this.pnlCustomForm.clearInnerHTML();
        this.pnlCustomForm.visible = false;
        if (Array.isArray(module)) {
            const items = module.map(type => ({ value: type, label: type.split('-')[1]}));
            this.pnlCustomForm.appendChild(
                <i-stack direction="vertical" width="100%" gap="0.625rem">
                  <i-label caption="Type"></i-label>
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
            await this.loadWidgetConfig(module);
        }
    }

    private getActions(elm: any, isChart: boolean) {
        const configs = elm.getConfigurators() || [];
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
    
    private async loadWidgetConfig(module: string) {
        const elm: any = await application.createElement(module);
        if (elm?.getConfigurators) {
            const isChart = chartWidgets.includes(module);
            const action = this.getActions(elm, isChart);
            if (action) {
                if (action.customUI) {
                    this.customForm = await action.customUI.render({}, this.onSave.bind(this));
                    this.pnlCustomForm.append(this.customForm);
                    this.pnlCustomForm.visible = true;
                } else {
                    this.actionForm.uiSchema = action.userInputUISchema;
                    this.actionForm.jsonSchema = action.userInputDataSchema;
                    this.actionForm.formOptions = {
                        columnWidth: '100%',
                        columnsPerRow: 1,
                        confirmButtonOptions: {
                        caption: 'Confirm',
                        backgroundColor: Theme.colors.primary.main,
                        fontColor: Theme.colors.primary.contrastText,
                        padding: {top: '0.5rem', bottom: '0.5rem', right: '1rem', left: '1rem'},
                        border: {radius: '0.5rem'},
                        hide: false,
                        onClick: async () => {
                            const data = await this.actionForm.getFormData();
                            const url = getWidgetEmbedUrl(module, data);
                            if (this.onConfirm) this.onConfirm(url);
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
                }
            }
        }
    }

    private async onTypeChanged(target: ComboBox) {
        const name = (target.selectedItem as IComboItem).value;
        if (this.customForm) this.customForm.remove();
        await this.loadWidgetConfig(name);
        if (this.onRefresh) this.onRefresh();
    }

    private onSave(result: boolean, data: any) {
        // data.title = this.inputTitle.value || '';
        if (this.cbType) {
            data.name = (this.cbType.selectedItem as IComboItem).value;
        }
        const url = getWidgetEmbedUrl(data.name, data);
        if (this.onConfirm) this.onConfirm(url);
    }

    private async selectWidget(widget: IWidget) {
        this.lblTitle.caption = widget.title;
        this.iconBack.visible = true;
        this.iconClose.visible = false;
        this.pnlWidgets.visible = false;
        this.pnlForm.visible = true;
        this.pnlLoading.visible = true;
        await this.renderForm(widget.name);
        this.pnlLoading.visible = false;
        if (this.onRefresh) this.onRefresh();
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
                        <i-label id="lblTitle" caption="Widgets" font={{ size: '1.125rem', color: Theme.colors.primary.main }}></i-label>
                    </i-stack>
                    <i-icon
                        id="iconClose"
                        width="1rem"
                        height="1rem"
                        name="times"
                        fill={Theme.colors.primary.main}
                        onClick={this.handleCloseButtonClick}
                        cursor="pointer"
                    ></i-icon>
                </i-stack>
                <i-stack id="pnlWidgets" direction="vertical" gap="0.5rem"></i-stack>
                <i-panel id="pnlForm" visible={false}>
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
            </i-stack>
        )
    }
}