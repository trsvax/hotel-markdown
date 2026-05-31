---
form: confirm
tube: /tube/booking/confirm
prev: /forms/booking/payment
---

# Confirm Your Booking

Review your details and confirm.

```css
form {
  display: grid;
  grid-template-areas:
    "summary summary"
    "terms   terms"
    "submit  submit";
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 600px;
}

input, select {
  font: inherit;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  background: #16a34a;
  color: white;
  padding: 1rem 3rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
}
```

## terms
- type: select
- area: terms
- required: true
- options: [agree, disagree]
- help: I agree to the cancellation policy and terms of service

```css
.field-terms {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
}
```
