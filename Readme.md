
# Cron Expression Parser

This command line application parses a cron string and expands each field to show the times at which it will run.

Cron expressions are used in scheduling tasks to define when those tasks should run. They consist of five fields representing various time components:

- **Minutes (0-59):** The minute of the hour when the task should run.
- **Hours (0-23):** The hour of the day when the task should run.
- **Day of the Month (1-31):** The day of the month when the task should run.
- **Month (1-12):** The month of the year when the task should run.
- **Day of the Week (0-7):** The day of the week when the task should run, where 0 or 7 represents Sunday.

Cron expressions are written as a string consisting of these five fields separated by spaces. Additionally, you can use special characters to represent different intervals and wildcard values:

- **Asterisk (\*):** Represents all possible values for that field.
- **Comma (,):** Specifies a list of values.
- **Hyphen (-):** Specifies a range of values.
- **Slash (/):** Specifies increments.

## Examples of Cron Expressions

- **Every minute:** `* * * * *`
- **Every hour at 30 minutes past the hour:** `30 * * * *`
- **Every day at 3 AM:** `0 3 * * *`
- **Every Monday at 5 PM:** `0 17 * * 1`
- **Every 15 minutes:** `*/15 * * * *`

* * * * *
- - - - -
| | | | |
| | | | +----- Day of the week (0 - 7) (Sunday is 0 or 7)
| | | +------- Month (1 - 12)
| | +--------- Day of the month (1 - 31)
| +----------- Hour (0 - 23)
+------------- Minute (0 - 59)

## Installation

1. **Clone the repository:**

    ```bash
    git clone
    ```

2. **Navigate to the project directory:**

    ```bash
    cd cron-expression-parser
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

## Usage

Run the application with a single argument - the cron string to parse:

```bash
node index.js "*/15 0 1,15 * 1-5 /usr/bin/find"


## output

minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
