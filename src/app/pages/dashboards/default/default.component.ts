import { Component, OnInit } from '@angular/core';
import { transactions, lineColumAreaChart, revenueColumnChart, customerRadialBarChart, orderRadialBarChart, growthColumnChart} from './data';

import { ChartType } from './dashboard.model';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

export class DefaultComponent implements OnInit {

  lineColumAreaChart: ChartType;
  revenueColumnChart: ChartType;
  orderRadialBarChart: ChartType;
  customerRadialBarChart: ChartType;
  growthColumnChart: ChartType;
  transactions;
  breadCrumbItems: Array<{}>;

  tarjetas = [
  { label: 'Cadenas', icon: 'fas fa-industry', value: 10 },
  { label: 'Salas', icon: 'fas fa-store', value: 67 },
  { label: 'Maquinas', icon: 'fas fa-gamepad', value: 9800 },
  { label: 'Usuarios', icon: 'fas fa-users', value: 35 },
  { label: 'Clientes', icon: 'fas fa-user', value: 1900 },
  { label: 'Monederos', icon: 'fas fa-credit-card', value: 2500 },
  { label: 'Saldo no debitado', icon: 'fas fa-wallet', value: '$180000.0' },
  { label: 'Premios entregados', icon: 'fas fa-gift', value: '$23000.0' }
];


  constructor() { }

  ngOnInit() {
    /**
     * Fetches the data
     */
    this.fetchData();
    this.breadCrumbItems = [{ label: 'Minible' }, { label: 'Dashboard', active: true }];
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    
    this.lineColumAreaChart = lineColumAreaChart;
    this.revenueColumnChart = revenueColumnChart;
    this.orderRadialBarChart = orderRadialBarChart;
    this.customerRadialBarChart = customerRadialBarChart;
    this.growthColumnChart = growthColumnChart;
    
    this.transactions = transactions;
  }

}
