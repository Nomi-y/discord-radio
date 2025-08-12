#!/bin/bash
set -e

APP_NAME="discord-radio"
APP_DIR=$(pwd)
NPM_EXEC=$(which npm)

if ! command -v node &> /dev/null; then
    echo "Node.js not found. Exiting..."
    exit 
fi


npm install --omit=dev

SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"

bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=$APP_NAME (Node.js App)
After=network.target

[Service]
WorkingDirectory=$APP_DIR
ExecStart=$NPM_EXEC start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$APP_NAME

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "$APP_NAME"
sudo systemctl start "$APP_NAME"

echo "  Check status: systemctl status $APP_NAME"
echo "  View logs:    journalctl -u $APP_NAME -f"
