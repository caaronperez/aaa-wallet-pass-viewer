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

Open more templates, all in the browser (nothing is uploaded). Each one gets its own tab next to the built-in ones (close it with ×), and importing the same template again updates its tab:

- **Drag** a `.pkpasstemplate` from Finder onto the page (also works with a `.zip` or `pass.json`).
- **Drag and drop / pass.json** button: pick a single `pass.json` (a zip of a template, for example from Download template, works too).
- **Open folder**: macOS shows `.pkpasstemplate` as a single file (it is a package), so the folder picker can't select it. Pick the folder that contains it instead, such as `outputs`; every template inside opens in its own tab.

## Google Wallet

`google.html` (Apple Wallet / Google Wallet switch in the title bar) shows the same two cards as Google Wallet Generic passes: `google/aaa-membership.json` and `google/aaa-insurance.json`, each `{genericClass, genericObject}` with mock data. It renders the Android card, value-added modules, app link, details and links, lists Google's limits, and compares Apple Featured Actions with Google's equivalents. Drop in your own pass JSON (or a JWT payload) to preview it. The issuer ID is a placeholder.

## Password

Both pages ask for a password (`gate.js`). It keeps casual visitors out, but it isn't real security: the repo is public, and files like templates and images can still be opened by their direct URL. For real access control, host the site behind a login (for example a private host or Cloudflare Access).

To change the password, run this and paste the result into `HASH` in `gate.js`. Everyone who unlocked before will be asked again.

```bash
printf '%s' 'aaa-wallet-viewer:NEWPASSWORD' | shasum -a 256
```

## Next steps (TODO)

- **Get Directions (place ID):** the place ID is written into the signed pass, so members and Wallet can't change it. Our pass server sets it per member (home branch or nearest to the address on file) and pushes updates through the Wallet web service (`webServiceURL`, APNs, new signed pass) when the branch changes. It can't follow the phone's location live; `locations` + `relevantText` only control Lock Screen relevance. Look up place IDs with the Apple Maps Server API or MapKit, store them per branch, and re-check them now and then. If a member has no branch, leave the action out.
- **View Membership Benefits:** currently `https://autoclubapp.page.link/wallet-benefits`, which only opens the app (old Firebase Dynamic Links domain; shows "not found" without the app). Move to an AAA domain with an `apple-app-site-association` file and add an app route that opens the assistant on Membership Benefits.

## Notes

- This is a recreation for design review. Wallet and Pass Designer render the real pass, including fonts, truncation, barcode artwork, and Featured Action labels and symbols.
- `place` Featured Actions need a real Apple Maps Place ID; with an invalid one the card does not render on a device. The templates use `I71B28B9C6AC9C7EF` (AAA Glendale, 1233 E Broadway), found with MapKit's `MKLocalSearch` and verified with `MKMapItemRequest`. Wallet still labels the card "Get Directions / Open in Maps"; the place name is not shown. Production passes should resolve each member's branch at pass-generation time.
- The bundled files are design samples with personal-looking test values. Replace them before production use or broad distribution.

Sources: [Creating a Poster Generic pass](https://developer.apple.com/documentation/walletpasses/creating-a-poster-generic-pass) · [Defining the metadata of your Wallet pass](https://developer.apple.com/documentation/walletpasses/defining-the-metadata-of-your-wallet-pass#Add-Featured-Actions) · [Creating a pass with Pass Designer](https://developer.apple.com/documentation/walletpasses/creating-a-pass-with-pass-designer)
