import type { DestinationOption, PlanOption, TripMetadata, TripEngineState } from "./schemas";

/**
 * Build prompt for generating 5 destination options based on user input
 */
export function buildDestinationPrompt(userInput: string, metadata?: TripMetadata): string {
  const { startDate, endDate, numberOfDays, budget, travelStyle, interests, travelers, specialRequirements } = metadata || {};

  let prompt = `You are an expert travel planner. Based on the user's input and preferences, suggest 5 destination options.

User Input: "${userInput}"

**CRITICAL**: Analyze the user input carefully:
1. If the user mentions a SPECIFIC DESTINATION (city, country, region like "홍콩", "Paris", "일본", "Hawaii", "발리"):
   - The FIRST option (id: "1") MUST be that exact destination
   - Options 2-5 should be DIFFERENT AREAS or NEIGHBORHOODS within that same destination, OR very similar alternatives nearby
   - Example: If user says "홍콩", option 1 = Hong Kong (general), options 2-5 = Hong Kong Island, Kowloon, Lantau Island, or nearby Macau/Shenzhen

2. If the user gives a GENERAL description (like "따뜻한 곳", "beach vacation", "유럽 여행"):
   - Suggest 5 diverse destinations that match the criteria
   - Vary by budget, style, and specific attractions

`;

  // Add metadata if available
  if (startDate || endDate || numberOfDays) {
    prompt += `Travel Dates:\n`;
    if (startDate) prompt += `- Start: ${startDate}\n`;
    if (endDate) prompt += `- End: ${endDate}\n`;
    if (numberOfDays) prompt += `- Duration: ${numberOfDays} days\n`;
    prompt += `\n`;
  }

  if (budget) {
    prompt += `Budget: ${budget}\n\n`;
  }

  if (travelStyle) {
    prompt += `Preferred Travel Style: ${travelStyle}\n\n`;
  }

  if (interests && interests.length > 0) {
    prompt += `Interests: ${interests.join(", ")}\n\n`;
  }

  if (travelers) {
    prompt += `Travelers:\n`;
    if (travelers.adults) prompt += `- Adults: ${travelers.adults}\n`;
    if (travelers.children) prompt += `- Children: ${travelers.children}\n`;
    if (travelers.seniors) prompt += `- Seniors: ${travelers.seniors}\n`;
    prompt += `\n`;
  }

  if (specialRequirements && specialRequirements.length > 0) {
    prompt += `Special Requirements: ${specialRequirements.join(", ")}\n\n`;
  }

  prompt += `Requirements:
- Generate exactly 5 destination options
- RESPECT the user's specific destination request if one is given
- Include varied budget levels and travel styles
- Consider the travel dates and climate
- Provide practical budget estimates using $ symbols ($, $$, $$$)
- Make each destination unique and appealing
- Include specific details about what makes each destination special
- Consider the traveler composition (families, couples, solo, groups, etc.)

For each destination, provide:
- A unique ID (1, 2, 3, 4, 5)
- Name and country
- Compelling description (2-3 sentences)
- What it's best for (tags like 'beaches', 'culture', 'adventure', 'food', 'nightlife', 'nature', 'history', 'relaxation')
- Estimated budget level
- Climate conditions during the travel period
- Optional image URL (can use placeholder)

Make the descriptions engaging and informative, highlighting unique selling points.`;

  return prompt;
}

/**
 * Build prompt for generating A/B/C plan options for a selected destination
 */
export function buildPlanPrompt(destination: DestinationOption, metadata?: TripMetadata): string {
  const { numberOfDays, budget, travelStyle, interests, travelers, specialRequirements } = metadata || {};

  let prompt = `You are an expert travel planner. Create 3 distinct trip plan options (A, B, C) for the following destination.

Destination: ${destination.name}, ${destination.country}
Description: ${destination.description}
Best For: ${destination.bestFor.join(", ")}
Climate: ${destination.climate}

`;

  if (numberOfDays) {
    prompt += `Trip Duration: ${numberOfDays} days\n\n`;
  }

  if (budget) {
    prompt += `Budget: ${budget}\n\n`;
  }

  if (travelStyle) {
    prompt += `Preferred Travel Style: ${travelStyle}\n\n`;
  }

  if (interests && interests.length > 0) {
    prompt += `Interests: ${interests.join(", ")}\n\n`;
  }

  if (travelers) {
    prompt += `Travelers:\n`;
    if (travelers.adults) prompt += `- Adults: ${travelers.adults}\n`;
    if (travelers.children) prompt += `- Children: ${travelers.children}\n`;
    if (travelers.seniors) prompt += `- Seniors: ${travelers.seniors}\n`;
    prompt += `\n`;
  }

  if (specialRequirements && specialRequirements.length > 0) {
    prompt += `Special Requirements: ${specialRequirements.join(", ")}\n\n`;
  }

  prompt += `Create 3 distinctly different plan options:

Plan A: Relaxed/Cultural Focus
- Slower pace with more time at each location
- Emphasis on cultural immersion and local experiences
- More downtime and flexibility
- Suitable for those who want to absorb the destination deeply

Plan B: Balanced/Highlights Focus
- Moderate pace covering major attractions
- Mix of must-see sights and local experiences
- Good balance of activity and rest
- Most comprehensive coverage of destination highlights

Plan C: Adventurous/Intensive Focus
- Faster pace with packed schedule
- Maximum experiences and activities
- Early starts and full days
- For travelers who want to see and do as much as possible

For each plan, provide:
- ID (A, B, or C)
- Catchy title that captures the plan's essence
- Detailed description (3-4 sentences) explaining the approach and philosophy
- Travel style descriptor
- Daily pace descriptor
- 5-8 key highlights and activities included
- Estimated cost range
- Target audience (who this plan is perfect for)

Make each plan distinct and appealing to different types of travelers. Consider the destination's strengths and the user's preferences.`;

  return prompt;
}

/**
 * Build prompt for generating detailed timeline with activities, locations, and logistics
 */
export function buildTimelinePrompt(
  destination: DestinationOption,
  plan: PlanOption,
  metadata?: TripMetadata
): string {
  const { startDate, endDate, numberOfDays, budget, interests, travelers, specialRequirements } = metadata || {};

  let prompt = `You are an expert travel planner. Create a detailed day-by-day timeline for the following trip.

Destination: ${destination.name}, ${destination.country}
Plan: ${plan.title} (${plan.id})
Plan Description: ${plan.description}
Style: ${plan.style}
Pace: ${plan.pace}
Key Highlights: ${plan.highlights.join(", ")}

`;

  if (startDate) {
    prompt += `Start Date: ${startDate}\n`;
  }

  if (endDate) {
    prompt += `End Date: ${endDate}\n`;
  }

  if (numberOfDays) {
    prompt += `Duration: ${numberOfDays} days\n`;
  }

  prompt += `\n`;

  if (budget) {
    prompt += `Budget: ${budget}\n\n`;
  }

  if (interests && interests.length > 0) {
    prompt += `Interests: ${interests.join(", ")}\n\n`;
  }

  if (travelers) {
    prompt += `Travelers:\n`;
    if (travelers.adults) prompt += `- Adults: ${travelers.adults}\n`;
    if (travelers.children) prompt += `- Children: ${travelers.children}\n`;
    if (travelers.seniors) prompt += `- Seniors: ${travelers.seniors}\n`;
    prompt += `\n`;
  }

  if (specialRequirements && specialRequirements.length > 0) {
    prompt += `Special Requirements: ${specialRequirements.join(", ")}\n\n`;
  }

  prompt += `Create a detailed timeline with the following requirements:

1. **Comprehensive Coverage**: Include all activities from arrival to departure
2. **Time Slots**: Specify realistic time ranges for each activity (e.g., "09:00-12:00", "Morning", "Afternoon", "Evening")
3. **Locations**: Provide specific venue names, addresses, and coordinates where possible
4. **Categories**: Classify activities (Sightseeing, Food, Transport, Accommodation, Activity, Shopping, Culture, Nature, etc.)
5. **Logistics**: Include transport information between locations (method, duration, cost)
6. **Practical Details**:
   - Estimated costs for each activity
   - Duration of activities
   - Booking requirements
   - Helpful tips and insider advice
   - Opening hours considerations
   - Best times to visit

7. **Flow and Pacing**:
   - Ensure logical geographic flow to minimize backtracking
   - Match the pace specified in the plan (${plan.pace})
   - Include appropriate breaks and meal times
   - Consider travel time between locations
   - Factor in jet lag for first day if international travel

8. **Variety**: Mix different types of activities
   - Morning activities (when places are less crowded)
   - Afternoon experiences
   - Evening entertainment
   - Meal recommendations
   - Rest periods

9. **Realism**:
   - Account for actual opening/closing times
   - Include realistic travel times
   - Don't over-schedule
   - Build in buffer time

10. **Summary**: Provide trip overview with:
    - Total days and activities
    - Overall estimated cost
    - Key highlights not to miss

Make this timeline actionable and ready to use. Include enough detail that a traveler could follow it without additional research.`;

  return prompt;
}

/**
 * Build prompt for conversational refinement of the timeline
 */
export function buildRefinementPrompt(currentState: TripEngineState, userMessage: string): string {
  const { destination, plan, timeline, summary, metadata } = currentState;

  let prompt = `You are an expert travel planner helping refine a trip itinerary. The user wants to make changes or ask questions.

**Current Trip Details:**
Destination: ${destination.name}, ${destination.country}
Plan: ${plan.title} (${plan.style}, ${plan.pace})
Duration: ${summary.totalDays} days
Total Activities: ${summary.totalActivities}

**User's Request:**
"${userMessage}"

**Current Timeline Summary:**
`;

  // Group timeline by day for context
  const dayGroups = timeline.reduce((acc, row) => {
    if (!acc[row.day]) acc[row.day] = [];
    acc[row.day].push(row);
    return acc;
  }, {} as Record<number, typeof timeline>);

  Object.entries(dayGroups).forEach(([day, activities]) => {
    prompt += `\nDay ${day} (${activities[0].date}):\n`;
    activities.forEach(activity => {
      prompt += `- ${activity.timeSlot}: ${activity.activity} at ${activity.location.name} (${activity.category})\n`;
    });
  });

  prompt += `\n\n**Your Task:**

1. **Understand the Request**: Analyze what the user wants to change, add, remove, or learn about
2. **Make Appropriate Changes**: If the request involves modifications:
   - Update the timeline accordingly
   - Maintain logical flow and realistic timing
   - Adjust subsequent activities if needed
   - Keep the overall plan style and pace
   - Ensure geographic coherence

3. **Provide Context**: Explain what changes you're making and why
4. **Offer Suggestions**: Recommend related improvements or alternatives
5. **Ask Clarifying Questions**: If the request is ambiguous, ask for clarification

**Response Requirements:**
- **response**: Natural, conversational explanation of what you understood and what you're doing
- **updatedTimeline**: The modified timeline array (ONLY if changes were made, otherwise null)
- **suggestedActions**: 2-4 follow-up suggestions or questions for the user
- **changesSummary**: Brief summary of specific changes made (if any)

**Important Guidelines:**
- If just answering a question without changes: return null for updatedTimeline
- If making changes: return the COMPLETE updated timeline, not just the changed items
- Maintain all IDs for unchanged items
- Generate new IDs for new items (format: "timeline-{day}-{sequence}")
- Keep date format consistent (YYYY-MM-DD)
- Preserve the existing structure and detail level
- If removing activities, adjust timing of subsequent activities
- If adding activities, ensure realistic time allocation

Be helpful, knowledgeable, and maintain the quality and detail of the original plan.`;

  return prompt;
}
