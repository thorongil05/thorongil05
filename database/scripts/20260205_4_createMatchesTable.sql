CREATE TABLE teams (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    city VARCHAR(100)
);

CREATE TABLE competitions (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100),
    type VARCHAR(50) -- League, Cup, International
);

CREATE TABLE matches (
    ID SERIAL PRIMARY KEY,
    match_date DATE NOT NULL,

    competition_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,

    home_goals INT,
    away_goals INT,

    stadium VARCHAR(100),

    CONSTRAINT fk_competition
        FOREIGN KEY (competition_id)
        REFERENCES competitions(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_home_team
        FOREIGN KEY (home_team_id)
        REFERENCES teams(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_away_team
        FOREIGN KEY (away_team_id)
        REFERENCES teams(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_different_teams
        CHECK (home_team_id <> away_team_id)
);