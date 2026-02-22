// ===== Helpers =====
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));

function E(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k==="class") n.className=v;
    else if(k==="text") n.textContent=v;
    else n.setAttribute(k,v);
  }
  children.forEach(c=>n.appendChild(c));
  return n;
}

const grid = document.getElementById("formGrid");
const out = document.getElementById("promptOut");
const toast = document.getElementById("toast");

function setToast(msg){
  toast.textContent = msg;
  setTimeout(()=>toast.textContent="", 1400);
}

function downloadTextFile(filename, text){
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const sleep0 = () => new Promise(r=>setTimeout(r,0));

// ===== Sections =====
const sections = [
  // Singles
  { id:"age", label:"Age", type:"single", options:[
    "Baby","Toddler","Child","Pre-Teen","Teen","Young Adult","Adult","Mature Adult","Senior","Ageless Icon"
  ]},
  { id:"ethnicity", label:"Ethnicity", type:"single", options:[
    "African American","Afro-Latina","Caribbean","Black + Mixed",
    "Caucasian",
    "Latina/Latino","Asian","South Asian","Middle Eastern","Native American","Pacific Islander",
    "West African","East African","Afro-Indigenous","Afro-Arab","Brazilian Afro",
    "Haitian","Jamaican","Nigerian","Ghanaian","Ethiopian","Somali","Sudanese"
  ]},
  { id:"skinTone", label:"Skin Tone", type:"single", options:[
    "Porcelain","Fair Beige","Light Peach","Warm Ivory","Golden Honey","Caramel Bronze",
    "Warm Pecan","Toffee Tan","Chestnut Glow","Mocha Rich","Cocoa Satin","Deep Ebony","Dark Cocoa","Espresso Deep"
  ]},
  { id:"artStyle", label:"Art Style", type:"single", options:[
    "3D Cartoon / CGI Doll Render (high gloss, toy-box depth)",
    "Toy Packaging Doll Box Art (premium retail render)",
    "Bratz-Inspired Fashion Doll (big eyes, glossy lips, doll proportions)",
    "Ultra Polished 3D",
    "Semi-Realistic Glam",
    "Luxury Editorial",
    "Sticker-Style Cute",
    "Chibi",
    "Exaggerated Chibi",
    "Bold Pop-Art"
  ]},
  { id:"imageMode", label:"Image Mode", type:"single", options:[
    "Toy Packaging / Retail Doll Box (candy gloss finish)",
    "Sticker Pack (sticker-ready polish)",
    "Black Background Campaign (high contrast glossy)",
    "Transparent PNG (clean edges)",
    "Full Color (vibrant glossy finish)",
    "Pinterest Viral Layout",
    "Black & White Coloring Page (pure ink line art)"
  ]},

  // Multi
  { id:"palette", label:"Color Palette", type:"multi", options:[
    "Bright Candy Mix (hot pink + aqua + lemon + purple)",
    "Cotton Candy (pink + baby blue + lavender)",
    "Neon Candy (neon pink + neon teal + neon yellow)",
    "Bubblegum Pop (pink + white + neon accents)",
    "Kawaii Candy (pastels + glossy toy finish)",
    "Pink + Aqua + Butter Gold (viral)",
    "Blush Pink + Gold Accents",
    "Black + Gold Luxury",
    "Rainbow Hyper-Saturated",
    "Purple + Pink Galaxy",
    "Teal + Coral Tropical",
    "Red + Black + Gold"
  ]},

  { id:"hairStyle", label:"Hair Style", type:"multi", options:[
    "Sleek Middle Part Bone Straight","Side Part Body Waves","Deep Wave Glam","Voluminous Curls","Curly Afro",
    "High Ponytail","Low Ponytail","Side Ponytail","Sleek Low Bun","High Bun","Half-Up Half-Down","Space Buns",
    "Knotless Box Braids","Boho Braids","Braided Ponytail","Fulani Braids",
    "Locs (long)","Locs (bob)","Blunt Bob","Layered Bob","Pixie Cut Glam","Wig Install (laid)"
  ]},

  { id:"hairColor", label:"Hair Color", type:"multi", options:[
    "Jet Black","Blue-Black","Espresso Brown","Chocolate Brown","Auburn","Copper",
    "Honey Blonde","Caramel Highlights","Brown Ombré","Blonde Ombré",
    "Pink Streaks","Aqua Streaks","Purple Streaks","Platinum Blonde","Silver","Rose Gold"
  ]},

  { id:"edges", label:"Edges / Baby Hairs", type:"multi", options:[
    "Laid & Sleek Edges","Soft Swoop Edges","Dramatic Swirl Edges","Double Swoop",
    "Sideburn Detail","Heart Swirl","Natural Hairline","Minimal Edges","No Edges"
  ]},

  { id:"nails", label:"Fingernails", type:"multi", options:[
    "Long Coffin Nails","XXL Coffin Nails","Stiletto Nails","Almond Nails","Square Short Nails",
    "French Tip","Chrome Nails","Glitter Nails","Rhinestone Nails","Ombré Nails",
    "Pink Candy Gloss Nails","Press-On Nails Look","3D Nail Charms","Pearl Nail Accents"
  ]},

  { id:"tattoos", label:"Tattoos", type:"multi", options:[
    "No Tattoos","Minimal Fine-Line Tattoos","Small Wrist Tattoo","Finger Tattoos","Hand Tattoo",
    "Forearm Script Tattoo","Half Sleeve Tattoo","Full Sleeve Tattoo","Neck Tattoo",
    "Collarbone Script","Sternum Tattoo","Thigh Tattoo","Ankle Tattoo","Back Tattoo"
  ]},

  { id:"bodyJewelry", label:"Body Jewelry / Piercings", type:"multi", options:[
    "None","Nose Stud","Nose Hoop","Septum Ring","Eyebrow Piercing","Lip Piercing","Belly Piercing",
    "Dermal Piercing","Multiple Ear Piercings","Industrial Ear Piercing","Cute Nose Chain"
  ]},

  { id:"jewelry", label:"Jewelry", type:"multi", options:[
    "Oversized Hoop Earrings","Diamond Stud Earrings","Chandelier Earrings","Ear Cuffs",
    "Layered Gold Necklaces","Layered Silver Necklaces","Nameplate Necklace (no brand)","Choker Necklace",
    "Pearl Necklace","Statement Pendant",
    "Stacked Rings","Cocktail Ring",
    "Charm Bracelet","Tennis Bracelet","Bangle Stack",
    "Luxury Watch (no logos)","Smart Watch (no logos)",
    "Anklet (gold)","Body Chain (fashion)"
  ]},

  { id:"bags", label:"Bags", type:"multi", options:[
    "Crossbody Bag (no logos)","Mini Handbag (no logos)","Top Handle Bag (no logos)","Clutch Bag (no logos)",
    "Tote Bag (no logos)","Shoulder Bag (no logos)","Backpack (no logos)",
    "Belt Bag / Fanny Pack (no logos)","Clear Bag (fashion)","Quilted Bag (no logos)"
  ]},

  { id:"extras", label:"Extras", type:"multi", options:[
    "Waist Belt (fashion)","Chain Belt",
    "Sunglasses (oversized)","Cat-eye Sunglasses","Tinted Shades",
    "Bucket Hat","Baseball Cap (no logos)","Headband / Scarf",
    "Headphones (no logos)","Phone in Hand (no brand)",
    "Long Gloves (fashion)","Fuzzy Cuffs (fashion)","Keychain Charm (cute)"
  ]},

  { id:"top", label:"Top", type:"multi", options:[
    "Graphic Cropped Hoodie (no brand)","Cropped Hoodie","Oversized Hoodie","Zip Hoodie","Cropped Zip Hoodie",
    "Graphic Tee (no brand)","Cropped Graphic Tee (no brand)","Oversized Tee","Baby Tee",
    "Ribbed Tank","Cropped Tank","Bodysuit","Corset Top","Satin Blouse","Sequin Top","Metallic Top",
    "Mesh Long Sleeve","Turtleneck"
  ]},

  { id:"outerwear", label:"Outerwear", type:"multi", options:[
    "No Outerwear","Oversized Denim Jacket","Cropped Denim Jacket","Leather Moto Jacket","Cropped Leather Jacket",
    "Bomber Jacket","Varsity Jacket","Puffer Jacket","Cropped Puffer Jacket",
    "Trench Coat","Longline Trench Coat","Faux Fur Coat","Fur Trim Coat",
    "Tailored Blazer","Oversized Blazer","Cropped Blazer",
    "Statement Coat","Windbreaker","Utility Jacket","Cardigan (outerwear)"
  ]},

  { id:"bottom", label:"Bottom", type:"multi", options:[
    "Metallic Biker Shorts","Biker Shorts","Leather Biker Shorts","Mini Skirt","Sequin Mini Skirt","Leather Mini Skirt",
    "Skinny Jeans","Ripped Jeans","Wide-Leg Jeans","Cargo Pants","Joggers","Leggings",
    "Leather Pants","Sequin Pants","Metallic Pants"
  ]},

  { id:"shoes", label:"Shoes", type:"multi", options:[
    "Chunky Fashion Sneakers","Chunky Sneakers","Luxury Sneakers (no logos)","Platform Sneakers","High-Top Sneakers",
    "Sock Sneakers","Slides (no logos)","Strappy Heels","Clear Heels","Platform Heels","Stiletto Heels",
    "Ankle Boots","Knee-High Boots"
  ]},

  { id:"background", label:"Background", type:"multi", options:[
    "Clean Black Background","Matte Black Studio Backdrop","Glossy Black Gradient Backdrop","Black Background with Soft Spotlight",
    "Toy Packaging Backdrop (retail box art)","Doll Box Insert Card (premium packaging)","Candy Gradient Backdrop (pink→aqua→purple)",
    "Neon Urban Street","Graffiti Wall","Penthouse Skyline Night","Clean White Studio"
  ]},

  // Custom type boxes
  { id:"customHair", label:"Custom Hair Notes (type anything)", type:"text" },
  { id:"customOutfit", label:"Custom Outfit Notes (type anything)", type:"text" },
  { id:"customJewelry", label:"Custom Jewelry (type anything)", type:"text" },
  { id:"customBags", label:"Custom Bags (type anything)", type:"text" },
  { id:"customExtras", label:"Custom Extras (type anything)", type:"text" },
  { id:"customBackground", label:"Custom Background Notes (type anything)", type:"text" },
  { id:"customNotes", label:"Extra Notes (type anything)", type:"text" }
];

// Chip state
const chipState = {};
sections.filter(s=>s.type==="multi").forEach(s=> chipState[s.id] = new Set());

// ===== UI builders =====
function buildSingle(sec){
  const wrap = E("div",{class:"field"});
  wrap.appendChild(E("div",{class:"label", text: sec.label}));
  const sel = E("select",{id:sec.id});
  sel.appendChild(E("option",{value:"", text:"Select…"}));
  sec.options.forEach(v=> sel.appendChild(E("option",{value:v, text:v})) );
  sel.addEventListener("change", updatePrompt);
  wrap.appendChild(sel);
  return wrap;
}

function buildText(sec){
  const wrap = E("div",{class:"field"});
  wrap.appendChild(E("div",{class:"label", text: sec.label}));
  const ta = E("textarea",{id:sec.id, placeholder:"Type here…"});
  ta.classList.add("customTypeBox");
  ta.addEventListener("input", updatePrompt);
  wrap.appendChild(ta);
  return wrap;
}

function toggleChip(secId, val, btn){
  const set = chipState[secId];
  if(set.has(val)){ set.delete(val); btn.classList.remove("chip-on"); }
  else { set.add(val); btn.classList.add("chip-on"); }
  updatePrompt();
}

function buildChips(sec){
  const wrap = E("div",{class:"field"});
  wrap.appendChild(E("div",{class:"label", text: sec.label}));

  const chips = E("div",{class:"chips", id:`chips_${sec.id}`});
  sec.options.forEach(v=>{
    const b = E("button",{type:"button", class:"chip", "data-val": v});
    b.innerHTML = `<span>${escapeHtml(v)}</span><span class="chipSpark">✨</span>`;
    b.addEventListener("click", ()=> toggleChip(sec.id, v, b));
    chips.appendChild(b);
  });

  const actions = E("div",{class:"chip-actions"});
  const clearBtn = E("button",{type:"button", class:"chip-clear", text:"Clear section"});
  clearBtn.addEventListener("click", ()=>{
    chipState[sec.id].clear();
    chips.querySelectorAll(".chip").forEach(x=>x.classList.remove("chip-on"));
    updatePrompt();
  });
  actions.appendChild(clearBtn);

  wrap.appendChild(chips);
  wrap.appendChild(actions);
  return wrap;
}

// ===== Presets UI =====
function buildPresetBar(){
  const wrap = E("div",{class:"field"});
  wrap.appendChild(E("div",{class:"label", text:"Presets"}));

  const row = E("div",{class:"chips", id:"presetBar"});

  const presets = [
    { label:"Candy CGI Doll Box 🍬", fn: applyPresetCandy },
    { label:"Bratz Glam Y2K 💋", fn: applyPresetBratz },
    { label:"Streetwear Glam 🏙️", fn: applyPresetStreet },
    { label:"Luxury Editorial 💎", fn: applyPresetLuxury },
    { label:"Sticker Pack Ready ✂️", fn: applyPresetSticker },
    { label:"Coloring Page Clean ✍️", fn: applyPresetColoring }
  ];

  presets.forEach(p=>{
    const b = E("button",{type:"button", class:"chip"});
    b.innerHTML = `<span>${escapeHtml(p.label)}</span><span class="chipSpark">✨</span>`;
    b.addEventListener("click", ()=>{ p.fn(); setToast("Preset applied ✅"); });
    row.appendChild(b);
  });

  wrap.appendChild(row);
  return wrap;
}

function rebuildUI(){
  grid.innerHTML = "";
  grid.appendChild(buildPresetBar());
  sections.forEach(sec=>{
    if(sec.type==="single") grid.appendChild(buildSingle(sec));
    else if(sec.type==="multi") grid.appendChild(buildChips(sec));
    else grid.appendChild(buildText(sec));
  });
}

// ===== Preset helpers =====
function setSingle(id, value){
  const el = document.getElementById(id);
  if(el) el.value = value;
}

function clearMulti(id){
  chipState[id]?.clear();
  const wrap = document.getElementById(`chips_${id}`);
  if(wrap) wrap.querySelectorAll(".chip").forEach(x=>x.classList.remove("chip-on"));
}

function pickMulti(id, values){
  clearMulti(id);
  const wrap = document.getElementById(`chips_${id}`);
  values.forEach(v=>{
    chipState[id].add(v);
    const btn = wrap?.querySelector(`.chip[data-val="${CSS.escape(v)}"]`);
    if(btn) btn.classList.add("chip-on");
  });
}

// ===== Presets =====
function clearAll(){
  sections.filter(s=>s.type==="single").forEach(s=>{
    const el = document.getElementById(s.id);
    if(el) el.value = "";
  });
  sections.filter(s=>s.type==="multi").forEach(s=>{
    chipState[s.id].clear();
    const wrap = document.getElementById(`chips_${id}`);
    if(wrap) wrap.querySelectorAll(".chip").forEach(x=>x.classList.remove("chip-on"));
  });
  sections.filter(s=>s.type==="text").forEach(s=>{
    const el = document.getElementById(s.id);
    if(el) el.value = "";
  });
}

// NOTE: bug fix in clearAll (chips wrapper id uses s.id)
function clearAll(){
  sections.filter(s=>s.type==="single").forEach(s=>{
    const el = document.getElementById(s.id);
    if(el) el.value = "";
  });
  sections.filter(s=>s.type==="multi").forEach(s=>{
    chipState[s.id].clear();
    const wrap = document.getElementById(`chips_${s.id}`);
    if(wrap) wrap.querySelectorAll(".chip").forEach(x=>x.classList.remove("chip-on"));
  });
  sections.filter(s=>s.type==="text").forEach(s=>{
    const el = document.getElementById(s.id);
    if(el) el.value = "";
  });
}

function applyPresetCandy(){
  clearAll();
  setSingle("age","Young Adult");
  setSingle("ethnicity","African American");
  setSingle("skinTone","Deep Ebony");
  setSingle("artStyle","3D Cartoon / CGI Doll Render (high gloss, toy-box depth)");
  setSingle("imageMode","Toy Packaging / Retail Doll Box (candy gloss finish)");

  pickMulti("palette",[
    "Bright Candy Mix (hot pink + aqua + lemon + purple)",
    "Neon Candy (neon pink + neon teal + neon yellow)"
  ]);
  pickMulti("background",["Clean Black Background","Toy Packaging Backdrop (retail box art)"]);
  pickMulti("hairStyle",["Sleek Middle Part Bone Straight"]);
  pickMulti("hairColor",["Jet Black"]);
  pickMulti("edges",["Laid & Sleek Edges"]);
  pickMulti("nails",["XXL Coffin Nails","Rhinestone Nails"]);

  pickMulti("top",["Graphic Cropped Hoodie (no brand)"]);
  pickMulti("outerwear",["No Outerwear"]);
  pickMulti("bottom",["Metallic Biker Shorts"]);
  pickMulti("shoes",["Chunky Fashion Sneakers"]);

  pickMulti("jewelry",["Oversized Hoop Earrings","Layered Gold Necklaces","Luxury Watch (no logos)"]);
  pickMulti("bags",["Crossbody Bag (no logos)"]);
  pickMulti("extras",["Chain Belt","Sunglasses (oversized)"]);

  updatePrompt();
}

// ✅ Bratz preset upgraded: fur-trim + mini bag + tinted shades + platform heels
function applyPresetBratz(){
  clearAll();
  setSingle("age","Teen");
  setSingle("ethnicity","Afro-Latina");
  setSingle("skinTone","Caramel Bronze");
  setSingle("artStyle","Bratz-Inspired Fashion Doll (big eyes, glossy lips, doll proportions)");
  setSingle("imageMode","Full Color (vibrant glossy finish)");

  pickMulti("palette",[
    "Bubblegum Pop (pink + white + neon accents)",
    "Purple + Pink Galaxy"
  ]);

  pickMulti("background",["Candy Gradient Backdrop (pink→aqua→purple)"]);

  pickMulti("hairStyle",["Half-Up Half-Down","High Ponytail"]);
  pickMulti("hairColor",["Honey Blonde","Caramel Highlights"]);
  pickMulti("edges",["Soft Swoop Edges"]);
  pickMulti("nails",["Long Coffin Nails","Glitter Nails","Rhinestone Nails"]);

  // Outfit: Y2K mall-core glam
  pickMulti("top",["Baby Tee","Corset Top"]);
  pickMulti("outerwear",["Fur Trim Coat"]);         // ✅ fur-trim vibe
  pickMulti("bottom",["Mini Skirt","Leather Mini Skirt"]);
  pickMulti("shoes",["Platform Heels"]);            // ✅ platform heels

  // Accessories: glossy mini bag + tinted shades + extras
  pickMulti("bags",["Mini Handbag (no logos)"]);    // ✅ mini bag
  pickMulti("extras",["Tinted Shades","Chain Belt"]); // ✅ tinted shades
  pickMulti("jewelry",["Oversized Hoop Earrings","Nameplate Necklace (no brand)","Stacked Rings"]);

  updatePrompt();
}

function applyPresetStreet(){
  clearAll();
  setSingle("age","Young Adult");
  setSingle("ethnicity","Caucasian");
  setSingle("skinTone","Fair Beige");
  setSingle("artStyle","Ultra Polished 3D");
  setSingle("imageMode","Full Color (vibrant glossy finish)");

  pickMulti("palette",["Teal + Coral Tropical","Bubblegum Pop (pink + white + neon accents)"]);
  pickMulti("background",["Neon Urban Street","Graffiti Wall"]);
  pickMulti("hairStyle",["High Ponytail"]);
  pickMulti("hairColor",["Espresso Brown"]);
  pickMulti("edges",["Minimal Edges"]);
  pickMulti("nails",["Long Coffin Nails","Chrome Nails"]);

  pickMulti("top",["Oversized Hoodie"]);
  pickMulti("outerwear",["Bomber Jacket"]);
  pickMulti("bottom",["Cargo Pants"]);
  pickMulti("shoes",["High-Top Sneakers"]);

  pickMulti("jewelry",["Stacked Rings","Charm Bracelet"]);
  pickMulti("bags",["Belt Bag / Fanny Pack (no logos)"]);
  pickMulti("extras",["Tinted Shades","Phone in Hand (no brand)"]);

  updatePrompt();
}

function applyPresetLuxury(){
  clearAll();
  setSingle("age","Adult");
  setSingle("ethnicity","Latina/Latino");
  setSingle("skinTone","Caramel Bronze");
  setSingle("artStyle","Luxury Editorial");
  setSingle("imageMode","Black Background Campaign (high contrast glossy)");

  pickMulti("palette",["Black + Gold Luxury","Blush Pink + Gold Accents"]);
  pickMulti("background",["Glossy Black Gradient Backdrop","Black Background with Soft Spotlight"]);
  pickMulti("hairStyle",["Side Part Body Waves"]);
  pickMulti("hairColor",["Brown Ombré"]);
  pickMulti("edges",["Soft Swoop Edges"]);
  pickMulti("nails",["Almond Nails","French Tip"]);

  pickMulti("top",["Satin Blouse"]);
  pickMulti("outerwear",["Tailored Blazer"]);
  pickMulti("bottom",["Leather Pants"]);
  pickMulti("shoes",["Stiletto Heels"]);

  pickMulti("jewelry",["Chandelier Earrings","Pearl Necklace","Tennis Bracelet","Luxury Watch (no logos)"]);
  pickMulti("bags",["Quilted Bag (no logos)"]);
  pickMulti("extras",["Waist Belt (fashion)","Cat-eye Sunglasses"]);

  updatePrompt();
}

function applyPresetSticker(){
  clearAll();
  setSingle("age","Young Adult");
  setSingle("ethnicity","Asian");
  setSingle("skinTone","Warm Ivory");
  setSingle("artStyle","Sticker-Style Cute");
  setSingle("imageMode","Sticker Pack (sticker-ready polish)");

  pickMulti("palette",["Cotton Candy (pink + baby blue + lavender)","Kawaii Candy (pastels + glossy toy finish)"]);
  pickMulti("background",["Candy Gradient Backdrop (pink→aqua→purple)"]);
  pickMulti("hairStyle",["Space Buns"]);
  pickMulti("hairColor",["Rose Gold"]);
  pickMulti("edges",["No Edges"]);
  pickMulti("nails",["Square Short Nails","Glitter Nails"]);

  pickMulti("top",["Baby Tee"]);
  pickMulti("outerwear",["Cropped Denim Jacket"]);
  pickMulti("bottom",["Mini Skirt"]);
  pickMulti("shoes",["Platform Sneakers"]);

  pickMulti("jewelry",["Nameplate Necklace (no brand)","Charm Bracelet"]);
  pickMulti("bags",["Mini Handbag (no logos)"]);
  pickMulti("extras",["Headband / Scarf"]);

  updatePrompt();
}

function applyPresetColoring(){
  clearAll();
  setSingle("age","Young Adult");
  setSingle("ethnicity","Caucasian");
  setSingle("skinTone","Warm Ivory");
  setSingle("artStyle","Exaggerated Chibi");
  setSingle("imageMode","Black & White Coloring Page (pure ink line art)");

  pickMulti("palette",[]);
  pickMulti("background",["Clean White Studio"]);
  pickMulti("hairStyle",["Blunt Bob"]);
  pickMulti("hairColor",[]);
  pickMulti("edges",["No Edges"]);
  pickMulti("nails",["Square Short Nails"]);

  pickMulti("top",["Ribbed Tank"]);
  pickMulti("outerwear",["No Outerwear"]);
  pickMulti("bottom",["Leggings"]);
  pickMulti("shoes",["Platform Sneakers"]);

  pickMulti("jewelry",["Diamond Stud Earrings"]);
  pickMulti("bags",[]);
  pickMulti("extras",[]);

  pickMulti("tattoos",["No Tattoos"]);
  pickMulti("bodyJewelry",["None"]);

  const notes = document.getElementById("customNotes");
  if(notes){
    notes.value =
`COLORING PAGE RULES:
- Pure white background only
- Pure black ink line art only
- Thick outer contour lines + crisp clean outlines
- No shading, no gray, no gradients, no color, no glow, no metallic effects
- Large open spaces for coloring
- Centered 8.5x11 printable layout
- No text, captions, labels, logos, watermarks`;
  }

  updatePrompt();
}

// ===== Prompt logic =====
const getSingle = id => document.getElementById(id)?.value || "";
const getText = id => (document.getElementById(id)?.value || "").trim();
const getMulti = id => Array.from(chipState[id] || []);
const join = arr => (arr.length ? arr.join(", ") : "");
const addCustom = (label, value) => value ? `${label}: ${value}` : "";

function updatePrompt(){
  const age = getSingle("age") || "Young Adult";
  const ethnicity = getSingle("ethnicity") || "African American";
  const skinTone = getSingle("skinTone") || "Deep Ebony";
  const artStyle = getSingle("artStyle") || "3D Cartoon / CGI Doll Render (high gloss, toy-box depth)";
  const imageMode = getSingle("imageMode") || "Toy Packaging / Retail Doll Box (candy gloss finish)";

  const palette = join(getMulti("palette"));
  const hairStyle = join(getMulti("hairStyle"));
  const hairColor = join(getMulti("hairColor"));
  const edges = join(getMulti("edges"));
  const nails = join(getMulti("nails"));
  const tattoos = join(getMulti("tattoos"));
  const bodyJewelry = join(getMulti("bodyJewelry"));

  const jewelry = join(getMulti("jewelry"));
  const bags = join(getMulti("bags"));
  const extras = join(getMulti("extras"));

  const top = join(getMulti("top"));
  const outerwear = join(getMulti("outerwear"));
  const bottom = join(getMulti("bottom"));
  const shoes = join(getMulti("shoes"));
  const background = join(getMulti("background"));

  const customHair = getText("customHair");
  const customOutfit = getText("customOutfit");
  const customJewelry = getText("customJewelry");
  const customBags = getText("customBags");
  const customExtras = getText("customExtras");
  const customBackground = getText("customBackground");
  const customNotes = getText("customNotes");

  const isDollish =
    artStyle.toLowerCase().includes("cgi") ||
    artStyle.toLowerCase().includes("3d") ||
    artStyle.toLowerCase().includes("bratz") ||
    imageMode.toLowerCase().includes("toy") ||
    imageMode.toLowerCase().includes("black");

  const cgiBoost = isDollish
    ? "Render style: glossy fashion-doll look with smooth airbrushed finish, soft studio lighting, dimensional depth. Doll proportions with big expressive eyes and glossy pouty lips. Premium packaging/campaign polish."
    : "";

  const coloringRules =
    imageMode.includes("Coloring Page")
    ? "Coloring page rules: pure white background, pure black ink line art only, thick outer contour lines, crisp outlines, no shading, no gray, no gradients, no color, large open spaces for coloring, centered 8.5x11 printable layout."
    : "";

  out.value =
`Create a ${age} ${ethnicity} glam doll character with ${skinTone} skin tone.

Art style: ${artStyle}.
Image mode: ${imageMode}.
${cgiBoost}
${coloringRules}

Color palette: ${palette || "—"}.

Hair style: ${hairStyle || "—"}.
Hair color: ${hairColor || "—"}.
Edges/baby hairs: ${edges || "—"}.
Fingernails: ${nails || "—"}.

Outfit:
- Top: ${top || "—"}
- Outerwear: ${outerwear || "—"}
- Bottom: ${bottom || "—"}
- Shoes: ${shoes || "—"}

Accessories:
- Jewelry: ${jewelry || "—"}
- Bags: ${bags || "—"}
- Extras: ${extras || "—"}

Tattoos: ${tattoos || "—"}.
Body jewelry/piercings: ${bodyJewelry || "—"}.

Background: ${background || "—"}.

${addCustom("Custom hair notes", customHair)}
${addCustom("Custom outfit notes", customOutfit)}
${addCustom("Custom jewelry", customJewelry)}
${addCustom("Custom bags", customBags)}
${addCustom("Custom extras", customExtras)}
${addCustom("Custom background notes", customBackground)}
${addCustom("Extra notes", customNotes)}

Rules: no logos, no text, no watermarks. High resolution, print-ready.`;
}

// ===== Buttons wiring =====
document.getElementById("btnClear").addEventListener("click", ()=>{
  clearAll(); updatePrompt(); setToast("Cleared ✨");
});

document.getElementById("btnCopy").addEventListener("click", async ()=>{
  updatePrompt();
  await sleep0();
  const textToCopy = out.value;

  try{
    await navigator.clipboard.writeText(textToCopy);
    setToast("Copied ✅");
  }catch(e){
    out.removeAttribute("readonly");
    out.focus();
    out.select();
    try{ document.execCommand("copy"); setToast("Copied ✅"); }
    catch(err){ setToast("Copy blocked ❌"); }
    out.setAttribute("readonly","readonly");
    out.blur();
  }
});

document.getElementById("btnDownload").addEventListener("click", async ()=>{
  updatePrompt();
  await sleep0();
  const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  downloadTextFile(`glam-doll-prompt-${stamp}.txt`, out.value);
  setToast("Downloaded 📄✅");
});

document.getElementById("btnRandom").addEventListener("click", ()=>{
  // random singles
  sections.filter(s=>s.type==="single").forEach(s=>{
    const el = document.getElementById(s.id);
    if(el) el.value = s.options[Math.floor(Math.random()*s.options.length)];
  });

  // random chips 1-3
  sections.filter(s=>s.type==="multi").forEach(s=>{
    const count = 1 + Math.floor(Math.random()*3);
    const picks = [...s.options].sort(()=>Math.random()-0.5).slice(0,count);

    chipState[s.id].clear();
    const wrap = document.getElementById(`chips_${s.id}`);
    if(wrap) wrap.querySelectorAll(".chip").forEach(x=>x.classList.remove("chip-on"));

    picks.forEach(v=>{
      chipState[s.id].add(v);
      const btn = wrap?.querySelector(`.chip[data-val="${CSS.escape(v)}"]`);
      if(btn) btn.classList.add("chip-on");
    });
  });

  // clear custom text boxes
  sections.filter(s=>s.type==="text").forEach(s=>{
    const el = document.getElementById(s.id);
    if(el) el.value = "";
  });

  updatePrompt();
  setToast("Magic built 🔮");
});

// ===== Init =====
rebuildUI();
updatePrompt();