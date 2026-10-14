/* =========================================
   SUCCESS PAGE ELEMENTS
========================================= */

/*
    Get the elements that we need to control
    with JavaScript.
*/

const wishUrlInput = document.getElementById("wishUrl");

const copyButton = document.getElementById("copyButton");

const copyStatus = document.getElementById("copyStatus");

const shareButton = document.getElementById("shareButton");

const viewButton = document.getElementById("viewButton");

/* =========================================
   WISH URL
========================================= */

/*
    The create page sends us here with the wish's
    slug in the address: success.html?wish=john
*/

const slug = new URLSearchParams(window.location.search).get("wish");

if (!slug || !/^[a-z0-9-]{3,30}$/.test(slug)) {
  window.location.replace("create.html");
  throw new Error("Missing or invalid wish slug.");
}

const wishUrl = `${window.location.origin}/wish.html?wish=${encodeURIComponent(slug)}`;

/*
    Display the generated URL.
*/

wishUrlInput.value = wishUrl;

/* =========================================
   COPY URL
========================================= */

/*
    Copy the personalized URL to the
    visitor's clipboard.
*/

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(wishUrlInput.value);

    /* Show success message */

    copyStatus.textContent = "✓ Link copied! Send it to someone special. ❤️";

    /* Temporarily change button text */

    copyButton.textContent = "Copied!";

    /*
                Return the button to its
                original state after a short delay.
            */

    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 2000);
  } catch (error) {
    /*
                Clipboard APIs can sometimes fail
                depending on browser permissions.

                Select the URL so the user can
                manually copy it.
            */

    wishUrlInput.select();

    copyStatus.textContent = "Select the link and copy it manually.";
  }
});

/* =========================================
   SHARE WISH
========================================= */

/*
    Use the browser's native Share API when
    the device supports it.

    This is especially useful on mobile.
*/

shareButton.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "A special birthday wish for you ❤️",

        text: "Someone made a special birthday wish for you! 🎂",

        url: wishUrl,
      });
    } catch (error) {
      /*
                    The user may simply close the
                    native sharing window.

                    We don't need to show an error.
                */

      console.log("Sharing cancelled.");
    }

    return;
  }

  /*
            If native sharing isn't supported,
            copy the URL instead.
        */

  try {
    await navigator.clipboard.writeText(wishUrl);

    copyStatus.textContent = "✓ Link copied! You can send it anywhere. ❤️";
  } catch (error) {
    wishUrlInput.select();

    copyStatus.textContent = "Copy the link manually and send it.";
  }
});

/* =========================================
   VIEW WISH
========================================= */

/*
    Open the birthday wish page.
*/

viewButton.addEventListener("click", () => {
  window.location.href = `wish.html?wish=${encodeURIComponent(slug)}`;
});
