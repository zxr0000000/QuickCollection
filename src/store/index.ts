import { createPinia } from 'pinia';
const pinia = createPinia();

export { pinia };
export * from './modules/bookmarks';
export * from './modules/user';
export * from './modules/pm';
export * from './base/baseStore'
