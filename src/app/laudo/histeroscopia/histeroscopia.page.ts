import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-histeroscopia',
  templateUrl: './histeroscopia.page.html',
  styleUrls: ['./histeroscopia.page.scss'],
})
export class HisteroscopiaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  toggleChange(event) {
    let toggle = event.source;
    if (toggle) {
        let group = toggle.buttonToggleGroup;
        if (event.value.some(item => item == toggle.value)) {
            group.value = [toggle.value];
        }
    }
}
}
