# Discord Music Bot for playing local songs

## Installation

1. **Clone the repo**:

   ```bash
    git clone https://github.com/Nomi-y/discord-radio
    cd discord-radio
   ```

2. **Install dependencies**:

   ```bash
    npm install
   ```

3. **Configure Environment**:

   - Create `.env` file from template:

   ```bash
    cp .env.example .env
   ```

   - Fill in your Discord credentials:

   ```text
    DISCORD_TOKEN='your_bot_token_here'
    CLIENT_ID='your_client_id_here'
   ```

4. **Set up audio files**:

    - Option A: Edit paths in `src/config.ts`
    - Option B (default):

        ```bash
            mkdir -p resources/{music,intermissions}
            # Add your files to:
            # - resources/music/
            # - resources/intermissions/
        ```

5. **Run the bot**:

    ```bash
        npm start
    ```
