# Stylo Hosting

## Current State
A web hosting platform where users log in with Internet Identity, upload HTML files/images, use a Template Gallery, HTML Editor, and Template Builder to create and deploy sites. Sites are stored using blob-storage and managed via the backend.

## Requested Changes (Diff)

### Add
- New backend function `getCallerSitesWithIds()` that returns each site with its ID for the authenticated caller.

### Modify
- Frontend `useGetAllSites` hook now calls `getCallerSitesWithIds()` instead of the admin-only `getAllSiteIds()`. This fixes the bug where regular users couldn't see their deployed sites.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `getCallerSitesWithIds` to `main.mo` returning `[SiteWithId]` for the caller only.
2. Update `useQueries.ts` to use the new function instead of the admin-only `getAllSiteIds`.
3. Keep `deleteSite` working since real IDs are now returned.
