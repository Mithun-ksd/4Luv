const recipientInput = document.getElementById("recipientName");
const messageInput = document.getElementById("message");
const senderInput = document.getElementById("senderName");
const slugInput = document.getElementById("slug");

const previewName = document.getElementById("previewName");
const previewMessage = document.getElementById("previewMessage");
const previewSender = document.getElementById("previewSender");
const previewCake = document.getElementById("previewCake");
const previewDecorations = document.getElementById("previewDecorations");

const characterCount = document.getElementById("characterCount");
const slugMessage = document.getElementById("slugMessage");

const wishForm = document.getElementById("wishForm");

/* RECIPIENT */

recipientInput.addEventListener("input", () => {
  const name = recipientInput.value.trim();

  previewName.textContent = name || "Your Name";
});

/*  MESSAGE */

messageInput.addEventListener("input", () => {
  const message = messageInput.value;

  previewMessage.textContent =
    message || "Your birthday message will appear here...";

  characterCount.textContent = message.length;
});

/*  SENDER */

senderInput.addEventListener("input", () => {
  const sender = senderInput.value.trim();

  previewSender.textContent = sender
    ? `With love, ${sender} ❤️`
    : "With love ❤️";
});

/* CAKE */

const cakeInputs = document.querySelectorAll('input[name="cake"]');

cakeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const cakes = {
      classic: "🎂",
      cupcake: "🧁",
      slice: "🍰",
      pink: "🎂",
      chocolate: "🍫",
    };

    previewCake.textContent = cakes[input.value];
  });
});

/*  DECORATIONS */

const decorationInputs = document.querySelectorAll('input[name="decorations"]');

decorationInputs.forEach((input) => {
  input.addEventListener("change", updateDecorations);
});

function updateDecorations() {
  const selected = [];

  decorationInputs.forEach((input) => {
    if (input.checked) {
      selected.push(input.value);
    }
  });

  const decorationIcons = {
    hearts: "💕",
    balloons: "🎈",
    confetti: "🎉",
    sparkles: "✨",
    gifts: "🎁",
  };

  if (selected.length === 0) {
    previewDecorations.textContent = "✨ 💕 ✨";

    return;
  }

  previewDecorations.textContent = selected
    .map((item) => decorationIcons[item])
    .join(" ");
}

/*  SLUG VALIDATION */

slugInput.addEventListener("input", () => {
  let slug = slugInput.value.toLowerCase();

  slug = slug.replace(/[^a-z0-9-]/g, "");

  slugInput.value = slug;

  if (slug.length === 0) {
    slugMessage.textContent = "Use 3–30 lowercase letters, numbers or hyphens.";

    slugMessage.style.color = "";

    return;
  }

  if (slug.length < 3) {
    slugMessage.textContent = "Your URL must contain at least 3 characters.";

    slugMessage.style.color = "#d94b6b";

    return;
  }

  slugMessage.textContent = "✓ This URL format is valid.";

  slugMessage.style.color = "#2e9b68";
});

/*  FORM SUBMISSION */

wishForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const recipient = recipientInput.value.trim();

  const message = messageInput.value.trim();

  const slug = slugInput.value.trim();

  if (!recipient) {
    alert("Please enter the recipient's name.");

    recipientInput.focus();

    return;
  }

  if (!message) {
    alert("Please write a birthday message.");

    messageInput.focus();

    return;
  }

  if (slug.length < 3) {
    alert("Please choose a valid personalized URL.");

    slugInput.focus();

    return;
  }

  const submitButton = wishForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Creating your wish...";

  const { error } = await sb.from("wishes").insert({
    slug,
    receiver_name: recipient,
    message,
    sender_name: senderInput.value.trim() || null,
    cake: document.querySelector('input[name="cake"]:checked').value,
    decorations: [...decorationInputs]
      .filter((input) => input.checked)
      .map((input) => input.value),
    theme: document.getElementById("theme").value,
  });

  if (error) {
    console.error(error);
    submitButton.disabled = false;
    submitButton.textContent = "Create My Birthday Wish →";

    alert(
      error.code === "23505"
        ? "That URL is already taken. Please try another one!"
        : "Something went wrong. Please try again.",
    );

    return;
  }

  window.location.href = `success.html?wish=${slug}`;
});
