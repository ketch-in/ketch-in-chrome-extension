import PureComponent, { PureComponentProps } from "./PureComponent";

export interface MomentComponentProps extends PureComponentProps {
  momentDelay?: number;
}

export default class MomentComponent extends PureComponent {
  private momentDelay: number;
  private momentTimeout: number | null;

  constructor({
    data,
    removeDelay,
    defaultClassName,
    momentDelay = 2000,
  }: MomentComponentProps) {
    super({ data, removeDelay, defaultClassName });
    this.momentDelay = momentDelay;
    this.momentTimeout = null;
  }

  private setMomentTimeout(momentTimeout: number | null) {
    this.momentTimeout = momentTimeout;
    return this;
  }

  async mount(target: HTMLElement) {
    return super
      .mount(target)
      .then(() =>
        this.setMomentTimeout(
          window.setTimeout(() => this.unmount(), this.momentDelay)
        )
      );
  }

  protected unmount() {
    if (this.momentTimeout) {
      clearTimeout(this.momentTimeout);
      this.setMomentTimeout(null);
    }
    return super.unmount();
  }
}
