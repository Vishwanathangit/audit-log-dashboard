const fs = require("fs");
const path = require("path");

const actors = [
  "priya.nair@company.com", "arjun.k@company.com", "sara.j@company.com",
  "mohammed.a@company.com", "kevin.lee@company.com", "anita.rao@company.com",
  "david.wilson@company.com", "fatima.z@company.com", "ryan.smith@company.com",
  "neha.gupta@company.com"
];
const roles = ["admin", "editor", "viewer"];
const actions = [
  "DELETE_USER", "CREATE_USER", "UPDATE_USER", "LOGIN", "LOGOUT",
  "READ_FILE", "CREATE_FILE", "UPDATE_FILE", "DELETE_FILE", "UPDATE_DATABASE"
];
const resourceTypes = ["USER", "FILE", "SYSTEM", "API", "DATABASE"];
const regions = ["ap-south-1", "us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];
const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const statuses = ["Resolved", "Unresolved"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomIp() {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomTimestamp() {
  const start = new Date("2025-01-01").getTime();
  const end = new Date("2025-12-31").getTime();
  const random = new Date(start + Math.random() * (end - start));
  return random.toISOString();
}

function generateRecord() {
  const actor = randomItem(actors);
  const action = randomItem(actions);
  const resourceType = randomItem(resourceTypes);
  return {
    actor,
    role: randomItem(roles),
    action,
    resource: `/api/${resourceType.toLowerCase()}s/${Math.floor(Math.random() * 999)}`,
    resourceType,
    ipAddress: randomIp(),
    region: randomItem(regions),
    severity: randomItem(severities),
    status: randomItem(statuses),
    timestamp: randomTimestamp(),
  };
}

const TOTAL = 10000;
const headers = "actor,role,action,resource,resourceType,ipAddress,region,severity,status,timestamp";
const rows = [headers];

for (let i = 0; i < TOTAL; i++) {
  const r = generateRecord();
  rows.push(`${r.actor},${r.role},${r.action},${r.resource},${r.resourceType},${r.ipAddress},${r.region},${r.severity},${r.status},${r.timestamp}`);
}

const outputPath = path.join(__dirname, "test-logs-10000.csv");
fs.writeFileSync(outputPath, rows.join("\n"));
console.log(`Generated ${TOTAL} records to ${outputPath}`);
