import React, { useEffect, useRef } from "react";

type RoomPreviewProps = {
  /** Image to show while the room preview is loading. */
  loadingUrl?: string;
  /** URL of the room preview. */
  previewUrl?: string;
  /** Custom styles. */
  style?: React.CSSProperties;
};

const RoomPreview: React.FC<RoomPreviewProps> = ({
  previewUrl,
  loadingUrl,
  style,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const currImg = useRef<HTMLImageElement>(getDefaultImage());

  // Append the image to the DOM when the component is mounted.
  useEffect(() => {
    if (container.current) {
      container.current.appendChild(currImg.current);
    }
  }, [])

  // Image initialization
  useEffect(() => {
    let imageErrorListener: (() => void) | undefined;

    if (loadingUrl) {
      currImg.current.src = loadingUrl;
      imageErrorListener = () => {
        if (currImg.current.src !== loadingUrl) {
          currImg.current.src = loadingUrl;
        }
      }
      currImg.current.addEventListener("error", imageErrorListener);
    } else {
      // User removed loadingUrl; if we are displaying it, let's remove it.
      if (currImg.current.src === loadingUrl) {
        currImg.current.src = '';
      }
    }

    // We capture a copy of the ref to make sure that the cleanup function uses
    // this one instead of the new ref at the time the cleanup function runs.
    const currImgCopy = currImg.current

    return () => {
      if (imageErrorListener) {
        currImgCopy.removeEventListener("error", imageErrorListener)
      }
    }
  }, [loadingUrl]);

  useEffect(() => {
    if (previewUrl) {
      currImg.current.src = previewUrl;
    }

    let intv: NodeJS.Timer | null = null;

    if (previewUrl) {
      intv = setInterval(() => {
        currImg.current.src = previewUrl;
      }, 10000);
    }

    return () => {
      if (intv) {
        clearInterval(intv);
      }
    };
  }, [previewUrl]);

  return (
    <div
      ref={container}
      style={{
        height: 200,
        aspectRatio: "16/9",
        backgroundColor: "black",
        ...style,
      }}
    ></div>
  );
};

/**
 * We need an in-memory Image object because a native Image object pre-fetches
 * the new image before replacing the previous one when using `img.src = x`. You
 * cannot do that using React.
 */
function getDefaultImage() {
  const img = new Image();
  img.style.height = "100%";
  img.style.width = "100%";
  return img;
}

export default RoomPreview;
