import fs from "fs";
import path from "path";

export type AlertConfig = {
  active: boolean;
  message: string;
  severity: "info" | "warning" | "critical";
  id: string;
};

const defaultAlert: AlertConfig = {
  active: false,
  message: "",
  severity: "info",
  id: "default",
};

export function getAlertConfig(): AlertConfig {
  try {
    const p = path.join(process.cwd(), "content/alert.json");
    const raw = fs.readFileSync(p, "utf8");
    return { ...defaultAlert, ...JSON.parse(raw) };
  } catch {
    return defaultAlert;
  }
}
