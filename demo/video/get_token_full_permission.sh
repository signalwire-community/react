#! /bin/sh

if [ $# -ne 3 ]; then
    printf "\n\
    Use this tool to get a room token for SignalWire Video with full permissons.\n\n\
    Usage:\t./get_token.sh <space name> <project_id> <api_token>\n\
    Example:\t./get_token.sh guides 123e4567-e89b-12d3-a456-426614174000 PT3d3753242c821d3568e214a12084433a07685e67\n\n"
    exit 1
fi

printf "\n\n"

curl --location --request POST "https://$1.signalwire.com/api/video/room_tokens" \
--header "Authorization: Basic `printf \"$2:$3\" | base64`" \
--header 'Content-Type: application/json' \
--data-raw '{
  "room_name": "room",
  "user_name": "full_permission_user",
  "permissions": [
    "room.hide_video_muted",
    "room.show_video_muted",
    "room.list_available_layouts",
    "room.playback",
    "room.recording",
    "room.set_layout",
    "room.member.audio_mute",
    "room.member.audio_unmute",
    "room.member.deaf",
    "room.member.undeaf",
    "room.member.remove",
    "room.member.set_input_sensitivity",
    "room.member.set_input_volume",
    "room.member.set_output_volume",
    "room.member.video_mute",
    "room.member.video_unmute",
    "room.self.additional_source",
    "room.self.audio_mute",
    "room.self.audio_unmute",
    "room.self.deaf",
    "room.self.undeaf",
    "room.self.screenshare",
    "room.self.set_input_sensitivity",
    "room.self.set_input_volume",
    "room.self.set_output_volume",
    "room.self.video_mute",
    "room.self.video_unmute",
    "room.self.set_position",
    "room.member.set_position"
    
  ]
}'

printf "\n\n\n"
