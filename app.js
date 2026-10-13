/* Demo Shop session helpers. Everything is local to the browser; nothing is sent anywhere. */
(function () {
  var KEY = "demo_shop_session";

  function getSession() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(email) {
    var s = { email: email, since: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    document.cookie = "demo_session=1; path=/; max-age=86400; samesite=lax; path=/demoshop-ub";
    return s;
  }

  function clearSession() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.cookie = "demo_session=; path=/; max-age=0; samesite=lax";
  }

  function isSignedIn() {
    return !!getSession();
  }

  function requireSession(nextPath) {
    if (!isSignedIn()) {
      window.location.replace("/demoshop-ub/login/?next=" + encodeURIComponent(nextPath || window.location.pathname));
      return false;
    }
    return true;
  }

  function safeNext(value) {
    if (!value) return "/demoshop-ub/bottle/";
    if (value.indexOf("/demoshop-ub/") !== 0 || value.indexOf("//") === 0) return "/demoshop-ub/bottle/";
    return value;
  }

  function renderHeader() {
    var box = document.querySelector("[data-session]");
    if (!box) return;
    if (isSignedIn()) {
      box.innerHTML = '<span class="who">Signed in as demo</span> <a href="/demoshop-ub/logout">Log out</a>';
    } else {
      box.innerHTML = '<a href="/demoshop-ub/login">Sign in</a>';
    }
  }

  window.DemoShop = {
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    isSignedIn: isSignedIn,
    requireSession: requireSession,
    safeNext: safeNext,
    renderHeader: renderHeader
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderHeader);
  } else {
    renderHeader();
  }
})();
