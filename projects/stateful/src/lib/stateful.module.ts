import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { NgUtilsStateful } from './stateful.directive';
import {
  StatefulConfig,
  StatefulConfigProvider
} from './providers';
import { DefaultLoaderComponent } from './components/default-loader/default-loader.component';
import { DefaultErrorComponent } from './components/default-error/default-error.component';

@NgModule({
  declarations: [NgUtilsStateful, DefaultLoaderComponent, DefaultErrorComponent],
  imports: [
  ],
  exports: [NgUtilsStateful],
  entryComponents: [
    DefaultLoaderComponent,
    DefaultErrorComponent,
  ],
})
export class StatefulModule {
  static forRoot(config: StatefulConfig = {}): ModuleWithProviders<StatefulModule> {
    return {
      ngModule: StatefulModule,
      providers: [
        {
          provide: StatefulConfigProvider,
          useValue: config
        },
      ]
    };
  }
}
