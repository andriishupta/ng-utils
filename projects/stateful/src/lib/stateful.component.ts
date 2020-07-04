import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-stateful',
  template: `
    <p>
      stateful works!
    </p>
  `,
  styles: [
  ]
})
export class StatefulComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
