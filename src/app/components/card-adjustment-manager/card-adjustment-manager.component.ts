import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-adjustment-manager',
  templateUrl: './card-adjustment-manager.component.html',
  styleUrls: ['./card-adjustment-manager.component.scss'],
})
export class CardAdjustmentManagerComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {}

}
