# Assembly frame sequence

Drop the frames here as `001.webp` … `NNN.webp`, zero-padded to 3 digits,
numbered **in assembly order**: `001` is fully exploded, the last frame is the
finished car.

Then set the count on the host element in `index.html`:

```html
<div class="seq" data-seq="/images/hero/assembly" data-seq-count="48"
     data-seq-ext="webp" data-seq-pad="3">
```

`js/sequence.js` does the rest — scroll scrubbing, lazy loading in display
order, reverse on scroll-up, and a reduced-motion path that loads only the
first and last frame.

## Specification

| | |
|---|---|
| Frames | 36–60. Below 30 it steps visibly; above 60 is wasted bytes |
| Size | 1920×1080, transparent or pure `#07080A` background |
| Format | WebP, quality ~78. Target **under 60 KB per frame** |
| Total | Keep the whole sequence under 2.5 MB |
| Framing | **Identical camera in every frame.** The car must not drift, rotate or rescale — only the parts move |
| Order | `001` fully exploded → last frame fully assembled |

The fixed camera is the one thing that cannot be fixed afterwards. If the
viewpoint shifts between frames the scrub will judder and no amount of code
will hide it.

## Converting a video to frames

If it is generated as video instead:

```
ffmpeg -i assembly.mp4 -vf "fps=24,scale=1920:-2" -q:v 2 frames/%03d.png
```

then batch to WebP at ~78 quality. Check the first and last frame are the
exploded and finished states, and trim any lead-in or hold at the end.
