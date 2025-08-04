import type { SignalWire } from "@signalwire/client";
export type SignalWireContract = Awaited<ReturnType<typeof SignalWire>>;
export type SignalWireOptions = Parameters<typeof SignalWire>[0];

export type Call = any; // Eventually this will describe the call object
