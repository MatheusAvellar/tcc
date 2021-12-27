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

////// INFO //////
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

////// COUNT //////
app.get("/count/:table", (req, res) => {
  res.type("json");
  countRows(req.params).then(data => {
    res.send({ count: data });
  });
});

// List of values
app.get("/count/:table/:column/!/list/:a", (req, res) => {
  res.type("json");
  countValues(req.params, ["not", "list"]).then(data => {
    res.send({ data: data });
  });
});
app.get("/count/:table/:column/list/:a", (req, res) => {
  res.type("json");
  countValues(req.params, ["list"]).then(data => {
    res.send({ data: data });
  });
});

// NOT between two values
app.get("/count/:table/:column/:a/:b/:c", (req, res) => {
  res.type("json");
  countValues(req.params, ["not", "range"]).then(data => {
    res.send({ data: data });
  });
});

// Custom ('= 10', '! null', between 1 and 10, ...)
app.get("/count/:table/:column/:a/:b", (req, res) => {
  res.type("json");
  countValues(req.params, []).then(data => {
    res.send({ data: data });
  });
});


////// DISTINCT //////
app.get("/distinct/:table/:column/:a/:b", (req, res) => {
  res.type("json");
  getDistinctValues(req.params, ["range"]).then(data => {
    res.send({ data: data });
  });
});

app.get("/distinct/:table/:column", (req, res) => {
  res.type("json");
  getDistinctValues(req.params, []).then(data => {
    res.send({ data: data });
  });
});


////// CONSISTENCY //////
app.get("/consistent/:table/:in_columns/:out_columns", (req, res) => {
  res.type("json");
  getConsistency(req.params, []).then(data => {
    res.send({ data: data });
  });
});


////// PRECISION //////
app.get("/precision/:table/:column", (req, res) => {
  res.type("json");
  getPrecision(req.params, []).then(data => {
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

async function countValues(params, type) {
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

  if("b" in params) {
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

  if(type.includes("list")) {
    if(type.includes("not")) {
      // User is requesting "count if not in this list of values"
      const list = params.a.split(",").map(l => `'${l}'`).join(", ");
      return await db.all(`SELECT count(*) as "${params.column}-count" FROM "${params.table}"
        WHERE ${params.column} NOT IN (${list}) LIMIT 100;`);
    }
    // User is requesting "count if in this list of values"
    const list = params.a.split(",").map(l => `'${l}'`).join(", ");
    return await db.all(`SELECT count(*) as "${params.column}-count" FROM "${params.table}"
      WHERE ${params.column} IN (${list}) LIMIT 100;`);
  }
}

async function getDistinctValues(params, type) {
  const filtered = Object.values(params).filter(v => null !== v.match(protecregex));
  if(filtered.length > 0) {
    console.log("[getDistinctValues] protected");
    return [];
  }

  console.log("[getDistinctValues]", params);

  if("a" in params && "b" in params) {
    return await db.all(`SELECT DISTINCT "${params.column}"
      FROM "${params.table}"
      WHERE ${params.column} NOT BETWEEN ${params.a} AND ${params.b}
      LIMIT 100;`);
  }
  return await db.all(`SELECT DISTINCT "${params.column}"
    FROM "${params.table}"
    ORDER BY ${params.column} DESC
    LIMIT 100;`);
}

async function getConsistency(params) {
  const filtered = Object.values(params).filter(v => null !== v.match(protecregex));
  if(filtered.length > 0) {
    console.log("[getConsistency] protected");
    return [];
  }

  console.log("[getConsistency]", params);

  // Params: /:table/:in_columns/:out_columns

  // Get greatest differences (both on positive and negative sides)
  const diff = await db.all(`SELECT
      min((${params.out_columns}) - (${params.in_columns})) as negative,
      max((${params.out_columns}) - (${params.in_columns})) as positive
    FROM "${params.table}" LIMIT 100;`);

  // Get inconsistency count
  const diffcount = await db.all(`SELECT count(DIFF) as count from (
      SELECT (${params.out_columns}) - (${params.in_columns}) as DIFF
      FROM "${params.table}"
      WHERE DIFF <> 0
    ) LIMIT 100;`);

  // ex.:
  /* {
    "name": "NO+NO2=NOx",
    "diff": {
      "negative": -211.2,
      "positive": 187.22
    },
    "count": 184519
  } */
  return {
    "name": `${params.in_columns}=${params.out_columns}`,
    "diff": diff[0],
    ...diffcount[0]
  };
}

async function getPrecision(params) {
  const filtered = Object.values(params).filter(v => null !== v.match(protecregex));
  if(filtered.length > 0) {
    console.log("[getPrecision] protected");
    return [];
  }

  console.log("[getPrecision]", params);

  return await db.all(`SELECT max(
    length(
      substr(
        cast(${params.column} as text),
        instr(cast(${params.column} as text), '.')+1)
      )
    ) as "${params.column}-precision" FROM "${params.table}" LIMIT 100;`);
}