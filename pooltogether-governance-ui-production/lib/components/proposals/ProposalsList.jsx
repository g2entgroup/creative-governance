import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { DateTime } from 'luxon'

import { useTranslation } from 'lib/../i18n'
import { PROPOSAL_STATUS } from 'lib/constants'
import { Card, InnerCard } from 'lib/components/Card'
import { CountDown } from 'lib/components/CountDown'
import { ButtonLink } from 'lib/components/ButtonLink'
import { useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'
import { useProposalData } from 'lib/hooks/useProposalData'
import { msToSeconds } from 'lib/utils/msToSeconds'

import ChatBubble from 'assets/images/chat-bubble.svg'

export const ProposalsList = (props) => {
  const { t } = useTranslation()

  const { isFetched, data: proposals, sortedProposals } = useAllProposalsSorted()

  if (!proposals || Object.keys(proposals)?.length === 0) {
    return (
      <>
        <h6 className='text-inverse mb-4'>{t('proposals')}</h6>
        <EmptyProposalsList />
      </>
    )
  }

  const { executable, approved, active, pending, past } = sortedProposals

  return (
    <>
      {executable.length > 0 && (
        <>
          <h6 className='text-inverse mb-4'>{t('executableProposals')}</h6>
          <ol>
            {executable.map((p) => (
              <ProposalItem key={p.id} proposal={p} />
            ))}
          </ol>
        </>
      )}
      {approved.length > 0 && (
        <>
          <h6 className='text-inverse mb-4'>{t('approvedProposals')}</h6>
          <ol>
            {approved.map((p) => (
              <ProposalItem key={p.id} proposal={p} />
            ))}
          </ol>
        </>
      )}
      {active.length > 0 && (
        <>
          <h6 className='text-inverse mb-4'>{t('activeProposals')}</h6>
          <ol>
            {active.map((p) => (
              <ProposalItem key={p.id} proposal={p} />
            ))}
          </ol>
        </>
      )}
      {pending.length > 0 && (
        <>
          <h6 className='text-inverse mb-4'>{t('pendingProposals')}</h6>
          <ol>
            {pending.map((p) => (
              <ProposalItem key={p.id} proposal={p} />
            ))}
          </ol>
        </>
      )}
      {past.length > 0 && (
        <>
          <h6 className='text-inverse mb-4'>{t('pastProposals')}</h6>
          <ol>
            {past.map((p) => (
              <ProposalItem key={p.id} proposal={p} />
            ))}
          </ol>
        </>
      )}
    </>
  )
}

const ProposalItem = (props) => {
  const { proposal } = props

  const { t } = useTranslation()

  const {
    status,
    description,
    startBlock,
    endBlock,
    proposer,
    forVotes,
    againstVotes,
    title,
    id
  } = proposal

  return (
    <li>
      <Card>
        <div className='flex justify-between flex-col-reverse sm:flex-row'>
          <h6 className='leading-none mb-2 mt-2 sm:mt-0'>{t('proposalId', { id })}</h6>
          <ProposalStatus proposal={proposal} />
        </div>
        <p className='mb-4'>{title}</p>
        <ViewProposalButton proposal={proposal} />
      </Card>
    </li>
  )
}

export const ProposalStatus = (props) => {
  const { proposal } = props

  const { t } = useTranslation()
  const { status } = proposal

  let statusValue
  switch (status) {
    case PROPOSAL_STATUS.executed:
    case PROPOSAL_STATUS.succeeded:
    case PROPOSAL_STATUS.active:
    case PROPOSAL_STATUS.queued: {
      statusValue = 1
      break
    }
    case PROPOSAL_STATUS.expired:
    case PROPOSAL_STATUS.defeated:
    case PROPOSAL_STATUS.cancelled: {
      statusValue = -1
      break
    }
    default:
    case PROPOSAL_STATUS.pending: {
      statusValue = 0
      break
    }
  }

  let icon
  if (statusValue < 0) {
    icon = 'x-circle'
  } else if (statusValue > 0) {
    icon = 'check-circle'
  }

  const showIcon = status !== PROPOSAL_STATUS.active && status !== PROPOSAL_STATUS.pending

  if (status === PROPOSAL_STATUS.active) {
    return <ProposalCountDown proposal={proposal} />
  }

  return (
    <div
      className={classnames(
        'ml-auto text-white sm:ml-0 mb-2 sm:mb-0 flex rounded px-2 py-1 w-fit-content h-fit-content bg-tertiary whitespace-no-wrap',
        {
          'text-orange': statusValue < 0,
          'text-highlight-9': statusValue > 0,
          'text-inverse': statusValue === 0
        }
      )}
    >
      {proposal.endDate && (
        <div className='pl-2 sm:pl-4 mr-2 sm:mr-4 text-right' style={{ minWidth: 104 }}>
          {proposal.endDate.toLocaleString(DateTime.DATE_MED)}
        </div>
      )}
      {icon && showIcon && (
        <FeatherIcon icon={icon} className='my-auto mr-2 stroke-current w-4 h-4' />
      )}
      <div className='pr-2 sm:pr-4 font-bold capitalized'>{t(status)}</div>
    </div>
  )
}

const ProposalCountDown = (props) => {
  const { proposal } = props

  const [seconds] = useState(proposal.endDateSeconds - msToSeconds(Date.now()).toNumber())
  const { refetch } = useProposalData(proposal.id)

  return (
    <CountDown className='sm:ml-auto sm:w-unset mb-4 sm:mb-0' seconds={seconds} onZero={refetch} />
  )
}

const ViewProposalButton = (props) => {
  const { proposal } = props

  const { t } = useTranslation()
  const { status, id } = proposal

  if (status === PROPOSAL_STATUS.active) {
    return (
      <ButtonLink
        href={'/proposals/[id]/'}
        as={`/proposals/${id}/`}
        border='green'
        text='primary'
        bg='green'
        hoverBorder='green'
        hoverText='primary'
        hoverBg='green'
      >
        {t('voteNow')}
      </ButtonLink>
    )
  }

  return (
    <ButtonLink textSize='xxs' href={'/proposals/[id]/'} as={`/proposals/${id}/`}>
      {t('viewProposal')}
    </ButtonLink>
  )
}

const EmptyProposalsList = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <InnerCard className='flex flex-col text-center py-8 text-inverse'>
        <img src={ChatBubble} className='mx-auto w-16 h-16 sm:w-auto sm:h-auto mb-4 sm:mb-6' />
        <h4 className='mb-2'>{t('noActiveProposalsAtTheMoment')}</h4>
        <p>
          {t('weEncourageYouToDiscussAnyIdeasYouHaveOn')}{' '}
          <a
            className='text-inverse underline'
            href='https://discord.gg/hxPhPDW'
            rel='noreferrer noopener'
            target='_blank'
          >
            Discord
          </a>{' '}
          {t('and')}{' '}
          <a
            className='text-inverse underline'
            href='https://gov.pooltogether.com/'
            target='_blank'
            rel='noreferrer noopener'
          >
            Discourse
          </a>
          .
        </p>
      </InnerCard>
    </Card>
  )
}
