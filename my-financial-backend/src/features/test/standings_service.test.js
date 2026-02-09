const { test, describe } = require("node:test");
const assert = require("node:assert");
const { calculateStandings } = require("../standings_service");

describe("calculateStandings", () => {
  test("should return empty array for empty matches", () => {
    const matches = [];
    const standings = calculateStandings(matches);
    assert.deepStrictEqual(standings, []);
  });

  test("should calculate standings for a single match (Home Win)", () => {
    const matches = [
      {
        homeTeam: { id: 1, name: "Team A" },
        awayTeam: { id: 2, name: "Team B" },
        homeScore: 2,
        awayScore: 0,
      },
    ];
    const standings = calculateStandings(matches);

    assert.strictEqual(standings.length, 2);
    
    // Team A (Winner)
    assert.strictEqual(standings[0].teamName, "Team A");
    assert.strictEqual(standings[0].points, 3);
    assert.strictEqual(standings[0].played, 1);
    assert.strictEqual(standings[0].won, 1);
    assert.strictEqual(standings[0].goalDifference, 2);

    // Team B (Loser)
    assert.strictEqual(standings[1].teamName, "Team B");
    assert.strictEqual(standings[1].points, 0);
    assert.strictEqual(standings[1].played, 1);
    assert.strictEqual(standings[1].lost, 1);
    assert.strictEqual(standings[1].goalDifference, -2);
  });

  test("should calculate standings for a single match (Draw)", () => {
    const matches = [
      {
        homeTeam: { id: 1, name: "Team A" },
        awayTeam: { id: 2, name: "Team B" },
        homeScore: 1,
        awayScore: 1,
      },
    ];
    const standings = calculateStandings(matches);

    assert.strictEqual(standings.length, 2);
    
    // Check points
    assert.strictEqual(standings[0].points, 1);
    assert.strictEqual(standings[1].points, 1);
    
    // Check drawn count
    assert.strictEqual(standings[0].drawn, 1);
    assert.strictEqual(standings[1].drawn, 1);
  });

  test("should order by Points DESC", () => {
    const matches = [
      { // Team A wins (3 pts)
        homeTeam: { id: 1, name: "Team A" },
        awayTeam: { id: 2, name: "Team B" },
        homeScore: 1,
        awayScore: 0,
      },
      { // Team C draws (1 pt)
        homeTeam: { id: 3, name: "Team C" },
        awayTeam: { id: 4, name: "Team D" },
        homeScore: 1,
        awayScore: 1,
      },
    ];
    // Team A: 3, Team C: 1, Team D: 1, Team B: 0
    const standings = calculateStandings(matches);

    assert.strictEqual(standings[0].teamName, "Team A");
    assert.strictEqual(standings[3].teamName, "Team B");
  });

  test("should break ties by Goal Difference DESC", () => {
    const matches = [
      { // Team A wins big (+3 GD)
        homeTeam: { id: 1, name: "Team A" },
        awayTeam: { id: 3, name: "Team C" },
        homeScore: 3,
        awayScore: 0,
      },
      { // Team B wins small (+1 GD)
        homeTeam: { id: 2, name: "Team B" },
        awayTeam: { id: 4, name: "Team D" },
        homeScore: 1,
        awayScore: 0,
      },
    ];
    // Team A and B both have 3 points. Team A has +3 GD, Team B has +1 GD.
    const standings = calculateStandings(matches);

    assert.strictEqual(standings[0].teamName, "Team A");
    assert.strictEqual(standings[1].teamName, "Team B");
    assert.strictEqual(standings[0].points, 3);
    assert.strictEqual(standings[1].points, 3);
  });

  test("should break ties by Goals For DESC", () => {
    const matches = [
      { // Team A wins 3-2 (+1 GD, 3 GF)
        homeTeam: { id: 1, name: "Team A" },
        awayTeam: { id: 3, name: "Team C" },
        homeScore: 3,
        awayScore: 2,
      },
      { // Team B wins 1-0 (+1 GD, 1 GF)
        homeTeam: { id: 2, name: "Team B" },
        awayTeam: { id: 4, name: "Team D" },
        homeScore: 1,
        awayScore: 0,
      },
    ];
    // Team A and B: 3 pts, +1 GD. Team A has 3 GF, Team B has 1 GF.
    const standings = calculateStandings(matches);

    assert.strictEqual(standings[0].teamName, "Team A");
    assert.strictEqual(standings[1].teamName, "Team B");
  });

  test("should handle unplayed matches (null scores)", () => {
    const matches = [
      {
        homeTeam: { id: 1, name: "Team A" },
        awayTeam: { id: 2, name: "Team B" },
        homeScore: null,
        awayScore: null,
      },
    ];
    const standings = calculateStandings(matches);

    assert.strictEqual(standings.length, 2);
    assert.strictEqual(standings[0].played, 0);
    assert.strictEqual(standings[0].points, 0);
    assert.strictEqual(standings[1].played, 0);
  });
  
  test("should accumulate stats correctly over multiple matches", () => {
      // Team A vs Team B: 2-0 (A: 3pts, +2GD; B: 0pts, -2GD)
      // Team A vs Team B: 1-1 (A: 4pts, +2GD; B: 1pts, -2GD)
      const matches = [
        {
          homeTeam: { id: 1, name: "Team A" },
          awayTeam: { id: 2, name: "Team B" },
          homeScore: 2,
          awayScore: 0,
        },
        {
          homeTeam: { id: 2, name: "Team B" },
          awayTeam: { id: 1, name: "Team A" },
          homeScore: 1, // Team B home
          awayScore: 1, // Team A away
        },
      ];
      const standings = calculateStandings(matches);
      
      const teamA = standings.find(t => t.teamName === "Team A");
      const teamB = standings.find(t => t.teamName === "Team B");
      
      assert.strictEqual(teamA.played, 2);
      assert.strictEqual(teamA.points, 4); // 3 + 1
      assert.strictEqual(teamA.won, 1);
      assert.strictEqual(teamA.drawn, 1);
      assert.strictEqual(teamA.goalsFor, 3); // 2 + 1
      assert.strictEqual(teamA.goalsAgainst, 1); // 0 + 1
      
      assert.strictEqual(teamB.played, 2);
      assert.strictEqual(teamB.points, 1); // 0 + 1
      assert.strictEqual(teamB.lost, 1);
      assert.strictEqual(teamB.drawn, 1);
  });
});
