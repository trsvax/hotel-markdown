---
form: room
tube: /tube/booking/room
next: /forms/booking/guest
prev: /forms/booking/search
---

# Choose Your Room

Pick a room type and any extras.

```css
form {
  display: grid;
  grid-template-areas:
    "roomType   roomType"
    "ratePlan   ratePlan"
    "breakfast  parking"
    "submit     submit";
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 600px;
}

input, select {
  font: inherit;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
}

button {
  background: #2563eb;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
```

## roomType
- type: select
- area: roomType
- required: true
- options: [standard, deluxe, suite, penthouse]
- default: standard
- help: Room category

## ratePlan
- type: select
- area: ratePlan
- required: true
- options: [flexible, non-refundable, member-rate]
- default: flexible
- help: Flexible allows free cancellation up to 24h before check-in

## breakfast
- type: select
- area: breakfast
- options: [none, continental, full-buffet]
- default: none
- help: Add breakfast to your stay

## parking
- type: select
- area: parking
- options: [none, self-park, valet]
- default: none
- help: On-site parking options
