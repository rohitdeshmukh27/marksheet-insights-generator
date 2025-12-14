export function analyzeStats(studentsRaw) {
  // studentsRaw is an array of objects with header keys
  if (!studentsRaw || studentsRaw.length === 0) return { error: "No data" };

  // Detect student name column heuristically
  const sample = studentsRaw[0];
  const keys = Object.keys(sample);
  let nameKey = keys.find((k) => /name|student/i.test(k)) || keys[0];

  // Subjects are other keys
  const subjectKeys = keys.filter((k) => k !== nameKey);

  // Normalize and convert numbers
  const students = studentsRaw.map((r) => {
    const s = { Student: r[nameKey] };
    subjectKeys.forEach((k) => {
      const raw = r[k] || "";
      const num = Number(String(raw).replace(/[^0-9.\-]/g, ""));
      s[k.trim()] = Number.isNaN(num) ? null : num;
    });
    return s;
  });

  const totals = [];
  const subjectStats = {};
  subjectKeys.forEach(
    (sub) =>
      (subjectStats[sub] = {
        sum: 0,
        count: 0,
        min: Infinity,
        max: -Infinity,
        values: [],
      })
  );

  students.forEach((st) => {
    let total = 0;
    let validCount = 0;
    subjectKeys.forEach((sub) => {
      const v = st[sub];
      if (typeof v === "number" && v !== null) {
        total += v;
        validCount++;
        const s = subjectStats[sub];
        s.sum += v;
        s.count += 1;
        s.values.push(v);
        if (v < s.min) s.min = v;
        if (v > s.max) s.max = v;
      }
    });
    totals.push({
      name: st.Student,
      total,
      avg: validCount ? total / validCount : null,
    });
  });

  const averages = {};
  Object.entries(subjectStats).forEach(([sub, s]) => {
    averages[sub] = s.count ? s.sum / s.count : null;
  });

  totals.sort((a, b) => (b.total || 0) - (a.total || 0));

  // Weak areas: subjects with average < 40 or relative low
  const weakSubjects = Object.entries(averages)
    .filter(([k, v]) => v !== null && v < 40)
    .map(([k, v]) => ({ subject: k, average: v }));

  // Trends: mean and std dev for subjects
  const trends = {};
  Object.entries(subjectStats).forEach(([sub, s]) => {
    const mean = s.count ? s.sum / s.count : null;
    const variance = s.count
      ? s.values.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / s.count
      : null;
    const sd = variance ? Math.sqrt(variance) : null;
    trends[sub] = {
      mean,
      min: s.min === Infinity ? null : s.min,
      max: s.max === -Infinity ? null : s.max,
      sd,
    };
  });

  return {
    students,
    subjectKeys,
    averages,
    topPerformers: totals.slice(0, 5),
    bottomPerformers: totals.slice(-5).reverse(),
    weakSubjects,
    trends,
    rawTotals: totals,
  };
}
