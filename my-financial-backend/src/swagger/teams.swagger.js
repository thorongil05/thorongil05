/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Retrieve all teams
 *     description: Returns a list of all teams.
 *     tags:
 *       - Teams
 *     responses:
 *       200:
 *         description: A list of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the team
 *                   name:
 *                     type: string
 *                     description: The name of the team
 *                   city:
 *                     type: string
 *                     description: The city of the team
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new team
 *     description: Creates a new team with the provided name and city.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the team
 *               city:
 *                 type: string
 *                 description: The city of the team
 *     responses:
 *       200:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created team
 *                 name:
 *                   type: string
 *                   description: The name of the team
 *                 city:
 *                   type: string
 *                   description: The city of the team
 *       500:
 *         description: Internal server error
 */
