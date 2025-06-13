import { Component, OnInit } from '@angular/core';
import { fadeInRightAnimation } from 'src/app/core/fade-in-right.animation';

@Component({
  selector: 'app-recarga',
  templateUrl: './recarga.component.html',
  styleUrl: './recarga.component.scss',
  animations: [fadeInRightAnimation],
})
export class RecargaComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  constructor(){}

  ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Wizard', active: true }];
  }

}
