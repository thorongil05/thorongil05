# README

## Local Setup

1. Define your `.env` file with the following environment variables

    ```text
    POSTGRES_USER='app'
    POSTGRES_PASSWORD='pwd'
    POSTGRES_DB='test'
    PGADMIN_EMAIL='name@example.com'
    PGADMIN_PASSWORD='admin'
    ```

2. Run `docker compose up` to start the docker compose.

> [!NOTE]
> If you want to restart everything from scratch (volumes included) use the command `docker-compose down -v`
