/* Elements */

const recipientName = document.getElementById("recipientName");

const birthdayMessage = document.getElementById("birthdayMessage");

const senderName = document.getElementById("senderName");

const cake = document.getElementById("cake");

const decorations = document.getElementById("decorations");

const replayButton = document.getElementById("replayButton");

/* Load Wish */

const cakeIcons = {
  classic: "🎂",
  cupcake: "🧁",
  slice: "🍰",
  pink: "🎂",
  chocolate: "🍫",
};

const decorationIcons = {
  hearts: "💕",
  balloons: "🎈",
  confetti: "🎉",
  sparkles: "✨",
  gifts: "🎁",
};

async function loadWish() {
  const slug = new URLSearchParams(window.location.search).get("wish");

  if (!slug || !/^[a-z0-9-]{3,30}$/.test(slug)) {
    window.location.href = "404.html";
    return;
  }

  const { data, error } = await sb.rpc("get_wish", { p_slug: slug });
  const wish = data && data[0];

  if (error || !wish) {
    window.location.href = "404.html";
    return;
  }

  recipientName.textContent = wish.receiver_name;
  birthdayMessage.textContent = wish.message;
  senderName.textContent = wish.sender_name
    ? `With love, ${wish.sender_name} ❤️`
    : "With love ❤️";
  cake.textContent = cakeIcons[wish.cake] || "🎂";
  decorations.textContent = wish.decorations
    .map((d) => decorationIcons[d])
    .join(" ");
}

loadWish();

/* Replay */

replayButton.addEventListener("click", () => {
  const card = document.querySelector(".wish-card");

  card.style.animation = "none";

  card.offsetHeight;

  card.style.animation = "cardAppear 0.8s ease";
});
