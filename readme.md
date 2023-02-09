# How to use:
1. Install nodejs: https://nodejs.org/
2. Download this repo (Click green code, download zip)
3. Extract and navigate to extracted files in terminal
4. Type `npm i` in your terminal
5. Type `node . --local-url <LocalURL>`
   - Example: `node . --local-url http://localhost` (Will forward all request to localhost)

# Q&A

> **Q:** Can I forward requests to a non-local url (eg. google.com)

**A:** Yes but we do not recommend this as it is not useful in anyway.

> **Q:** Do I need as HTTP Server to share local files?

**A:** Yes you can use [XAMPP](https://www.apachefriends.org/download.html) or any http server software