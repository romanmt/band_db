# Service Account Credentials Encryption Deployment Guide

## Overview

We've implemented field-level encryption for Google service account credentials using Cloak to address the security vulnerability where credentials were stored as plaintext in the database.

## Changes Made

1. **Added Cloak encryption library** - Service account credentials are now encrypted using AES-256-GCM encryption
2. **Updated ServiceAccount schema** - The `credentials` field now uses encrypted binary storage
3. **Created migration** - Changes the database column type from text to binary
4. **Added encryption configuration** - Vault configuration for development, test, and production

## Deployment Steps

### 1. Set the encryption key in production

Before deploying, you need to set the `CLOAK_KEY` environment variable on your production server:

```bash
# Generate a new encryption key
mix phx.gen.secret 32

# Set it on fly.io
fly secrets set CLOAK_KEY="your-generated-key-here"
```

### 2. Deploy the application

Deploy the updated application with the new code:

```bash
fly deploy
```

The migration will run automatically during deployment and change the credentials column type.

### 3. Encrypt existing credentials (if any)

If you have existing service account credentials in the database, run the encryption task:

```bash
fly ssh console
cd /app
./bin/band_db eval "Mix.Tasks.EncryptCredentials.run([])"
```

This will encrypt any plaintext credentials that exist in the database.

## Security Benefits

- Service account private keys are now encrypted at rest
- Encryption/decryption is transparent to the application
- Even if the database is compromised, credentials remain protected
- Encryption key is stored separately from the database

## Rollback Instructions

If needed, you can rollback:

1. Deploy the previous version of the code
2. Run `mix ecto.rollback` to revert the migration
3. Note: This will lose the credentials data as we can't decrypt without the application running

## Testing

The encryption has been tested with:
- Unit tests verifying encryption/decryption
- Integration tests confirming service account functionality still works
- Manual testing of the admin interface

## Notes

- The encryption is transparent to the application code
- No changes needed to ServiceAccountManager or GoogleAPI modules
- Credentials are automatically encrypted on save and decrypted on read