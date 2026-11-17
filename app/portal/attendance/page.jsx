import PortalShell from "../../../components/portal/PortalShell";
import AttendanceView from "../../../components/portal/AttendanceView";
import { getPortalData, fmtDate } from "../../../lib/portalData";

export const metadata = { title: "Attendance | MAF Tech Academy" };

export default async function Attendance() {
  const d = await getPortalData();
  const records = d.attendance.map((a) => ({
    id: a.id,
    date: String(a.class_date).slice(0, 10),
    present: !!a.present,
    label: fmtDate(a.class_date, { weekday: "long", day: "numeric", month: "short" }),
  }));
  return (
    <PortalShell active="attendance" role={d.profile?.role}>
      <AttendanceView pct={d.pct} present={d.present} absent={d.absent} total={d.attendance.length} records={records} error={!!d.error} />
    </PortalShell>
  );
}
