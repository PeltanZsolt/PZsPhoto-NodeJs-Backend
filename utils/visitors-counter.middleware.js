const db = require('./database');

const visitorsCounterMiddleware = async (req, res, next) => {
   const ipAddress = req.body.ip;
   let visitorsCountResult;
   try {
      visitorsCountResult = await db.query(
         `INSERT INTO visitorscount (ipAddress) SELECT '${ipAddress}' WHERE NOT EXISTS (SELECT * FROM visitorscount WHERE ipAddress = '${ipAddress}');
         SELECT COUNT(*) FROM visitorscount`
      );
   } catch (error) {
      console.log(error.message);
   }
   if (!visitorsCountResult[0][0]) {
      let incrementedVisitorsCountResult;
      try {
         incrementedVisitorsCountResult = await db.query(
            `INSERT INTO visitorsCount (ipAddress) VALUES (?)`,
            [ipAddress]
         );
      } catch (error) {
         console.log(error);
      }
   }
   req.visitorsCount = visitorsCountResult[0][1][0]['COUNT(*)']
   next();
};

module.exports = visitorsCounterMiddleware;
