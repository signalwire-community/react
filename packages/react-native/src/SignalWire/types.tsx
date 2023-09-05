import type { SignalWire } from '@signalwire/js';
export type SignalWireContract = Awaited<ReturnType<typeof SignalWire>>;
export type SignalWireOptions = Parameters<typeof SignalWire>[0];

export type Call = any; // Eventually this will describe the call object
