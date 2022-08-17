import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageErrorEventData,
  ImageProps,
  ImageStyle,
  NativeSyntheticEvent,
  StyleProp,
} from 'react-native';

type RoomPreviewProps = {
  /** Image to show while the room preview is loading. */
  loadingUrl?: { uri: string };
  /** URL of the room preview. */
  previewUrl?: { uri: string };
  /** Custom styles. */
  style?: StyleProp<ImageStyle> | undefined;
};

const BLACK_IMG = {
  uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
};

const RoomPreview: React.FC<RoomPreviewProps> = ({
  previewUrl,
  loadingUrl,
  style,
}) => {
  const [currUrl, setCurrUrl] = useState<{ uri: string } | undefined>(
    loadingUrl
  );

  useEffect(() => {
    setCurrUrl(loadingUrl);
  }, [loadingUrl]);

  useEffect(() => {
    if (previewUrl) {
      setCurrUrl(previewUrl);
    }

    let intv: NodeJS.Timer | null = null;

    if (previewUrl) {
      intv = setInterval(async () => {
        // Update the object reference to force a refresh
        setCurrUrl({ ...previewUrl });
      }, 10000);
    }

    return () => {
      if (intv) {
        clearInterval(intv);
      }
    };
  }, [previewUrl]);

  function onError(e: any) {
    if (e?.nativeEvent?.error && e?.nativeEvent?.error?.includes('animated-webp')) {
      // error: "To encode animated webp please add the dependency to the animated-webp module"
      console.warn("You need to enable animated webP support for room previews to work.")
    }

    if (currUrl?.uri !== loadingUrl?.uri) {
      setCurrUrl(loadingUrl);
    }
  }

  return (
    <EtagImage
      source={currUrl ?? BLACK_IMG}
      onError={onError}
      fadeDuration={0}
      style={[
        {
          aspectRatio: 16 / 9,
          backgroundColor: 'black',
        },
        style,
      ]}
    />
  );
};

type EtagImageProps = Omit<ImageProps, 'source' | 'onError'> & {
  source: { uri?: string };
  onError?:
    | ((error: NativeSyntheticEvent<ImageErrorEventData> | null) => void)
    | undefined;
};

/**
 * This component is similar to the Image component, but has some additional caching checks.
 *
 * In particular, whenever you set the `source` property, this component:
 *
 *  1. Makes a HEAD request to check if the Etag of the resouce changed.
 *  2. If the Etag changed, downloads the new image (while still displaying the old one)
 *  3. Replaces the old image with the new image
 *
 * This ensures that
 *
 *  - When changing image, no "empty image" is displayed while downloading the new one.
 *  - The image is properly refreshed (the native Image components never invalidates cache)
 */
function EtagImage(props: EtagImageProps) {
  const [source, setSource] = useState(props.source);
  const lastEtag = useRef<string | null>(null);

  useEffect(() => {
    if (
      !props.source ||
      !props.source.uri ||
      props.source.uri.startsWith('data')
    ) {
      setSource(props.source);
    } else {
      (async () => {
        try {
          const response = await fetch(props.source.uri!, { method: 'HEAD' });
          const etag = response.headers.get('etag');
          if (etag !== lastEtag.current) {
            // The image changed, we need to refresh it.
            setSource({
              uri: (
                await urlContentToDataUriNoCache(props.source.uri!)
              ).toString(),
            });
            lastEtag.current = etag;
          }
        } catch (e) {
          props.onError?.(null);
        }
      })();
    }
  }, [props.source]);

  return <Image {...props} source={source}></Image>;
}

/**
 * Takes a URL and downloads it as a data URI. This function does NOT use cache
 * for the network request.
 */
function urlContentToDataUriNoCache(
  url: string
): Promise<string | ArrayBuffer> {
  return fetch(url, {
    headers: new Headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }),
  })
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((callback) => {
          let reader = new FileReader();
          reader.onload = function () {
            callback(this.result);
          };
          reader.readAsDataURL(blob);
        })
    );
}

export default RoomPreview;
