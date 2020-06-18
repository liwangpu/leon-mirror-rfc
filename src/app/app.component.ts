import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { parse } from 'query-string';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {


    private _showSimulator: boolean;
    public constructor(
        private router: Router
    ) {
        // this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(res => {
        //     console.info('url info:', res);
        // });
        this._showSimulator = localStorage.getItem('showSimulator') === 'true' ? true : false;
    }

    public set showSimulator(val: boolean) {
        this._showSimulator = val;
        localStorage.setItem('showSimulator', `${val}`);
    }

    public get showSimulator(): boolean {
        return this._showSimulator;
    }

    public gotoPreview(): void {
        let urlArr: Array<string> = this.router.url.split('?');
        let queryParams: { [key: string]: any } = this.getUrlQueryParam(urlArr[1]);
        if (Object.keys(queryParams).some(x => x.toLocaleLowerCase() === 'preview')) {
            return;
        }

        queryParams.preview = true;
        this.router.navigate([urlArr[0]], { queryParams });
    }

    public cancelPreview(): void {
        let urlArr: Array<string> = this.router.url.split('?');
        let queryParams: { [key: string]: any } = this.getUrlQueryParam(urlArr[1])
        if (!Object.keys(queryParams).some(x => x.toLocaleLowerCase() === 'preview')) {
            return;
        }

        delete queryParams.preview;
        this.router.navigate([urlArr[0]], { queryParams });
    }

    private getUrlQueryParam(url: any): any {
        if (!url) {
            return {};
        }
        return parse(url);
    }
}
