const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3");
const sq = require("sqlite");
const DBPATH = "../dados-horarios.db";
const app = express();
const PORT = 3000;

const protecregex = new RegExp(/(--|'|"|`|;)/gi);

let db;
sq.open({
  filename: DBPATH,
  driver: sqlite3.cached.Database,
  mode: sqlite3.OPEN_READONLY
}).then((res) => {
  console.log("Opened connection to DB");
  db = res;
});

// Express stuff
app.get("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/db.conf.json", (req, res) => {
  res.sendFile(path.join(__dirname, "db.conf.json"));
});

app.get("/info/tables", (req, res) => {
  res.type("json");
  getTables().then(tables => {
    res.send({ tables: tables });
  });
});

app.get("/info/cols/:table", (req, res) => {
  res.type("json");
  getColumnNames(req.params.table).then(data => {
    res.send({ columns: data });
  });
});

app.get("/count/:table", (req, res) => {
  res.type("json");
  countRows(req.params).then(data => {
    res.send({ count: data });
  });
});

app.get("/count/:table/:column/:a/:b/:c", (req, res) => {
  res.type("json");
  countValues(req.params).then(data => {
    res.send({ data: data });
  });
});
app.get("/count/:table/:column/:a/:b", (req, res) => {
  res.type("json");
  countValues(req.params).then(data => {
    res.send({ data: data });
  });
});



app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`)
});

////////////////////////////

async function getTables() {
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table';`);
  const filtered = tables.filter(o => !o.name.startsWith("sqlite"))
  console.log("[getTableInfo]", filtered);
  return filtered;
}

async function getColumnNames(table) {
  if(table.match(protecregex)) {
    console.log("[getColumnNames] protected");
    return [];
  }

  // Placeholders don't seem to work on this library
  // This is very bad and unsafe
  const columns = await db.all(`pragma table_info("${table}");`);
  columns.forEach(c => {
    delete c.cid;
    delete c.dflt_value;
  });
  console.log("[getColumnNames]", columns);
  return columns;
}

// [Ref] stackoverflow.com/a/175787/4824627
function isNumeric(str) {
  if(typeof str !== "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

async function countRows(params) {
  const filtered = Object.values(params).filter(v => null !== v.match(protecregex));
  if(filtered.length > 0) {
    console.log("[countRows] protected");
    return [];
  }

  const rowcount = (await db.all(`SELECT count(3) as count from "${params.table}";`))[0].count;
  console.log("[countRows]", rowcount);
  return rowcount;
}

async function countValues(params) {
  const filtered = Object.values(params).filter(v => null !== v.match(protecregex));
  if(filtered.length > 0) {
    console.log("[countValues] protected");
    return [];
  }

  console.log("[countValues]", params);

  // User is requesting "count not between"
  if("c" in params) {
    if(params.a === "!") {
      return await db.all(`SELECT count(*) as "${params.column}-count" FROM "${params.table}"
        WHERE ${params.column} NOT BETWEEN ${params.b} AND ${params.c}
        LIMIT 100;`);
    } else {
      console.log("[countValues] unimplemented");
      return [];
    }
  }
  // User is requesting "count between"
  if(isNumeric(params.a) && isNumeric(params.b)) {
    return await db.all(`SELECT count(*) as "${params.column}-count" FROM "${params.table}"
      WHERE ${params.column} BETWEEN ${params.a} AND ${params.b}
      LIMIT 100;`);
  }
  if(params.b.toLowerCase() === "null") {
    const isorisnt = params.a === "!" ? "NOT" : "";
    return await db.all(`SELECT count(*) as "${params.column}-count" FROM "${params.table}"
      WHERE ${params.column} IS ${isorisnt} NULL LIMIT 100;`);
  }
  // User is requesting "<operation> <value>" (eg. '= 100')
  return await db.all(`SELECT count(*) as "${params.column}-count" FROM "${params.table}"
    WHERE ${params.column} ${params.a} ${params.b} LIMIT 100;`);
}