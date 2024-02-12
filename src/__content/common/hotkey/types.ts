export type KeyboardModifiers = {
    alt?: boolean;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    mod?: boolean;
  };
  
  export interface HotkeySimple {
    key: string;
    handler: (...arg: any[]) => any;
  }
  
  export interface HotkeyDetail extends Omit<HotkeySimple, 'key'>, KeyboardModifiers {
    keys?: string[];
    description?: string;
  }
  