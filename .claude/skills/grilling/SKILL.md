---
name: grilling
description: Interrogate a plan, decision, or idea round by round until nothing is left silently assumed. Maps the work as a design tree and asks the whole answerable frontier at once, with a recommended answer attached to every question. NARROW KEYWORD TRIGGER ONLY. Use this skill only when the user explicitly uses the word "grill" - for example "grill this idea", "grill this plan", "grill me", "grill my thinking", "grill this". Do NOT use it for any other ideation, refinement, or pressure-testing request, however similar it sounds. "Refine this idea", "stress-test my plan", "poke holes in this", "ideate on this", "sharpen this", "what am I not thinking about", and every other pressure-testing phrasing are handled in normal conversation without this skill. There is no separate ideation skill to route them to.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Each question should be formatted like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each round the user answers reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment, go find it with whatever tools are available — read the files, run the search, check the docs. Never ask the user for something you could look up yourself. Don't block on it either: an unfinished lookup is an unsettled prerequisite, so only the questions downstream of it wait. Ask the rest of the frontier now. The _decisions_ are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
