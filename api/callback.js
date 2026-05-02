export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const code = req.query.code;

  if (!clientId || !clientSecret) {
    res.status(500).send("Missing GitHub OAuth environment variables");
    return;
  }

  if (!code) {
    res.status(400).send("Missing OAuth code");
    return;
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      res.status(401).send(`GitHub OAuth failed: ${JSON.stringify(tokenData)}`);
      return;
    }

    const authContent = {
      token: tokenData.access_token,
      provider: "github"
    };

    const primaryMessage = `authorization:github:success:${JSON.stringify(authContent)}`;
    const secondaryMessage = `authorization:github:success:${JSON.stringify({ token: tokenData.access_token })}`;

    const lt = String.fromCharCode(60);
    const gt = String.fromCharCode(62);

    const html = [
      `${lt}!doctype html${gt}`,
      `${lt}html lang="ar" dir="rtl"${gt}`,
      `${lt}head${gt}`,
      `${lt}meta charset="utf-8" /${gt}`,
      `${lt}title${gt}NADEED OAuth${lt}/title${gt}`,
      `${lt}/head${gt}`,
      `${lt}body${gt}`,
      `${lt}p${gt}تم تسجيل الدخول. جار العودة إلى لوحة نضيد...${lt}/p${gt}`,
      `${lt}script${gt}`,
      `(function () {`,
      `  const primaryMessage = ${JSON.stringify(primaryMessage)};`,
      `  const secondaryMessage = ${JSON.stringify(secondaryMessage)};`,
      `  const targetOrigin = "https://nadeed.vercel.app";`,
      ``,
      `  function sendAuthMessages() {`,
      `    if (window.opener) {`,
      `      window.opener.postMessage(primaryMessage, targetOrigin);`,
      `      window.opener.postMessage(primaryMessage, "*");`,
      `      window.opener.postMessage(secondaryMessage, targetOrigin);`,
      `      window.opener.postMessage(secondaryMessage, "*");`,
      `    }`,
      `  }`,
      ``,
      `  window.addEventListener("message", function () {`,
      `    sendAuthMessages();`,
      `  });`,
      ``,
      `  let attempts = 0;`,
      `  sendAuthMessages();`,
      ``,
      `  const timer = setInterval(function () {`,
      `    attempts = attempts + 1;`,
      `    sendAuthMessages();`,
      `    if (attempts >= 24) {`,
      `      clearInterval(timer);`,
      `      window.close();`,
      `    }`,
      `  }, 250);`,
      `})();`,
      `${lt}/script${gt}`,
      `${lt}/body${gt}`,
      `${lt}/html${gt}`
    ].join("\n");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`OAuth callback error: ${error.message}`);
  }
}
