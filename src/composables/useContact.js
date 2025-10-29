export function useContact() {
  /**
   * Open default mail client to contact a user.
   * @param {Object} user - { email, fullName }
   * @param {Object} [opts]
   * @param {string} [opts.subject] - Custom subject
   * @param {string[]} [opts.bodyLines] - Lines for the email body
   */
  function contactUser(user, opts = {}) {
    if (!user?.email) return

    const subject =
      opts.subject ?? `SwimRunIF — Account & registrations (${user.fullName || user.email})`

    const defaultBody = [
      `Hi ${user.fullName || ''},`,
      '',
      'This is the SwimRunIF admin team.',
      '',
      'Best,',
      'SwimRunIF Admin',
    ]
    const bodyLines = opts.bodyLines?.length ? opts.bodyLines : defaultBody

    const mailto = [
      `mailto:${encodeURIComponent(user.email)}`,
      `?subject=${encodeURIComponent(subject)}`,
      `&body=${encodeURIComponent(bodyLines.join('\n'))}`,
    ].join('')

    window.location.href = mailto
  }

  return { contactUser }
}
