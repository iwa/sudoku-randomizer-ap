# SudokuRando AP

- Use APWorld from https://github.com/iwa/ArchipelagoSudoku
- If self-host the server and you have security errors like "the operation is insecure", you need to:
  - Firefox, in `about:config`, `network.websocket.allowInsecureFromHTTPS` to true
  - Chrome, Site settings, "Insecure content" to Allow
  - Edge, Permissions for this site, "Insecure content" to Allow
  - :warning: Beware of what you're doing when self-hosting and opening your server to the public

## todo list

- notes entry (corner/center)
- remove user-input from duplicate detection (avoid losing lives)
- disable number button when 9 occurences used
