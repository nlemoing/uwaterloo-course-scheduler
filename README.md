# UWaterloo Course Scheduler

This is a simple, drag-and-drop interface for uWaterloo students planning their courses.
It also provides up-to-date information on the status of plan requirements while the schedule is being updated.

This project is a work in progress, but check back for updates!
Planned features include a more detailed course explorer and sign-on with external identity providers.
For now, you can try a demo version by running it locally!

## Running a local demo version

The backend is an API that's served using Node.js in the `api` directory. 
To run the API, go to the `api` directory and run `node index.js`.
This will run the backend on port 3000.

The frontend is just static HTML/JS/CSS files; you can run it with a simple HTTP server. 
For example, `python -m http.server` will get things running on port 8000.

Once both the frontend and backend are running, navigating to `localhost:8000/?scheduleId=1` will take you to a demo schedule.
`localhost:8000/?scheduleId=2` is a blank schedule you can play around with.

Data for Waterloo courses is obtained by scraping several university websites (the code for this is in the `scraping` folder).
