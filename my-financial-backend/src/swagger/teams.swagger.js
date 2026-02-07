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
 *         headers:
 *           Access-Control-Allow-Origin:
 *             schema:
 *               type: string
 *             description: CORS origin allowed
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
 *   options:
 *     summary: Get allowed methods for teams resource
 *     description: Returns the allowed HTTP methods and CORS headers for the teams resource.
 *     tags:
 *       - Teams
 *     responses:
 *       200:
 *         description: Success - returns allowed methods
 *         headers:
 *           Allow:
 *             schema:
 *               type: string
 *             description: Allowed HTTP methods
 *           Access-Control-Allow-Origin:
 *             schema:
 *               type: string
 *             description: CORS origin allowed
 *           Access-Control-Allow-Methods:
 *             schema:
 *               type: string
 *             description: CORS allowed methods
 *           Access-Control-Allow-Headers:
 *             schema:
 *               type: string
 *             description: CORS allowed headers
 *           Access-Control-Max-Age:
 *             schema:
 *               type: string
 *             description: CORS max age for preflight cache
 */
