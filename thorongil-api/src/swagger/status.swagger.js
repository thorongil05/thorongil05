/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Application status
 *     description: Returns the current application status.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Application is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                   example: 12345
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
