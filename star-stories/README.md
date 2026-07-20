# Star Stories — a book about the child, for the child

A personalized book generated from a child's birth data: their real natal chart,
translated into a story written in the register of their age. A gift that can be
re-given as they grow — the same sky, retold.

## The product idea

One engine (the Chart Compass astro engine — planets, ASC, houses, Human Design
gates, Gene Keys), many registers:

| Edition | Reader | Register |
|---|---|---|
| Parents' Companion | the adults | extensive, reflective — closest to the Compass portraits; easy-print |
| 0–2 | read *to* the baby | lullaby cadence, few words, images carry it |
| 2–5 | bedtime story | animal fable, rhythm and repetition, "a little bear who feels everything" |
| First graders (6–8) | early self-reading | quest story, short chapters, the child as hero |
| Pre-teens (9–12) | private reading | adventure + first interiority, "your secret compass" |
| Teenagers | skeptical reading | honest, unpatronizing, identity and intensity |
| Young adults | leaving home | a letter to carry — the parents' book, re-addressed to them |

## The ethical line (non-negotiable)

Story as **mirror**, never prediction as **destiny**. The chart gives the story
its *shape* — a child with a Scorpio Moon gets a hero who feels deeper than
anyone knows — but the text never tells a child who they must become. No career
predictions, no relationship fates, no "you will be". A child inherits a poem,
not a box.

## Pipeline (v1 — handcrafted, then automated)

1. Birth data → chart computed with the existing engine (`test-engine/`)
2. Chart → age-register prompt → story text (crafted, reviewed)
3. Story → typeset printable HTML → PDF (print-ready, A5, generous margins)

First three books: ages 7, 5, and 2. Handcrafted end-to-end to find the voice
before any automation or storefront (Lovable or otherwise) is built.

## Status

- [ ] Book 1 — age 7 (awaiting birth data)
- [ ] Book 2 — age 5 (awaiting birth data)
- [ ] Book 3 — age 2 (awaiting birth data)
