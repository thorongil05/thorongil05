/**
 * @swagger
 * /api/competitions:
 *   get:
 *     summary: Retrieve all competitions
 *     description: Returns a list of all competitions.
 *     tags:
 *       - Competitions
 *     responses:
 *       200:
 *         description: A list of competitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the competition
 *                   name:
 *                     type: string
 *                     description: The name of the competition
 *                   country:
 *                     type: string
 *                     description: The country of the competition
 *                   type:
 *                     type: string
 *                     description: The type of competition (League, Cup, International)
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new competition
 *     description: Creates a new competition with the provided details.
 *     tags:
 *       - Competitions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the competition
 *               country:
 *                 type: string
 *                 description: The country of the competition
 *               type:
 *                 type: string
 *                 description: The type of competition (League, Cup, International)
 *     responses:
 *       200:
 *         description: Competition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created competition
 *                 name:
 *                   type: string
 *                   description: The name of the competition
 *                 country:
 *                   type: string
 *                   description: The country of the competition
 *                 type:
 *                   type: string
 *                   description: The type of competition (League, Cup, International)
 *       500:
 *         description: Internal server error
 */
