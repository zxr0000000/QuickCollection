import { createPinia } from 'pinia';
const pinia = createPinia();

export { pinia };
export * from './modules/bookmarks';
export * from './modules/user';
