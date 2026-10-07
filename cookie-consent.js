(function () {
  const GA_MEASUREMENT_ID = "G-PG78R62BDM";
  const STORAGE_KEY = "essexBuildersCookieConsent";

  function loadGoogleAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function saveConsent(choice) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        choice: choice,
        date: new Date().toISOString()
      })
    );
  }

  function getConsent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).choice : null;
    } catch (error) {
      return null;
    }
  }

  function createBanner() {
    const banner = document.createElement("div");
    banner.id = "cookieConsentBanner";

    banner.innerHTML = `
      <div class="cookie-consent-box">
        <div class="cookie-consent-text">
          <strong>Cookies on this website</strong>
          <p>
            We use essential cookies to make this website work. With your permission,
            we also use Google Analytics cookies to understand how visitors use the site
            and improve our services.
          </p>
          <a href="privacy-policy.html">Read our Privacy Policy</a>
        </div>

        <div class="cookie-consent-actions">
          <button type="button" id="rejectAnalyticsCookies">Reject analytics</button>
          <button type="button" id="acceptAnalyticsCookies">Accept analytics</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #cookieConsentBanner {
        position: fixed;
        left: 20px;
        right: 20px;
        bottom: 20px;
        z-index: 99999;
        font-family: 'DM Sans', Arial, sans-serif;
      }

      .cookie-consent-box {
        max-width: 980px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 18px 50px rgba(26, 43, 95, 0.18);
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .cookie-consent-text strong {
        display: block;
        color: #1a2b5f;
        font-size: 1rem;
        margin-bottom: 6px;
      }

      .cookie-consent-text p {
        color: #64748b;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 8px;
      }

      .cookie-consent-text a {
        color: #2563eb;
        font-size: 0.85rem;
        font-weight: 700;
        text-decoration: none;
      }

      .cookie-consent-text a:hover {
        text-decoration: underline;
      }

      .cookie-consent-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
        flex-wrap: wrap;
      }

      .cookie-consent-actions button {
        border-radius: 8px;
        padding: 12px 18px;
        font-weight: 700;
        cursor: pointer;
        font-size: 0.88rem;
        transition: transform 0.2s, background 0.2s;
      }

      #rejectAnalyticsCookies {
        background: #f5f7fb;
        color: #1a2b5f;
        border: 1px solid #e2e8f0;
      }

      #acceptAnalyticsCookies {
        background: #1a2b5f;
        color: #ffffff;
        border: 1px solid #1a2b5f;
      }

      .cookie-consent-actions button:hover {
        transform: translateY(-2px);
      }

      @media (max-width: 720px) {
        .cookie-consent-box {
          flex-direction: column;
          align-items: flex-start;
        }

        .cookie-consent-actions {
          width: 100%;
        }

        .cookie-consent-actions button {
          flex: 1;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    document
      .getElementById("acceptAnalyticsCookies")
      .addEventListener("click", function () {
        saveConsent("accepted");
        loadGoogleAnalytics();
        banner.remove();
      });

    document
      .getElementById("rejectAnalyticsCookies")
      .addEventListener("click", function () {
        saveConsent("rejected");
        banner.remove();
      });
  }

  const consent = getConsent();

  if (consent === "accepted") {
    loadGoogleAnalytics();
  } else if (consent !== "rejected") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createBanner);
    } else {
      createBanner();
    }
  }
})();