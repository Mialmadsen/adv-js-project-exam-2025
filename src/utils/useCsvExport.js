export function useCsvExport() {
  const esc = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }

  function downloadUserCsv(user, regs) {
    if (!user) return
    const rows = []
    const list = (regs && regs.length ? regs : [null])

    for (const r of list) {
      rows.push({
        uid: user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        emailVerified: user.emailVerified ? 'yes' : 'no',
        age: user.age ?? '',
        gender: user.gender || '',
        nationality: user.nationality || '',
        size: user.shirtSize ||'',
        raceTitle: r ? (r.raceTitle || r.raceId || '') : '',
        bib: r ? (r.bib ?? '') : '',
        regStatus: r ? (r.status || '') : '',
        regCreatedAt: r && r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toISOString() : ''
      })
    }

    const cols = [
      'uid','fullName','email','emailVerified','age','gender','nationality','size',
      'raceTitle','bib','regStatus','regCreatedAt'
    ]
    const header = cols.join(',')
    const body = rows.map(row => cols.map(k => esc(row[k])).join(',')).join('\n')
    const csv = header + '\n' + body

    const fileNameSafe = (user.fullName || user.email || 'user').replace(/[^a-z0-9-_]+/gi, '_')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileNameSafe}_${user.id}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

   function downloadUsersCsv(users) {
    const rows = (users || []).map((u) => {
      const createdISO =
        u.createdAt && u.createdAt.toDate ? u.createdAt.toDate().toISOString()
        : u.createdAt && u.createdAt.seconds ? new Date(u.createdAt.seconds * 1000).toISOString()
        : ''
      return {
        uid: u.id,
        fullName: u.fullName || '',
        email: u.email || '',
        emailVerified: u.emailVerified ? 'yes' : 'no',
        age: u.age ?? '',
        gender: u.gender || '',
        nationality: u.nationality || '',
       size: u.shirtSize ||'',
        registrationsCount: u.registrationsCount ?? 0,
        createdAt: createdISO
      }
    })

    const cols = [
      'uid','fullName','email','emailVerified','age','gender',
      'nationality','size','registrationsCount','createdAt'
    ]
    const header = cols.join(',')
    const body = rows.map(r => cols.map(k => esc(r[k])).join(',')).join('\n')
    const csv = header + '\n' + body

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // NEW: export many users -> JSON
  function downloadUsersJson(users) {
    const cleaned = (users || []).map((u) => {
      const createdISO =
        u.createdAt && u.createdAt.toDate ? u.createdAt.toDate().toISOString()
        : u.createdAt && u.createdAt.seconds ? new Date(u.createdAt.seconds * 1000).toISOString()
        : null
      return {
        uid: u.id,
        fullName: u.fullName || null,
        email: u.email || null,
        emailVerified: !!u.emailVerified,
        age: u.age ?? null,
        gender: u.gender || null,
        nationality: u.nationality || null,
        size: u.shirtSize ||'',
        registrationsCount: u.registrationsCount ?? 0,
        createdAt: createdISO
      }
    })

    const blob = new Blob([JSON.stringify(cleaned, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    // keep existing
    downloadUserCsv,
    // new
    downloadUsersCsv,
    downloadUsersJson,
  }
}
