# AAA Wallet Pass Viewer

Read-only browser viewer for the AAA `.pkpasstemplate` examples, laid out like Apple's Pass Designer: components on the left, iOS 27 and iOS 26 previews on the canvas.

Live: https://caaronperez.github.io/aaa-wallet-pass-viewer/

## What it shows

- **iOS 27** — the `posterGeneric` pass (artwork, primary logo, barcode, primary and footer fields) plus its Featured Action cards.
- **iOS 26** — the `generic` fallback style stored in the same `pass.json`, matching the previous AAA card design.
- **Details** — the back fields (Pass Details) for both styles. Use the Front/Details toggle or drag a card sideways.
- **Every component is inspectable, never editable**: Identity & Signing, Style, Images, Barcode & NFC, Featured Actions, each field group and field, and the complete `pass.json` / `tooling.json`.
- **Apple's limits beside each component**, e.g. Header Fields (max 1), Primary Fields (max 4), and Featured Actions 2/2. The "Show limits for pass style" menu checks the same fields against another style (Generic, Store Card, Coupon, Event Ticket, Boarding Pass) and shows in red what would no longer fit.
- **Featured Actions** lists all 14 documented action types. The ones in the template are highlighted, and each type shows its required keys, value format, category and validation.

**Download template** saves the selected template as a `.zip` of its `.pkpasstemplate` folder; unzip it and open the folder in Pass Designer. It is an unsigned design template, not an installable `.pkpass`.

Open another template with **Open .pkpasstemplate** (select the folder) or **Open pass.json**. Files stay in the browser.

## Notes

- This is a recreation for design review. Wallet and Pass Designer render the real pass, including fonts, truncation, barcode artwork, and Featured Action labels and symbols.
- `place` Featured Actions need a real Apple Maps Place ID; with an invalid one the card does not render on a device. The templates use `I71B28B9C6AC9C7EF` (AAA Glendale, 1233 E Broadway), found with MapKit's `MKLocalSearch` and verified with `MKMapItemRequest`. Wallet still labels the card "Get Directions / Open in Maps"; the place name is not shown. Production passes should resolve each member's branch at pass-generation time.
- The bundled files are design samples with personal-looking test values. Replace them before production use or broad distribution.

Sources: [Creating a Poster Generic pass](https://developer.apple.com/documentation/walletpasses/creating-a-poster-generic-pass) · [Defining the metadata of your Wallet pass](https://developer.apple.com/documentation/walletpasses/defining-the-metadata-of-your-wallet-pass#Add-Featured-Actions) · [Creating a pass with Pass Designer](https://developer.apple.com/documentation/walletpasses/creating-a-pass-with-pass-designer)
