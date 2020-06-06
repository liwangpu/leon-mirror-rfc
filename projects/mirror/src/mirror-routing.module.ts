import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicPageComponent } from './components/dynamic-page/dynamic-page.component';
import { PageMetaDataResolverService } from './services/page-meta-data-resolver.service';


const routes: Routes = [
    {
        path: 'dynamic/:metaKey',
        component: DynamicPageComponent,
        resolve: {
            pageMetaData: PageMetaDataResolverService
        }
    },
    {
        path: 'dynamic/:metaKey/:dataId',
        component: DynamicPageComponent,
        resolve: {
            pageMetaData: PageMetaDataResolverService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MirrorRoutingModule { }
