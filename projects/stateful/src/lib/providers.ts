import {
  Component,
  InjectionToken,
  Type,
} from '@angular/core';

export type StatefulConfig = {
  loaderComponent?: Type<Component>;
  errorComponent?: Type<Component>;
};

export const StatefulConfigProvider = new InjectionToken<StatefulConfig>('StatefulConfigProvider');
