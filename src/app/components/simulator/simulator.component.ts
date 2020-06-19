import { Component, OnInit, Output, EventEmitter, Optional } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { setScopeData, PageNotifyOpsatService } from '@cxist/mirror-core';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-simulator',
    templateUrl: './simulator.component.html',
    styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {

    @Output()
    public close = new EventEmitter<void>();
    public scopeForm: FormGroup;
    public eventForm: FormGroup;
    public constructor(
        fb: FormBuilder,
        @Optional() private opsat: PageNotifyOpsatService,
        private store: Store<any>
    ) {
        this.scopeForm = fb.group({
            name: [],
            value: []
        });

        this.eventForm = fb.group({
            name: [],
            value: []
        });

        this.scopeForm.valueChanges
            .pipe(debounceTime(500))
            .subscribe(val => localStorage.setItem('scopeForm', JSON.stringify(val)));

        this.eventForm.valueChanges
            .pipe(debounceTime(500))
            .subscribe(val => localStorage.setItem('eventForm', JSON.stringify(val)));
    }

    public ngOnInit(): void {
        let scopeStr = localStorage.getItem('scopeForm');
        if (scopeStr) {
            this.scopeForm.patchValue(JSON.parse(scopeStr));
        }

        let eventStr = localStorage.getItem('eventForm');
        if (eventStr) {
            this.eventForm.patchValue(JSON.parse(eventStr));
        }
    }

    public sendScope(): void {
        let { name, value } = this.scopeForm.value;
        this.store.dispatch(setScopeData({ scope: { [name]: value } }));
    }

    public sendEvent(): void {
        let { name, value } = this.eventForm.value;
        this.opsat.publish({ source: name, type: 'event', target: value });
    }

}
