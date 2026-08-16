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

    // We have not built the destinations north/east/west yet.
    // Do not create fake room destinations simply to make
    // buttons appear.
    exits: {
      south: "thirdAlcoves",
    },

    features: [
      {
        id: "bodies",
        name: "Bodies",

        description:
          "Three of the dead appear to have been adventurers from outside the stronghold; the other two were guards. One human fighter is slumped against a wall with a broken sword. A human magic-user is impaled against a wooden section of wall by the sword that killed him. A dwarf fighter lies face down farther east, still holding a war hammer. Two human fighters who appear to have been guards lie nearby.",

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

            afterDescription:
              "Three of the dead were adventurers and two were guards. The human fighter remains slumped against the wall with his broken sword. The dead magic-user now lies on the floor beneath the wooden section of wall where he had been pinned. A blood-stained carving is visible behind him. The dwarf fighter remains face down farther east with his war hammer, and the two dead guards remain nearby.",

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

      // They physically exist according to B1.
      // We simply haven't implemented their destinations yet.
      unimplementedExits: ["north", "east", "west"],
    },
  },
};
