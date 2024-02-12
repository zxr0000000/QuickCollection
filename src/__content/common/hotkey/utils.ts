import { HotkeyDetail, KeyboardModifiers } from './types';

const reservedModifierKeywords = ['shift', 'alt', 'meta', 'mod', 'ctrl'];

const mappedKeys: Record<string, string> = {
  esc: 'escape',
  return: 'enter',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  AltLeft: 'alt',
  AltRight: 'alt',
  MetaLeft: 'meta',
  MetaRight: 'meta',
  OSLeft: 'meta', // 左 command
  OSRight: 'meta', // 右 command
  ControlLeft: 'ctrl',
  ControlRight: 'ctrl',
};

export function mapKey(key: string): string {
  return (mappedKeys[key] || key)
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '');
}

export function parseHotkey(hotkey: string, combinationKey = '+', description?: string): Omit<HotkeyDetail, 'handler'> {
  const keys = hotkey
    .toLocaleLowerCase()
    .split(combinationKey)
    .map((k) => mapKey(k));

  const modifiers: KeyboardModifiers = {
    alt: keys.includes('alt'),
    ctrl: keys.includes('ctrl') || keys.includes('control'),
    shift: keys.includes('shift'),
    meta: keys.includes('meta'),
    mod: keys.includes('mod'),
  };

  const singleCharKeys = keys.filter((k) => !reservedModifierKeywords.includes(k));

  return {
    ...modifiers,
    keys: singleCharKeys,
    description,
  };
}

export function isHotkeyMatching(e: KeyboardEvent, hotkey: HotkeyDetail) {
  const { alt, meta, shift, ctrl, keys } = hotkey;
  const { code, ctrlKey, metaKey, shiftKey, altKey } = e;

  const key = mapKey(code);

  const hasModifier = hotkey.alt || hotkey.ctrl || hotkey.meta || hotkey.mod || hotkey.shift;

  if (hasModifier) {
    if (ctrlKey !== ctrl || metaKey !== meta || shiftKey !== shift || altKey !== alt) {
      return false;
    }
  }

  if (keys && keys.length === 1 && keys.includes(key)) {
    return true;
  } else if (keys) {
    // TODO：多个快捷键
  } else if (!key) {
    return true;
  }

  return false;
}
