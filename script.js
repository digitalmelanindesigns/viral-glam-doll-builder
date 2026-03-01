const $ = (sel) => document.querySelector(sel);
const state = {}; // single: string, multi: Set

function single(id, label, options, meta={}) { return { id, label, type:"single", options, ...meta }; }
function multi(id, label, options, meta={}) { return { id, label, type:"multi", options, ...meta }; }

const SECTIONS = [
  single("skinTone","Skin Tone",[
    "Deep Ebony (rich deep tone)",
    "Cocoa Satin (deep warm brown)",
    "Mocha Rich (deep mocha)",
    "Caramel Bronze (golden caramel)",
    "Honey Bronze (warm honey)",
    "Chestnut Glow (reddish brown)",
    "Espresso Noir (very deep)",
    "Warm Beige (light warm)",
    "Ivory (light neutral)",
    "Golden Tan (sun-kissed)"
  ],{default:"Caramel Bronze (golden caramel)"}),

  single("renderStyle","Render Style",[
    "Ultra polished 3D CGI doll render",
    "Toy box depth render (dimensional)",
    "Soft glam illustration (high polish)",
    "Sticker pack clean cutout look (glossy)",
    "Bratz-inspired 4K semi-real glam render",
    "Hyper-real glossy editorial doll render",
    "Luxury product-shot render (studio tabletop)",
    "Candy-coated plastiglaze render (super reflective)",
    "High-fashion campaign lighting render (billboard polish)",
    "Kawaii-chibi couture render (gloss + couture fabric detail)"
  ],{default:"Ultra polished 3D CGI doll render"}),

  single("proportions","Body & Proportions",[
    "Oversized 2.5:1 head ratio, tiny waist, thick thighs (signature chibi glam)",
    "Oversized head ratio, curvy silhouette, soft toy proportions",
    "Slightly taller doll proportions, still chibi glam",
    "Ultra-chibi exaggeration (bigger head, smaller torso, cute hands)",
    "Runway doll proportions (longer legs, still glam face)"
  ],{default:"Oversized 2.5:1 head ratio, tiny waist, thick thighs (signature chibi glam)"}),

  single("skinFinish","Skin Finish",[
    "Hyper smooth candy gloss skin, high shine mapping",
    "Glass-skin glow with glossy highlights",
    "Soft glow with controlled gloss (still shiny)",
    "Butter-smooth airbrushed skin with wet highlight points",
    "Vinyl toy sheen (plastic luxe glow)"
  ],{default:"Hyper smooth candy gloss skin, high shine mapping"}),

  // Face
  single("eyes","Eyes",[
    "Oversized almond sparkle eyes",
    "Big round doll eyes with star highlights",
    "Half-lidded glam stare",
    "Side-eye baddie eyes",
    "Wide-eyed surprised look",
    "Fox-eye glam (lifted outer corner)",
    "Bambi eyes (big + watery highlights)",
    "Cat-eye gaze (sharp liner look)",
    "Glitter iris twinkle (extra sparkle)",
    "Heart highlight pupils (cute viral)"
  ],{default:"Oversized almond sparkle eyes"}),

  multi("lashes","Lashes",[
    "Mega volume lashes",
    "Wispy doll lashes",
    "Bottom lash detail",
    "Fluffy mink lashes",
    "Dramatic outer flare",
    "Spiky anime lashes (glam version)",
    "Extra-long top lashes (photo-ready)",
    "Doll cluster lashes (stacked)",
    "Lower lash emphasis (flutter bottom)"
  ],{default:["Mega volume lashes","Bottom lash detail"]}),

  single("brows","Brows",[
    "Snatched arched brows",
    "Sharp precision brows",
    "Soft straight brows",
    "Raised brow attitude",
    "Feathered glam brows",
    "Ultra-snatched razor brows",
    "Angled boss brows (power look)"
  ],{default:"Snatched arched brows"}),

  single("makeup","Makeup",[
    "Full glam beat, shimmer lids, heavy highlight",
    "Glitter cut-crease + glossy cheeks",
    "Soft pink glam + blush pop",
    "Bronzed glam + gold shimmer",
    "Icy highlight + nude glam",
    "Smoky eye + glossy lip combo",
    "Neon liner accent + clean glam",
    "Chrome shimmer lids (metallic pop)",
    "Peachy soft-glow glam (viral)"
  ],{default:"Full glam beat, shimmer lids, heavy highlight"}),

  single("lips","Lips",[
    "Gloss bomb pout lips",
    "Overlined nude gloss lips",
    "Candy pink gloss lips",
    "Cherry red glossy lips",
    "Mocha gloss lips",
    "Glass clear gloss lips (wet look)",
    "Brown liner + caramel gloss",
    "Hot pink jelly gloss",
    "Soft matte nude + gloss topper"
  ],{default:"Gloss bomb pout lips"}),

  multi("extrasFace","Face Extras",[
    "Freckles",
    "Beauty mark",
    "Glitter tear duct highlight",
    "Nose tip highlight sparkle",
    "Under-eye shimmer",
    "Glossy cheek highlight stamp",
    "Tiny rhinestone face gems",
    "Soft blush nose (cute)",
    "Highlighter stripe on nose bridge",
    "Lip gloss shine streak (extra)"
  ]),

  // Nails
  single("nailLength","Nails Length",["Short","Medium","Long","XL","XXL"],{default:"Long"}),
  single("nailShape","Nails Shape",["Square","Short square","Coffin","Almond","Stiletto","Round"],{default:"Almond"}),
  single("nailFinish","Nails Finish",["High-gloss gel","Chrome mirror","French tip","Glitter ombré","Jelly gloss","Matte (with gloss top highlight)"],{default:"High-gloss gel"}),
  single("nailColor","Nails Color",["Nude","Pink","Hot pink","Red","Orange","White","Black","Mocha","Gold chrome","Violet chrome","Lime green","Neon pink"],{default:"Hot pink"}),
  multi("nailArt","Nail Art Details",["Rhinestones","Designer-inspired pattern","Heart accents","Butterfly accents","Swirl lines","Star decals","No extra nail art"],{default:["No extra nail art"]}),

  // Hair
  single("hairStyle","Hair Style",[
    "Platinum blonde long waves under a cap",
    "High snatch ponytail (sleek)",
    "Messy glam bun with face-framing pieces",
    "Waist-length bone straight silk press",
    "Big curly volume hair",
    "Blunt bob (sleek)",
    "Half up half down (sleek + volume)",
    "Space buns + long pieces",
    "Long knotless braids (waist length)",
    "Curly pony puff (defined curls)",
    "Side part body waves (luxury)",
    "90s flip ends (cute throwback)"
  ],{default:"High snatch ponytail (sleek)"}),

  single("hairColor","Hair Color",[
    "Jet black","Platinum blonde","Soft black-brown","Rose pink","Copper auburn",
    "Honey blonde","Burgundy wine","Chocolate brown","Blonde money pieces","Two-tone split dye",
    "Neon pink","Lime green tips","Pink + black split dye","Lime + black split dye"
  ],{default:"Jet black"}),

  single("cap","Hat / Cap",[
    "No hat",
    "Baseball cap (street luxe)",
    "Designer cap (statement)",
    "Beanie (cute street)",
    "Trucker hat (baddie)",
    "Bucket hat (fashion)",
    "Oversized hoodie up (acts like hat)",
    "Headband (cute glam)"
  ],{default:"No hat"}),

  single("edges","Edges / Baby Hairs",[
    "Dramatic swirl edges",
    "Laid sleek edges",
    "Soft baby hairs",
    "Sharp razor edges",
    "No edges (clean hairline)",
    "Extra swoop edges (double swirl)",
    "Micro baby hairs (fine + neat)",
    "Gelled edges (super glossy)"
  ],{default:"Dramatic swirl edges"}),

  // Expression + pose
  single("expression","Expression",[
    "Shocked glam gasp (mouth open)",
    "Surprised baddie",
    "Playful wink",
    "Girl bye side-eye",
    "Soft smile",
    "Serious model face",
    "Smirk (confident)",
    "Kissy face",
    "Eyeroll (viral attitude)",
    "Are you kidding me face",
    "Laughing smile (joyful)"
  ],{default:"Soft smile"}),

  single("pose","Pose",[
    "Hands on cheeks shock pose (viral)",
    "Selfie pose holding phone",
    "Peace sign pose",
    "Hand on hip attitude pose",
    "Over-the-shoulder glance",
    "Walking with attitude",
    "Crouch pose (street baddie)",
    "Hair flip pose",
    "Pointing at camera (callout)",
    "Arms crossed (boss energy)",
    "Blowing kiss",
    "Leaning forward (close-up energy)"
  ],{default:"Hand on hip attitude pose"}),

  // Outfit sets
  single("outfitSet","Outfit Set",[
    "None (build separate top/bottom)",
    "Velour tracksuit set (luxury lounge)",
    "Hoodie + sweatpants set (street cozy)",
    "Faux fur set (statement)",
    "Denim set (cropped jacket + jeans)",
    "Boss blazer set (CEO energy)",
    "Leather set (noir baddie)",
    "Pink sparkle set (viral)",
    "Mocha neutral lounge set (soft luxe)",
    "Airport luxe set (travel baddie)",
    "Tennis skirt set (cute sporty)",
    "Two-piece knit set (snatched)",
    "Corset + mini skirt set (night out)",
    "Graphic tee + cargo set (street)"
  ],{default:"None (build separate top/bottom)"}),

  single("outerwear","Outerwear",[
    "None",
    "Faux fur coat (full plush)",
    "Cropped puffer jacket",
    "Glossy jacket (patent shine)",
    "Varsity jacket",
    "Denim jacket (cropped)",
    "Leather moto jacket",
    "Trench coat (luxury)",
    "Fur-trim hoodie jacket",
    "Oversized cardigan (soft luxe)",
    "Cropped blazer (snatched)",
    "Longline blazer (boss)",
    "Shacket (street)",
    "Bomber jacket (cute)"
  ],{default:"None"}),

  // ✅ MORE TOPS
  single("top","Top",[
    "Fitted baby tee",
    "Cropped tank top",
    "Sports bra top",
    "Graphic glam tee",
    "Hoodie top",
    "Corset top (fashion)",
    "Off-shoulder lounge top",
    "Zip-up cropped jacket (top)",
    "Sweater crop (soft)",
    "Bodysuit (snatched)",
    "Tube top (glam)",
    "Halter top (night out)",
    "Bustier top (sparkle)",
    "Mesh long-sleeve top (layer)",
    "Cropped button-up (preppy)",
    "Puffer vest (street)",
    "Ribbed knit top (tight)",
    "Turtleneck crop (baddie)"
  ],{default:"Fitted baby tee"}),

  // ✅ MORE BOTTOMS
  single("bottom","Bottom",[
    "Ripped jeans",
    "Cargo pants",
    "Leather pants",
    "Stacked sweatpants",
    "Velour joggers",
    "Biker shorts",
    "Mini skirt",
    "Wide-leg denim",
    "Leggings (glossy athleisure)",
    "Flare pants (cute)",
    "Tennis skirt (cute)",
    "Pleated mini skirt (preppy)",
    "Skort (sporty)",
    "High-waist shorts (snatched)",
    "Micro mini skirt (night out)",
    "Sparkle pants (party)",
    "Baggy street jeans (oversized)",
    "Straight-leg jeans (clean)"
  ],{default:"Ripped jeans"}),

  single("setStyle","Style Vibe",[
    "Street luxe",
    "Soft bougie lounge",
    "Pink sparkle glam",
    "Luxury neutral",
    "Black + neon baddie",
    "Hot pink + lime pop",
    "Mocha rich neutrals",
    "Neon pop street glam"
  ],{default:"Hot pink + lime pop"}),

  // ✅ MORE SHOES: platforms + sandals + cute heels
  single("shoes","Shoes",[
    "Nike Air Max 90",
    "Nike Air Max 95",
    "Nike Air Max 97",
    "Nike Air Max Plus (TN)",
    "Nike Air Force 1",
    "Nike Dunk Low",
    "Nike Dunk High",
    "Nike Blazer Mid",
    "Nike Vapormax",
    "Nike Huarache",
    "Jordan 1 High",
    "Jordan 1 Low",
    "Jordan 3",
    "Jordan 4",
    "Jordan 11",
    "New Balance 550",
    "Adidas Superstar",
    "Timberland boots",
    "UGG boots",
    "Crocs",

    "Platform slide sandals (puffy)",
    "Platform thong sandals (cute)",
    "Platform strappy sandals (night out)",
    "Chunky platform sandals (fashion)",
    "Platform mule heels (glam)",
    "Platform block-heel sandals",
    "Clear platform heels (viral)",
    "Clear strap heels (cute)",
    "Chunky heel sandals (street glam)",
    "Kitten heel sandals (soft glam)",
    "Pointed toe pumps (boss)",
    "Sock boots (baddie)",
    "Platform sneakers (extra height)",
    "Platform combat boots (edgy)"
  ],{default:"Nike Air Max 97"}),

  single("shoeColorway","Shoe Colorway",[
    "White/Black",
    "White/Hot Pink",
    "White/Lime",
    "Hot Pink/Lime",
    "Black/Hot Pink",
    "Black/Lime",
    "Mocha/Cream",
    "Neon pop (bright accents)",
    "All black (stealth)",
    "All white (clean)"
  ],{default:"Hot Pink/Lime"}),

  // Bags
  single("bag","Pocketbook / Bag",[
    "None",
    "Louis Vuitton Neverfull",
    "Louis Vuitton Speedy",
    "Louis Vuitton Pochette",
    "Louis Vuitton Alma",
    "Chanel Classic Flap",
    "Chanel Boy Bag",
    "Gucci Marmont",
    "Gucci Dionysus",
    "Dior Saddle Bag",
    "Dior Book Tote",
    "Prada Nylon Bag",
    "Prada Galleria",
    "Fendi Baguette",
    "Balenciaga City Bag",
    "YSL Lou Camera Bag",
    "YSL Kate Chain Bag",
    "Hermès Birkin",
    "Hermès Kelly"
  ],{default:"Chanel Classic Flap"}),

  single("bagColorway","Bag Colorway",[
    "Black","White","Tan","Mocha","Hot Pink","Lime Green","Neon Pink","Neon Lime","Monogram pattern","Quilted leather"
  ],{default:"Hot Pink"}),

  single("bagHardware","Bag Hardware",[
    "Gold hardware","Silver hardware","Rose gold hardware","Gunmetal hardware","Pearl hardware detail"
  ],{default:"Gold hardware"}),

  single("bagCarry","Bag Carry Style",[
    "Handheld",
    "On shoulder",
    "Crossbody",
    "Arm crook carry",
    "Hanging off wrist",
    "Two-hand clutch hold",
    "Bag on forearm + phone in other hand"
  ],{default:"On shoulder"}),

  // Jewelry stack
  multi("jewelry","Jewelry Stack",[
    "Oversized gold hoops",
    "Diamond studs",
    "Stacked rings",
    "Bangle stack",
    "Layered chains",
    "Watch",
    "Ear cuffs",
    "Nameplate necklace (use text box)",
    "Anklet chain",
    "Charm bracelet",
    "Big statement pendant",
    "Pearl + gold mix (luxury)"
  ],{default:["Oversized gold hoops","Stacked rings","Layered chains"]}),

  // Props
  single("prop","Prop",[
    "None",
    "Phone in hand",
    "Glitter phone case",
    "Sunglasses",
    "Coffee cup",
    "Car keys (luxury key fob)",
    "Shopping bags (designer haul)",
    "Lip gloss in hand",
    "Mirror compact",
    "Starbucks cup + selfie combo"
  ],{default:"Phone in hand"}),

  // ✅ TEXT STICKER TEMPLATE OPTIONS (this helps you add words like the examples)
  single("textSticker","Text Sticker Template",[
    "None (no sticker text)",
    "Bubble sticker letters with white cutline",
    "Puffy vinyl letters with shadow depth",
    "Glitter outline text sticker (sparkle edge)",
    "Chrome text sticker (mirror shine)",
    "Handwritten script sticker (bold)",
    "Blocky caption sticker (viral meme style)",
    "Neon glow text sticker (pink/lime)",
    "Ransom-note collage sticker (cute chaos)",
    "3D foam letters sticker (toy-box depth)"
  ],{default:"None (no sticker text)"}),

  single("textPlacement","Text Placement",[
    "No text placement",
    "Top-left corner",
    "Top-right corner",
    "Bottom-left corner",
    "Bottom-right corner",
    "Centered above head",
    "Across the bottom banner",
    "Floating beside character"
  ],{default:"No text placement"}),

  // Background + lighting
  single("background","Background",[
    "Clean studio gradient backdrop",
    "Hot pink gradient background",
    "Lime gradient background",
    "Pink + lime duotone gradient",
    "Neon glow background (pink/lime)",
    "Black glossy studio background (luxury)",
    "Glitter sparkle background (pink)",
    "Chrome glow background (neon)"
  ],{default:"Pink + lime duotone gradient"}),

  single("lighting","Lighting",[
    "Studio glam lighting with sparkle bokeh",
    "Soft beauty ringlight glow",
    "High-contrast fashion lighting",
    "Neon rim light + glossy highlights (pink/lime)",
    "Product-shot lighting (high specular)"
  ],{default:"Neon rim light + glossy highlights (pink/lime)"}),

  multi("noWords","No-Words Rules",[
    "No watermarks"
  ],{default:["No watermarks"]}),
];

// Presets (updated to match pink/lime)
const PRESETS = {
  A: {
    badge:"Soft Bougie (clean glam)",
    picks:{
      setStyle:"Soft bougie lounge",
      outfitSet:"Mocha neutral lounge set (soft luxe)",
      shoes:"Platform mule heels (glam)",
      shoeColorway:"Mocha/Cream",
      bag:"YSL Lou Camera Bag",
      bagColorway:"Tan",
      bagHardware:"Gold hardware",
      bagCarry:"Crossbody",
      expression:"Soft smile",
      pose:"Over-the-shoulder glance",
      background:"Clean studio gradient backdrop",
      lighting:"Soft beauty ringlight glow",
      textSticker:"None (no sticker text)",
      textPlacement:"No text placement"
    }
  },
  B: {
    badge:"Pink + Lime Pop (viral)",
    picks:{
      setStyle:"Hot pink + lime pop",
      outfitSet:"Pink sparkle set (viral)",
      outerwear:"Cropped puffer jacket",
      shoes:"Clear platform heels (viral)",
      shoeColorway:"Hot Pink/Lime",
      bag:"Chanel Classic Flap",
      bagColorway:"Hot Pink",
      bagHardware:"Gold hardware",
      bagCarry:"On shoulder",
      expression:"Playful wink",
      pose:"Selfie pose holding phone",
      background:"Neon glow background (pink/lime)",
      lighting:"Neon rim light + glossy highlights (pink/lime)",
      textSticker:"Bubble sticker letters with white cutline",
      textPlacement:"Bottom-right corner"
    }
  },
  C: {
    badge:"Street Baddie (platform sandals)",
    picks:{
      setStyle:"Neon pop street glam",
      outfitSet:"Graphic tee + cargo set (street)",
      outerwear:"Bomber jacket (cute)",
      shoes:"Platform slide sandals (puffy)",
      shoeColorway:"Black/Lime",
      bag:"Prada Nylon Bag",
      bagColorway:"Lime Green",
      bagHardware:"Silver hardware",
      bagCarry:"Crossbody",
      expression:"Girl bye side-eye",
      pose:"Hand on hip attitude pose",
      background:"Pink + lime duotone gradient",
      lighting:"Studio glam lighting with sparkle bokeh",
      textSticker:"Neon glow text sticker (pink/lime)",
      textPlacement:"Top-left corner"
    }
  }
};

function toast(msg){
  const t=$("#toast");
  if(!t) return;
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(window.__tt);
  window.__tt=setTimeout(()=>t.classList.remove("show"),1200);
}

function initDefaults(){
  for(const s of SECTIONS){
    if(s.type==="single") state[s.id]=s.default ?? "";
    else state[s.id]=new Set(s.default ?? []);
  }
}

function joinMulti(set){
  const arr=[...(set||[])];
  return arr.length ? arr.join(", ") : "";
}

function render(){
  const host=$("#sections");
  if(!host) return;
  host.innerHTML="";

  const q = ($("#search")?.value||"").trim().toLowerCase();
  const filtered = !q ? SECTIONS : SECTIONS.filter(s=>{
    const hay=(s.label+" "+s.id+" "+s.options.join(" ")).toLowerCase();
    return hay.includes(q);
  });

  $("#sectionCount").textContent = `${filtered.length} sections`;

  for(const s of filtered){
    const wrap=document.createElement("div");
    wrap.className="section";
    wrap.id=`sec-${s.id}`;

    const hd=document.createElement("div");
    hd.className="hd";

    const left=document.createElement("div");
    left.className="left";

    const lbl=document.createElement("div");
    lbl.className="lbl";
    lbl.textContent=s.label;

    const sub=document.createElement("div");
    sub.className="sub";
    sub.textContent = (s.type==="single" ? "Single select" : "Multi select");

    left.appendChild(lbl);
    left.appendChild(sub);

    const badge=document.createElement("div");
    badge.className="pill";
    badge.textContent = (s.type==="single")
      ? (state[s.id] ? "1 selected" : "0 selected")
      : `${state[s.id]?.size||0} selected`;

    hd.appendChild(left);
    hd.appendChild(badge);

    const bd=document.createElement("div");
    bd.className="bd";

    const chips=document.createElement("div");
    chips.className="chips";

    for(const opt of s.options){
      const chip=document.createElement("div");
      chip.className="chip";
      chip.textContent=opt;

      const on = (s.type==="single")
        ? state[s.id]===opt
        : state[s.id]?.has(opt);

      if(on) chip.classList.add("on");

      chip.addEventListener("click",()=>{
        if(s.type==="single"){
          state[s.id] = (state[s.id]===opt) ? "" : opt;
        }else{
          if(!state[s.id]) state[s.id]=new Set();
          if(state[s.id].has(opt)) state[s.id].delete(opt);
          else state[s.id].add(opt);
        }
        render();
        buildPrompt();
      });

      chips.appendChild(chip);
    }

    bd.appendChild(chips);
    wrap.appendChild(hd);
    wrap.appendChild(bd);
    host.appendChild(wrap);
  }
}

function setPreset(key){
  const p=PRESETS[key];
  if(!p) return;
  for(const s of SECTIONS){
    const v=p.picks[s.id];
    if(v===undefined) continue;
    if(s.type==="single") state[s.id]=v;
    else state[s.id]=new Set(Array.isArray(v)?v:[v]);
  }
  render();
  buildPrompt();
  toast(`Loaded ${p.badge}`);
}

function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function randomize(){
  const get=(id)=>{
    const s=SECTIONS.find(x=>x.id===id);
    return s ? pickRandom(s.options) : "";
  };
  const getMulti=(id, n=2)=>{
    const s=SECTIONS.find(x=>x.id===id);
    if(!s) return new Set();
    const set=new Set();
    while(set.size<n) set.add(pickRandom(s.options));
    return set;
  };

  for(const s of SECTIONS){
    if(s.type==="single") state[s.id]=get(s.id);
    else state[s.id]=getMulti(s.id, Math.min(2, s.options.length));
  }

  render();
  buildPrompt();
  toast("Randomized ✅");
}

function clearAll(){
  for(const s of SECTIONS){
    if(s.type==="single") state[s.id]="";
    else state[s.id]=new Set();
  }

  ["charName","nameplate","quoteText","quoteStyle","customColors","customBag","customShoeColorway","extraNotes"].forEach(id=>{
    const el=$("#"+id);
    if(el) el.value="";
  });

  render();
  buildPrompt();
  toast("Cleared all ✅");
}

function resetDefaults(){
  initDefaults();

  ["charName","nameplate","quoteText","quoteStyle","customColors","customBag","customShoeColorway","extraNotes"].forEach(id=>{
    const el=$("#"+id);
    if(el) el.value="";
  });

  render();
  buildPrompt();
  toast("Defaults restored");
}

function buildPrompt(){
  const charName=$("#charName")?.value.trim() || "";
  const nameplate=$("#nameplate")?.value.trim() || "";
  const quoteText=$("#quoteText")?.value.trim() || "";
  const quoteStyle=$("#quoteStyle")?.value.trim() || "";
  const customColors=$("#customColors")?.value.trim() || "";
  const customBag=$("#customBag")?.value.trim() || "";
  const customShoeColorway=$("#customShoeColorway")?.value.trim() || "";
  const extraNotes=$("#extraNotes")?.value.trim() || "";

  const lines=[];
  if(charName) lines.push(`Character name: ${charName}.`);

  lines.push(
    `Ultra glossy glam doll character with ${state.skinTone || "a rich skin tone"}, `+
    `${state.proportions || "oversized chibi glam proportions"}, `+
    `${state.skinFinish || "hyper smooth glossy skin"}, dimensional depth, candy gloss finish.`
  );

  if(state.renderStyle) lines.push(`Render style: ${state.renderStyle}.`);

  const hairBits=[state.hairStyle,state.hairColor,state.cap,state.edges].filter(Boolean);
  if(hairBits.length) lines.push(`Hair: ${hairBits.join(" | ")}.`);

  const faceBits=[
    state.eyes,
    joinMulti(state.lashes),
    state.brows,
    state.makeup,
    state.lips,
    joinMulti(state.extrasFace)
  ].filter(Boolean);
  if(faceBits.length) lines.push(`Face glam: ${faceBits.join(" | ")}.`);

  const nailsBits=[state.nailLength,state.nailShape,state.nailFinish,state.nailColor].filter(Boolean);
  const nailArt = joinMulti(state.nailArt);
  if(nailsBits.length || nailArt){
    lines.push(`Nails: ${[...nailsBits, nailArt].filter(Boolean).join(" | ")}.`);
  }

  if(state.expression) lines.push(`Expression: ${state.expression}.`);
  if(state.pose) lines.push(`Pose/action: ${state.pose}.`);

  const outfitBits=[];
  if(state.setStyle) outfitBits.push(`Vibe: ${state.setStyle}`);
  if(state.outfitSet && !String(state.outfitSet).startsWith("None")) outfitBits.push(`Outfit set: ${state.outfitSet}`);
  if(state.top) outfitBits.push(`Top: ${state.top}`);
  if(state.bottom) outfitBits.push(`Bottom: ${state.bottom}`);
  if(state.outerwear && state.outerwear!=="None") outfitBits.push(`Outerwear: ${state.outerwear}`);
  if(outfitBits.length) lines.push(`Outfit: ${outfitBits.join(" | ")}.`);

  if(state.shoes){
    const cw = customShoeColorway || state.shoeColorway;
    lines.push(`Shoes: ${state.shoes}${cw ? ` | colorway: ${cw}` : ""}.`);
  }

  const accBits=[];
  const jew=joinMulti(state.jewelry);
  if(jew) accBits.push(`Jewelry: ${jew}`);
  if(nameplate) accBits.push(`Nameplate necklace text: "${nameplate}"`);
  if(state.bag && state.bag!=="None"){
    accBits.push(`Pocketbook: ${state.bag} | colorway: ${state.bagColorway || "Black"} | hardware: ${state.bagHardware || "Gold hardware"} | carry: ${state.bagCarry || "Handheld"}`);
  }
  if(customBag) accBits.push(`Bag notes: ${customBag}`);
  if(state.prop && state.prop!=="None") accBits.push(`Prop: ${state.prop}`);

  // ✅ Sticker text rules (optional)
  if(state.textSticker && !String(state.textSticker).startsWith("None")){
    const txt = quoteText ? `"${quoteText}"` : "(use quote text input)";
    const sty = quoteStyle ? quoteStyle : "high-impact sticker typography";
    accBits.push(`Text sticker: ${state.textSticker} | placement: ${state.textPlacement} | text: ${txt} | style: ${sty}`);
  }

  if(accBits.length) lines.push(`Accessories: ${accBits.join(" | ")}.`);

  if(state.background) lines.push(`Background: ${state.background}.`);
  if(state.lighting) lines.push(`Lighting: ${state.lighting}, sparkle bokeh accents, high resolution 4K.`);

  if(customColors) lines.push(`Color notes: ${customColors}.`);
  if(extraNotes) lines.push(`Extra notes: ${extraNotes}.`);

  const nw=joinMulti(state.noWords);
  if(nw) lines.push(`Rules: ${nw}.`);

  lines.push("Clean subject edges, crisp details, premium polish.");

  $("#output").value = lines.join("\n\n");
}

function copyOut(){
  const txt=$("#output")?.value || "";
  navigator.clipboard.writeText(txt).then(()=>toast("Copied ✅")).catch(()=>{
    $("#output").select();
    document.execCommand("copy");
    toast("Copied ✅");
  });
}

function setupSearch(){
  const el=$("#search");
  if(!el) return;
  el.addEventListener("input", ()=>render());
  el.addEventListener("keydown", (e)=>{
    if(e.key==="Enter"){
      e.preventDefault();
      const first = $("#sections .section");
      if(first){
        first.scrollIntoView({behavior:"smooth", block:"start"});
        toast("Jumped to results");
      }
    }
  });
}

// Bind AFTER DOM loads (prevents null addEventListener errors)
document.addEventListener("DOMContentLoaded", ()=>{
  initDefaults();
  setupSearch();
  render();
  buildPrompt();

  $("#btnBuild").addEventListener("click", buildPrompt);
  $("#btnCopy").addEventListener("click", copyOut);
  $("#btnRandom").addEventListener("click", randomize);
  $("#btnClear").addEventListener("click", clearAll);
  $("#btnReset").addEventListener("click", resetDefaults);

  $("#presetA").addEventListener("click", ()=>setPreset("A"));
  $("#presetB").addEventListener("click", ()=>setPreset("B"));
  $("#presetC").addEventListener("click", ()=>setPreset("C"));

  ["charName","nameplate","quoteText","quoteStyle","customColors","customBag","customShoeColorway","extraNotes"].forEach(id=>{
    $("#"+id).addEventListener("input", buildPrompt);
  });
});
