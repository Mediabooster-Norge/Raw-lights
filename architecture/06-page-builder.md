# Page builder

Blocks are listed on `page.blocks` and nested in `sectionBlock`.

`lib/components/blocks/registry.ts` maps `_type` to a component. `PageRenderer` renders the tree.

Unknown types show `UnknownBlock` in development.
