export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    res.status(500).send("Missing OAUTH_GITHUB_CLIENT_ID");
    return;
  }

  const siteUrl = "https://nadeed.vercel.app";
  const redirectUri = `${siteUrl}/api/callback`;

  const state = encodeURIComponent(
    JSON.stringify({
      provider: "github",
      site_id: "nadeed.vercel.app"
    })
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`
  });

  res.end();
}
