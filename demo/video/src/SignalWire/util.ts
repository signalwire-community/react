export function time2TimeAgo(ts: number) {
  // https://stackoverflow.com/a/19540505/2735127
  // This function computes the delta between the
  // provided timestamp and the current time, then test
  // the delta for predefined ranges.

  var d = new Date(); // Gets the current time
  var nowTs = Math.floor(d.getTime() / 1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
  var seconds = nowTs - ts;

  // more that two days
  if (seconds > 2 * 24 * 3600) {
    return "a few days ago";
  }
  // a day
  if (seconds > 24 * 3600) {
    return "yesterday";
  }

  if (seconds > 3600) {
    return "a few hours ago";
  }
  if (seconds > 1800) {
    return "Half an hour ago";
  }
  if (seconds > 60) {
    return Math.floor(seconds / 60) + " minutes ago";
  }
}

/*
    from input {..., channels:{audio:"/private/<xyz>?audio=true",...}}
    to "/private/<xyz>"
*/
export function addressUrlFromAddress(address: any) {
  return (
    address?.channels?.audio?.split("?")?.[0] ??
    address?.channels?.video?.split("?")?.[0] ??
    null
  );
}
