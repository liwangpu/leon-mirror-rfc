import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {

    constructor() {
        let p: Object = { name: 'Leon', info: { message: 'good', test: { age: 18 } } };

        // console.log(1, p.hasOwnProperty('info.message'));
        console.log(2, _.has(p, 'info.test.age1'));
    }

    save() {
 
    }

}
