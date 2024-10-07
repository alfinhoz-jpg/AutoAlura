
# AutoAlura Userscript

AutoAlura is a userscript that automates interactions with the Alura platform, 
such as progressing through activities like videos, quizzes, and ordered blocks.

## Features

- Automatically plays videos and progresses to the next activity after 2 seconds.
- Automatically selects the correct alternative in quizzes and progresses to the next activity.
- Automatically selects blocks in the correct order, submits the answer, and progresses to the next activity.
- Adds a "clicked" class to prevent repeated actions on the same elements.
- Includes delays to ensure smooth transitions between actions.
- Handles multiple alternatives and block activities.

## Requirements

- Userscript manager (e.g., Tampermonkey, Greasemonkey) installed in your browser.

## Installation

1. Install a userscript manager extension in your browser.
2. Copy and paste the script code into a new userscript in the manager.
3. The script will run automatically on Alura's platform.

## Usage

- The script will automatically detect the activity type (video, quiz, block) and perform the necessary actions.
- If no videos, alternatives, or blocks are found, it will move to the next activity.

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.


