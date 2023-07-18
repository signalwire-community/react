const config = {
  client_id: process.env["CLIENT_ID"],
  redirect_uri: process.env["REDIRECT_URI"],

  // any valid PKCE code challenge pair will work, including this:
  code_challenge: "CUZX5qE8Wvye6kS_SasIsa8MMxacJftmWdsIA_iKp3I",
  code_verifier: "u1ta-MQ0e7TcpHjgz33M2DcBnOQu~aMGxuiZt0QMD1C",

  refresh_token: process.env["REFRESH_TOKEN"],
};
export default config;
