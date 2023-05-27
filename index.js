require("dotenv").config();
const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  // database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function main() {

  const client = await pool.connect();

  try{
    // data 폴더 내 파일명 추출
    const files = fs.readdirSync("data");
    
    // .xlsx 확장자가 붙은 파일명 추출
    const excelFiles = files.filter((file) => file.endsWith(".xlsx"));
    
    // .xlsx 확장자 제거
    const fileNamesWithoutExtension = excelFiles.map((file) => file.replace(".xlsx", ""));
    
    // xlsx 확장자 제거한 파일명으로 DATABASE 생성
    fileNamesWithoutExtension.forEach(async (fileName) => {
    // DATABASE 존재 여부 확인
      const is_database = await client.query(`SELECT EXISTS(SELECT datname FROM pg_database WHERE datname = '${fileName}')`);
      if (is_database.rows[0].exists) {
        console.log(`${fileName}는 이미 존재하는 데이터베이스입니다.`);
      } else {
        console.log(`${fileName} 데이터베이스를 생성합니다.`);
        // DATABASE 생성
        await client.query(`CREATE DATABASE ${fileName}`);
      }

      // 엑셀파일의 sheet 이름 추출
      

    });

  } catch (err) {
    console.log(err);
  }
  finally {
    client.release(); 
  }
}

main();