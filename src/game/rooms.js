export const rooms = {
  entrance: {
    id: "entrance",
    name: "Entrance to Quasqueton",

    description:
      "Before you lies the entrance to the Caverns of Quasqueton. A passage leads into the dark stronghold.",

    examine:
      "The passage has been cut into the dark stone of the hill. The air from within is heavy, damp, and musty.",

    exits: {
      north: "entranceCorridor",
    },

    dm: {
      areaType: "entrance",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
    },
  },

  entranceCorridor: {
    id: "entranceCorridor",
    name: "Entrance Corridor",

    description:
      "You proceed north into the stronghold. The corridor continues ahead into darkness.",

    examine:
      "The stone corridor shows that this place was deliberately constructed rather than formed naturally.",

    exits: {
      south: "entrance",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description:
          "Several shallow alcoves are set into the walls of the corridor.",

        dm: {
          hidden: false,
          interaction: "magicMouth",
        },
      },
    ],

    dm: {
      areaType: "corridor",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
    },
  },
};
