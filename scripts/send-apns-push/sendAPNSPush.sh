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
      "iv": "zn0iD+krgT7wIQBm",
      "tag": "7QGMuX+z9iftg3qG8HbPRQ==",
      "invite": "LoD5PBTkFXLPQYkkEA1K/ynv7PFboXfbc6nctey2sB6dgSpQm2Gzn8UzWO81bWFCx4h863AWtCDim3D57wSpZYsZa+ibhAgHUx0cfHeGw7apXM8ucGBRuIT0b0/NTU65PD0a9I334MgOw9pTxPOsxhyLlS9ppKEkVxvjvJtIbgOn/hwEVg67gKv0y5FwYUzQhdVIQIIEGL/otxeuUEZgbLIucFUuGOcBroRqhjH0yhOx8NblkK0JSQB+7EcnktHpOzs3gMbAbIKKUritU3YKO9+Pn2u7FZ48Lc4fzG8qFlJaA68j30ObhYvu1tp14UY5ZguEYEP2g5d0pYdAcQ4etoqTwiwUGt9xKpcsSO+SA9qbqLv39kwbbmYfPgIyegodiL2Yi1axPetvjhKrxYLM5FooLgSiBEKVL34BqOzx0OFzNbGxC9smPyUPxwcAwKdxQ7YBSqbzlHpscFQ1IK1u6J1RmtB8dC7SE5CLDzrPvMG6O5TvAaimZM2Gbez1Iu9QYOrZPtbG9BDoQQ7bX172lD4gMTlpaakdBFauvV33GbFOiWu+fE6WnyyOUXzgI4uhAT3QQd10x0fj73FSYzaOAKCV8Whx9nidS/g+/8FG3/vtMLYhssHdzQMnXoXZtuAh9Kfw0vfVjXExEpXUz49hzlCHwg5LzudwaeEn3wlR6+iog/EHKfHR6Z6ODqTxe0ceJ3AOv+FVfct/arbv8KYv4QJmaGGZrxTQHvXgIDzm95gNRAZ8P1WpPRb/ZCsyTNn8k7+l43pmPYYVWQNBFsRrBvuQiFXiVGXYnCltZzXDGu3R9HPVFywz7nBXAwBfYm6CU0xCHzNQyf0As6sURT+0OWh/Na5ukWajeDpkubisuVj9f/jfK2FMgH0t1Ex6s+iEbY+ayzJepaH4ojCCkobWE72fC2gX/K7mX1wGVcTxQXPjJwQzkRlj8Q9Nr9Ow72cENzVofKA8OaiCO9NtFfmmxHEiK4s9oD05t9wrEfukwh8+Py0hdQ6AHNl7t3HTzG1auBK9Y7+EPE73rBCBWwYLtS3VJ9GFc2E65aTruowdYBK25qiwrs+7mAmLJ4Nyf45S+6Yf4zK9XK/0rZHZ/5zeoB3LmQg6BweQwMY4q+xQVAfnetFL5E+bnPtNAjntAtug7g51BZ8bbGXXeEmkffFfAH3LbM+mdX4Y9DhMI6PQ8lchcdpZFWKH80MBV34/nDT8vBny2iupbGBu8rqlY+VCq/G3knUZJk/fgmuDvQxewYffwNyMA5QqpqocByYjTQw6sn9FqPDrqbBRihZXRBnx1vciiJpaMl1MTKg7LM5YwsNPZZyCSXBoQCkOCzfBX00ltchroH9sbzDOzF5Q8+x9N6OwkKlRgqINYsiaXdiY0QOREHdrSv8ncCtJknDz2XFxI2GHiTQX8sxPHElwC9dBR/TBtvPfMMq2RfhKOYc7hmZzeClAGQOEMw/gMTqu/hzmfg=="
      }
    }
  }'

