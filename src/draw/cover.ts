export interface DrawPoint {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

function createCoverElement(videoElement: HTMLVideoElement) {
  const { x, y, width, height } = videoElement.getBoundingClientRect();
  const coverElement =
    document.getElementById('cover') || document.createElement('div');
  coverElement.classList.add('cover');
  coverElement.style.position = 'absolute';
  coverElement.style.left = `${x}px`;
  coverElement.style.top = `${y}px`;
  coverElement.style.width = `${width}px`;
  coverElement.style.height = `${height}px`;
  coverElement.style.zIndex = '10';
  coverElement.style.display = 'block';

  return coverElement;
}

export function appendCoverElement(
  videoElement: HTMLVideoElement,
  onDraw: (drawPoint: DrawPoint) => void
) {
  const coverElement = createCoverElement(videoElement);

  coverElement.addEventListener('mousemove', (e: MouseEvent) => {
    // 마우스 왼쪽 버튼이 눌려있어야 한다.
    if (e.buttons !== 1) return;

    onDraw({
      width: coverElement.clientWidth,
      height: coverElement.clientHeight,
      offsetX: e.offsetX,
      offsetY: e.offsetY,
    });
  });

  coverElement.addEventListener('mouseout', () => {
    coverElement.style.display = 'none';
  });

  coverElement.style.display = 'block';
  document.body.append(coverElement);
}
