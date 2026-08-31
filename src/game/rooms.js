export const rooms = {
  entrance: {
    id: "entrance",
    name: "Entrance",

    image: {
      src: "/images/rooms/entrance.png",
      alt: "Adventurers approaching the vine-covered entrance to Quasqueton.",
    },

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

    features: [
      {
        id: "southWall",
        name: "South Wall",

        description:
          "This section of finished stone wall appears unremarkable.",

        searchable: true,

        search: "You carefully inspect the stonework for concealed openings.",

        secretDoor: {
          id: "wizardLaboratoryNorthDoor",
          destination: "wizardLaboratory",

          foundDescription:
            "Careful examination reveals the concealed outline and mechanism of a secret door.",

          discoveredDescription:
            "The concealed outline and mechanism of the secret door are now apparent in the stone wall.",
        },

        dm: {
          hidden: false,
          sourceArea: "Upper-level map",
        },
      },
    ],

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
      southeast: "zelligarCloset",
      southwest: "wizardAnnex",
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

        unlockedDescription:
          "A rosewood nightstand stands beside the bed. Its single drawer is unlocked but remains closed.",

        openDescription:
          "A rosewood nightstand stands beside the bed. Its single drawer stands open. The drawer is empty.",

        lock: {
          id: "drawer-lock",
          initiallyLocked: true,

          lockedMessage: "The drawer is locked and will not open.",
        },

        container: {
          id: "drawer",
          name: "Drawer",

          openMessage: "The drawer slides open. It is empty.",

          empty: true,
        },

        trap: {
          id: "drawer-handle-pins",
          trigger: "graspHandle",

          message:
            "As you grasp the brass handle, concealed pins spring into your hand.",

          damage: 1,

          condition: {
            id: "painful-hand",
            name: "Painful Hand",
            duration: "1d4+1",

            description:
              "The injured hand is unusable because of the intense pain caused by the oily pins.",

            isPoison: false,
          },

          // B1: inserting any comparably sized key before
          // grasping the handle negates the trap.
          // We are recording that rule now; key interaction
          // itself can be implemented later.
          bypass: {
            type: "comparableKeyInserted",
          },
        },

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
  zelligarCloset: {
    id: "zelligarCloset",
    name: "Zelligar's Closet",

    description:
      "This large closet is rather barren for its size. Dust lies heavily over the few belongings that remain.",

    examine:
      "Several bolts of cloth are stacked in one corner, five old garments hang along a wall, and four large books rest on a wooden stand. An oil lantern hangs elsewhere in the room, while a small table in another corner holds a dusty stack of papers beneath a stone paperweight.",

    exits: {
      northwest: "wizardChamber",
    },

    features: [
      {
        id: "clothBolts",
        name: "Bolts of Cloth",

        description:
          "Several bolts of cloth are stacked in one corner. They are covered with dust and have been partially eaten and deteriorated by moths. They are of no particular value.",

        dm: {
          hidden: false,
          valuable: false,
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "garments",
        name: "Garments",

        description:
          "Five garments, mostly coats and cloaks, hang along one wall. All are musty, dusty, and dingy with age. Four are worthless. The fifth is ornamented with circular pieces of pewter and, despite its poor condition, might bring as much as 15 gold pieces.",

        dm: {
          hidden: false,
          count: 5,
          valuableGarments: 1,
          valuableGarmentValueGp: 15,
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "bookStand",
        name: "Wooden Book Stand",

        description:
          "A wooden stand in the corner farthest from the door holds four large books. They appear to belong with the books in the stronghold's library.",

        dm: {
          hidden: false,
          bookCount: 4,
          relatedArea: "12. LIBRARY",
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "historyBook",
        name: "Historical Book",

        description:
          "This large book is written in the common tongue. It outlines the history of the civilized area within roughly one hundred miles of the stronghold. It contains nothing remarkable.",

        dm: {
          hidden: false,
          language: "common",
          readableNormally: true,
          remarkableContent: false,
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "plantEncyclopedia",
        name: "Plant Encyclopedia",

        description:
          "This large volume contains numerous illustrations of plants, providing a clue to its subject. The text itself is written in the language of elves.",

        dm: {
          hidden: false,
          language: "elvish",
          understandableByElvishReader: true,
          understandableWithReadLanguages: true,
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "zelligarDiary",
        name: "Handwritten Notebook",

        description:
          "At first glance, this volume appears to be an unremarkable notebook filled with handwritten entries of undecipherable runes and markings.",

        dm: {
          hidden: false,
          trueIdentity: "Zelligar's diary",
          author: "Zelligar",
          understandableWithReadLanguages: true,
          decodedContent:
            "The volume is Zelligar's diary and describes one of his adventures from the distant past.",
          finderValueGp: 0,
          specialistValueGp: 50,
          saleRumorChancePercent: 40,
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "weatherBook",
        name: "Weather Book",

        description:
          "This illustrated work is written in the common language and discusses weather and meteorological phenomena. Sparse descriptive text accompanies the illustrations. Cryptic handwritten notes appear in the margins.",

        dm: {
          hidden: false,
          language: "common",
          mainTextReadableNormally: true,
          marginNotesAuthor: "Zelligar",
          marginNotesRequireReadLanguages: true,
          decodedMarginNotes:
            "The notes are ordinary study annotations highlighting important points in the text.",
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "oilLantern",
        name: "Oil Lantern",

        description:
          "An old oil lantern hangs along one wall. It contains no fuel and has plainly gone unused for a very long time, but it remains usable if supplied with oil.",

        dm: {
          hidden: false,
          fueled: false,
          usableIfFueled: true,
          sourceArea: "6. CLOSET",
        },
      },

      {
        id: "papers",
        name: "Papers and Paperweight",

        description:
          "A small table holds a dusty stack of papers beneath a stone slab used as a paperweight. The stone is monogrammed with an ornate letter Z. The papers are written in the common language and concern ordinary matters such as food inventories, expenses, construction work, and routine messages. Even the newest is more than thirty years old.",

        dm: {
          hidden: false,
          language: "common",
          paperweightMonogram: "Z",
          sourceArea: "6. CLOSET",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      sourceArea: "6. CLOSET",
    },
  },
  wizardAnnex: {
    id: "wizardAnnex",
    name: "Wizard's Annex",

    description:
      "This unusually shaped annex extends from Zelligar's chamber and widens into a triangular area at its south end.",

    examine:
      "The south end of the annex is the most striking part of the room.",

    exits: {
      northeast: "wizardChamber",
    },

    features: [
      {
        id: "southEnd",
        name: "South End",

        description:
          "Two large wooden chests studded with jewels appear to overflow with riches. Gold pieces lie around and within them, mixed with glittering gems and jewels.",

        interactions: [
          {
            id: "touchTreasure",
            name: "Touch Treasure",

            requiresExamination: true,

            message:
              "The instant you touch the apparent treasure, the entire magnificent hoard vanishes. The chests, coins, gems, and jewels were an illusion. The room is actually empty.",

            afterDescription:
              "The apparent treasure is gone. The room is empty. Near the south wall, the floor is bumpy and darkly discolored, as though it has been charred and partially melted by intense heat.",

            dm: {
              effect: "dispelIllusion",
              temporary: true,
              reappearsWithinHours: 24,
              sourceArea: "7. WIZARD'S ANNEX",
            },
          },
        ],

        dm: {
          hidden: false,

          illusion: {
            permanent: true,
            dispelledBy: "touch",
            reappearsWithinHours: 24,
          },

          actualTreasure: false,
          actualRoomEmpty: true,

          concealedUntilIllusionDispelled: {
            floor:
              "The floor near the south wall is bumpy, darkly discolored, and appears charred or partially melted by intense heat.",
          },

          sourceArea: "7. WIZARD'S ANNEX",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",

      apparentPurpose: ["meditation", "study", "practice of magic spells"],

      triangularSouthEnd: true,
      southWallThickerThanElsewhere: true,

      sourceArea: "7. WIZARD'S ANNEX",
    },
  },
  wizardWorkroom: {
    id: "wizardWorkroom",
    name: "Wizard's Workroom",

    image: {
      src: "/images/rooms/wizards-workroom.png",
      alt: "Adventurers examining a large glass jar containing a black cat suspended in clear liquid inside Zelligar's Wizard's Workroom.",
    },

    description:
      "This room was used for the study and practice of magic. Several large wooden tables occupy the chamber, along with a prominent stone table near the center.",

    examine:
      "One wooden table lies overturned. The central stone table has a smooth black slate top buried beneath a thick layer of dust. Chairs and stools are scattered about the room, and wooden cabinets line the north wall.",

    exits: {
      north: "wizardLaboratory",
    },

    features: [
      {
        id: "woodenTables",
        name: "Wooden Tables",

        description:
          "Several large wooden tables stand around the room. One has been overturned onto its side. Their surfaces are bare.",

        dm: {
          hidden: false,
          sourceArea: "8. WIZARD'S WORKROOM",
        },
      },

      {
        id: "stoneTable",
        name: "Stone Table",

        description:
          "A heavy stone table stands prominently near the center of the room. Its top is a smooth slab of black slate, though a thick layer of dust hides much of its appearance. Nothing rests upon it.",

        dm: {
          hidden: false,
          material: "stone",
          topMaterial: "black slate",
          sourceArea: "8. WIZARD'S WORKROOM",
        },
      },

      {
        id: "chairsAndStools",
        name: "Chairs and Stools",

        description:
          "Several ordinary chairs and stools are scattered around the workroom.",

        dm: {
          hidden: false,
          sourceArea: "8. WIZARD'S WORKROOM",
        },
      },

      {
        id: "chemicalCabinets",
        name: "Wooden Cabinets",

        description:
          "Wooden cabinets are mounted along the north wall, about four feet above the floor. They are unlocked and contain numerous glass and earthen containers holding old chemical compounds and supplies.",

        dm: {
          hidden: false,
          locked: false,
          containerCount: 40,
          contentsDeterminedBy: "d20",
          contentsValue: "no particular value",
          sourceArea: "8. WIZARD'S WORKROOM",
        },
      },

      {
        id: "largeGlassJar",
        name: "Large Glass Jar",

        description:
          "Among the smaller containers is a much larger clear glass jar. A black cat appears to be suspended inside it in a clear, colorless liquid. The jar is sealed with a large cork.",

        dm: {
          hidden: false,
          sealed: true,
          trigger: "removeCork",
          sourceArea: "8. WIZARD'S WORKROOM",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      access: "secretDoors",
      adjacentArea: "9. WIZARD'S LABORATORY",
      sourceArea: "8. WIZARD'S WORKROOM",
    },
  },
  wizardLaboratory: {
    id: "wizardLaboratory",
    name: "Wizard's Laboratory",

    description:
      "This 50-foot by 30-foot laboratory contains an assortment of old magical equipment and devices. A large human skeleton hangs suspended from the ceiling in the northeast corner, its skull cracked.",

    examine:
      "Large wooden tables and a heavy stone table occupy the room. A smoked-glass bottle rests on one table. Elsewhere are pine logs, a wooden rack, a stretched leather skin covered in strange writing, a sunken fire pit, several vats, glassware and containers, an upright coffin, two kegs, and shelving along the north wall.",

    exits: {
      south: "wizardWorkroom",
    },

    features: [
      {
        id: "hangingSkeleton",
        name: "Hanging Skeleton",

        description:
          "A large human skeleton hangs suspended from the ceiling in the northeast corner of the laboratory. Its skull is cracked.",

        dm: {
          hidden: false,
          trueIdentity: "remains of a barbarian chieftain",
          identityKnowableNormally: false,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "laboratoryTables",
        name: "Laboratory Tables",

        description:
          "Several large wooden tables stand about the laboratory, along with a heavy stone table similar to the one in the adjoining workroom. Their surfaces are bare except for a single stoppered smoked-glass bottle.",

        dm: {
          hidden: false,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "smokedGlassBottle",
        name: "Smoked-Glass Bottle",

        description:
          "A single stoppered bottle of smoked glass rests on one of the tables. Its contents cannot be clearly seen through the darkened glass.",

        interactions: [
          {
            id: "unstopSmokedGlassBottle",
            name: "Unstop Bottle",

            requiresExamination: true,

            message:
              "You pull the cork from the smoked-glass bottle. A pungent gas immediately rushes out with a whoosh.",

            afterDescription:
              "The smoked-glass bottle stands open and empty on the table.",

            effects: {
              savingThrow: {
                type: "poison",
                label: "Poison",
              },

              condition: {
                id: "laughingGas",
                name: "Uncontrollable Laughter",
                description:
                  "You are overcome by spasms of uncontrollable, raucous laughter and cannot effectively oppose an attacker.",
                duration: "1d6",
                durationUnit: "rounds",
              },
            },

            dm: {
              radiusFeet: 10,
              dropChancePercent: 50,
              causesAdditionalWanderingMonsterCheck: true,
              monsterArrivalDelayRounds: "1d4",
              dispelledBy: "dispelMagic",
              sourceArea: "9. WIZARD'S LABORATORY",
            },
          },
        ],

        dm: {
          hidden: false,
          stoppered: true,

          gas: {
            type: "laughingGas",
            trigger: "removeStopper",
            radiusFeet: 10,
            savingThrow: "poison",
            durationRounds: "1d6",
            dropChancePercent: 50,
            preventsOppositionWhileAffected: true,
            causesAdditionalWanderingMonsterCheck: true,
            monsterArrivalDelayRounds: "1d4",
            dispelledBy: "dispelMagic",
          },

          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "pineLogs",
        name: "Pine Logs",

        description:
          "Several pine logs are piled beneath one of the laboratory tables.",

        interactions: [
          {
            id: "movePineLogs",
            name: "Move Logs",

            requiresExamination: true,

            message:
              "You shift the pine logs aside. Something bright and metallic glints beneath them.",

            afterDescription:
              "The pine logs have been moved aside, exposing the dusty floor beneath the table.",

            discoveredItem: {
              id: "laboratory-gold-ring",
              name: "Shiny Gold-Colored Ring",
              type: "item",
              quantity: 1,
              source: "Beneath the pine logs",

              description:
                "A brilliantly shiny ring lies beneath the logs. It appears to be gold and might seem worth as much as 100 gold pieces, but it is actually worthless and possesses no magical properties.",

              actualValueGp: 0,
              apparentValueGp: 100,
              magical: false,
            },

            dm: {
              sourceArea: "9. WIZARD'S LABORATORY",
            },
          },
        ],

        dm: {
          hidden: false,
          concealsItem: "laboratory-gold-ring",
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "woodenRack",
        name: "Wooden Rack",

        description:
          "A large wooden rack stands along the west wall. It appears sized to hold a human body and resembles something from a torture chamber. A thin streak of dried blood stains the front of its oaken frame.",

        dm: {
          hidden: false,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "leatherSkin",
        name: "Stretched Leather Skin",

        description:
          "A stretched leather skin hangs on the south wall. Strange magical writing covers its surface. The skin looks extremely old and fragile.",

        interactions: [
          {
            id: "removeLeatherSkin",
            name: "Remove Skin",

            requiresExamination: true,

            message:
              "The ancient leather begins to crack and crumble as you try to remove it. The skin falls apart, irreparably destroying the writing.",

            afterDescription:
              "Only ruined scraps of the ancient leather remain. The magical writing has been destroyed.",

            dm: {
              effect: "destroyWriting",
              sourceArea: "9. WIZARD'S LABORATORY",
            },
          },
        ],

        dm: {
          hidden: false,
          language: "magic",
          readableNormally: false,
          requiresReadMagic: true,
          decodedText:
            "What mysterious happenings have their birth here? Only the greatest feats of wizardry, for which every element of earth, water and sky is but a tool!",
          removableIntact: false,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "firePit",
        name: "Sunken Fire Pit",

        description:
          "A blackened, cold fire pit lies near the center of the laboratory. It is about four feet wide and two feet deep, although several inches of ash partly fill it. An iron brace spans the opening and supports a cast-iron pot.",

        dm: {
          hidden: false,
          depthFeet: 2,
          widthFeet: 4,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "castIronPots",
        name: "Cast-Iron Pots",

        description:
          "One heavy cast-iron pot hangs over the fire pit. It is empty except for a harmless brown residue clinging to its interior. A second, shallower pot lies beside the pit and is empty. Both are extraordinarily heavy.",

        dm: {
          hidden: false,
          count: 2,
          moveRequirement: {
            minimumCharacters: 2,
            minimumStrengthEach: 14,
          },
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "vats",
        name: "Wooden Vats",

        description:
          "Three wooden vats stand in the southwest corner. Two are large, each holding roughly one hundred gallons, and are empty. The third is about half their size and is half-filled with murky, muddy water.",

        dm: {
          hidden: false,
          largeVatCount: 2,
          largeVatCapacityGallons: 100,
          largeVatsEmpty: true,
          smallVatCapacityGallons: 50,
          smallVatHalfFull: true,
          smallVatContents: "murky muddy water",
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "stoneStand",
        name: "Stone Stand",

        description:
          "A stone block used as a table or stand sits beside the vats along the west wall. Six earthen containers and assorted pieces of dusty glassware rest on and around it. Some glassware bears old residue, but all of it is empty.",

        dm: {
          hidden: false,
          earthenContainerCount: 6,
          containerContentsUseArea8Table: true,
          glasswareEmpty: true,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "woodenCoffin",
        name: "Wooden Coffin",

        description:
          "A plain wooden coffin stands upright in the northwest corner. The wood has begun to rot in places.",

        interactions: [
          {
            id: "openCoffin",
            name: "Open Coffin",

            requiresExamination: true,

            message: "The coffin opens easily. There is nothing inside.",

            afterDescription:
              "The plain wooden coffin stands open and empty in the northwest corner.",

            dm: {
              sourceArea: "9. WIZARD'S LABORATORY",
            },
          },
        ],

        dm: {
          hidden: false,
          empty: true,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "kegs",
        name: "Kegs",

        description:
          "Two old kegs rest against the north wall. Each bears a letter code indicating its contents.",

        dm: {
          hidden: false,
          count: 2,
          contentsDeterminedAsStoreroomKegs: true,
          relatedArea: "10. STOREROOM",
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "northShelving",
        name: "North-Wall Shelving",

        description:
          "Wooden shelving along the north wall holds additional dusty glassware and three more containers like those found in Zelligar's workroom. Two small trays contain differently colored powdered incense, whose aroma readily reveals what they are.",

        dm: {
          hidden: false,
          containerCount: 3,
          containerContentsUseArea8Table: true,
          incenseTrayCount: 2,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },

      {
        id: "northWall",
        name: "North Wall",

        description: "The finished stone wall appears unremarkable.",

        searchable: true,

        search: "You carefully inspect the stonework for concealed openings.",

        secretDoor: {
          id: "wizardLaboratoryNorthDoor",
          destination: "northPassage",

          foundDescription:
            "Careful examination reveals the concealed outline and mechanism of a secret door.",

          discoveredDescription:
            "The concealed outline and mechanism of the secret door are now apparent in the stone wall.",
        },

        dm: {
          hidden: false,
          sourceArea: "9. WIZARD'S LABORATORY",
        },
      },
    ],

    dm: {
      areaType: "room",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
      dimensionsFeet: {
        width: 50,
        depth: 30,
      },
      sourceArea: "9. WIZARD'S LABORATORY",
    },
  },
};
