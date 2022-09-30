export enum SHAPE_LABEL {
  RECT = 'rect',
  ROUNDED_RECT = 'rounded-rect',
  CIRCLE = 'circle',
  ELLIPSE = 'triangle',
}

export const SHAPE_SVG_CODES: {[index in SHAPE_LABEL]: string} = {
  [SHAPE_LABEL.RECT]: `<rect x='5' y='5' width='20' height='20' fill='none' stroke='grey' />`,
  [SHAPE_LABEL.ROUNDED_RECT]: `<rect x='5' y='5' rx='4' width='20' height='20' fill='none' stroke='grey' />`,
  [SHAPE_LABEL.CIRCLE]: `<circle cx='15' cy='15' r='10' fill='none' stroke='grey' />`,
  [SHAPE_LABEL.ELLIPSE]: `<ellipse cx='15' cy='16' rx='12' ry='8' fill='none' stroke='grey' />`,
};
