import { useState, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";
import { castVote as castVoteApi } from "../utils/service/api";

const useVote = () => {
  const { checkUserStatus, setVoteId, currentStep } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [voteData, setVoteData] = useState(null);

  // Cast Vote Function
  const castVote = useCallback(async (partyId) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!partyId) {
      setIsLoading(false);
      return { success: false, error: "Party ID தேவை" };
    }

    // Call API
    const result = await castVoteApi(partyId);

    if (result.success) {
      setVoteData(result.data);
      setIsSuccess(true);

      // Save to localStorage
      // localStorage.setItem("voter_status", "voted");
      // if (result.data.vote_id) {
      //   // localStorage.setItem("vote_id", result.data.vote_id);
      //   setVoteId(result.data.vote_id);
      // }
      await checkUserStatus();
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, [checkUserStatus]);

  // Reset Function
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
    setVoteData(null);
  }, []);

  // Check if already voted
  const hasVoted = useCallback(() => {
    // return localStorage.getItem("voter_status") === "voted";
     return currentStep !== "REGISTER" && currentStep !== "VOTE";
  }, []);

  return {
    isLoading,
    error,
    isSuccess,
    voteData,
    castVote,
    reset,
    hasVoted,
  };
};

export default useVote;