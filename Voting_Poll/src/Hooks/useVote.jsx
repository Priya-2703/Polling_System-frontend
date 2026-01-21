import { useState, useCallback } from "react";
import { castVote as castVoteApi } from "../utils/service/api";

const useVote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [voteData, setVoteData] = useState(null);

  // Cast Vote Function
  const castVote = useCallback(async (partyId) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!trackerId) {
      console.log("Tracker ID காணவில்லை. மீண்டும் முதலிலிருந்து தொடங்கவும்.");
      setIsLoading(false);
      return { success: false, error: "Tracker ID காணவில்லை" };
    }

    if (!partyId) {
      console.log("Party ID தேவை.");
      setIsLoading(false);
      return { success: false, error: "Party ID தேவை" };
    }

    // Call API
    const result = await castVoteApi(trackerId, partyId);

    if (result.success) {
      setVoteData(result.data);
      setIsSuccess(true);

      // Save to localStorage
      localStorage.setItem("voter_status", "voted");
      if (result.data.vote_id) {
        localStorage.setItem("vote_id", result.data.vote_id);
      }
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, []);

  // Reset Function
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
    setVoteData(null);
  }, []);

  // Check if already voted
  const hasVoted = useCallback(() => {
    return localStorage.getItem("voter_status") === "voted";
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