import {
  customElements,
  ControlElement,
  Styles,
  Module,
  Container,
  Input,
  Button,
} from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

interface ScomPostComposerUploadElement extends ControlElement {
  onConfirm: (url: string) => void;
  url?: string;
}

export interface IUploadForm {
  onConfirm: (url: string) => void;
  url?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-post-composer-upload']: ScomPostComposerUploadElement;
    }
  }
}

@customElements('i-scom-post-composer-upload')
export class ScomPostComposerUpload extends Module {
  private inputUrl: Input;
  private btnSubmit: Button;

  private _data: IUploadForm;

  static async create(options?: ScomPostComposerUploadElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  get data() {
    return this._data;
  }
  set data(value: IUploadForm) {
    this._data = value;
  }

  setData(value: IUploadForm) {
    this._data = value;
    this.inputUrl.value = value.url || '';
  }

  private onFormSubmit() {
    const { onConfirm } = this.data;
    if (onConfirm) onConfirm(this.inputUrl.value)
    this.inputUrl.value = '';
  }

  private onInputChanged(target: Input) {
    this.btnSubmit.enabled = !!target.value;
  }

  init() {
    super.init();
    const onConfirm = this.getAttribute('onConfirm', true);
    const url = this.getAttribute('url', true);
    if (onConfirm) this.setData({ onConfirm, url });
  }

  render() {
    return (
      <i-vstack gap="1rem" padding={{top: '1rem', bottom: '1rem', left: '1rem', right: '1rem'}}>
        <i-input
          id="inputUrl"
          placeholder='Enter URL'
          width={'100%'}
          height={'2rem'}
          border={{radius: '0.5rem'}}
          padding={{left: '0.5rem', right: '0.5rem'}}
          onChanged={this.onInputChanged}
        ></i-input>
        <i-hstack horizontalAlignment='end'>
          <i-panel>
            <i-button
              id="btnSubmit"
              height={36}
              padding={{ left: '1rem', right: '1rem' }}
              background={{ color: Theme.colors.primary.main }}
              font={{ color: Theme.colors.primary.contrastText, bold: true }}
              border={{ radius: '0.5rem' }}
              enabled={false}
              caption="Confirm"
              onClick={this.onFormSubmit}
            ></i-button>
          </i-panel>
        </i-hstack>
      </i-vstack>
    )
  }
}
