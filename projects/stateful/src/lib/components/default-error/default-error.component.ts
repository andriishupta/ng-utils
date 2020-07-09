import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng-utils-default-error',
  template: `
    <p>
      default-error works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultErrorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
