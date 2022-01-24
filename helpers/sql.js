const { BadRequestError } = require("../expressError");


//Helper function for helping with SQL update queries
function sqlForUpdate(dataToUpdate, jsToSql) {
   const keys = Object.keys(dataToUpdate);


   if(keys.length === 0) throw BadRequestError("No Data");


   let sqlCols = keys.map((colName, idx) =>
   `"${jsToSql[colName]  || colName}"=$${idx + 1}`, );

   return {

    setCol: sqlCols.join(", "),
    values: Object.values(dataToUpdate)
   };




}


module.exports = {sqlForUpdate};