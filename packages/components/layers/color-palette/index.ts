import PureController, { PureControllerOptions } from "../../core/PureController";
import ColorPaletteLayer, { ColorPaletteLayerProps } from "./ColorPalette";

export default class ColorPaletteController extends PureController {
  private layer: unknown;
  constructor(targetEl: Element, options: PureControllerOptions) {
    super(targetEl, options, true);
  }

  open(props: ColorPaletteLayerProps) {
    this.layer = new ColorPaletteLayer({...props, removeDelay: 0})
    if (this.layer instanceof ColorPaletteLayer) {
      return this.layer.mount(this.target);
    }
    return;
  }

  close() {
    if (this.layer instanceof ColorPaletteLayer) {
      return this.layer.unMount();
    }
  }
}
