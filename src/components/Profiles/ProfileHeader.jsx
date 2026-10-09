import React from 'react'
import moment from 'moment'
import { Mail, Phone, Cake, CalendarCheck, UserRound, Hash, PiggyBank, Landmark, TrendingUp, Banknote } from 'lucide-react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import { formatUGX } from '../../utils/currency'
import { ownerName } from '../../utils/names'
import { cn } from '../../lib/utils'

const Detail = ({ icon: Icon, label, children }) => (
  <span className="flex min-w-0 items-center gap-2 text-sm text-custom-text-secondary" title={label}>
    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
    <span className="sr-only">{label}: </span>
    <span className="truncate text-custom-text-primary">{children}</span>
  </span>
)

const Pill = ({ tone = 'neutral', children }) => (
  <span className={cn(
    'inline-flex h-6 items-center rounded-full px-2 text-xs font-medium',
    tone === 'good' && 'bg-green-500/10 text-green-700 dark:text-green-400',
    tone === 'warn' && 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    tone === 'neutral' && 'bg-custom-bg-tertiary text-custom-text-secondary',
  )}>
    {children}
  </span>
)

// One key figure: accent bar, label, big value, context line
const Figure = ({ icon: Icon, label, value, note, accent }) => (
  <div className="flex min-w-0 items-start gap-3 px-[var(--card-padding)] py-3">
    <span className={cn('mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', accent)}>
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-xs font-medium uppercase tracking-wide text-custom-text-secondary">{label}</p>
      <p className="truncate text-lg font-bold tabular-nums leading-7 text-custom-text-primary xl:text-xl">{value}</p>
      {note && <p className="truncate text-xs text-custom-text-secondary">{note}</p>}
    </div>
  </div>
)

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

// Who the member is and how they stand, at a glance: identity on the left, key figures for the year below
const ProfileHeader = ({ user, account, figures, year }) => {
  const name = ownerName(user)
  return (
    <section className="shrink-0 overflow-hidden rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary shadow-card">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-[var(--card-padding)]">
        <Avatar user={user} className="h-16 w-16" textClassName="text-xl" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold leading-7 text-custom-text-primary xl:text-xl">{name}</h2>
            <StatusBadge status={user.status} />
            {user.role && <Pill>{user.role.toLowerCase()}</Pill>}
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
            <Detail icon={Mail} label="Email">{user.email || 'No email'}</Detail>
            <Detail icon={Phone} label="Contact">{user.contact || 'Not provided'}</Detail>
            <Detail icon={UserRound} label="Gender">{user.gender ? user.gender.toLowerCase() : 'Not specified'}</Detail>
            <Detail icon={Cake} label="Date of birth">{user.dob ? moment(user.dob).format('DD MMM YYYY') : 'Not provided'}</Detail>
            <Detail icon={CalendarCheck} label="Member since">
              {user.joinDate ? `Member since ${moment(user.joinDate).format('MMM YYYY')}` : 'Join date unknown'}
            </Detail>
          </div>
        </div>

        {/* Account standing */}
        <div className="flex shrink-0 flex-col items-start gap-2 border-custom-bg-tertiary sm:border-l sm:pl-6">
          {account ? (
            <>
              <span className="flex items-center gap-2 text-sm text-custom-text-secondary">
                <Hash className="h-4 w-4" aria-hidden="true" />
                Account <span className="font-semibold tabular-nums text-custom-text-primary">{account.accountNumber}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={account.status} />
                <Pill tone={account.paidMembership ? 'good' : 'warn'}>
                  {account.paidMembership ? 'Membership paid' : 'Membership unpaid'}
                </Pill>
                {figures.pendingApplication && <Pill tone="warn">Loan application pending</Pill>}
              </div>
            </>
          ) : (
            <Pill tone="warn">No SACCO account</Pill>
          )}
        </div>
      </div>

      {account && (
        <div className="grid grid-cols-2 divide-custom-bg-tertiary border-t border-custom-bg-tertiary bg-custom-bg-table lg:grid-cols-4 lg:divide-x">
          <Figure
            icon={PiggyBank}
            label="Savings balance"
            value={formatUGX(figures.balance)}
            note="Available now"
            accent="bg-green-500/10 text-green-700 dark:text-green-400"
          />
          <Figure
            icon={Landmark}
            label="Outstanding loan"
            value={formatUGX(figures.outstanding)}
            note={figures.openLoanCount ? `${formatUGX(figures.monthlyDue)} due monthly` : 'No open loan'}
            accent={figures.outstanding ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'bg-custom-bg-tertiary text-custom-text-secondary'}
          />
          <Figure
            icon={TrendingUp}
            label={`Saved in ${year}`}
            value={formatUGX(figures.savedInYear)}
            note={plural(figures.depositsInYear, 'deposit')}
            accent="bg-custom-interactive-focus text-custom-brand-green"
          />
          <Figure
            icon={Banknote}
            label={`Repaid in ${year}`}
            value={formatUGX(figures.repaidInYear)}
            note={plural(figures.paymentsInYear, 'payment')}
            accent="bg-custom-interactive-focus text-custom-brand-green"
          />
        </div>
      )}
    </section>
  )
}

export default ProfileHeader
