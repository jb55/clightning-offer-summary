
# offer-summary-plugin

A clightning plugin that summarizes paid offer invoices

## Example

    $ lightning-cli offer-summary 22db2cbdb2d6e1f4d727d099e2ea987c05212d6b4af56d92497e093b82360db7 5

```
{
  "total_msatoshi": 11863999,
  "paid_invoices": [
    {
      "payer_note": "satsxsw @pleblab",
      "paid_at": 1647108469,
      "msatoshi": 1000
    },
    {
      "paid_at": 1646951285,
      "msatoshi": 100000
    },
    {
      "paid_at": 1646946288,
      "msatoshi": 1000000
    },
    {
      "payer_note": "base58.info is the premier bitcoin tx academy ⛓️🔓",
      "paid_at": 1646945213,
      "msatoshi": 9000
    },
    {
      "paid_at": 1646945065,
      "msatoshi": 9999000
    }
  ],
  "top_donors": [
    {
      "paid_at": 1646945065,
      "msatoshi": 9999000
    },
    {
      "paid_at": 1646946288,
      "msatoshi": 1000000
    },
    {
      "payer_note": "Love your work!",
      "paid_at": 1630554622,
      "msatoshi": 500000
    },
    {
      "paid_at": 1646951285,
      "msatoshi": 100000
    },
    {
      "payer_note": "world first mainnet lndhub bolt12 payment",
      "paid_at": 1645624806,
      "msatoshi": 100000
    }
  ]
}
```
