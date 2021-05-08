const sqlite3 = require('sqlite3').verbose()
let db

// 连接数据库
function connectDB() {
  if (!db || !db.open) {
    db = new sqlite3.Database('lianbi.db')
    console.log('connect success !!!')
  }
  return db
}

// 初始化数据表
export const initTable_backup = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()
    db.serialize(() => {

      let createTableSQL = `create table if not exists t_products (
                             id integer primary key autoincrement,
                             product_name varchar(100) not null,
                             price float not null)`
      db.run(createTableSQL)

      resolve()
    })
  })
}

export const queryAllTree_backup = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()
    db.all('select id, name, fatherId from TreeTable order by fatherId', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryAllProduct_backup = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()
    db.all('select id, name from ProductTable', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const insertProduct_backup = (product) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()
    let prepare = db.prepare('replace into ProductTable (id, name) values (?, ?)')
    prepare.run(product.id, product.name)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}


/****************Mengyl*******************/
// 表创建
function createTableLBSymbols() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_symbols (
                             id integer primary key autoincrement not null,
                             code varchar(100) not null,
                             name varchar(255),
                             fullname varchar(255),
                             logo varchar(500),
                             market varchar(255),
                             symbol varchar(255),
                             status integer not null,
                             is_hot integer not null,
                             display_name varchar(255),
                             introduction_id integer not null,
                             is_pay integer not null,
                             platform varchar(255),
                             is_collect integer null,
                             price_precision integer,
                             amount_precision integer,
                             value_precision integer)`
    db.run(createTableSQL)

  })
}

function createTableLBNote() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_note (
                             id integer primary key autoincrement not null,
                             type integer,
                             title varchar(255) not null,
                             content varchar(255) not null,
                             code varchar(255) not null,
                             market varchar(255) not null,
                             symbol varchar(255) not null,
                             create_at integer,
                             is_public integer not null,
                             direction integer,
                             transaction_time integer,
                             transaction_price float,
                             transaction_amount float,
                             association_type varchar(255) not null)`
    db.run(createTableSQL)

  })
}

function createTableLBTree() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_tree (
                             t_id integer primary key autoincrement not null,
                             user_id integer not null,
                             node varchar(255) not null,
                             serve_id integer)`
    db.run(createTableSQL)

  })
}

function createTableLBFuncs() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_funcs (
                             i_id integer primary key autoincrement not null,
                             user_id integer not null,
                             tree_id integer not null,
                             tree_node varchar(1000) not null,
                             ID varchar(1000) not null,
                             Name varchar(1000) not null,
                             Type integer,
                             IsMainIndex integer,
                             Description varchar(1000),
                             FloatPrecision integer,
                             Args varchar(1000),
                             Script varchar(1000),
                             ArgsList varchar(1000))`
    db.run(createTableSQL)

  })
}

function createTableLBPlate() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_plate (
                             p_id integer primary key autoincrement not null,
                             id integer not null,
                             plate_name varchar(255) not null,
                             plate_explain varchar(1000),
                             user_id integer,
                             create_at not null)`
    db.run(createTableSQL)

  })
}

function createTableLBPlateDetail() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_plate_detail (
                             d_id integer primary key autoincrement not null,
                             id integer not null,
                             code varchar(255) not null,
                             name varchar(255) not null,
                             fullname varchar(255) not null,
                             logo varchar(1000) not null,
                             market varchar(255) not null,
                             symbol varchar(255) not null,
                             status integer not null,
                             is_hot integer not null,
                             display_name varchar(255) not null,
                             introduction_id integer not null,
                             is_pay integer not null,
                             platform varchar(255) not null,
                             is_query integer not null,
                             price_precision integer not null,
                             amount_precision integer not null,
                             value_precision integer not null,
                             is_collect integer not null,
                             plate_id integer not null)`
    db.run(createTableSQL)

  })
}

function createTableLBScriptIndex() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = 'create table if not exists lb_script_index (id integer primary key autoincrement not null, user_id integer not null, `Index` integer not null, Period integer not null, WindowIndex varchar(2000) not null)'
    db.run(createTableSQL)

  })
}

function createTableLBContract() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = 'create table if not exists lb_contract (id integer primary key autoincrement not null, symbol varchar(255), type varchar(255), contract_code varchar(255), contract_type varchar(255), contract_short_type varchar(255), contract_size integer, price_tick varchar(255), contract_status integer, delivery_date integer, create_date integer, settlement_date integer,`index` integer)'
    db.run(createTableSQL)

  })
}

function createTablePaint() {
  let db = connectDB()
  db.serialize(() => {

    let createTableSQL = `create table if not exists lb_paint (
                             id integer primary key autoincrement not null,
                             user_id integer not null,
                             currency_id integer not null,
                             symbol varchar(255) not null,
                             period integer not null,
                             type varchar(255) not null,
                             paintInfo varchar(1000) not null)`
    db.run(createTableSQL)

  })
}

createTableLBSymbols()
createTableLBNote()
createTableLBTree()
createTableLBFuncs()
createTableLBPlate()
createTableLBPlateDetail()
createTableLBScriptIndex()
createTableLBContract()
// createTablePaint()

// 批量插入 币种表
export const batchInsertCurrency = (list) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.serialize(() => {
      console.log('币种batchInsertCurrency::: ', list[0].id, list)

      db.run('begin transaction')

      for (let i = 0; i < list.length; i++) {
        db.run(`INSERT INTO "lb_symbols"("id", "code", "name", "fullname", "logo", "market", "symbol", "status", "is_hot", "display_name", "introduction_id", 
              "is_pay", "platform","is_collect","price_precision","amount_precision","value_precision") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          list[i].id, list[i].code, list[i].name, list[i].fullname, list[i].logo, list[i].market, list[i].symbol, list[i].status, list[i].is_hot, list[i].display_name,
          list[i].introduction_id, list[i].is_pay, list[i].platform, null, list[i].price_precision, list[i].amount_precision, list[i].value_precision)
      }

      db.run('commit')

    })
    resolve()
  })
}

// 获取 币种表 总条数
export const getCount = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`select count(*) as count from lb_symbols`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })

  })
}

// 根据条件 查询 币种表
export const queryCurrency = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`select * from lb_symbols where "market" = "${params.market}" limit (${params.page} - 1)*15,15`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 获取 自选表
export const queryCollect = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`select * from lb_symbols where "is_collect" = "1"`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 获取 笔记表 总条数
export const getNoteCount = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`select count(*) as count from lb_note`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })

  })
}

// 根据条件 查询 笔记表
export const queryNote = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    let sqlStr = `select * from lb_note `

    if (params.code && !params.title) {
      sqlStr += `where "code" = "${params.code}" `
    }

    if (params.title && !params.code) {
      sqlStr += `where "title" = "${params.title}" `
    }

    if (params.code && params.title) {
      sqlStr += `where "code" = "${params.code}" and "title" = "${params.title}" `
    }

    sqlStr += `limit (${params.page} - 1)*10,10`

    db.all(sqlStr, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 添加笔记
export const insertNote = (list, single) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.serialize(() => {
      console.log('插入笔记:::: ', list)

      db.run('begin transaction')

      if (!single) {  // 批量插入
        for (let i = 0; i < list.length; i++) {
          db.run(`INSERT INTO "lb_note"("id", "type", "title", "content", "code", "market", "symbol", "create_at", "is_public", "direction","transaction_time","transaction_price","transaction_amount", "association_type")
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            list[i].id, list[i].type, list[i].title, list[i].content, list[i].code, list[i].market, list[i].symbol, list[i].create_at, list[i].is_public, list[i].direction, list[i].transaction_time, list[i].transaction_price, list[i].transaction_amount, list[i].association_type)
        }
      }

      if (single === 'single') { // 插入一行
        for (let i = 0; i < list.length; i++) {
          db.run(`INSERT INTO "lb_note"("type", "title", "content", "code", "market", "symbol", "create_at", "is_public", "direction","transaction_time","transaction_price","transaction_amount", "association_type")
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            list[i].type, list[i].title, list[i].content, list[i].code, list[i].market, list[i].symbol, list[i].create_at, list[i].is_public, list[i].direction, list[i].transaction_time, list[i].transaction_price, list[i].transaction_amount, list[i].association_type)
        }
      }

      db.run('commit')

    })
    resolve()
  })
}

// 编辑笔记
export const updateNote = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.serialize(() => {
      console.log('updateNote:::: ', params.type)

      db.run('begin transaction')

      let sqlStr = `UPDATE "lb_note" SET type = "${params.type}", title = "${params.title}", content = "${params.content}", code = "${params.code}", market = "${params.market}", symbol = "${params.symbol}", association_type = "${params.association_type}"`

      if (Number(params.type) === 1) {
        sqlStr += `, create_at = '${params.create_at}', is_public = ${params.is_public}, direction = ${params.direction}, transaction_time = ${params.transaction_time}, transaction_price = ${params.transaction_price}, transaction_amount = ${params.transaction_amount}`
      } else {
        sqlStr += `, create_at = 0, is_public = 0, direction = '', transaction_time = 0, transaction_price = 0, transaction_amount = 0`
      }

      sqlStr += ` WHERE id = ${params.id};`
      db.run(sqlStr)

      db.run('commit')

    })
    resolve()
  })
}

// 删除笔记
export const deleteNoteRow = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.serialize(() => {

      db.run('begin transaction')

      const sqlStr = `DELETE FROM "lb_note" WHERE id=${params.id}`
      db.run(sqlStr, (err, rows) => {
        if (err) reject(err)
        resolve('删除成功')
      })

      db.run('commit')

    })

  })
}

// 批量插入 指标树表
export const batchInsertTree = (list, user) => {
  return new Promise((resolve, reject) => {
    if (!user) return
    let db = connectDB()

    db.serialize(() => {
      console.log('批量插入指标树::: ', list, user)
      db.run('begin transaction')

      for (let i = 0; i < list.length; i++) { // 树分类
        db.run(`INSERT INTO "lb_tree"("user_id", "node", "serve_id") VALUES (?, ?, ?)`, JSON.parse(user).id, list[i].node, 0)
      }

      db.run('commit')

    })
    resolve()
  })
}

// 获取 指标树表 总条数
export const getTreeCount = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT count(*) as count FROM "lb_tree"`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })

  })
}

// 查询 指标树表
export const queryTree = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT * FROM "lb_tree"`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 批量插入 指标公式表
export const batchInsertFuncs = (params, tree_id, tree_node, user) => {
  return new Promise((resolve, reject) => {
    if (!user) return
    let db = connectDB()

    db.serialize(() => {
      console.log('batchInsertFuncs 插入指标::: ', params, tree_id, tree_node, JSON.parse(user).id)
      db.run('begin transaction')

      db.run(`INSERT INTO "lb_funcs"("user_id", "tree_id", "tree_node", "ID", "Name", "Type", "IsMainIndex", "Description", "FloatPrecision", "Args", "Script", "ArgsList")
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        JSON.parse(user).id, tree_id, tree_node, params.id, params.name, null, null, null, null, null, null, null)

      db.run('commit')

    })
    resolve()
  })
}

// 插入 指标公式表
export const insertFuncs = (params, user) => {
  return new Promise((resolve, reject) => {
    if (!user) return
    let db = connectDB()

    db.serialize(() => {
      console.log('插入指标::: ', params, user)
      db.run('begin transaction')

      db.run(`INSERT INTO "lb_funcs"("user_id", "tree_id", "tree_node", "ID", "Name", "Type", "IsMainIndex", "Description", "FloatPrecision", "Args", "Script", "ArgsList")
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        JSON.parse(user).id, params.tree_id, params.tree_node, params.ID, params.Name, params.Type, params.IsMainIndex, params.Description, params.FloatPrecision, params.Args, params.Script, params.ArgsList)

      db.run('commit')

    })
    resolve()
  })
}

// 编辑 指标公式表
export const updateFuncs = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    console.log('编辑updateFuncs::: ', params.Args, params.ArgsList)

    db.serialize(() => {

      db.run('begin transaction')

      const sqlStr = `UPDATE "lb_funcs" SET type = ${params.Type}, IsMainIndex = ${params.IsMainIndex}, Description = "${params.Description}",
       FloatPrecision = ${params.FloatPrecision}, Args = '${JSON.stringify(params.Args)}', ArgsList = '${JSON.stringify(params.ArgsList)}', Script = "${params.Script}" WHERE Name = "${params.Name}";`

      db.run(sqlStr, (err, rows) => {
        console.log('修改错误提示::: ', err)
        if (err) reject(err)
        resolve(rows || [])
      })

      db.run('commit')

    })
    resolve()
  })
}

// 删除 指标公式
export const deleteFuncs = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.serialize(() => {

      db.run('begin transaction')

      const sqlStr = `DELETE FROM "lb_funcs" WHERE Name = "${params}"`
      db.run(sqlStr, (err, rows) => {
        if (err) reject(err)
        resolve('删除成功')
      })

      db.run('commit')

    })

  })
}

// 查询 指标公式表
export const queryFuncs = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT * FROM "lb_funcs"`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 批量插入 板块表
export const batchInsertPlateClassify = (list, user) => {
  return new Promise((resolve, reject) => {
    if (!user) return
    let db = connectDB()

    db.serialize(() => {
      console.log('插入模板::: ', list, JSON.parse(user).id)
      db.run('begin transaction')

      for (let i = 0; i < list.length; i++) {
        db.run(`INSERT INTO "lb_plate"("id","plate_name", "plate_explain", "user_id", "create_at") VALUES (?, ?, ?, ?, ?)`,
          list[i].id, list[i].plate_name, list[i].plate_explain, JSON.parse(user).id, list[i].create_at)
      }

      db.run('commit')

    })
    resolve()
  })
}

// 获取 板块表 总条数
export const getPlateCount = () => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT count(*) as count FROM "lb_plate"`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })

  })
}

// 查询 板块表
export const queryPlateClassify = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT * FROM "lb_plate"`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 批量插入 板块列表 表
export const batchInsertPlateList = (list, plateId) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.serialize(() => {

      db.run('begin transaction')

      for (let i = 0; i < list.length; i++) {
        db.run(`INSERT INTO "main"."lb_plate_detail"("id", "code", "name", "fullname", "logo", "market", "symbol", "status", "is_hot", "display_name", "introduction_id", 
                "is_pay", "platform", "is_query", "price_precision", "amount_precision", "value_precision", "is_collect", "plate_id") 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          list[i].id, list[i].code, list[i].name, list[i].fullname, list[i].logo, list[i].market, list[i].symbol, list[i].status, list[i].is_hot, list[i].display_name,
          list[i].introduction_id, list[i].is_pay, list[i].platform, list[i].is_query, list[i].price_precision, list[i].amount_precision, list[i].value_precision, list[i].is_collect, plateId)
      }

      db.run('commit')

    })

    resolve()

  })
}

// 获取 板块列表表 总条数
export const getPlateDetailCount = (plateId) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT count(*) as count FROM "lb_plate_detail" WHERE plate_id = ${plateId}`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })

  })
}

// 查询 板块列表 表
export const queryPlateList = (params) => {
  return new Promise((resolve, reject) => {
    let db = connectDB()

    db.all(`SELECT * FROM "lb_plate_detail" WHERE plate_id = "${params.plate_id}" limit (${params.page} - 1)*15,15`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

// 插入 用户自定义指标参数 表
export const insertScriptIndex = (params, userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) return
    let db = connectDB()

    db.serialize(() => {
      console.log('用户自定义指标参数::: ', params, userId)
      db.run('begin transaction')

      db.run(`INSERT INTO "lb_script_index"("user_id", "Index", "Period", "WindowIndex") VALUES (?, ?, ?, ?)`,
        userId, params.Index, params.Period, JSON.stringify(params.WindowIndex))

      db.run('commit')

    })

    resolve()

  })
}

// 查询 用户自定义指标参数 表
export const queryUserCustomIndex = (period, userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) return
    let db = connectDB()

    db.all(`SELECT * FROM "lb_script_index" WHERE Period = ${period} AND user_id = ${userId}`, (err, rows) => {
      if (err) reject(err)
      resolve(rows || null)
    })

  })
}

// 编辑 用户自定义指标 表
export const updateScriptIndex = (params, userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) return
    let db = connectDB()

    db.serialize(() => {

      db.run('begin transaction')

      const sqlStr = `UPDATE "lb_script_index" SET WindowIndex = '${JSON.stringify(params.WindowIndex)}' WHERE Period = ${params.Period} AND user_id = ${userId}`

      db.run(sqlStr, (err, rows) => {
        if (err) reject(err)
        resolve(rows || [])
      })

      db.run('commit')

    })
  })
}

export const closeDB = () => {
  console.log('connect close...')
  if (db) db.close()
}
