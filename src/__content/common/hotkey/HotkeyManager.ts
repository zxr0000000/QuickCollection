/**
 * @since 2023/08/29
 * @author my
 * @fileOverview 
 */
// import { addDomListener } from '@ies/ic-common-utils';
// import { TTSEditorController } from '../tts-editor-controller';
import { addDomListener } from '@/ulits/dom';
import { HotkeyDetail, HotkeySimple } from './types';
import { isHotkeyMatching, parseHotkey } from './utils';

export class HotkeyManager {
  hotkeys: HotkeyDetail[] = [];

  private _cleanTasks: ((...args: any[]) => any)[] = [];

  constructor() {
    const dispose = addDomListener(window, 'keydown', this.keydown.bind(this) as EventListener);

    this.registerCleanTask(() => {
      dispose();
    });
  }

  keydown(event: KeyboardEvent) {
    if (event.code === undefined) {
      return;
    }

    this.hotkeys.forEach((hotkey) => {
      if (isHotkeyMatching(event, hotkey)) {
        hotkey.handler(event);
      }
    });
  }

  /**
   * 添加快捷键
   */
  addHotkeys(hotkeys: HotkeySimple[]) {
    const hotkeyDetails: HotkeyDetail[] = hotkeys.map((hk) => {
      return {
        ...parseHotkey(hk.key),
        handler: hk.handler,
      };
    });

    this.hotkeys = this.hotkeys.concat(...hotkeyDetails);
  }

  registerCleanTask(fn: (...args: any[]) => any) {
    this._cleanTasks.push(fn);
  }

  destroy() {
    this._cleanTasks.forEach((f) => f());
    this._cleanTasks = [];
  }
}

export const hotkeyManager = new HotkeyManager()
