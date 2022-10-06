import { act, renderHook } from "@testing-library/react-hooks";
import useSelf from "./useSelf";

describe("useSelf", () => {
  it("reacts to room.joined", () => {
    const roomSession = {
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "room.joined") {
          cb({
            member_id: "member1",
            room_session: {
              members: [
                {
                  id: "member0",
                  audio_muted: true,
                  name: "aaa",
                },
                {
                  id: "member1",
                  audio_muted: true,
                  name: "bbb",
                },
                {
                  id: "member2",
                  audio_muted: true,
                  name: "ccc",
                },
              ],
            },
          });
        }
      }),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useSelf(roomSession as any));

    expect(roomSession.on).toHaveBeenCalledWith(
      "room.joined",
      expect.anything()
    );

    expect(result.current?.name).toBe("bbb");
    expect(result.current?.audioMuted).toBe(true);
  });

  it("reacts to member.updated", async () => {
    let emitMemberUpdated: any;

    const roomSession = {
      active: true,
      memberId: "member1",
      getMembers: jest.fn().mockImplementation(async () => ({
        members: [
          {
            id: "member1",
            input_volume: 0,
          },
          {
            id: "member2",
            input_volume: 0,
          },
        ],
      })),
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "member.updated") {
          emitMemberUpdated = cb;
        }
      }),
      off: jest.fn(),
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useSelf(roomSession as any)
    );
    await waitForNextUpdate();

    expect(roomSession.on).toHaveBeenCalledWith(
      "member.updated",
      expect.anything()
    );

    expect(result.current?.inputVolume).toBe(0);

    act(() => {
      emitMemberUpdated({
        member: {
          updated: ["input_volume"],
          id: "member1",
          input_volume: 1,
        },
      });
      emitMemberUpdated({
        member: {
          updated: ["input_volume"],
          id: "member1",
          input_volume: 2,
        },
      });
      emitMemberUpdated({
        member: {
          updated: ["input_volume"],
          id: "member2",
          input_volume: 3,
        },
      });
    });

    expect(result.current?.inputVolume).toBe(2);
  });

  it("reacts to member.talking", async () => {
    let emitMemberTalking: any;

    const roomSession = {
      active: true,
      memberId: "member1",
      getMembers: jest.fn().mockImplementation(async () => ({
        members: [
          {
            id: "member1",
            input_volume: 0,
          },
          {
            id: "member2",
            input_volume: 0,
          },
        ],
      })),
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "member.talking") {
          emitMemberTalking = cb;
        }
      }),
      off: jest.fn(),
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useSelf(roomSession as any)
    );
    await waitForNextUpdate();

    expect(result.current?.talking).toBe(undefined);

    act(() => {
      emitMemberTalking({
        member: {
          id: "member1",
          talking: true,
        },
      });
      emitMemberTalking({
        member: {
          id: "member2",
          talking: false,
        },
      });
    });

    expect(result.current?.talking).toBe(true);

    act(() => {
      emitMemberTalking({
        member: {
          id: "member1",
          talking: false,
        },
      });
    });

    expect(result.current?.talking).toBe(false);
  });
});
