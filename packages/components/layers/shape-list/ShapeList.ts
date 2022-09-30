import PureComponent, { PureComponentProps } from "../../core/PureComponent";
import { SHAPE_LABEL, SHAPE_SVG_CODES } from "./constants";

export interface Shape {
  type: string,
  svg: string,
}

export interface ShapeListLayerProps extends PureComponentProps {
  onShapeSelect: (selectedShape: Shape) => void;
}

export default class ShapeListLayer extends PureComponent {
  private onShapeSelect: (selectedShape: Shape) => void;

  constructor({
    removeDelay,
    onShapeSelect = () => {},
  }: ShapeListLayerProps) {
    super({removeDelay, defaultClassName: 'toolbar__shape-list'});
    this.onShapeSelect = onShapeSelect;
  }

  mount(target: HTMLElement) {
    const targetEl = this.getElement();
    const wrapperList = this.createElement('ul');

    Object.entries(SHAPE_SVG_CODES).map(([type, svg]) => {
      const item = this.createElement('li');
      const shapeBtn = this.createSVGElement(40, 40);

      // shapeBtn.style.backgroundColor = '#EEE';
      shapeBtn.style.borderRadius = '4px';
      shapeBtn.innerHTML = svg;
      shapeBtn.dataset.shape = type;

      item.classList.add(`btn-${type}`);
      item.appendChild(shapeBtn);

      wrapperList.appendChild(item);
    });

    wrapperList.classList.add('wrapper');
    targetEl.appendChild(wrapperList);

    wrapperList.onclick = (event) => {
      event.stopPropagation();
      const eTarget = event.target as HTMLElement;
      if (eTarget.closest('li')) {
        const curShape = eTarget.dataset.shape as SHAPE_LABEL;
        if (curShape) this.onShapeSelect({type: curShape, svg: SHAPE_SVG_CODES[curShape]});
        this.unmount();
      }
    }

    document.querySelector('.toolbar')?.addEventListener('click', e => {
      const eTarget = e.target as HTMLElement;
      if (!eTarget.contains(targetEl)) {
        this.unmount().then(this.onClose);
      }
    });

    return super.mount(target);
  }

  unmount() {
    return super.unmount();
  }

  onClose() {

  }
}
