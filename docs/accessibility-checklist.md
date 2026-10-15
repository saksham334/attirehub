# AttireHub Accessibility and Responsive Notes

Checked manually in Chrome with DevTools, Lighthouse and keyboard-only testing.
Not a certified audit.

## Implemented
- Semantic landmarks: header, nav, main, footer, aside, section with headings
- Skip-to-content link; visible focus outline on all controls
- Every form field has a label; errors use role="alert"; status text uses role="status"
- Icon-only buttons have accessible names; decorative icons are aria-hidden
- Images have alt text (decorative thumbnails use empty alt)
- Color is never the only signal (order status badges include text; swatches have names)
- Page title changes per page
- prefers-reduced-motion respected
- Carousel can be paused; countdown does not announce every second
- Muted text and badge colors adjusted for contrast

## Tested sizes
360, 768, 1024, 1440 px

## Lighthouse accessibility scores
| Page | Score |
|---|---|
| Home | __ |
| Shop | __ |
| Product | __ |
| Login | __ |
| Cart | __ |

## Known gaps
- No screen reader testing across NVDA/JAWS/VoiceOver
- Color swatches rely on a tooltip and accessible name rather than a visible label
- Carousel slides auto-advance until paused
- Third-party placeholder images are not described beyond the product name