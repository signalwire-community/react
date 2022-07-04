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

  // Initialization
  useEffect(() => {
    if (container.current) {
      container.current.appendChild(currImg.current);
      if (loadingUrl) {
        currImg.current.src = loadingUrl;
        currImg.current.addEventListener("error", () => {
          if (currImg.current.src !== loadingUrl) {
            currImg.current.src = loadingUrl;
          }
        });
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
 * the new image before replacing the previous one using `img.src = x`, unlike using React.
 */
function getDefaultImage() {
  const img = new Image();
  img.style.height = "100%";
  img.style.width = "100%";
  return img;
}

export default RoomPreview;
