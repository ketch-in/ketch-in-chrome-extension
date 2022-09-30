export interface PureControllerOptions {
  removeDelay?: number;
  modalWidth?: number;
}

const DEFAULT_PURE_CONTROLLER_OPTIONS: PureControllerOptions = {
  removeDelay: 2000,
  modalWidth: 200,
};

export default class PureController {
  protected target: HTMLElement;
  private options: PureControllerOptions;

  constructor(targetEl: Element, options?: PureControllerOptions, keepContent = false) {
    this.target = targetEl as HTMLElement;
    this.options = options || {};
    !keepContent && this.clear();
  }
  protected getOption(key: keyof PureControllerOptions) {
    return this.options[key] || DEFAULT_PURE_CONTROLLER_OPTIONS[key];
  }

  clear() {
    this.target.innerText = "";
  }
}
