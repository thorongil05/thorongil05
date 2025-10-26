CREATE TABLE IF NOT EXISTS instrument_price_history (
    id SERIAL PRIMARY KEY,
    instrument_id INT NOT NULL,                         -- riferimento allo strumento
    price_date DATE NOT NULL,                           -- data del prezzo
    open_price NUMERIC(18, 4),                          -- prezzo di apertura
    close_price NUMERIC(18, 4),                         -- prezzo di chiusura
    high_price NUMERIC(18, 4),                          -- massimo giornaliero
    low_price NUMERIC(18, 4),                           -- minimo giornaliero
    volume BIGINT,                                      -- volume scambiato
    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_instrument
        FOREIGN KEY (instrument_id)
        REFERENCES financial_instruments (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_instrument_date
        UNIQUE (instrument_id, price_date)              -- impedisce duplicati per data
);