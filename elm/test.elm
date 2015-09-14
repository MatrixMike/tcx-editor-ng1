type alias KV = (String, String)
type alias Arr = List Object
type alias KVs = List Object

type alias KO = (String, Object)

type Object = KV KV | Arr Arr | KVs KVs | KO KO


-- {a : b}
a1 : Object
a1 = KV ("a", "b")
c1 = KV ("c", "d")

-- [{a:b}, {c:d}]
a2 : Object
a2 = Arr [ a1, c1 ]

-- {a: {b : c}} // {a: [{b : c}]}
a3 : Object
-- a3 = KO ("a", KV ("b", "c"))
a3 = KO ("a", Arr [KV ("b", "c")])

-- { a : b
-- , c : d
-- }
a4 : Object
a4 = KVs [a1, c1]
