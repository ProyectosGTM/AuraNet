import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrl: './recarga.component.scss'
})
export class RecargaComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  constructor(){}

  ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Wizard', active: true }];
  }

}
