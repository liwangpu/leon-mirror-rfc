import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-token-setting',
    templateUrl: './token-setting.component.html',
    styleUrls: ['./token-setting.component.scss']
})
export class TokenSettingComponent implements OnInit {

    public token: string;
    public ngOnInit(): void {
        this.token = localStorage.getItem('app-token');
    }

    public update(): void {
        localStorage.setItem('app-token', this.token);
        location.reload();
    }

}
