import mockingoose from "mockingoose";
import { Record, Player, Level } from "../src/schema"

mockingoose(Record).toReturn([
  {
    player: "Coopersuper",
    level: "Yatagarasu",
    hertz: 60,
    link: "https://www.youtube.com/watch?v=86VHptwZ0KI",

  }
]
)