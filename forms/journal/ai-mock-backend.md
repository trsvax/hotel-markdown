---
form: journal
date: 2026-06-05
---

# AI Mock Backend

What if the forms actually worked — not with a real booking system, but with AI improvising responses?

## The idea

The hotel booking flow has five forms: search, room, guest, payment, confirm. Right now they submit to a tube URL and get a 202. Nothing happens after that.

But what if a Lambda received the submission, passed the form data to Bedrock, and got back a plausible response? Search returns available rooms. Room selection returns pricing. Payment returns a confirmation number. All fake, all contextually appropriate, all generated on the fly.

The form markdown already describes what each field means. That's enough context for an LLM to improvise a believable response.

## The flow

1. Form submits to `/tube/booking/search`
2. Ticket machine creates a locker, invokes processor
3. Processor reads the form spec (the markdown) + the submitted data
4. Calls Bedrock: "given this form and this input, generate a realistic response"
5. Writes result to locker
6. Client polls, gets a JSON response that looks like a real hotel system

## Why

It's a demo. The point of hotel-markdown is that forms are files. But a form that does nothing is less compelling than a form that responds. AI gives you a backend without building a backend.

Cost: one Bedrock invoke per submission. Fractions of a cent at demo scale.

## What it proves

You can build an interactive application with:
- Markdown (the form spec)
- One HTML file (the renderer)
- One Lambda (the AI responder)
- No database, no server, no framework

The form *is* the API contract. The markdown describes what's expected. The AI fulfills it.
