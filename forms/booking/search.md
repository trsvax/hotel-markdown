---
form: search
tube: /tube/booking/search
next: /forms/booking/room
---

# Find a Room

Where are you headed?

```css
form {
  display: grid;
  grid-template-areas:
    "destination destination"
    "checkin     checkout"
    "guests      rooms"
    "submit      submit";
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

## destination
- type: text
- area: destination
- required: true
- placeholder: City, hotel, or region
- help: Where do you want to stay?

## checkin
- type: date
- area: checkin
- required: true
- help: Check-in date

## checkout
- type: date
- area: checkout
- required: true
- help: Check-out date

## guests
- type: number
- area: guests
- required: true
- min: 1
- max: 10
- default: 2
- placeholder: 2
- help: Number of guests

## rooms
- type: number
- area: rooms
- required: true
- min: 1
- max: 5
- default: 1
- placeholder: 1
- help: Number of rooms
