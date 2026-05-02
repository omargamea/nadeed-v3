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

    const successMessage = `authorization:github:success:${JSON.stringify(authContent)}`;

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
      `  const successMessage = ${JSON.stringify(successMessage)};`,
      ``,
      `  function sendSuccess(origin) {`,
      `    if (!window.opener) return;`,
      `    window.opener.postMessage(successMessage, origin || "*");`,
      `  }`,
      ``,
      `  window.addEventListener("message", function (event) {`,
      `    if (!event) return;`,
      `    if (event.data === "authorizing:github") {`,
      `      sendSuccess(event.origin);`,
      `      setTimeout(function () { window.close(); }, 500);`,
      `    }`,
      `  }, false);`,
      ``,
      `  if (window.opener) {`,
      `    window.opener.postMessage("authorizing:github", "*");`,
      `    sendSuccess("*");`,
      `  }`,
      ``,
      `  setTimeout(function () { sendSuccess("*"); }, 500);`,
      `  setTimeout(function () { sendSuccess("*"); }, 1000);`,
      `  setTimeout(function () { sendSuccess("*"); }, 1500);`,
      `  setTimeout(function () { window.close(); }, 3000);`,
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
