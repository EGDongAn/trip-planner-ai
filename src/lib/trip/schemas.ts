import { SchemaType, type Schema } from "@google/generative-ai";

/**
 * Schema for generating 5 destination options based on user input
 */
export const DESTINATION_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    destinations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
            description: "Unique identifier for the destination",
            nullable: false,
          },
          name: {
            type: SchemaType.STRING,
            description: "Name of the destination city/region",
            nullable: false,
          },
          country: {
            type: SchemaType.STRING,
            description: "Country where the destination is located",
            nullable: false,
          },
          description: {
            type: SchemaType.STRING,
            description: "Brief description highlighting the destination's appeal",
            nullable: false,
          },
          bestFor: {
            type: SchemaType.ARRAY,
            description: "Tags describing what this destination is best suited for",
            items: {
              type: SchemaType.STRING,
            },
            nullable: false,
          },
          estimatedBudget: {
            type: SchemaType.STRING,
            description: "Budget estimate (e.g., '$', '$$', '$$$')",
            nullable: false,
          },
          imageUrl: {
            type: SchemaType.STRING,
            description: "URL to a representative image (can be placeholder)",
            nullable: true,
          },
          climate: {
            type: SchemaType.STRING,
            description: "Expected climate during the travel period",
            nullable: false,
          },
        },
        required: ["id", "name", "country", "description", "bestFor", "estimatedBudget", "climate"],
      },
      description: "Array of exactly 5 destination options",
      nullable: false,
    },
  },
  required: ["destinations"],
};

/**
 * Schema for generating A/B/C plan options for a selected destination
 */
export const PLAN_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    plans: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
            description: "Plan identifier (A, B, or C)",
            nullable: false,
          },
          title: {
            type: SchemaType.STRING,
            description: "Short title for the plan theme",
            nullable: false,
          },
          description: {
            type: SchemaType.STRING,
            description: "Detailed description of the plan's focus and approach",
            nullable: false,
          },
          style: {
            type: SchemaType.STRING,
            description: "Travel style (e.g., 'Relaxed', 'Balanced', 'Adventurous')",
            nullable: false,
          },
          pace: {
            type: SchemaType.STRING,
            description: "Daily pace (e.g., 'Slow', 'Moderate', 'Fast')",
            nullable: false,
          },
          highlights: {
            type: SchemaType.ARRAY,
            description: "Key highlights and activities included in this plan",
            items: {
              type: SchemaType.STRING,
            },
            nullable: false,
          },
          estimatedCost: {
            type: SchemaType.STRING,
            description: "Budget estimate for this plan",
            nullable: false,
          },
          targetAudience: {
            type: SchemaType.ARRAY,
            description: "Who this plan is best suited for",
            items: {
              type: SchemaType.STRING,
            },
            nullable: false,
          },
        },
        required: ["id", "title", "description", "style", "pace", "highlights", "estimatedCost", "targetAudience"],
      },
      description: "Array of exactly 3 plan options (A, B, C)",
      nullable: false,
    },
  },
  required: ["plans"],
};

/**
 * Schema for generating detailed timeline with activities, locations, and logistics
 */
export const TIMELINE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    timeline: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
            description: "Unique identifier for the timeline row",
            nullable: false,
          },
          day: {
            type: SchemaType.INTEGER,
            description: "Day number in the trip",
            nullable: false,
          },
          date: {
            type: SchemaType.STRING,
            description: "Date in YYYY-MM-DD format",
            nullable: false,
          },
          timeSlot: {
            type: SchemaType.STRING,
            description: "Time range (e.g., '09:00-12:00', 'Morning', 'Afternoon', 'Evening')",
            nullable: false,
          },
          activity: {
            type: SchemaType.STRING,
            description: "Name/title of the activity or event",
            nullable: false,
          },
          description: {
            type: SchemaType.STRING,
            description: "Detailed description of what to do and expect",
            nullable: false,
          },
          location: {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: "Name of the location/venue",
                nullable: false,
              },
              address: {
                type: SchemaType.STRING,
                description: "Full address or area description",
                nullable: true,
              },
              coordinates: {
                type: SchemaType.OBJECT,
                properties: {
                  lat: {
                    type: SchemaType.NUMBER,
                    description: "Latitude coordinate",
                    nullable: true,
                  },
                  lng: {
                    type: SchemaType.NUMBER,
                    description: "Longitude coordinate",
                    nullable: true,
                  },
                },
                required: [],
                nullable: true,
              },
            },
            required: ["name"],
            nullable: false,
          },
          category: {
            type: SchemaType.STRING,
            description: "Category of activity (e.g., 'Sightseeing', 'Food', 'Transport', 'Accommodation', 'Activity', 'Shopping', 'Culture', 'Nature')",
            nullable: false,
          },
          estimatedCost: {
            type: SchemaType.STRING,
            description: "Estimated cost for this activity (e.g., '$20-30', 'Free', '$$')",
            nullable: true,
          },
          estimatedDuration: {
            type: SchemaType.STRING,
            description: "Expected duration (e.g., '2 hours', '30 min', 'Half day')",
            nullable: true,
          },
          tips: {
            type: SchemaType.ARRAY,
            description: "Helpful tips and recommendations",
            items: {
              type: SchemaType.STRING,
            },
            nullable: true,
          },
          bookingRequired: {
            type: SchemaType.BOOLEAN,
            description: "Whether advance booking is recommended or required",
            nullable: true,
          },
          transportInfo: {
            type: SchemaType.OBJECT,
            properties: {
              method: {
                type: SchemaType.STRING,
                description: "Mode of transport (e.g., 'Walk', 'Taxi', 'Metro', 'Bus')",
                nullable: true,
              },
              duration: {
                type: SchemaType.STRING,
                description: "Travel time to this location from previous activity",
                nullable: true,
              },
              cost: {
                type: SchemaType.STRING,
                description: "Estimated transport cost",
                nullable: true,
              },
            },
            required: [],
            nullable: true,
          },
        },
        required: ["id", "day", "date", "timeSlot", "activity", "description", "location", "category"],
      },
      description: "Array of timeline rows covering the entire trip",
      nullable: false,
    },
    summary: {
      type: SchemaType.OBJECT,
      properties: {
        totalDays: {
          type: SchemaType.INTEGER,
          description: "Total number of days in the trip",
          nullable: false,
        },
        totalActivities: {
          type: SchemaType.INTEGER,
          description: "Total number of planned activities",
          nullable: false,
        },
        estimatedTotalCost: {
          type: SchemaType.STRING,
          description: "Overall estimated cost for the trip",
          nullable: true,
        },
        keyHighlights: {
          type: SchemaType.ARRAY,
          description: "Main highlights and must-see experiences",
          items: {
            type: SchemaType.STRING,
          },
          nullable: true,
        },
      },
      required: ["totalDays", "totalActivities"],
      nullable: false,
    },
  },
  required: ["timeline", "summary"],
};

/**
 * Schema for conversational refinement responses
 */
export const REFINEMENT_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    response: {
      type: SchemaType.STRING,
      description: "Natural language response to the user's refinement request",
      nullable: false,
    },
    updatedTimeline: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
            description: "Unique identifier for the timeline row",
            nullable: false,
          },
          day: {
            type: SchemaType.INTEGER,
            description: "Day number in the trip",
            nullable: false,
          },
          date: {
            type: SchemaType.STRING,
            description: "Date in YYYY-MM-DD format",
            nullable: false,
          },
          timeSlot: {
            type: SchemaType.STRING,
            description: "Time range",
            nullable: false,
          },
          activity: {
            type: SchemaType.STRING,
            description: "Name/title of the activity or event",
            nullable: false,
          },
          description: {
            type: SchemaType.STRING,
            description: "Detailed description of what to do and expect",
            nullable: false,
          },
          location: {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: "Name of the location/venue",
                nullable: false,
              },
              address: {
                type: SchemaType.STRING,
                description: "Full address or area description",
                nullable: true,
              },
              coordinates: {
                type: SchemaType.OBJECT,
                properties: {
                  lat: {
                    type: SchemaType.NUMBER,
                    description: "Latitude coordinate",
                    nullable: true,
                  },
                  lng: {
                    type: SchemaType.NUMBER,
                    description: "Longitude coordinate",
                    nullable: true,
                  },
                },
                required: [],
                nullable: true,
              },
            },
            required: ["name"],
            nullable: false,
          },
          category: {
            type: SchemaType.STRING,
            description: "Category of activity",
            nullable: false,
          },
          estimatedCost: {
            type: SchemaType.STRING,
            description: "Estimated cost for this activity",
            nullable: true,
          },
          estimatedDuration: {
            type: SchemaType.STRING,
            description: "Expected duration",
            nullable: true,
          },
          tips: {
            type: SchemaType.ARRAY,
            description: "Helpful tips and recommendations",
            items: {
              type: SchemaType.STRING,
            },
            nullable: true,
          },
          bookingRequired: {
            type: SchemaType.BOOLEAN,
            description: "Whether advance booking is recommended or required",
            nullable: true,
          },
          transportInfo: {
            type: SchemaType.OBJECT,
            properties: {
              method: {
                type: SchemaType.STRING,
                description: "Mode of transport",
                nullable: true,
              },
              duration: {
                type: SchemaType.STRING,
                description: "Travel time to this location from previous activity",
                nullable: true,
              },
              cost: {
                type: SchemaType.STRING,
                description: "Estimated transport cost",
                nullable: true,
              },
            },
            required: [],
            nullable: true,
          },
        },
        required: ["id", "day", "date", "timeSlot", "activity", "description", "location", "category"],
      },
      description: "Updated timeline if changes were made, otherwise null",
      nullable: true,
    },
    suggestedActions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
      description: "Suggested follow-up actions or questions for the user",
      nullable: true,
    },
    changesSummary: {
      type: SchemaType.STRING,
      description: "Summary of changes made to the timeline",
      nullable: true,
    },
  },
  required: ["response"],
};

/**
 * TypeScript types matching the schemas
 */
export interface DestinationOption {
  id: string;
  name: string;
  country: string;
  description: string;
  bestFor: string[];
  estimatedBudget: string;
  imageUrl?: string;
  climate: string;
}

export interface PlanOption {
  id: string;
  title: string;
  description: string;
  style: string;
  pace: string;
  highlights: string[];
  estimatedCost: string;
  targetAudience: string[];
}

export interface TimelineLocation {
  name: string;
  address?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export interface TransportInfo {
  method?: string;
  duration?: string;
  cost?: string;
}

export interface TimelineRow {
  id: string;
  day: number;
  date: string;
  timeSlot: string;
  activity: string;
  description: string;
  location: TimelineLocation;
  category: string;
  estimatedCost?: string;
  estimatedDuration?: string;
  tips?: string[];
  bookingRequired?: boolean;
  transportInfo?: TransportInfo;
}

export interface TimelineSummary {
  totalDays: number;
  totalActivities: number;
  estimatedTotalCost?: string;
  keyHighlights?: string[];
}

export interface BookingData {
  type: string;
  parsedData?: {
    type: string;
    airline?: string;
    flightNumber?: string;
    departure?: { airport: string; time: string; date: string };
    arrival?: { airport: string; time: string; date: string };
    name?: string;
    checkIn?: string;
    checkOut?: string;
    roomType?: string;
  };
}

export interface TripMetadata {
  startDate?: string;
  endDate?: string;
  numberOfDays?: number;
  budget?: string;
  travelStyle?: string;
  interests?: string[];
  travelers?: {
    adults: number;
    children?: number;
    seniors?: number;
  };
  specialRequirements?: string[];
  presets?: string[];
  bookings?: BookingData[];
}

/**
 * Internal TripState used by TripPlannerEngine
 * This represents the final trip configuration for refinement
 */
export interface TripEngineState {
  destination: DestinationOption;
  plan: PlanOption;
  timeline: TimelineRow[];
  summary: TimelineSummary;
  metadata: TripMetadata;
}

export interface RefinementResponse {
  response: string;
  updatedTimeline?: TimelineRow[];
  suggestedActions?: string[];
  changesSummary?: string;
}
