import { act, renderHook } from "@testing-library/react-hooks";
import {
  decoratePermissionObject,
  makeBarePermissionObject,
  usePermissions,
} from "./usePermissions";

const validPermissionArray: string[] = [
  "room.self.audio_mute",
  "room.self.audio_unmute",
  "room.self.video_unmute",
  "room.member.audio_unmute",
  "room.member.video_unmute",
  "room.member.something.other",
  "room.screenshare",
];

describe("usePermissions", () => {
  test("permission objects are decorated", () => {
    const permission1 = makeBarePermissionObject(validPermissionArray);
    const decorated = decoratePermissionObject(permission1);
    expect(decorated).toEqual({
      screenshare: true,
      self: {
        audio_mute: true,
        audio_unmute: true,
        audio_full: true,
        video_full: false,
        speaker_full: false,
        video_unmute: true,
        remove: true,
      },
      member: {
        audio_full: false,
        video_full: false,
        speaker_full: false,
        audio_unmute: true,
        video_unmute: true,
        something: { other: true },
      },
      layout: false,
    });
  });

  test("invalid permission string is ignored", () => {
    const permission1 = makeBarePermissionObject(["room", "room.screenshare"]);
    const permission2 = makeBarePermissionObject([
      "",
      "room.member.audio_mute",
    ]);
    const permission3 = makeBarePermissionObject(["", "", ""]);
    const permission4 = makeBarePermissionObject([]);
    const permission5 = makeBarePermissionObject([""]);
    expect(permission1).toEqual({ screenshare: true });
    expect(permission2).toEqual({ member: { audio_mute: true } });
    expect(permission3).toEqual({});
    expect(permission4).toEqual({});
    expect(permission5).toEqual({});
  });

  test("empty permission array returns empty permission object", () => {
    const permission = makeBarePermissionObject([]);
    expect(permission).toEqual({});
  });

  test("sibling properties are false for existing values", () => {
    const permissionObj = makeBarePermissionObject(validPermissionArray);
    expect(permissionObj.any_other_property).toBe(false);
    expect(permissionObj.self.some_property).toBe(false);
    expect(permissionObj.member["any_other_property"]).toBe(false);
  });

  test("deeper nested parameters are undefined", () => {
    const permissionObj = makeBarePermissionObject(validPermissionArray);
    expect(permissionObj.any_other_property.property).toBeUndefined();
    expect(permissionObj.self.some_property.property).toBeUndefined();
  });

  test("valid string array returns valid object", () => {
    const permissionObj = makeBarePermissionObject(validPermissionArray);
    expect(permissionObj).toEqual({
      screenshare: true,
      self: {
        audio_mute: true,
        audio_unmute: true,
        video_unmute: true,
      },
      member: {
        audio_unmute: true,
        video_unmute: true,
        something: { other: true },
      },
    });
  });

  it("should return an empty object when roomSession is null", () => {
    const { result } = renderHook(() => usePermissions(null));
    expect(result.current).toBeTruthy();
  });

  it("should react to room.joined", () => {
    let emitRoomJoined: any;

    const roomSession = {
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "room.joined") {
          emitRoomJoined = cb;
        }
      }),
      off: jest.fn(),
    };

    Object.defineProperty(roomSession, "permissions", {
      get: jest
        .fn()
        .mockImplementationOnce(() => ["room.aaa.bbb", "room.ccc"])
        .mockImplementationOnce(() => ["room.xxx.bbb"]),
    });

    const { result } = renderHook(() => usePermissions(roomSession as any));

    expect(result.current.aaa.bbb).toBe(true);
    expect(result.current.ccc).toBe(true);

    act(() => {
      emitRoomJoined();
    });

    expect(result.current.xxx.bbb).toBe(true);
    expect(result.current.ccc).toBeFalsy();
  });
});
