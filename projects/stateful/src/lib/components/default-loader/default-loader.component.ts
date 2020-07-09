import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng-utils-default-loader',
  template: `
    Loading...
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
