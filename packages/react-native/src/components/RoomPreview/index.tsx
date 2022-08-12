import React, { useEffect, useRef, useState } from "react";
import { WebView } from 'react-native-webview';

type RoomPreviewProps = {
  /** Image to show while the room preview is loading. */
  loadingUrl?: { uri: string };
  /** URL of the room preview. */
  previewUrl?: { uri: string };
  /** Custom styles. */
  style?: any; // ConstructorParameters<typeof WebView>[0]['style'];
};

const RoomPreview: React.FC<RoomPreviewProps> = ({
  previewUrl,
  loadingUrl,
  style,
}) => {
  const webView = useRef<WebView>(null)
  const [currUrl, setCurrUrl] = useState<{ uri: string } | undefined>(loadingUrl);

  useEffect(() => {
    setCurrUrl(loadingUrl)
  }, [loadingUrl]);

  useEffect(() => {
    if (previewUrl) {
      setCurrUrl(previewUrl)
    }

    let intv: NodeJS.Timer | null = null;

    if (previewUrl) {
      intv = setInterval(() => {
        if (currUrl === previewUrl) {
          // We are already displaying previewUrl, so just refresh it.
          webView.current?.reload()
        } else {
          // We probably were displaying the "loading" image, so now we should
          // try displaying the previewUrl.
          setCurrUrl(previewUrl)
        }
      }, 10000);
    }

    return () => {
      if (intv) {
        clearInterval(intv);
      }
    };
  }, [previewUrl]);

  function onHttpError() {
    if (currUrl !== loadingUrl) {
      setCurrUrl(loadingUrl)
    }
  }

  return (
    <WebView 
      ref={webView}
      source={currUrl}
      onHttpError={onHttpError}
      style={{
        height: 200,
        aspectRatio: "16/9",
        backgroundColor: "black",
        ...style,
      }}
    />
  );
};

export default RoomPreview;
