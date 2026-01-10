import { animate, style, transition, trigger } from '@angular/animations';

export const hintSwapAnimation = trigger('hintSwap', [
  transition('* => *', [
    style({ opacity: 0, transform: 'translateY(6px)' }),
    animate('180ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
