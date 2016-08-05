# shaawchat
Shaawchat is a twitch chat client.


## Features

* Connect to twitch chat and join different channels.
* Supports all the official emotes.
* Autocomplete twitch names and official emotes using Tab.
* You can switch between tabs when the foscus is on the writting textbox with Ctrl+Tab and Ctrl+Shift+Tab
* Display user list from people in chat if the channel has less than 5000 chatters.

## ToDo Features

* BetterTTV emotes.
* Add user to autocomplete list when they chat (for channel with more then 5000 users)-
* Cycle autocomplete when pressing consecutive Tabs.
* Capture all the events of twitch chat (timeouts, bans, subscriptions, /me, etc).

## Download

Head over to the [releases page](https://github.com/shaaw/shaawchat/releases) to download the latest version.


## Known issues

User list won't load if the list has more than 5000 users because it freezes the app for a couple of seconds every time it gets loaded.


## Tech info

App made using node-webkit and the following node modules.

* Tmi.js
* Oboe
* cheerio
* semver
