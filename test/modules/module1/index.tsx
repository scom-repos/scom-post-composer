import { Module, customModule, Container, application } from '@ijstech/components';
import { ScomPostComposer } from '@scom/scom-post-composer';
@customModule
export default class Module1 extends Module {

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        application.store.giphy = options.giphy;
    }

    async init() {
        super.init();
    }

    private onSubmit(content: string, medias: any) {
        console.log(content);
    }

    render() {
        return <i-panel>
            <i-hstack id="mainStack" margin={{ top: '1rem', left: '1rem' }} gap="2rem">
                <i-scom-post-composer
                    id="postComposer"
                    autoFocus
                    buttonCaption="Post"
                    placeholder={'Post your thoughts...'}
                    onSubmit={this.onSubmit}
                />
            </i-hstack>
        </i-panel>
    }
}