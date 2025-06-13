import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'Tablero',
        icon: 'uil-home-alt',
        link: '/',
    },
    {
        id: 3,
        label: 'Recarga',
        icon: 'uil-money-bill',
        link: '/recarga',
    },
    {
        id: 4,
        label: 'Perfil',
        icon: 'uil-user-circle',
        link: '/contacts/profile',
    },
    {
        id: 5,
        label: 'Cerrar Sesión',
        isTitle: true,
    },
    {
        id: 6,
        label: 'Login',
        icon: 'uil-arrow-circle-left',
        link: '/account/login',
    },
];

