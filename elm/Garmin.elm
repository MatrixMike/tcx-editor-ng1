module Garmin where

import Html exposing (..)
import Http
import Effects exposing (Effects)
import Json.Decode as Json exposing (..)
import Task exposing (..)

-- MODEL

type alias KV = (String, String)
type alias KO = (String, KV)
type alias Arr = List KV

type Item = MkKV KV | MkKO KO | MkArr Arr

type alias Model =
    -- { outer: String
    { outer: KV
    }

type alias TCAttributes =
    { xsischemaLocation: String
    , xmlnsns5: String
    , xmlnsns3: String
    , xmlnsns2: String
    , xmlns: String
    , xmlnsxsi: String
    , xmlnsns4: String
    }

type Action =
      Raw (Maybe Model)


init : (Model, Effects Action)
init = (
    { outer = ("initial key", "init val")
    }, loadData)

-- get : Decoder value -> String -> Task Error value
loadData : Effects Action
loadData =
    Http.get myParser "http://localhost:8080/tcx"
        |> Task.toMaybe
        |> Task.map Raw
        |> Effects.task

-- (:=) : String -> Decoder a -> Decoder a
-- object1 : (a -> value) -> Decoder a -> Decoder value
myParser : Json.Decoder Model
-- myParser = Json.object1 Model (outer := Json.string)
myParser = Json.object1 Model (kvCreator "TrainingCenterDatabase")

-- map : (a -> b) -> Decoder a -> Decoder b
-- map : (String -> KV) -> Decoder String -> Decoder KV)
kvCreator : String -> Decoder KV
kvCreator key = Json.map ((,) key) (key := Json.string)

update : Action -> Model -> (Model, Effects Action)
update action model =
    let newmodel =
        case action of
            Raw maybeModel ->
                Maybe.withDefault
                    { outer = ("dummey", "failed string") }
                    maybeModel
    in (newmodel, Effects.none)

view : Signal.Address Action -> Model -> Html
view address model = div [] [text <| fst model.outer ++ snd model.outer]
