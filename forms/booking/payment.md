---
form: payment
tube: /tube/booking/payment
next: /forms/booking/confirm
prev: /forms/booking/guest
---

# Payment

Almost there.

```css
form {
  display: grid;
  grid-template-areas:
    "cardName   cardName"
    "cardNumber cardNumber"
    "expiry     cvv"
    "billingAddress billingAddress"
    "billingCity billingZip"
    "submit     submit";
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 600px;
}

input {
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

## cardName
- type: text
- area: cardName
- required: true
- placeholder: Name on card

## cardNumber
- type: text
- area: cardNumber
- required: true
- max: 19
- placeholder: 4242 4242 4242 4242
- help: We never store your full card number

```css
.field-cardNumber input {
  font-family: monospace;
  letter-spacing: 0.1em;
}
```

## expiry
- type: text
- area: expiry
- required: true
- max: 5
- placeholder: MM/YY

## cvv
- type: text
- area: cvv
- required: true
- max: 4
- placeholder: 123

```css
.field-cvv input {
  font-family: monospace;
  max-width: 100px;
}
```

## billingAddress
- type: text
- area: billingAddress
- required: true
- placeholder: Billing street address

## billingCity
- type: text
- area: billingCity
- required: true
- placeholder: City

## billingZip
- type: text
- area: billingZip
- required: true
- max: 10
- placeholder: Postal code
