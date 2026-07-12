import mysql, { type Pool, type ResultSetHeader } from "mysql2/promise";

declare global {
  var vantalumeDatabasePool: Pool | undefined;
  var vantalumeLeadTableReady: Promise<void> | undefined;
}

function required(name: "DB_HOST" | "DB_NAME" | "DB_USER" | "DB_PASSWORD") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function getPool() {
  if (!global.vantalumeDatabasePool) {
    global.vantalumeDatabasePool = mysql.createPool({
      host: required("DB_HOST"),
      port: Number(process.env.DB_PORT || 3306),
      database: required("DB_NAME"),
      user: required("DB_USER"),
      password: required("DB_PASSWORD"),
      charset: "utf8mb4",
      connectionLimit: 5,
      enableKeepAlive: true,
      waitForConnections: true,
      queueLimit: 20,
    });
  }
  return global.vantalumeDatabasePool;
}

async function ensureLeadTable() {
  await getPool().execute(`
    CREATE TABLE IF NOT EXISTS concierge_leads (
      id CHAR(36) NOT NULL PRIMARY KEY,
      created_at DATETIME(3) NOT NULL,
      source VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      company VARCHAR(150) NOT NULL DEFAULT '',
      email VARCHAR(254) NOT NULL DEFAULT '',
      phone VARCHAR(40) NOT NULL DEFAULT '',
      preferred_contact ENUM('email','phone','whatsapp','either') NOT NULL,
      message TEXT NOT NULL,
      transcript JSON NOT NULL,
      consented_at DATETIME(3) NOT NULL,
      status ENUM('new','contacted','qualified','closed') NOT NULL DEFAULT 'new',
      INDEX idx_concierge_leads_created_at (created_at),
      INDEX idx_concierge_leads_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

export async function saveConciergeLead(input: {
  id: string;
  createdAt: Date;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "whatsapp" | "either";
  message: string;
  transcript: Array<{ role: "visitor" | "assistant"; text: string }>;
}) {
  global.vantalumeLeadTableReady ??= ensureLeadTable().catch((error) => {
    global.vantalumeLeadTableReady = undefined;
    throw error;
  });
  await global.vantalumeLeadTableReady;

  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO concierge_leads
      (id, created_at, source, name, company, email, phone, preferred_contact, message, transcript, consented_at)
     VALUES (?, ?, 'website-concierge', ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.id,
      input.createdAt,
      input.name,
      input.company,
      input.email,
      input.phone,
      input.preferredContact,
      input.message,
      JSON.stringify(input.transcript),
      input.createdAt,
    ],
  );

  if (result.affectedRows !== 1) throw new Error("Lead was not inserted");
}
