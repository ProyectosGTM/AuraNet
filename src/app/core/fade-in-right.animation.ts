import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInRightAnimation = trigger('fadeInRight', [
  transition(':enter', [
    style({
      transform: 'translateX(40px)',
      opacity: 0
    }),
    animate(
      '650ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({
        transform: 'translateX(0)',
        opacity: 1
      })
    )
  ])
]);
