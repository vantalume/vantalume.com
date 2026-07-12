import mysql, {
  type Pool,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export type ConciergeLead = {
  id: string;
  createdAt: Date;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "whatsapp" | "either";
  message: string;
  transcript: Array<{ role: "visitor" | "assistant"; text: string }>;
  status: LeadStatus;
};

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

type LeadRow = RowDataPacket & {
  id: string;
  created_at: Date;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferred_contact: ConciergeLead["preferredContact"];
  message: string;
  transcript: string | ConciergeLead["transcript"];
  status: LeadStatus;
};

function mapLead(row: LeadRow): ConciergeLead {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    preferredContact: row.preferred_contact,
    message: row.message,
    transcript:
      typeof row.transcript === "string"
        ? JSON.parse(row.transcript)
        : row.transcript,
    status: row.status,
  };
}

export async function listConciergeLeads(options?: {
  status?: LeadStatus | "all";
  query?: string;
}) {
  global.vantalumeLeadTableReady ??= ensureLeadTable().catch((error) => {
    global.vantalumeLeadTableReady = undefined;
    throw error;
  });
  await global.vantalumeLeadTableReady;

  const clauses: string[] = [];
  const values: string[] = [];
  if (options?.status && options.status !== "all") {
    clauses.push("status = ?");
    values.push(options.status);
  }
  if (options?.query) {
    clauses.push("(name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ?)");
    const query = `%${options.query.slice(0, 100)}%`;
    values.push(query, query, query, query);
  }

  const [rows] = await getPool().execute<LeadRow[]>(
    `SELECT id, created_at, name, company, email, phone, preferred_contact, message, transcript, status
     FROM concierge_leads
     ${clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""}
     ORDER BY created_at DESC
     LIMIT 200`,
    values,
  );
  return rows.map(mapLead);
}

export async function updateConciergeLeadStatus(
  id: string,
  status: LeadStatus,
) {
  const [result] = await getPool().execute<ResultSetHeader>(
    "UPDATE concierge_leads SET status = ? WHERE id = ? LIMIT 1",
    [status, id],
  );
  return result.affectedRows === 1;
}
