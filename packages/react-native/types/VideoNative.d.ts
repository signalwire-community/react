/// <reference types="react" />
import 'react-native-get-random-values';
import type { IVideoProps } from '@signalwire-community/react';
interface IVideoNativeProps extends IVideoProps {
    style: CSSStyleDeclaration;
}
export default function VideoNative({ token }: IVideoNativeProps): JSX.Element;
export {};
