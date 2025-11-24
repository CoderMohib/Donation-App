#!/usr/bin/env bash

# This script writes the GOOGLE_SERVICES_JSON environment variable to a file
# It runs before the build starts on EAS

if [ -n "$GOOGLE_SERVICES_JSON" ]; then
  echo "Writing GOOGLE_SERVICES_JSON to google-services.json"
  echo "$GOOGLE_SERVICES_JSON" > google-services.json
else
  echo "Error: GOOGLE_SERVICES_JSON environment variable is not set"
  exit 1
fi
