# How to use:
1. Install nodejs: https://nodejs.org/
2. Download or clone this repo (click green code button then download zip or git clone)
3. Extract and navigate to extracted files in terminal
4. Paste your tunnel authentication token from `https://pies.cf/panel/tunnels` into `pietunnel_token.txt`
   - If you are using the old version of tunnel software the file starts with `token=` but the newer versions just have the token without any prefix
5. Type `npm i` in your terminal
6. Type `node . --local-url <LocalURL>`
   - Example: `node . --local-url http://localhost` (Will forward all request to localhost)


# Terminal arguments

- `LocalURL`: the url of the website which the requests are forwardeed to.
- `setting`: `prod` or `test` | defines which server the program uses.

# Q&A

> **Q:** Can I forward requests to a non-local url (eg. google.com)

**A:** Yes but we do not recommend this as it is not useful in any way, and may get you bannned from our service.

> **Q:** Do I need as HTTP Server to share local files?

**A:** Yes you can use [XAMPP](https://www.apachefriends.org/download.html) or any http server software