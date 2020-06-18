import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './components/test/test.component';


const routes: Routes = [
    {
        path: 'mirror',
        loadChildren: () => import('./mirror-infrastructure/mirror-infrastructure.module').then(m => m.MirrorInfrastructureModule)
    },
    {
        path: 'test',
        component: TestComponent
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
