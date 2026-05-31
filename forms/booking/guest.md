---
form: guest
tube: /tube/booking/guest
next: /forms/booking/payment
prev: /forms/booking/room
---

# Guest Details

Who's checking in?

```css
form {
  display: grid;
  grid-template-areas:
    "firstName  lastName"
    "email      phone"
    "address    address"
    "city       zip"
    "country    country"
    "requests   requests"
    "submit     submit";
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 600px;
}

input, textarea, select {
  font: inherit;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
}

textarea {
  min-height: 100px;
  resize: vertical;
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

## firstName
- type: text
- area: firstName
- required: true
- max: 50
- placeholder: First name

## lastName
- type: text
- area: lastName
- required: true
- max: 50
- placeholder: Last name

## email
- type: email
- area: email
- required: true
- placeholder: you@example.com
- help: Confirmation sent here

## phone
- type: tel
- area: phone
- required: true
- placeholder: +1 555 123 4567
- help: For day-of-arrival contact

## address
- type: text
- area: address
- required: true
- placeholder: Street address

## city
- type: text
- area: city
- required: true
- placeholder: City

## zip
- type: text
- area: zip
- required: true
- max: 10
- placeholder: Postal code

## country
- type: select
- area: country
- required: true
- options: [US, CA, UK, DE, FR, JP, AU, other]
- default: US

## requests
- type: textarea
- area: requests
- placeholder: Early check-in, extra pillows, quiet room...
- help: We'll do our best
