import { Injector } from '@angular/core';
import { IComponentMetaData } from './i-component-meta-data';
import * as fromToken from '../tokens';
import { INotification } from './i-notification';

export class MetaDataProvider {

    private _metaData: IComponentMetaData;
    public constructor(
        protected injector: Injector
    ) { }

    public get key(): string {
        return this.metaData.key;
    }

    public get title(): string {
        return this.metaData.title;
    }

    public get control(): string {
        return this.metaData.control;
    }

    public get metaData(): IComponentMetaData {
        if (!this._metaData) {
            this._metaData = this.injector.get(fromToken.COMPONENTMETADATA, {});
        }
        return this._metaData;
    }

    public get content(): Array<IComponentMetaData> {
        return this.metaData.content;
    }

    public get subscribe(): Array<INotification> {
        return this.metaData.subscribe;
    }

    public get notify(): Array<INotification> {
        return this.metaData.notify;
    }

    public get initialParameter(): { [key: string]: any } {
        return this.metaData.initialParameter;
    }

    public get filterParameter(): { [key: string]: any } {
        return this.metaData.filter;
    }

    public get dataSourceKey(): string {
        return this.metaData.dataSourceKey;
    }
}
