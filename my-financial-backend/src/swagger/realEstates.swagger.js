/**
 * @swagger
 * components:
 *   schemas:
 *     RealEstateInfo:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: Villa
 *         address:
 *           type: string
 *           example: Via Zanda 1
 *         location:
 *           type: string
 *           example: Periferia
 *         city:
 *           type: string,
 *           example: Lucca
 *         area:
 *           type: number,
 *           example: 80
 *         price:
 *           type: number,
 *           example: 100000
 *         referenceDate:
 *           type: string
 *           format: date
 *           example: 2025-12-27
 */

/**
 * @swagger
 * /api/real-estates:
 *   post:
 *      summary: Create new real estate info
 *      tags:
 *       - User
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RealEstateInfo'
 *      responses:
 *       200:
 *         description: Real Estate Info added
 *   get:
 *      summary: Retrieve real estate info
 *      tags:
 *       - User
 *      responses:
 *       200:
 *         description: Real Estate info retrieved
 */
