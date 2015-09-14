-- DO NOT RUN WITH ?debug as this conflicts with `port`

import Garmin exposing (init, update, view)
import StartApp exposing (start)
import Effects exposing (Never)
import Task

app =
  start
    { init = init
    , update = update
    , view = view
    , inputs = []
    }

main =
    app.html

-- DO NOT RUN WITH ?debug as this conflicts with `port`
port tasks : Signal (Task.Task Never ())
port tasks =
    app.tasks
