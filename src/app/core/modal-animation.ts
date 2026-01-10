import { animate, style, transition, trigger } from '@angular/animations';

export const previewModalAnimation = trigger('previewModal', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale(0.96) translateY(20px)'
    }),
    animate(
      '260ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      })
    )
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.6, 1)',
      style({
        opacity: 0,
        transform: 'scale(0.96) translateY(12px)'
      })
    )
  ])
]);
