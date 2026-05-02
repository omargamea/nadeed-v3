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
      res.status(401).send("GitHub OAuth failed: " + JSON.stringify(tokenData));
      return;
    }

    const authPayload = {
      token: tokenData.access_token,
      provider: "github"
    };

    const authMessage = "authorization:github:success:" + JSON.stringify(authPayload);

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
      `${lt}p id="status"${gt}تم تسجيل الدخول. جار العودة إلى لوحة نضيد...${lt}/p${gt}`,
      `${lt}script${gt}`,
      `(function () {`,
      `  var authMessage = ${JSON.stringify(authMessage)};`,
      `  var fallbackOrigin = "https://nadeed.vercel.app";`,
      `  var attempts = 0;`,
      `  var closed = false;`,
      ``,
      `  function setStatus(text) {`,
      `    var el = document.getElementById("status");`,
      `    if (el) {`,
      `      el.textContent = text;`,
      `    }`,
      `  }`,
      ``,
      `  function sendSuccess(origin) {`,
      `    if (!window.opener) {`,
      `      setStatus("تم تسجيل الدخول، لكن نافذة لوحة نضيد غير متاحة. أعد فتح لوحة الإدارة وحاول مرة واحدة.");`,
      `      return false;`,
      `    }`,
      ``,
      `    try {`,
      `      window.opener.postMessage(authMessage, origin || fallbackOrigin);`,
      `      return true;`,
      `    } catch (error) {`,
      `      try {`,
      `        window.opener.postMessage(authMessage, "*");`,
      `        return true;`,
      `      } catch (innerError) {`,
      `        return false;`,
      `      }`,
      `    }`,
      `  }`,
      ``,
      `  function closeSoon() {`,
      `    if (closed) {`,
      `      return;`,
      `    }`,
      `    closed = true;`,
      `    setTimeout(function () {`,
      `      window.close();`,
      `    }, 900);`,
      `  }`,
      ``,
      `  window.addEventListener("message", function (event) {`,
      `    if (!event) {`,
      `      return;`,
      `    }`,
      `    if (event.origin) {`,
      `      fallbackOrigin = event.origin;`,
      `    }`,
      `    sendSuccess(fallbackOrigin);`,
      `    closeSoon();`,
      `  }, false);`,
      ``,
      `  function tick() {`,
      `    attempts = attempts + 1;`,
      ``,
      `    if (window.opener) {`,
      `      window.opener.postMessage("authorizing:github", "*");`,
      `      sendSuccess(fallbackOrigin);`,
      `      sendSuccess("*");`,
      `    }`,
      ``,
      `    if (attempts === 16) {`,
      `      closeSoon();`,
      `      return;`,
      `    }`,
      ``,
      `    setTimeout(tick, 250);`,
      `  }`,
      ``,
      `  tick();`,
      `})();`,
      `${lt}/script${gt}`,
      `${lt}/body${gt}`,
      `${lt}/html${gt}`
    ].join("\n");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("OAuth callback error: " + error.message);
  }
}
