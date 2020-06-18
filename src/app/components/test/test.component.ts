import { Component, OnInit } from '@angular/core';

interface IDatasource {
    create(): Promise<void>;
}


class BaseComponent {

    constructor() {

        let originCreate: Function = this['create'];
        Object.defineProperty(this, 'create', {
            value: async function (...args: any[]) {
                let result = await originCreate.apply(this, args);
                console.log('after create');
                return result;
            }
        });
    }
}



@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent extends BaseComponent implements IDatasource {

    constructor() {
        super();
    }

    async save() {
        await this.create();
    }

    async create(): Promise<void> {
        await this.doCreate();
    }

    doCreate(): Promise<string> {
        return new Promise<string>(res => {
            setTimeout(() => {
                console.log('create successfully');
                res('123');
            }, 1000);
        });
    }

}
