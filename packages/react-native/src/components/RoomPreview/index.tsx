import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
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
      console.log("Setting Interval", previewUrl)
      intv = setInterval(() => {
        setCurrUrl(currUrl => {
          if (currUrl?.uri === previewUrl?.uri) {
            // We are already displaying previewUrl, so just refresh it.
            // webView.current?.clearCache(true)
            // webView.current?.reload()

            return {...currUrl}
          } else {
            // We probably were displaying the "loading" image, so now we should
            // try displaying the previewUrl.
            return previewUrl
          }
        })
      }, 10000);
    }

    return () => {
      if (intv) {
        clearInterval(intv);
      }
    };
  }, [previewUrl]);

  function onHttpError() {
    if (currUrl?.uri !== loadingUrl?.uri) {
      setCurrUrl(loadingUrl)
    }
  }

  return (
    <View style={{
      aspectRatio: 16 / 9,
      backgroundColor: "blue",
      ...style,
    }}>
      <WebView
        ref={webView}
        source={currUrl}
        // cacheEnabled={false}
        onHttpError={onHttpError}
      />
    </View>
  );
};

export default RoomPreview;
