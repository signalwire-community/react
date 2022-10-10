import { act, renderHook } from "@testing-library/react-hooks";
import useMembers from "./useMembers";

describe("useMembers", () => {
  it("reacts to room.joined", () => {
    const roomSession = {
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "room.joined") {
          cb({
            member_id: "x",
            room_session: {
              members: [
                {
                  room_session_id: "x",
                  input_volume: 0,
                  id: "member1",
                  audio_muted: true,
                  name: "daniel",
                  video_muted: false,
                },
              ],
            },
          });
        }
      }),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useMembers(roomSession as any));

    expect(roomSession.on).toHaveBeenCalledWith(
      "room.joined",
      expect.anything()
    );

    expect(result.current.members).toHaveLength(1);
    expect(result.current.members[0].audioMuted).toBe(true);
    expect(result.current.members[0].videoMuted).toBe(false);
  });

  it("reacts to memberList.updated", () => {
    const roomSession = {
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "memberList.updated") {
          cb({
            members: [
              {
                room_session_id: "x",
                input_volume: 0,
                id: "member1",
                audio_muted: false,
                name: "daniel",
                video_muted: false,
              },
            ],
          });
          cb({
            members: [
              {
                room_session_id: "x",
                input_volume: 0,
                id: "member1",
                audio_muted: true,
                name: "daniel",
                video_muted: false,
              },
            ],
          });
        }
      }),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useMembers(roomSession as any));

    expect(roomSession.on).toHaveBeenCalledWith(
      "memberList.updated",
      expect.anything()
    );

    expect(result.current.members).toHaveLength(1);
    expect(result.current.members[0].audioMuted).toBe(true);
    expect(result.current.members[0].videoMuted).toBe(false);
  });

  it("reacts to member.talking", () => {
    let emitMemberTalking: any;

    const roomSession = {
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "room.joined") {
          cb({
            member_id: "x",
            room_session: {
              members: [
                {
                  room_session_id: "x",
                  input_volume: 0,
                  id: "member1",
                  audio_muted: false,
                  name: "daniel",
                  video_muted: false,
                },
              ],
            },
          });
        }
        if (event === "member.talking") {
          emitMemberTalking = cb;
        }
      }),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useMembers(roomSession as any));

    expect(result.current.members[0].talking).toBe(undefined);

    act(() => {
      emitMemberTalking({
        member: {
          id: "member1",
          talking: true,
        },
      });
    });

    expect(result.current.members[0].talking).toBe(true);

    act(() => {
      emitMemberTalking({
        member: {
          id: "member1",
          talking: false,
        },
      });
    });

    expect(result.current.members[0].talking).toBe(false);
  });

  it("ignores member.talking if the member is not in the list", () => {
    const roomSession = {
      on: jest.fn().mockImplementation((event, cb) => {
        if (event === "member.talking") {
          cb({
            member: {
              id: "member1",
              talking: true,
            },
          });
        }
      }),
      off: jest.fn(),
    };

    const { result } = renderHook(() => useMembers(roomSession as any));

    expect(roomSession.on).toHaveBeenCalledWith(
      "member.talking",
      expect.anything()
    );

    expect(result.current.members).toHaveLength(0);
  });
});
