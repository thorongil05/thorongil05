/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Retrieve all matches
 *     description: Returns a list of all matches.
 *     tags:
 *       - Matches
 *     responses:
 *       200:
 *         description: A list of matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the match
 *                   match_date:
 *                     type: string
 *                     format: date
 *                     description: The date of the match
 *                   competition_id:
 *                     type: integer
 *                     description: The ID of the competition
 *                   home_team_id:
 *                     type: integer
 *                     description: The ID of the home team
 *                   away_team_id:
 *                     type: integer
 *                     description: The ID of the away team
 *                   home_goals:
 *                     type: integer
 *                     description: Goals scored by the home team
 *                   away_goals:
 *                     type: integer
 *                     description: Goals scored by the away team
 *                   stadium:
 *                     type: string
 *                     description: The stadium where the match was played
 *                   home_team_name:
 *                     type: string
 *                     description: The name of the home team
 *                   home_team_city:
 *                     type: string
 *                     description: The city of the home team
 *                   away_team_name:
 *                     type: string
 *                     description: The name of the away team
 *                   away_team_city:
 *                     type: string
 *                     description: The city of the away team
 *   post:
 *     summary: Create a new match
 *     description: Creates a new match with the provided details.
 *     tags:
 *       - Matches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matchDate
 *               - competitionId
 *               - homeTeamId
 *               - awayTeamId
 *             properties:
 *               matchDate:
 *                 type: string
 *                 format: date
 *                 description: The date of the match
 *               competitionId:
 *                 type: integer
 *                 description: The ID of the competition
 *               homeTeamId:
 *                 type: integer
 *                 description: The ID of the home team
 *               awayTeamId:
 *                 type: integer
 *                 description: The ID of the away team
 *               homeGoals:
 *                 type: integer
 *                 description: Goals scored by the home team
 *               awayGoals:
 *                 type: integer
 *                 description: Goals scored by the away team
 *               stadium:
 *                 type: string
 *                 description: The stadium where the match was played
 *     responses:
 *       200:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created match
 *                 match_date:
 *                   type: string
 *                   format: date
 *                   description: The date of the match
 *                 competition_id:
 *                   type: integer
 *                   description: The ID of the competition
 *                 home_team_id:
 *                   type: integer
 *                   description: The ID of the home team
 *                 away_team_id:
 *                   type: integer
 *                   description: The ID of the away team
 *                 home_goals:
 *                   type: integer
 *                   description: Goals scored by the home team
 *                 away_goals:
 *                   type: integer
 *                   description: Goals scored by the away team
 *                 stadium:
 *                   type: string
 *                   description: The stadium where the match was played
 *       500:
 *         description: Internal server error
 */
