---
title: "Firebase Local Emulator Backup & Automation on Linux Ubuntu Machine (Complete Guide)"
summary: ""
category: "Automation"
publishedAt: 2026-10-01
tags: ["Bash Scripting", "Firebase Emulator Suite", "Firebase Emulator", "Workflow Automation","Developer Productivity"]
coverImage: "/firebase.png"
---


![Cover Image](/firebase.png)

When working with Firebase Local Emulator Suite for your developing projects your local data includes Firestore, Realtime Database, Auth and Storage lives only on your machine. A system crash, accidental reset or reinstallation can wipe out hours of testing data.

This blog explains how to back up Firebase Emulator data and automate it on Linux ubuntu based machine using simple shell scripts and cron schedules. It’s designed for developers who want repeatable, reliable local backups without manual effort.

### Prerequisites:
Ensure the following are installed on your ubuntu machine

1. Node.js (>= 16) (Check version with command node -v).
1. Firebase CLI (Check version with command firebase — version).
1. Firebase project initialized with emulators.

### Project Structure:
![Project Structure](/project_structure.png)

### Manual Method:
If you want the Firebase Emulator Suite to export all local data when the emulator exits execute the following command from the emulator project path.

```
firebase emulators:start --export-on-exit=/home/saran/project/manual_export_data/app_emulator
```

Later when you want to continue development using the same local data you can restore the emulator data by running the following command.

```
firebase emulators:start --import=/home/saran/project/manual_export_data/app_emulator
```

Drawback of this approach is that it will overwrites the existing export data every time the emulator exits making it impossible to maintain a history of backups. Additionally, if you forget to include the — export-on-exit flag the emulator data will not be persisted.

### Automation Method:
In the automation method exports Firebase emulator data programmatically using a shell script and cron jobs. And backups are versioned using timestamped directories to avoid overwriting and logs are maintained for export process.

Below is the export script,

```
#!/bin/bash

PROJECT_PATH=/home/saran/project
FILE_NAME=$(date +"%Y%m%d_%H%M%S")

EMULATOR_PATH=$PROJECT_PATH/app_emulator
EXPORT_PATH=$PROJECT_PATH/export_data/app_emulator_$FILE_NAME
LOG_PATH=$PROJECT_PATH/export_logs.txt

cd $EMULATOR_PATH

echo "--------- $FILE_NAME ---------" >> $LOG_PATH

firebase emulators:export $EXPORT_PATH >> $LOG_PATH 2>&1

echo "--------------------------------" >> $LOG_PATH

```


Now the export script can be scheduled via cron to run at specified times. This allows continuous automated export of Firebase emulator data into timestamped directories.

Go to cron scheduler list using your preferred editor (nano, vim or vi).

```
crontab -e
```

At the end of the file add the following line to run your export script every 30 minutes. You can adjust the time based on your preference. For more details and examples, you can explore online cron editor tools, which are very helpful for learning and testing cron expressions.

```
*/30 * * * * /home/saran/project/export_script.sh
```
Make sure your script is executable

```
sudo chmod 777 /home/saran/project/export_script.sh
```

Once you save and exit the cron editor, your export script is now scheduled to run automatically at the defined interval. You can verify that the cron job is active by running crontab -l and from this point onward, your Firebase emulator export will be created without any manual effort.

### The Run Script:
Run script programmatically identifies the most recent emulator export and initializes the Firebase Emulator Suite with the imported data. This ensures consistent and repeatable local restores.

```
#!/bin/bash

PROJECT_PATH=/home/saran/project
EMULATOR_PATH=$PROJECT_PATH/app_emulator

LATEST_EXPORT=$(ls -td $PROJECT_PATH/export_data/app_emulator_* | head -n 1)

echo "Latest export path : $LATEST_EXPORT"

cd $EMULATOR_PATH

firebase emulators:start --import="$LATEST_EXPORT"
```

### Conclusion:
In this blog, I demonstrated how to efficiently export and restore Firebase Local Emulator data using Linux scripting and cron automation. By leveraging my Firebase knowledge alongside practical shell scripting I believe that I built a reliable solution that protects local development data, preserves backup history and automates repetitive tasks by ensuring a safer and more efficient workflow.
