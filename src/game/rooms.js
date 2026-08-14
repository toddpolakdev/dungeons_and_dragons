export const rooms = {
  entrance: {
    id: "entrance",
    name: "Entrance to Quasqueton",

    description:
      "Before you lies the entrance to the Caverns of Quasqueton. A passage leads into the dark stronghold.",

    examine:
      "The passage has been cut into the dark stone of the hill. The air from within is heavy, damp, and musty.",

    exits: {
      north: "firstAlcoves",
    },

    dm: {
      areaType: "entrance",
      level: 1,
      module: "B1",
      moduleName: "In Search of the Unknown",
    },
  },

  firstAlcoves: {
    id: "firstAlcoves",
    name: "Entrance Passage",

    description:
      "You proceed deeper into the entrance passage. A pair of shallow alcoves is set into the walls.",

    examine:
      "The passage is cut from dark stone. The alcoves face one another across the corridor.",

    exits: {
      south: "entrance",
      north: "secondAlcoves",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description: "Two shallow alcoves face each other across the passage.",

        dm: {
          hidden: false,
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

  secondAlcoves: {
    id: "secondAlcoves",
    name: "Entrance Passage",

    description:
      "You continue farther along the passage and approach another pair of alcoves.",

    examine:
      "Another pair of shallow alcoves has been cut into the walls here.",

    exits: {
      south: "firstAlcoves",
      north: "thirdAlcoves",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description: "A second pair of alcoves faces across the corridor.",

        dm: {
          hidden: false,
          secretOneWayDoors: true,
          discoverableFromThisSide: false,
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

  thirdAlcoves: {
    id: "thirdAlcoves",
    name: "Entrance Passage",

    description: "The passage continues to a third pair of opposing alcoves.",

    examine:
      "The alcoves resemble the previous ones, carved directly into the dark stone walls.",

    exits: {
      south: "secondAlcoves",
    },

    features: [
      {
        id: "alcoves",
        name: "Alcoves",

        description:
          "A third pair of shallow alcoves faces across the passage.",

        dm: {
          hidden: false,
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
      magicMouthTrigger: "betweenAlcoves",
    },
  },
};
