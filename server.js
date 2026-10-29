const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Question bank (10 'hidden story' business questions)
// ---------------------------------------------------------------------------
const QUESTIONS = [
  {
    topic: "Brands and Saving Animals",
    question:
      "In a limited campaign timed to a global conservation moment, this company did something no major fashion label had done before: it manufactured only as many units of ten special product runs as there were individuals left in the wild of ten different endangered species — not a round marketing number, but the actual, scientifically estimated population count for each animal. One run, tied to a critically endangered bird found only on a single group of islands, totalled exactly 157 units; once that run sold out, it could never be remade by design, since the whole point was for scarcity to mirror extinction risk. The irony is that the animal which normally appears stitched onto the company's product is not endangered at all — it's one of the most widespread and populous animals on the planet, found across multiple continents in healthy numbers, which is precisely why swapping it out for genuinely at-risk species made the campaign so striking. Name the company.",
    answer: "Lacoste"
  },
  {
    topic: "Reusing Packaging",
    question:
      "In the 1960s, this beer company's founder commissioned an industrial designer to create a glass bottle with a completely unconventional purpose: once emptied, the bottle itself was designed to be laid on its side and stacked like a brick, interlocking with others of its kind, so that roughly 1,000 empty bottles could be used to construct the walls of a small house. The project was piloted in Caribbean island communities facing severe housing shortages and limited building materials, with the bottles even designed to have a flattened surface so mortar could adhere to them like ordinary bricks. The idea never reached mass production, and surviving prototype bottles are now considered rare collector's items, but the concept is still cited today as an early, literal example of designing packaging for a second life as affordable housing. Name the company.",
    answer: "Heineken (the bottle was known as the WOBO, or “World Bottle”)"
  },
  {
    topic: "Success After Failure",
    question:
      "Five investors in the early 1900s pooled their savings to buy mining rights to a hillside they believed contained a valuable mineral used to manufacture industrial-grade sandpaper for shipyards and machine shops. When the deposit turned out to be low-grade and nearly commercially worthless, the fledgling company spent its early years as a near-total failure, forced to import raw abrasive material from elsewhere just to keep producing anything at all, and several of its original investors reportedly lost most of their personal savings before the company found its footing. Decades later, long after it had become a sprawling industrial innovator, one of its research chemists was tasked with developing a stronger, more permanent adhesive — and instead accidentally produced a weak, easily removable one that was initially considered a failed experiment and shelved for years, until a colleague began using it to keep bookmarks from falling out of his choir hymnal. Name the company.",
    answer: "3M (Minnesota Mining and Manufacturing Company)"
  },
  {
    topic: "Old Names, New Businesses",
    question:
      "This company's modern emblem has nothing whatsoever to do with the product category it has dominated for well over a century. The name and symbol instead trace back to a modest import shop in London's East End, run in the 1830s by the founder's father, who specialized in selling ornamental objects collected from beaches on the far side of the world — objects prized by Victorian collectors for their polish and rarity, sold alongside other curios imported from trade routes the family had connections to. Decades after his father's death, the son expanded the family trading business into oil transport almost by accident, chartering tankers to move kerosene through the Suez Canal, and chose to keep the family's old shop emblem rather than design something new — a decision made largely out of sentiment rather than strategy. Name the company.",
    answer: "Shell"
  },
  {
    topic: "Solving Problems to Survive",
    question:
      "In 1943, this European entrepreneur started a mail-order business as a teenager, initially selling pens, wallets, and nylon stockings sourced cheaply and resold at a markup to customers across the countryside, using the postal service as his only distribution channel since he had no physical shop. When he began adding furniture to his catalog years later, local furniture retailers were so threatened that they pressured manufacturers to boycott supplying him directly, forcing him to design and source his own furniture from scratch — a workaround that accidentally led to the flat-packed, self-assembly format the company is famous for today, since flat packaging was simply the cheapest way to ship furniture by mail without a dealer network. Name the company.",
    answer: "IKEA — an acronym of the founder's initials (Ingvar Kamprad), his family farm (Elmtaryd), and his home village (Agunnaryd)"
  },
  {
    topic: "Big Companies Helping People",
    question:
      "This global consumer goods company — best known for a line of bottled water and a separate portfolio of baby food and infant formula brands — developed a low-cost, portable water filtration device roughly the size of a drinking straw, engineered to remove bacteria and parasites from contaminated water using only suction, with no electricity, batteries, or chemical treatment required. Originally developed through research linked to the company's pharmaceutical and nutrition divisions to serve refugee camps and disaster-relief zones, the device was deliberately priced far below cost and distributed through humanitarian partnerships to parts of the world facing acute water-contamination crises, rather than sold as a mainstream retail product. Name the company.",
    answer: "Nestlé (the device is the LifeStraw)"
  },
  {
    topic: "Inventions in Hard Times",
    question:
      "During a period of severe wartime rationing in the early 1940s, when a key imported ingredient essential to a popular confection had become both scarce and prohibitively expensive across an entire country, a small-town pastry maker began experimenting with ways to stretch his dwindling supply of that ingredient by blending it with a cheap, locally abundant nut that grew in the hills near his shop. The resulting dense paste, originally sold in a loaf that could be sliced like bread, wasn't conceived as a luxury treat at all — it was a practical, cost-saving workaround for customers who could no longer afford the real thing in its pure, unblended form, and it wasn't until his son took over the business decades later, reformulating it into a smoother, more spreadable version, that it became the breakfast product recognized in households worldwide today. Name the brand.",
    answer: "Nutella (by Ferrero)"
  },
  {
    topic: "Luxury Brand Stories",
    question:
      "According to company lore passed down for decades, its most famous and most heavily waitlisted product — one that can carry a years-long waiting list and resell for several times its original price — wasn't conceived in a design studio or sketched by a professional illustrator at all, but drawn in rough form on the back of an airline sickness bag during a transatlantic flight, after a well-known actress and singer seated beside a senior company executive accidentally spilled the contents of her own overstuffed straw tote bag into the aisle in front of him. Charmed by the mishap, he offered on the spot to design her something more practical, and the resulting bag, launched commercially a few years later, now carries her first name — even though she herself later remarked in interviews that she eventually stopped carrying it regularly because it had become too heavy and impractical for daily use. Name the company.",
    answer: "Hermès (the bag is the Birkin, named after Jane Birkin)"
  },
  {
    topic: "How a Brand Got Its Name",
    question:
      "This company's name was chosen not for any connection to its product, but purely for how the word sounded when spoken aloud — it was lifted from a minor supporting character in a sprawling 19th-century seafaring novel about an obsessive sea captain, a choice made by the three co-founders partly because an early working name they had considered, drawn from a nearby mining town's history, tested poorly with focus groups. For its first decade of existence in the Pacific Northwest, the company didn't serve a single drink to a walk-in customer — it sold only whole roasted beans, loose-leaf tea, and brewing equipment for people to prepare at home, resembling a specialty grocer more than a café, until an employee who had traveled through Italy and become fascinated by the espresso-bar culture there spent years convincing the original founders to change the entire business model into one centered on serving prepared drinks. Name the company.",
    answer: "Starbucks (named after Starbuck, from Herman Melville's Moby-Dick)"
  },
  {
    topic: "Who Owns a Company",
    question:
      "In a restructuring completed in 2022, the founder of this outdoor apparel company — a lifelong rock climber who had built his company's reputation partly on radical environmental honesty, including a famous ad that directly urged his own customers to buy less from him — gave away the entirety of his multi-billion-dollar business, but not through a conventional sale, a charitable foundation donation, or an inheritance to his children. Instead, voting control and all future profit not reinvested into daily operations were restructured through a specially created legal trust and nonprofit arrangement designed so that money would flow, automatically and in perpetuity, toward fighting climate change and protecting undeveloped land — meaning that in a very literal, legally binding sense, the planet itself effectively became the company's only shareholder going forward. Name the company.",
    answer: "Patagonia"
  }
];

const WAGER_SECONDS = 20;
const ANSWER_SECONDS = 90;

// ---------------------------------------------------------------------------
// In-memory game state (single game/event at a time)
// ---------------------------------------------------------------------------
function freshGame() {
  return {
    code: null,
    status: "idle",       // idle | lobby | active | paused | ended
    phase: "wagering",    // wagering | awaiting_broadcast | question | results
    currentIndex: -1,
    timer: {
      running: false,
      remaining: 0,
      total: 0,
      kind: null,         // "wager" | "answer"
      handle: null
    },
    lockdown: false,      // host-enforced full-screen lock for all teams
    violations: [],       // { teamId, teamName, type, at }
    teams: {}             // teamId -> { id, name, socketId, score, wagers:{}, answers:{}, results:{} }
  };
}

let game = freshGame();

function randomCode() {
  let code = "";
  for (let i = 0; i < 6; i++) code += Math.floor(Math.random() * 10);
  return code;
}

function usedPoints(team) {
  return Object.values(team.wagers || {});
}

function computeScore(team) {
  let score = 0;
  Object.keys(team.results || {}).forEach((idx) => {
    if (team.results[idx] === "correct" && typeof team.wagers[idx] === "number") {
      score += team.wagers[idx];
    }
  });
  return score;
}

function publicTeamList() {
  return Object.values(game.teams)
    .map((t) => ({
      id: t.id,
      name: t.name,
      score: computeScore(t),
      wagers: t.wagers,
      answers: t.answers,
      results: t.results,
      violationCount: t.violationCount || 0
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function currentQuestion() {
  return QUESTIONS[game.currentIndex] || null;
}

function broadcastHost() {
  io.to("host").emit("host:state", {
    code: game.code,
    status: game.status,
    phase: game.phase,
    currentIndex: game.currentIndex,
    totalQuestions: QUESTIONS.length,
    question: currentQuestion(),
    allQuestions: QUESTIONS,
    lockdown: game.lockdown,
    violations: game.violations.slice(-100),
    timer: { running: game.timer.running, remaining: game.timer.remaining, total: game.timer.total, kind: game.timer.kind },
    teams: publicTeamList()
  });
}

function broadcastTeams() {
  Object.values(game.teams).forEach((t) => {
    if (!t.socketId) return;
    const q = currentQuestion();
    const showQuestionText = q && game.phase === "question";
    io.to(t.socketId).emit("team:state", {
      status: game.status,
      lockdown: game.lockdown,
      phase: game.phase,
      currentIndex: game.currentIndex,
      totalQuestions: QUESTIONS.length,
      topic: q ? q.topic : null,
      question: showQuestionText ? q.question : null,
      timer: { running: game.timer.running, remaining: game.timer.remaining, total: game.timer.total, kind: game.timer.kind },
      me: {
        id: t.id,
        name: t.name,
        score: computeScore(t),
        wagers: t.wagers,
        answers: t.answers,
        results: t.results
      }
    });
  });
}

const VIOLATION_TYPES = ["tab_switch", "exited_fullscreen", "reconnected"];

function recordViolation(team, type) {
  const rec = { teamId: team.id, teamName: team.name, type, at: Date.now() };
  game.violations.push(rec);
  team.violationCount = (team.violationCount || 0) + 1;
  io.to("host").emit("host:alert", rec);
}

function broadcastAll() {
  broadcastHost();
  broadcastTeams();
}

// ---------------------------------------------------------------------------
// Timer engine (pausable)
// ---------------------------------------------------------------------------
function clearTimer() {
  if (game.timer.handle) clearInterval(game.timer.handle);
  game.timer.handle = null;
  game.timer.running = false;
}

function startTimer(seconds, kind, onExpire) {
  clearTimer();
  game.timer.remaining = seconds;
  game.timer.total = seconds;
  game.timer.kind = kind;
  game.timer.running = true;
  game.timer.handle = setInterval(() => {
    if (game.status === "paused") return; // frozen while paused
    game.timer.remaining -= 1;
    if (game.timer.remaining <= 0) {
      clearTimer();
      onExpire();
    }
    broadcastAll();
  }, 1000);
}

// ---------------------------------------------------------------------------
// Phase transitions
// ---------------------------------------------------------------------------
function beginWagerWindow() {
  game.phase = "wagering";
  startTimer(WAGER_SECONDS, "wager", () => {
    // Auto-lock lowest available wager for any team that hasn't wagered
    const idx = String(game.currentIndex);
    Object.values(game.teams).forEach((t) => {
      if (t.wagers[idx] !== undefined) return;
      const used = usedPoints(t);
      for (let n = 1; n <= 10; n++) {
        if (used.indexOf(n) === -1) {
          t.wagers[idx] = n;
          break;
        }
      }
    });
    game.phase = "awaiting_broadcast";
    broadcastAll();
  });
  broadcastAll();
}

function broadcastQuestionToTeams() {
  if (game.phase !== "awaiting_broadcast" && game.phase !== "wagering") return;
  game.phase = "question";
  startTimer(ANSWER_SECONDS, "answer", () => {
    const idx = String(game.currentIndex);
    Object.values(game.teams).forEach((t) => {
      if (t.answers[idx] === undefined) t.answers[idx] = "[No Answer Submitted]";
    });
    broadcastAll();
  });
  broadcastAll();
}

function revealResults() {
  // No longer used during live play — judging happens in the end-of-round review screen.
}

function nextQuestion() {
  // If teams are mid-answer, lock in blanks for anyone who hasn't submitted yet before moving on.
  if (game.phase === "question") {
    const idx = String(game.currentIndex);
    Object.values(game.teams).forEach((t) => {
      if (t.answers[idx] === undefined) t.answers[idx] = "[No Answer Submitted]";
    });
  }
  const next = game.currentIndex + 1;
  if (next >= QUESTIONS.length) {
    game.status = "review";
    game.phase = "wagering";
    clearTimer();
    broadcastAll();
    return;
  }
  game.currentIndex = next;
  beginWagerWindow();
}

function finishReview() {
  game.status = "ended";
  game.lockdown = false;
  clearTimer();
  broadcastAll();
}

// ---------------------------------------------------------------------------
// Socket handlers
// ---------------------------------------------------------------------------
io.on("connection", (socket) => {
  socket.on("host:create", (_payload, cb) => {
    game = freshGame();
    game.code = randomCode();
    game.status = "lobby";
    socket.join("host");
    if (cb) cb({ ok: true, code: game.code });
    broadcastAll();
  });

  socket.on("host:start", () => {
    if (game.status !== "lobby") return;
    game.status = "active";
    game.currentIndex = 0;
    beginWagerWindow();
  });

  socket.on("host:broadcastQuestion", () => {
    broadcastQuestionToTeams();
  });

  socket.on("host:revealResults", () => {
    revealResults();
  });

  socket.on("host:finishReview", () => {
    finishReview();
  });

  socket.on("host:judge", ({ teamId, verdict, questionIndex }) => {
    const t = game.teams[teamId];
    if (!t) return;
    const idx = String(questionIndex !== undefined ? questionIndex : game.currentIndex);
    if (verdict !== "correct" && verdict !== "wrong") return;
    t.results[idx] = verdict;
    broadcastAll();
  });

  socket.on("host:next", () => {
    nextQuestion();
  });

  socket.on("host:pause", () => {
    if (game.status === "active") game.status = "paused";
    broadcastAll();
  });

  socket.on("host:resume", () => {
    if (game.status === "paused") game.status = "active";
    broadcastAll();
  });

  socket.on("host:setLockdown", ({ on }) => {
    if (game.status === "ended" || game.status === "idle") return;
    game.lockdown = !!on;
    broadcastAll();
  });

  socket.on("host:end", () => {
    game.status = "ended";
    game.lockdown = false;
    clearTimer();
    broadcastAll();
  });

  socket.on("team:join", ({ name, code }, cb) => {
    name = (name || "").trim();
    code = (code || "").trim();
    if (!game.code || code !== game.code) {
      if (cb) cb({ ok: false, error: "No game found with that code." });
      return;
    }
    if (!name) {
      if (cb) cb({ ok: false, error: "Enter a team name." });
      return;
    }
    const id = "t_" + Math.random().toString(36).slice(2, 10);
    game.teams[id] = {
      id,
      name,
      socketId: socket.id,
      score: 0,
      wagers: {},
      answers: {},
      results: {}
    };
    socket.join("teams");
    socket.data.teamId = id;
    if (cb) cb({ ok: true, teamId: id });
    broadcastAll();
  });

  socket.on("team:rejoin", ({ teamId }, cb) => {
    const t = game.teams[teamId];
    if (!t) {
      if (cb) cb({ ok: false });
      return;
    }
    t.socketId = socket.id;
    socket.join("teams");
    socket.data.teamId = teamId;
    if (game.lockdown) recordViolation(t, "reconnected");
    if (cb) cb({ ok: true });
    broadcastAll();
  });

  socket.on("team:wager", ({ n }) => {
    const teamId = socket.data.teamId;
    const t = game.teams[teamId];
    if (!t || game.phase !== "wagering" || game.status !== "active") return;
    const idx = String(game.currentIndex);
    if (t.wagers[idx] !== undefined) return;
    if (usedPoints(t).indexOf(n) !== -1) return;
    if (n < 1 || n > 10) return;
    t.wagers[idx] = n;
    broadcastAll();
  });

  socket.on("team:violation", ({ type }) => {
    const t = game.teams[socket.data.teamId];
    if (!t || !game.lockdown) return;
    if (VIOLATION_TYPES.indexOf(type) === -1) return;
    recordViolation(t, type);
    broadcastHost();
  });

  socket.on("team:answer", ({ text }) => {
    const teamId = socket.data.teamId;
    const t = game.teams[teamId];
    if (!t || game.phase !== "question") return;
    const idx = String(game.currentIndex);
    if (t.answers[idx] !== undefined) return;
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    t.answers[idx] = trimmed;
    broadcastAll();
  });

  socket.on("disconnect", () => {
    // Teams can reconnect via team:rejoin; we keep their data.
  });
});

server.listen(PORT, () => {
  console.log("War Room Wager listening on port " + PORT);
});
