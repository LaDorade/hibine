# TODO

## Prio Prio

- ~~[ ] Save only the changed part of the file (8 points)~~
  - -> not priority for now, files are small enough
- [x] Synchronization on tabs/open editors when moving/renaming files (8 points)
- [~] Deploy script for easy installation (5 points)
- [ ] Codemirror integration (8 points)
  - [ ] Finish basic markdown support
- [x] File renaming (3 points)
- [x] File deletion (3 points)
- [ ] Basic settings page/tab (5 points)
- [ ] Full mobile support (13 points)
  - [x] Sidebar support
  - [ ] Touch support (drag and drop, context menu, etc)

## High Prio

- [x] Support multiple vaults
- [ ] Fulltext search
- [ ] Feedback with toasts/notifications
- [ ] Export to PDF/HTML/MD
- [ ] Page in page link

## Bugs

- [?] File is created but there is an error after (this does not open the file as the current file because of that)
- [?] "getExistingTape" is not considered as remote function when we login ???

## Features to implement

- [x] Drag and drop to move files in the tree
  - [x] implementation mv of the file
  - [ ] implem of cp
  - [x] implem of rename
  - [ ] handle edge cases (ex: moving a folder into itself)
  - [x] update all the open tabs if a file is moved/renamed
- [ ] Tests
  - [ ] E2E tests for the side-bar/drag and drop
    - [ ] mock the server calls
    - [x] mock the file system -> use a temp folder?
    - [x] -> needs multiple vault support
- [x] Auto save
- [x] Sync active file between tabs and sidebar
  - [x] Show active file in sidebar
- [ ] Faire l'editeur markdown realtime (comme obsidian)
  - [ ] Bold, Italic, Strikethrough
  - [ ] Headings
  - [ ] Links
    - [ ] Internal links (to other notes)
    - [ ] External links (to web pages)
  - [ ] Lists (ordered, unordered, task)
  - [ ] Code blocks
  - [ ] Lists (ordered, unordered, task)
    - [ ] Checkboxes
    - [ ] Nested lists
  - [ ] Blockquotes
  - [ ] Inline code
  - [ ] Images
  - [ ] Horizontal rules
  - [ ] Tables
  - [ ] Footnotes
- [ ] Tooltips
  - [ ] Show full file name on hover in sidebar
  - [ ] Show full tab name on hover in tabs
- [ ] Keyboard shortcuts
  - [ ] Open file (in sidebar)
  - [ ] Create new file
  - [ ] Create new folder
  - [ ] Rename file/folder
  - [ ] Delete file/folder
  - [x] Save file
  - [ ] Close tab
  - [ ] Switch between tabs
  - [x] Open command palette (Ctrl+K)
- [ ] Command palette
  - [x] Open file
  - [ ] Create new file (zed editor style)
  - [ ] Create new folder
  - [ ] Rename file/folder
- [ ] Tabs
  - [ ] Drag and drop to reorder tabs
  - [ ] Animated tab opening/closing
  - [ ] Close tab on middle click
  - [ ] Tab context menu (close other tabs, close to the right, etc)
  - [ ] Tab overflow handling (scrolling, dropdown, etc)
- [~] Right click (context) menu
- [x] Custom Sidebar width
- "Preview click" like vscode
  - click on open the file in preview mode (not permanent tab)
  - open a file in permanent tab on double click or edit
- Commencer à gérer le mode hors-ligne
  - Indiquer que l'on est hors ligne
  - Empêcher certaines actions (ex: création de fichier)
  - Permettre d'autres actions (ex: édition de fichier déjà ouvert)
- Find a way to implement plugin stystem (excalidraw/calendar/daily notes/graph/Latex support/...)

## Known issues

- Click event on the Drawer closes the drawer when we click on a folder (not the "touch" event)
- $derived(await ...) sometimes does not refresh the content (likely a Svelte issue)
- After closing a file from the tabslist, a click on it on the left bar doesnt open it
- Cant rename with spaces + create a tab with the new AND the old name
- URL's without "https://" are processed as local ULR's
- Deleted file not removed from the tabs
- [x] Stores are not cleaned when switching tape (eg: selectedStore, opentabs)
- [x] Cant really create folder directly (eg: "test/"), will throw an error (call of writeFile)
  - [x] Need to check if the path ends with "/" and create the folder instead of a file
  - [x] Need to signal to the front that it's a folder (don't open a tab for it)
- [x] When creating a file within a folder -> the title client side is slugified and "/" are replaced with "_"
- [x] After creating a file, the new tab created is bugged (cannot close it)