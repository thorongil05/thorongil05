/**
 * @swagger
 * /api/instruments:
 *   get:
 *     summary: Retrieve instruments
 *     description: Returns the instruments.
 *     tags:
 *       - User
 *   post:
 *      summary: Create new instrument
 *      tags:
 *       - User
 * /api/instruments/{id}/prices:
 *   post:
 *    summary: Create prices
 *    tags:
 *     - User
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to retrieve
 */
