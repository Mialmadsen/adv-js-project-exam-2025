export function useUserStats() {
  function buildStats(users = []) {
    const u = users.filter(Boolean)
    const total = u.length

    // registered = has registrationsCount > 0

    const registered = u.filter((x) => !!x.registered).length

    const nonregistered = total - registered

    const verified = u.filter((x) => !!x.emailVerified).length
    const verifiedPct = total ? Math.round((verified / total) * 100) : 0

    // gender split
    const genderCounts = u.reduce((acc, x) => {
      const g = (x.gender || 'Unknown').toString()
      acc[g] = (acc[g] || 0) + 1
      return acc
    }, {})

    // nationality distribution (top 8 + “Other”)
    const natCountsRaw = u.reduce((acc, x) => {
      const n = (x.nationality || 'Unknown').toString()
      acc[n] = (acc[n] || 0) + 1
      return acc
    }, {})
    const natEntries = Object.entries(natCountsRaw).sort((a, b) => b[1] - a[1])
    const top = natEntries.slice(0, 8)
    const restCount = natEntries.slice(8).reduce((s, [, cnt]) => s + cnt, 0)
    if (restCount > 0) top.push(['Other', restCount])

    return {
      total,
      registered,
      nonregistered,
      verified,
      verifiedPct,
      genderCounts,
      nationalityCounts: top,
    }
  }

  return { buildStats }
}
