CREATE TABLE competition_teams (
    competition_id INT NOT NULL,
    team_id INT NOT NULL,

    PRIMARY KEY (competition_id, team_id),

    CONSTRAINT fk_competition
        FOREIGN KEY (competition_id)
        REFERENCES competitions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE
);
