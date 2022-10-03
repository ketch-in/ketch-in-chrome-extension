import { DrawPoint, appendCoverElement } from './cover';

function getElementArea(el: HTMLElement) {
  const { width, height } = el.getBoundingClientRect();
  return (width ?? 0) * (height ?? 0);
}

function findOnePinnedParticipantElement() {
  const participantElements = Array.from(
    document.querySelectorAll('div[data-participant-id]')
  ) as HTMLElement[];
  const maxArea = participantElements.reduce(
    (maxArea, el) => Math.max(maxArea, getElementArea(el)),
    0
  );
  const maxAreaElements = participantElements.filter(
    (el) => maxArea === getElementArea(el)
  );

  return maxAreaElements.length === 1 ? maxAreaElements.shift() : null;
}

function isScreenShare(videoElement: any) {
  const shareType = videoElement.srcObject
    ?.getVideoTracks()
    ?.shift()
    ?.label?.split(':')
    .shift();
  return shareType === 'screen';
}

export function onDraw(
  callback: (participantId: string, drawPoint: DrawPoint) => void
) {
  window.addEventListener('mousemove', (e) => {
    if (!e.target) return;

    const participantElement = (e.target as HTMLElement).closest(
      'div[data-participant-id]'
    );
    if (!participantElement) return;

    // one pinned 확인
    if (participantElement !== findOnePinnedParticipantElement()) return;

    const videoElement = Array.from(
      participantElement.querySelectorAll('video')
    )
      .filter((v) => getElementArea(v) > 0)
      .shift();
    if (!videoElement) return;

    // 발표 화면인지 확인
    if (!isScreenShare(videoElement)) return;

    appendCoverElement(videoElement, (drawPoint) => {
      callback(
        participantElement.getAttribute('data-participant-id') as string,
        drawPoint
      );
    });
  });
}
