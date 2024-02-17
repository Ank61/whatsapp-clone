import { atom, selector } from 'recoil';

export const userNameGlobal = atom({
    key: 'userNameGlobal',
    default: ''
});

export const privateUser = atom({
    key: 'privateUser',
    default: ''
})

