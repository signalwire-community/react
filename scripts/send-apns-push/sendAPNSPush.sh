#! /bin/bash

set -o allexport
source .env 
set +o allexport

curl -i --location "https://api.sandbox.push.apple.com:443/3/device/${DEVICE_TOKEN}" \
--header 'apns-push-type: voip' \
--header 'apns-expration: 4' \
--header 'apns-priority: 10' \
--header "apns-topic: ${BUNDLE_ID}.voip" \
--header "Content-Type: application/json" \
--http2 \
--cert "${P12_CERT_LOCATION}" \
--cert-type 'P12' \
--data '
{
  "aps":{
    "alert":{
      "version": "1",
      "type": "call_invite",
      "title": "Incoming Call",
      "notification_uuid": "982cf533-7b1b-4cf6-a6e0-004aab68c503",
      "incoming_caller_id": "0123456789",
      "incoming_caller_name": "Tester",
      "with_video": "true",
      "encryption_type": "aes_256_gcm",
      "iv": "+ojw3NtIgHkHAoD5",
      "tag": "eIkch7g8h75m2QWrvdB3UQ==",
      "invite": "YMK3bz0VtiQvxpxWRIE="
      }
    }
  }'
