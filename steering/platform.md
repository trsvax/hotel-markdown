---
inclusion: auto
---

# Platform Principles

The contract is: files at URLs. Nothing cares what built them or what reads them.

## Architecture defaults

- Files on S3 served via CloudFront
- Lambda for processing, not servers
- No databases unless the problem genuinely requires transactions
- No servers unless the problem genuinely requires persistent connections
- No infrastructure that costs money when idle

## Format defaults

- Markdown for human-to-AI communication (steering, specs, forms, content)
- JSON only for machine-to-machine contracts (package.json, API responses, manifests)
- HTML/CSS where you need full rendering control
- Embed real CSS/HTML in markdown code blocks when you need precision on one piece

## Cost constraint

A dollar a month at personal scale. Linear cost at any scale. If a suggestion adds fixed monthly cost, flag it.

## Reference implementations

- **AWS setup:** https://github.com/trsvax/theTube/blob/main/scripts/aws-setup.sh
- **CDK infrastructure:** https://github.com/trsvax/thetube-private/tree/main/infra
- **Lambda examples:** https://github.com/trsvax/thetube-private/tree/main/lambda
- **Deploy workflow:** https://github.com/trsvax/theTube/blob/main/.github/workflows/deploy.yml
- **Form pattern:** https://github.com/trsvax/hotel-markdown

Read these for how the architecture is implemented. Use them as templates for new projects.
