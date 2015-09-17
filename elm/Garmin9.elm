module Garmin where

import Html exposing (..)
import Http
import Effects exposing (Effects)
import Json.Decode as Json exposing (..)
import Task exposing (..)
import String exposing (toInt, toFloat)

-- MODEL

type alias Position =
    { lat: Float
    , lng: Float
    }

type alias Trackpoint =
    { time: String
    , position: Position
    , distance: Float
    }

type alias Lap =
    { totalTime: Float
    , distance: Float
    , tps: List Trackpoint
    }

type alias Model = List Lap

i = []
    -- { totalTime = 100
    -- , distance = 99
    -- , tps = []
    -- }

type Action = Raw (Maybe Model)
-- type Action = Raw (Result Model)

init : (Model, Effects Action)
init = (i, loadData)

-- get : Decoder value -> String -> Task Error value
loadData : Effects Action
loadData =
    -- Http.get tcxDecoder "http://localhost:5000/tcx/test"
    Http.get tcxDecoder "http://localhost:5000/longexample.json"
        |> Task.toMaybe
        |> Task.map Raw
        |> Effects.task

-- (:=) : String -> Decoder a -> Decoder a
-- object1 : (a -> value) -> Decoder a -> Decoder value
-- at : List String -> Decoder a -> Decoder a
-- int : Decoder Int
-- map : (a -> b) -> Decoder a -> Decoder b
-- list : Decoder a -> Decoder (List a)
-- tuple1 : (a -> value) -> Decoder a -> Decoder value
-- "DistanceMeters": ["94.8200"],

tcxDecoder : Decoder Model
tcxDecoder =
    -- at ["TrainingCenterDatabase", "Activities"] <| object1 (\[x] -> x) (list activitiesDecoder)
    at ["TrainingCenterDatabase", "Activities"] <| tuple1 identity activitiesDecoder

activitiesDecoder : Decoder Model
-- activitiesDecoder = xtract "Activity" activityDecoder
activitiesDecoder = ("Activity" := tuple1 identity activityDecoder)

activityDecoder : Decoder Model
activityDecoder = ("Lap" := list lapDecoder)

-- customDecoder : Decoder a -> (a -> Result String b) -> Decoder b
-- toFloat : String -> Result String Float
lapDecoder: Decoder Lap
lapDecoder =
    object3 Lap
        (xtractFloat "TotalTimeSeconds")
        (xtractFloat "DistanceMeters")
        trackDecoder

trackDecoder: Decoder (List Trackpoint)
trackDecoder = "Track" := tuple1 identity ("Trackpoint" := list tpDecoder)

tpDecoder : Decoder Trackpoint
tpDecoder =
    object3 Trackpoint
        ("Time" := tuple1 identity string)
        ("Position" := tuple1 identity posDecoder)
        (xtractFloat "DistanceMeters")

posDecoder: Decoder Position
posDecoder =
    object2 Position
        (xtractFloat "LatitudeDegrees")
        (xtractFloat "LongitudeDegrees")

-- apply decoder to singleton array
-- xtract : String -> Decoder a -> Decoder a
-- xtract s d = object1 (\[x] -> x) (s := list d)
-- xtract s d = (s:= tuple1 identity d)

xtractFloat: String -> Decoder Float
xtractFloat str = customDecoder (str := tuple1 identity string) String.toFloat
-- "TotalTimeSeconds" := tuple1 go string

-- UPDATE

update : Action -> Model -> (Model, Effects Action)
update action model =
    let newmodel =
        case action of
            Raw maybeModel ->
                Maybe.withDefault i maybeModel
    in (newmodel, Effects.none)

-- VIEW

viewTrack : Trackpoint -> Html
viewTrack tp =
    div [] <| [(text << toString) tp.distance]

viewLap : Lap -> Html
viewLap lap =
    div []
        <| p [] [text <| "Distance: " ++ toString lap.distance]
           :: List.map viewTrack lap.tps

view : Signal.Address Action -> Model -> Html
view address model = div [] <| List.map viewLap model
-- view address model = div [] <| List.map (\lap -> (text << toString) lap.distance) model
