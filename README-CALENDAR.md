# Google Calendar Integration

This feature allows band admins to connect to Google Calendar and manage rehearsal plans and show schedules directly from the app.

## Setup Instructions

### Prerequisites

1. A Google account
2. A Google Cloud project with the Calendar API enabled
3. OAuth credentials (client ID and client secret)

### Configuration Steps

1. Create a `.env` file based on the `.env.example` template
2. Fill in your Google Cloud credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
   ```
3. Create a `.env.exs` file with the same credentials for Phoenix to load:
   ```elixir
   # This file loads environment variables directly for development
   System.put_env("GOOGLE_CLIENT_ID", "your-client-id-here")
   System.put_env("GOOGLE_CLIENT_SECRET", "your-client-secret-here")
   System.put_env("GOOGLE_REDIRECT_URI", "http://localhost:4000/auth/google/callback")
   ```
4. Start the Phoenix server:
   ```
   mix phx.server
   ```

### Security Note

The `.env` and `.env.exs` files contain sensitive credentials and should never be committed to version control. They are automatically excluded by the `.gitignore` file. Always keep your Google API credentials secure and never share them publicly.

For production deployment, use environment variables or a secure secrets management system rather than files.

### Usage

1. Log in as an admin user
2. Navigate to "Admin" -> "Calendar Settings"
3. Click "Connect Google Calendar"
4. Follow the Google authentication flow
5. Once connected, you can create a band calendar
6. Rehearsal plans and set lists will automatically sync with this calendar

## Implementation Details

The integration follows these key steps:

1. **Authentication**: OAuth 2.0 flow connecting band admin to Google
2. **Calendar Creation**: Custom calendar for band events
3. **Event Sync**: Two-way sync between app events and calendar
4. **Sharing**: Band members get access to the shared calendar

## Architecture

- `GoogleAuth` schema: Stores OAuth tokens and calendar IDs
- `Calendar` context: Manages calendar operations and token refresh
- `GoogleAPI` module: Handles all communication with Google APIs
- `AdminCalendarLive`: User interface for admin calendar settings

## Troubleshooting

- **Connection Issues**: Check that your Google API credentials are correct
- **Permission Errors**: Ensure the Calendar API is enabled in your Google Cloud project
- **Token Refresh Failures**: Try disconnecting and reconnecting your Google account

## Next Steps

See the full implementation plan in `calendar_integration_plan.md` for details on upcoming features. 