import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInRightAnimation = trigger('fadeInRight', [
  transition(':enter', [
    style({
      transform: 'translateX(80px) scale(0.94)',
      opacity: 0
    }),
    animate(
      '800ms cubic-bezier(0.19, 1, 0.22, 1)',
      style({
        transform: 'translateX(0) scale(1)',
        opacity: 1
      })
    )
  ])
]);
