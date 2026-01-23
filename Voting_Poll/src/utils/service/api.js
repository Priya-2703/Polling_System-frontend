

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Register Voter API Call
export const registerVoter = async (voterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(voterData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get Caste List API Call
export const getCasteList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/utils/castes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch caste list');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};



// Cast Vote API Call
export const castVote = async (partyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vote/cast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        party_id: partyId,
      }),
    });

    const data = await response.json();

    console.log("vote", data)

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('ஏற்கனவே வாக்களிக்கப்பட்டது');
      } else if (response.status === 404) {
        throw new Error('Tracker ID கண்டுபிடிக்கப்படவில்லை');
      } else if (response.status === 400) {
        throw new Error(data.error || 'தவறான கோரிக்கை');
      }
      throw new Error(data.error || 'வாக்களிப்பு தோல்வி');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get Vote Status API Call (Optional)
export const getVoteStatus = async (trackerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vote/status/${trackerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get vote status');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// SUBMIT SURVEY API Call (NEW FUNCTION)
export const submitSurvey = async (voteId, surveyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vote/survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // If your backend uses cookies for vote_id/session, uncomment this
      body: JSON.stringify({
        vote_id: voteId,       // Step 2-ல இருந்து வந்த vote_id
        survey_data: surveyData, // q1: "a", q2: "b" format-ல
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend-ல இருந்து வரக்கூடிய குறிப்பிட்ட Error Messages-ஐ இங்கே Handle செய்யலாம்
      if (response.status === 404) {
        throw new Error(data.error || 'Vote record not found. Please ensure you have voted.');
      }
      if (response.status === 403) {
        throw new Error(data.error || 'You have already submitted the survey for this vote.');
      }
      throw new Error(data.error || 'Failed to submit survey');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// CM Vote API
export const submitCMVote = async (voteId, candidateId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cm/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        vote_id: voteId,
        cm_id: candidateId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'CM Vote failed');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Resume Session API
export const resumeSession = async (trackerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie set aaga mukkiyam
      body: JSON.stringify({
        tracker_id: trackerId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Resume failed');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Thanks API
export const getMyChoice = async (voteId, lang = 'en') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cm/my-choice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 👈 Cookies anuppa ithu MUST
      body: JSON.stringify({
        vote_id: voteId,
        lang: lang
      })
    });

    const data = await response.json();

    // HTTP Error Check (fetch won't throw for 4xx/5xx)
    if (!response.ok) {
      console.error("API Error:", data.error);
      return { error: data.error || "Something went wrong" };
    }

    console.log("My Choice Response:", data);
    return data;

  } catch (error) {
    console.error("Network/Fetch Error:", error);
    return { error: "Network error. Please try again." };
  }
};