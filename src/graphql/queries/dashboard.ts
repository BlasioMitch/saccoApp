import { gql } from '@apollo/client'

const KPI = `value previous change`;

export const DASHBOARD_STATS = gql`
  query DashboardStats($range: STATSRANGE!) {
    dashboardStats(range: $range) {
      range
      grain
      from
      to
      generatedAt
      kpis {
        totalSavings { ${KPI} }
        outstandingLoans { ${KPI} }
        cash { ${KPI} }
        portfolioAtRisk { ${KPI} }
        deposits { ${KPI} }
        withdrawals { ${KPI} }
        repayments { ${KPI} }
        disbursed { ${KPI} }
        income { ${KPI} }
        newMembers { ${KPI} }
        transactions { ${KPI} }
      }
      members { active total }
      loans {
        byStatus { status count amount }
        aging { key label count outstanding }
        arrears
        loansInArrears
      }
      typeMix { kind label amount count }
      series {
        period deposits withdrawals repayments disbursed feeIncome interestIncome
        transactions netSavings newMembers savingsBalance loanBook cash
      }
    }
  }
`;
