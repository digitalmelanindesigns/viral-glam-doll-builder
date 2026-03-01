/* =========================
   VIRAL GLAM DOLL BUILDER v10
   - Triple Randomize
   - Custom input per section
   - 300+ Combo counter
   - Expanded glam categories
========================= */

const $ = (sel) => document.querySelector(sel);

const state = {};
const customPools = {};

function single(id, label, options) {
  return { id, label, type: "single", options };
}

function multi(id, label, options) {
  return { id, label, type: "multi", options };
}

/* =========================
   EXPANDED OPTIONS
========================= */

const SECTIONS = [

single("skinTone", "Skin Tone", [
  "Cocoa Satin",
  "Mocha Rich",
  "Honey Bronze",
  "Deep Ebony",
  "Caramel Glow"
]),

single("hairColor", "Hair Color", [
  "Jet Black",
  "Chocolate Brown",
  "Honey Blonde",
  "Platinum Blonde",
  "Burgundy",
  "Copper",
  "Pastel Pink",
  "Black with Blonde Money Pieces",
  "Brown with Caramel Highlights",
  "Ombré Brown to Blonde"
]),

single("expression", "Expression", [
  "Soft Smile",
  "Confident Smirk",
  "Girl Bye Side-Eye",
  "Laughing Smile",
  "Are You Kidding Me Face",
  "Flirty Wink",
  "Boss CEO Stare",
  "Over It Look",
  "Playful Tongue Out",
  "Serious Model Face"
]),

single("top", "Top", [
  "Cropped Baby Tee",
  "Corset Top",
  "Oversized Hoodie",
  "Tube Top",
  "Graphic Glam Tee",
  "Velour Zip Hoodie",
  "Lace Bustier",
  "Mesh Long Sleeve",
  "Sequin Crop Top"
]),

single("bottom", "Bottom", [
  "Stacked Sweatpants",
  "Leather Pants",
  "Glossy Leggings",
  "Cargo Pants",
  "Mini Skirt",
  "High Waist Jeans",
  "Velour Joggers",
  "Wide Leg Trousers"
]),

single("shoes", "Shoes", [
  "Nike Dunk High",
  "Jordan 1",
  "Jordan 3",
  "Jordan 11",
  "Platform Crocs",
  "Rhinestone Slides",
  "Chunky Platform Sandals",
  "Strappy Platform Heels",
  "Barbie Pink Platforms",
  "Clear PVC Heels",
  "Luxury Pool Slides"
]),

single("nails", "Nails", [
  "XXL Chrome",
  "Long Square French Tip",
  "Matte Pink w/ Gloss Outline",
  "Black French Tip",
  "3D Flower Acrylic",
  "Aura Airbrush Fade",
  "Marble Swirl",
  "Butterfly Charms",
  "Gold Foil Accent",
  "Diamond Cluster Nails"
])

];

/* =========================
   UI RENDER
========================= */

function render() {
  const container = $("#sections");
  container.innerHTML = "";

  SECTIONS.forEach(section => {
    const div = document.createElement("div");
    div.className = "section";

    const title = document.createElement("h3");
    title.textContent = section.label;
    div.appendChild(title);

    section.options.concat(customPools[section.id] || []).forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = state[section.id] === opt ? "active" : "";
      btn.onclick = () => {
        state[section.id] = opt;
        render();
      };
      div.appendChild(btn);
    });

    // Custom input
    const input = document.createElement("input");
    input.placeholder = "Add custom...";
    input.className = "custom-input";
    input.onchange = (e) => {
      const val = e.target.value.trim();
      if (!val) return;
      if (!customPools[section.id]) customPools[section.id] = [];
      customPools[section.id].push(val);
      state[section.id] = val;
      e.target.value = "";
      render();
    };
    div.appendChild(input);

    container.appendChild(div);
  });

  updateCounter();
}

/* =========================
   VIRAL COMBO COUNTER
========================= */

function updateCounter() {
  const total = SECTIONS.reduce((acc, s) => {
    return acc * (s.options.length + (customPools[s.id]?.length || 0));
  }, 1);

  const counter = $("#comboCounter");
  counter.textContent = total > 300
    ? `Over 300+ Combinations`
    : `${total} Combinations`;
}

/* =========================
   BUILD PROMPT
========================= */

function buildPrompt() {
  return SECTIONS.map(s => state[s.id] || "").join(" | ");
}

/* =========================
   TRIPLE RANDOMIZER
========================= */

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomizeThree() {
  const results = [];

  for (let i = 0; i < 3; i++) {
    const temp = SECTIONS.map(section => {
      const all = section.options.concat(customPools[section.id] || []);
      return randomChoice(all);
    }).join(" | ");

    results.push(temp);
  }

  const output = $("#output");
  output.innerHTML = `
    <div class="prompt-block">${results[0]}</div>
    <div class="prompt-block">${results[1]}</div>
    <div class="prompt-block">${results[2]}</div>
  `;
}

/* =========================
   INIT
========================= */

render();
