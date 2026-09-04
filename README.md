# Gerardo Chay — Backend Portfolio

A static, single-page professional portfolio built with HTML, CSS, JavaScript, and JSON. It is being developed incrementally and currently contains the definitive information architecture with provisional content.

## Information architecture

The page follows this order:

1. Hero
2. About
3. Experience
4. Selected Work
5. Expertise
6. Education
7. Contact

Content is stored by domain in `data/`. Text marked `PLACEHOLDER` is intentionally provisional and will be replaced in later phases.

## Run locally

The site loads JSON with `fetch`, so serve it over HTTP instead of opening `index.html` directly:

```bash
python3 -m http.server 5500
```

Then open `http://127.0.0.1:5500`.

## Deployment

The project is intended for GitHub Pages and uses repository-relative asset paths. It can be published from the root of the `main` branch.
