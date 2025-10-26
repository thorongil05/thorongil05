CREATE TABLE IF NOT EXISTS financial_instruments (
    id SERIAL PRIMARY KEY,
    isin VARCHAR(12) UNIQUE NOT NULL,               -- Codice ISIN (es. IT0001234567)
    symbol VARCHAR(10),                             -- Simbolo di trading (es. AAPL, ENI)
    name VARCHAR(255) NOT NULL,                     -- Nome completo dello strumento
    type VARCHAR(50) NOT NULL,                      -- Tipo: 'stock', 'bond', 'etf', 'fund', ecc.
    currency CHAR(3) NOT NULL,                      -- Codice valuta ISO (es. EUR, USD)
    issue_date DATE,                                -- Data di emissione
    maturity_date DATE,                             -- Data di scadenza (se applicabile)
    issuer VARCHAR(255),                            -- Nome dell’emittente
    nominal_value NUMERIC(18, 4),                   -- Valore nominale
    market_price NUMERIC(18, 4),                    -- Prezzo corrente di mercato
    created_at TIMESTAMP DEFAULT NOW(),             -- Timestamp di creazione
    updated_at TIMESTAMP DEFAULT NOW()              -- Timestamp ultimo aggiornamento
);