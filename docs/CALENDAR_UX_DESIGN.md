# UX Architecture: Mobile Calendar & Agenda Logic

**Context**: Remindr is an *obligation operating system*, not a passive calendar. It prioritizes action, risk prevention, and immediate context over general browsing.

## 1. Core Philosophy: "Action over Browsing"
Traditional calendar apps (Google Calendar, Apple Calendar) are **Map-First**: they show you the entire territory (month/week) and ask you to find your destination.
Remindr is **GPS-First**: it tells you exactly where you are (Today) and what the next turn is (Up Next). The map (Month View) is only pulled out when you are lost or planning a long trip.

- **Calendar = Context (The Map)**: Used to orient oneself in time (What day is it? When is next Friday?).
- **Agenda = Action (The Route)**: Used to execute tasks (Do this now, prepare for that).

## 2. The Mobile User Mental Model
### "The Pilot's Checklist" vs. "The Wall Calendar"
On desktop, users have screen real estate to manage a "Wall Calendar" (drag-and-drop, full month overview).
On mobile, users define success by **speed of capture** and **clarity of next action**.

*   **The User's Goal**: "What do I need to worry about right now?"
*   **The Problem with Month Views**: They are cognitively expensive. Dots on a grid require tapping to reveal content ("Mystery Meat Navigation").
*   **The Solution**: A linear, scrolling timeline (Agenda) reduces friction. The user never has to "dig" for information; it is served on a platter.

## 3. Why This Approach Wins on Mobile

### A. Reduces Cognitive Load (Hick’s Law)
- **Traditional**: User sees 30 days → Needs to decide which one to click → Clicks → Reads list → Back navigation.
- **Remindr**: User sees Today + Next 3 days (Strip) → Content is already visible → Scroll to see more.
- **Benefit**: Removes decision fatigue. The "default" state is always the most useful state.

### B. High Signal-to-Noise Ratio
- Month views are 90% empty space or numbers (1-31) that carry no task information.
- Agenda views are 100% relevant content (Task Titles, Times, Risks).

### C. Thumb Zone Friendly
- **Strip Navigation**: Horizontal swiping (Calendar Strip) is ergonomic for the thumb.
- **Grid Navigation**: Reaching for specific dates in a top-heavy grid requires hand shifting. Minimizing grid interaction usage to "occasional browsing" saves physical effort.

## 4. Interaction Rules (Do's & Don'ts)

### ✅ DO
- **Default to Agenda**: The primary view is always a list of reminders.
- **Strip for Short Hops**: Use the horizontal Day Strip to jump +/- 3-7 days.
- **Grid for Long Jumps**: Use the Month View (Modal/Overlay) *only* when the user intentionally needs to jump weeks/months ahead.
- **Auto-Close**: When a date is selected in the Month View, immediately close the grid and show the Agenda. Do not force a second tap to "confirm".

### ❌ DON'T
- **Don't Fragment**: Never make the user toggle between "List View" and "Calendar View" as equal modes. The List is the *only* mode; the Calendar is just a *navigator* for that list.
- **Don't Clutter**: Avoid placing full text inside monthly grid cells. Use simple density indicators (dots/heatmaps).
- **Don't Trap**: Never leave the user in an empty state without a clear "Create" or "Back to Today" action.

## 5. Interaction & Animation Concepts

### The "HUD" Reveal (Month Overlay)
Instead of sliding to a new screen, the Month View should feel like a **Heads-Up Display (HUD)** overlay.
- **Trigger**: Tap "Month Name" or Calendar Icon.
- **Animation**: Fade + Scale In (Glassmorphism backdrop).
- **Feeling**: You are momentarily pausing interactions to check the map, then diving back in.

### The "Magnetic" Strip
The horizontal calendar strip should feel "magnetic" to the current selection.
- **Behavior**: Swiping the agenda list (changing days) should auto-scroll the strip to match.
- **Feedback**: Haptic tap when crossing day boundaries.

## 6. Summary
This logic aligns with **Notification-Driven Usage**. Users typically open the app because a reminder fired.
1.  **Notification** ("Pay Bill").
2.  **Open App** -> Lands on **Agenda** (Context: "What else is due today?").
3.  **Action** -> Mark Complete.
4.  **Close**.

A full calendar view is unnecessary for this 90% use case. We only show it for the 10% "Planning" use case.
