export const rooms = {
  entrance: {
    id: "entrance",
    name: "Entrance",

    description:
      "A cave-like opening, partly obscured by vegetation, lies at the end of a treacherous path climbing a craggy outcropping of black rock.",

    examine:
      "Vines and branches partly cover the opening. Beyond them, a passage runs straight into the rock. A 10-foot-wide corridor leads to a large wooden door.",

    exits: {
      north: "firstAlcoves",
    },

    features: [
      {
        id: "woodenDoor",
        name: "Wooden Door",

        description:
          "The large wooden door opens freely. Close examination reveals chipped wood along its edge, showing that it has been forced before.",

        dm: {
          hidden: false,
          opensFreely: true,

          // B1 also allows this clue to be noticed without
          // deliberate examination:
          passiveNoticeChancePerAdventurer: 0.1,
        },
      },
    ],

    dm: {
      areaType: "entrance",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "ENTRANCE",
    },
  },
  firstAlcoves: {
    id: "firstAlcoves",
    name: "Entrance Passage — First Alcoves",

    description:
      "The entrance passage reaches the first pair of opposing alcoves.",

    examine:
      "The alcoves are empty defensive guardpoints. They are barren and bear no markings.",

    exits: {
      south: "entrance",
      north: "secondAlcoves",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description: "The two opposing alcoves are empty and unmarked.",

        dm: {
          hidden: false,
          purpose: "defensiveGuardpoint",
        },
      },
    ],

    dm: {
      areaType: "corridor",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "1. ALCOVES",
    },
  },
  secondAlcoves: {
    id: "secondAlcoves",
    name: "Entrance Passage — Second Alcoves",

    description: "The passage reaches a second pair of opposing alcoves.",

    examine:
      "Like the first pair, these alcoves appear empty, barren, and unmarked.",

    exits: {
      south: "firstAlcoves",
      north: "thirdAlcoves",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description:
          "The two alcoves appear to be empty defensive guardpoints with no markings.",

        dm: {
          hidden: false,
          purpose: "defensiveGuardpoint",

          // IMPORTANT:
          // B1 says these are one-way secret doors,
          // but they are completely undetectable from
          // the entrance-corridor side.
          oneWaySecretDoors: true,
          discoverableFromEntranceSide: false,
        },
      },
    ],

    dm: {
      areaType: "corridor",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "1. ALCOVES",
    },
  },
  thirdAlcoves: {
    id: "thirdAlcoves",
    name: "Entrance Passage — Third Alcoves",

    description: "The passage reaches the third pair of opposing alcoves.",

    examine:
      "These alcoves are also defensive guardpoints and otherwise appear empty, barren, and unmarked.",

    exits: {
      south: "secondAlcoves",
      north: "intersection",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description: "The third pair of alcoves appears empty and unmarked.",

        dm: {
          hidden: false,
          purpose: "defensiveGuardpoint",
          containsMagicMouths: true,
        },
      },
    ],

    events: {
      onEnter: ["magicMouthWarning"],
    },

    dm: {
      areaType: "corridor",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "1. ALCOVES",
      magicMouthTrigger: "betweenAlcoves",
    },
  },
  intersection: {
    id: "intersection",
    name: "Battle-Site Intersection",

    description:
      "Two steps rise to an intersection. The corridor continues north while other corridors meet it from the east and west. Five decomposing bodies mark the site of a violent hand-to-hand battle.",

    examine:
      "Five combatants died here. Their remains are in various states of decomposition, and the stench is strong.",

    exits: {
      south: "thirdAlcoves",
      north: "northPassage",
      west: "kitchen",
      east: "diningRoom",
    },

    features: [
      {
        id: "bodies",
        name: "Bodies",

        description: `Three of the dead were adventurers from outside the stronghold, while the other two appear to have been guards.

• Body #1 — A human fighter slumped against the wall. His sword is broken about eight inches above the pommel.

• Body #2 — A human magic-user impaled against a wooden section of wall by the sword that killed him.

• Body #3 — A dwarf fighter lying face down east of the intersection, still clutching a war hammer. A trail of dried blood leads from his body back toward the battle. An empty sack turned inside out lies beside him, and his helmet is badly dented.

• Body #4 — A human berserker or fighter sprawled on the floor beside a broken wooden shield.

• Body #5 — Another human berserker or fighter lying face down with his head crushed by a war-hammer blow. A small sheathed dagger remains on his ornate leather belt, although the belt is badly bloodstained.`,
        searchable: true,

        search:
          "You carefully search the five bodies and their remaining equipment.",

        searchResults: [
          {
            id: "body1-gold",
            name: "5 gold pieces",
            type: "coins",
            quantity: 5,
            source: "Body #1",

            description:
              "A belt pouch on the dead human fighter contains 5 gold pieces.",
          },

          {
            id: "body2-gold",
            name: "2 gold pieces",
            type: "coins",
            quantity: 2,
            source: "Body #2",

            description:
              "A purse in the dead magic-user's ruined robe contains 2 gold pieces.",
          },

          {
            id: "body2-garlic",
            name: "Pouch of garlic buds",
            type: "item",
            quantity: 1,
            source: "Body #2",

            description:
              "A pouch in the dead magic-user's robe contains garlic buds.",
          },

          {
            id: "body3-war-hammer",
            name: "War hammer",
            type: "weapon",
            quantity: 1,
            source: "Body #3",

            description: "The dead dwarf fighter still has his war hammer.",
          },

          {
            id: "body5-dagger",
            name: "Small dagger",
            type: "weapon",
            quantity: 1,
            source: "Body #5",

            description:
              "A small sheathed dagger remains on the belt of one of the dead guards.",
          },
        ],

        interactions: [
          {
            id: "remove-body2-sword",
            name: "Remove Sword",

            requiresExamination: true,

            message:
              "You pull the sword free from the dead magic-user and the wooden wall. With nothing holding it upright, the body crumples to the floor.",

            afterDescription: `Three of the dead were adventurers and two were guards.

• Body #1 — The human fighter remains slumped against the wall with his broken sword.

• Body #2 — The dead magic-user now lies crumpled on the floor beneath the wooden section of wall where he had been pinned. A blood-stained carving is visible behind him.

• Body #3 — The dwarf lies face down farther east, still clutching his war hammer. A trail of dried blood leads back toward the battle. An empty inside-out sack lies beside him, and his helmet is badly dented.

• Body #4 — The human guard lies sprawled beside a broken wooden shield.

• Body #5 — The other guard lies face down with a crushed head, a small sheathed dagger, and an ornate but badly bloodstained leather belt.`,

            discoveredSecret: {
              id: "quasqueton-carving",
              name: "QUASQUETON",

              description:
                'Behind the fallen magic-user, blood-stained letters carved into the wall spell "QUASQUETON" in the common language.',
            },

            discoveredItem: {
              id: "body2-sword",
              name: "Poor-quality sword",
              type: "weapon",
              quantity: 1,
              source: "Body #2",

              description:
                "The sword removed from the dead magic-user has a loose handle and is of poor overall quality.",

              condition: "poor",
              usable: false,
              valueGp: 0,
            },
          },
        ],

        dm: {
          hidden: false,
          bodies: 5,
          sourceArea: "Battle site after 1. ALCOVES",
        },
      },
    ],

    dm: {
      areaType: "intersection",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
    },
  },
  kitchen: {
    id: "kitchen",
    name: "Kitchen",

    description:
      "This very long room was used for food preparation. Two large cooking pits occupy the southwest corner, while long tables line the walls.",

    examine:
      "The room contains two large cooking pits, long tables covered with old containers and spoiled food, hanging and scattered cooking utensils, and a large cast-iron kettle suspended from the ceiling.",

    exits: {
      east: "intersection",
    },

    features: [
      {
        id: "cookingPits",
        name: "Cooking Pits",

        description:
          "Two cooking pits occupy the southwest corner. Each is large enough to cook an animal as large as a deer. One is slightly larger than the other, but both are about three feet deep and filled with ash and the charred remains of cooking fuel.",

        dm: {
          hidden: false,
          sourceArea: "2. KITCHEN",
        },
      },

      {
        id: "chimney",
        name: "Chimney",

        description:
          "A chimney rises from the cooking area, but its opening is too small to permit further investigation.",

        dm: {
          hidden: false,
          traversable: false,
          sourceArea: "2. KITCHEN",
        },
      },

      {
        id: "tables",
        name: "Tables",

        description:
          "Long tables line the walls. Scattered containers sit upon them, some overturned, with their spoiled contents moldering across the tabletops.",

        dm: {
          hidden: false,
          sourceArea: "2. KITCHEN",
        },
      },

      {
        id: "spoiledFood",
        name: "Spoiled Food",

        description:
          "Spoiled pieces of food are scattered around the room. The smell is extremely uninviting.",

        dm: {
          hidden: false,
          sourceArea: "2. KITCHEN",
        },
      },

      {
        id: "moldyCheese",
        name: "Moldy Cheese",

        description:
          "One particularly noxious chunk of moldy cheese is completely covered by a fuzzy green growth.",

        dm: {
          hidden: false,
          sourceArea: "2. KITCHEN",
        },
      },

      {
        id: "utensils",
        name: "Cooking Utensils",

        description:
          "Pots, pans, and other cooking utensils of various sizes hang from above or lie scattered across the floor.",

        dm: {
          hidden: false,
          valuable: false,
          sourceArea: "2. KITCHEN",
        },
      },

      {
        id: "kettle",
        name: "Cast-Iron Kettle",

        description:
          "A large cast-iron kettle hangs from the ceiling by a thick chain. The kettle is empty.",

        dm: {
          hidden: false,
          empty: true,
          sourceArea: "2. KITCHEN",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "2. KITCHEN",
    },
  },
  diningRoom: {
    id: "diningRoom",
    name: "Dining Room",

    description:
      "This is the stronghold's main dining hall, where guest banquets were once held. Tables and chairs are scattered throughout the musty room.",

    examine:
      "The dining hall contains scattered tables and chairs, carved decoration along the walls, and two unusually ornate seats in the northeast corner.",
    exits: {
      west: "intersection",
      south: "lounge",
    },

    features: [
      {
        id: "woodenMantle",
        name: "Wooden Mantle",

        description:
          "A nicely carved wooden mantle runs around the room about seven feet above the floor. Despite the workmanship, it does not appear especially valuable.",

        dm: {
          hidden: false,
          sourceArea: "3. DINING ROOM",
        },
      },

      {
        id: "wallCarvings",
        name: "Wall Carvings",

        description:
          "The stone walls are carved with simple but pleasant decorative designs. The decoration is modest rather than elaborate.",

        dm: {
          hidden: false,
          sourceArea: "3. DINING ROOM",
        },
      },

      {
        id: "tablesAndChairs",
        name: "Tables and Chairs",

        description:
          "Most of the furnishings are plain, utilitarian tables and chairs made of hard maple. Several have been overturned. They show wear and have clearly not been used recently.",

        dm: {
          hidden: false,
          valuable: false,
          sourceArea: "3. DINING ROOM",
        },
      },

      {
        id: "ornateChairs",
        name: "Ornate Chairs",

        description:
          "Two chairs stand apart from the ordinary furnishings. They are ornately carved from walnut and were the personal seats of Zelligar and Rogahn. Closer examination shows that the chairs are fixed directly into an enormous wooden structure forming part of the northeast wall, making them impossible to remove intact.",

        dm: {
          hidden: false,
          owners: ["Zelligar", "Rogahn"],
          removable: false,
          sourceArea: "3. DINING ROOM",
        },
      },

      {
        id: "greenFungus",
        name: "Green Fungus",

        description:
          "A greenish fungus grows across portions of the walnut seats, marring their otherwise impressive appearance. The condition of the chairs makes it obvious that they have gone unused for a long time.",

        dm: {
          hidden: false,
          sourceArea: "3. DINING ROOM",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "3. DINING ROOM",
    },
  },
  lounge: {
    id: "lounge",
    name: "Lounge",

    description:
      "This anteroom appears to have been used for drinking and relaxation before and after meals. A life-sized white statue stands at the center of the room.",

    examine:
      "Old drinking vessels, built-in benches, strangely textured stone walls, and the central statue are the room's most noticeable features.",

    exits: {
      north: "diningRoom",
    },

    features: [
      {
        id: "tankards",
        name: "Tankard Mugs",

        description:
          "Several earthenware tankard mugs hang from a row of hooks high on one wall. Many more hooks are empty, suggesting that numerous mugs are missing.",

        dm: {
          hidden: false,
          sourceArea: "4. LOUNGE",
        },
      },

      {
        id: "aleKeg",
        name: "Ale Keg",

        description:
          "An old ale keg stands in one corner. It has long since gone dry, though a faint smell of ale still lingers around it.",

        dm: {
          hidden: false,
          empty: true,
          sourceArea: "4. LOUNGE",
        },
      },

      {
        id: "texturedWalls",
        name: "Textured Walls",

        description:
          "The stone walls have been worked into an unusual texture for decorative effect. There are no additional markings or obvious details.",

        dm: {
          hidden: false,
          sourceArea: "4. LOUNGE",
        },
      },

      {
        id: "benches",
        name: "Bench Seats",

        description:
          "A long wooden bench is attached to each side wall. Anyone seated there would face toward the center of the room.",

        dm: {
          hidden: false,
          removable: false,
          sourceArea: "4. LOUNGE",
        },
      },

      {
        id: "statue",
        name: "Marble Statue",

        description:
          "At the center of the room stands a life-sized statue of a nude human woman, carved in an alluring pose with her arms extended forward. It appears to be white marble and is obviously extremely valuable. However, its enormous weight and the way it is anchored to the floor make it impossible to move by ordinary means.",

        dm: {
          hidden: false,
          material: "white marble",
          valueGp: 5000,
          removable: false,
          anchored: true,
          sourceArea: "4. LOUNGE",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "4. LOUNGE",
    },
  },
  northPassage: {
    id: "northPassage",
    name: "North Passage",

    description:
      "The corridor continues north from the battle-site intersection into the interior of the stronghold.",

    examine: "The finished stone passage continues farther into Quasqueton.",

    exits: {
      south: "intersection",
      east: "wizardChamber",
    },

    features: [],

    dm: {
      areaType: "corridor",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "Upper-level map — north of entrance intersection",
    },
  },
  wizardChamber: {
    id: "wizardChamber",
    name: "Wizard's Chamber",

    description:
      "This austere chamber was Zelligar's personal room. A huge stone carving dominates the north wall, while an ornate rosewood bed stands in the southeast corner.",

    examine:
      "The chamber contains a massive wall carving, several wall pegs, Zelligar's ornate bed, a rosewood nightstand, and a simple table with three chairs.",

    exits: {
      west: "northPassage",
    },

    features: [
      {
        id: "wallCarving",
        name: "Wall Carving",

        description:
          "A detailed stone carving stretches for roughly seventy feet along the north wall. It depicts a mighty wizard, obviously Zelligar, standing upon a hilltop and casting a spell over the valley below while an entire army flees in panic.",

        dm: {
          hidden: false,
          depicts: "Zelligar",
          sourceArea: "5. WIZARD'S CHAMBER",
        },
      },

      {
        id: "wallPegs",
        name: "Wall Pegs",

        description:
          "Several pegs are fixed to the otherwise bare east and west walls. They appear to have once been used for hanging garments.",

        dm: {
          hidden: false,
          sourceArea: "5. WIZARD'S CHAMBER",
        },
      },

      {
        id: "rosewoodBed",
        name: "Rosewood Bed",

        description:
          "The bed is made from ornately carved rosewood and is exceptionally well constructed. Its headboard boldly displays Zelligar's name in gold leaf. The heavy frame is too sturdy to remove intact without first dismantling it.",

        dm: {
          hidden: false,
          owner: "Zelligar",
          material: "rosewood",
          removableIntact: false,

          dismantledValueGp: {
            baseboard: 100,
            eachSide: 100,
            headboard: 500,
          },

          sourceArea: "5. WIZARD'S CHAMBER",
        },
      },

      {
        id: "nightstand",
        name: "Rosewood Nightstand",

        description:
          "A rosewood nightstand stands beside the bed. It has a single drawer with a brass handle. The drawer is locked.",

        dm: {
          hidden: false,
          locked: true,
          trapped: true,
          sourceArea: "5. WIZARD'S CHAMBER",

          trap: {
            type: "pinTrap",
            trigger: "graspHandle",
            damage: 1,
            painfulOil: true,
            handUnusableTurns: "1d4+1",
          },
        },
      },

      {
        id: "tableAndChairs",
        name: "Table and Chairs",

        description:
          "A plain table and three ordinary chairs furnish another part of the chamber. They are not of exceptional value.",

        dm: {
          hidden: false,
          valuable: false,
          sourceArea: "5. WIZARD'S CHAMBER",
        },
      },

      {
        id: "pewterware",
        name: "Pewterware",

        description:
          "A pewter pitcher and three pewter mugs sit upon the table. The pitcher is worth about 15 gold pieces, while each mug is worth about 5 gold pieces.",

        dm: {
          hidden: false,
          sourceArea: "5. WIZARD'S CHAMBER",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "5. WIZARD'S CHAMBER",
    },
  },
};
