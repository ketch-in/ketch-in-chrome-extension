import PureComponent, { PureComponentProps } from "../../core/PureComponent";
import { COLOR_LIST } from "./constants";

export interface ColorPaletteLayerProps extends PureComponentProps {
  onColorSelect: (selectedColor: string) => void;
}
export default class ColorPaletteLayer extends PureComponent {
  private onColorSelect: (selectedColor: string) => void;

  constructor({
    removeDelay,
    onColorSelect = () => {},
  }: ColorPaletteLayerProps) {
    super({removeDelay, defaultClassName: 'toolbar__color-palette'})
    this.onColorSelect = onColorSelect;
  }

  mount(target: HTMLElement) {
    const targetEl = this.getElement();
    const wrapperList = this.createElement('ul');

    COLOR_LIST.map(color => {
      const item = this.createElement('li');
      const colorBtn = this.createElement('label');

      // TODO: 추후 css 처리
      colorBtn.style.width = '27px';
      colorBtn.style.height = '27px';
      colorBtn.style.display = 'inline-block'

      colorBtn.classList.add('color-unit');
      colorBtn.dataset.color = color;
      colorBtn.style.backgroundColor = color;

      item.classList.add(`btn-${color}`);
      item.appendChild(colorBtn);

      wrapperList.appendChild(item);
    });

    wrapperList.classList.add('wrapper');
    targetEl.appendChild(wrapperList);

    wrapperList.onclick = (event) => {
      const eTarget = event.target as HTMLElement;
      if (eTarget.closest('li')) {
        const curColor = eTarget.dataset.color;
        if (curColor) this.onColorSelect(curColor);
      }
    }

    document.querySelector('.toolbar')?.addEventListener('click',
      e => {
        const eTarget = e.target as HTMLElement;
        if (!eTarget.contains(targetEl)) {
          this.unmount().then(this.onClose);
        }
      }
    );

    return super.mount(target);
  }

  unMount() {
    this.unmount();
  }

  onClose() {
    document.body.onclick = null;
  }
}
