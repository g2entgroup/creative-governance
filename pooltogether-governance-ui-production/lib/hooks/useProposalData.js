import { useAllProposals } from 'lib/hooks/useAllProposals'

export function useProposalData(id) {
  const { refetch, data, isFetching, isFetched, error } = useAllProposals()

  return {
    proposal: data?.[id],
    refetch,
    isFetching,
    isFetched,
    error
  }
}
