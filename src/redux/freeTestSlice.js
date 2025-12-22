import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import freeTestProvider from "../api/freeTestQuizProvider";





// Async Thunks getFreeQuizeSlice
export const getFreeQuizeSlice = createAsyncThunk(
  'freeTest/getFreeQuizeSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.freeTestGet();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);


// Async Thunks getFreeTopicWisePaperSlice
export const getFreeTopicWisePaperSlice = createAsyncThunk(
  'freeTest/getFreeTopicWisePaperSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getTopicWisePaper();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getFreeTopicWisePaperSlice
export const getAllPreviouseYearDataSlice = createAsyncThunk(
  'freeTest/getAllPreviouseYearDataSlice',
  async (page, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getAllPreviouseYearData(page);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks 
export const getPreviouseYearGetQuestionSlice = createAsyncThunk(
  'freeTest/getPreviouseYearGetQuestionSlice',
  async (previousPaperId, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getPreviouseYearPaperQuestionById(previousPaperId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks attendPreviouseYearQuestionSlice
export const attendPreviouseYearQuestionSlice = createAsyncThunk(
  'user/attendPreviouseYearQuestionSlice',
  async (previouseYearSubmitData, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.attendPreviouseYearQuestions(
        previouseYearSubmitData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks attendPreviouseYearQuestionSlice
export const previouseYearSolutionGetSlice = createAsyncThunk(
  'user/previouseYearSolutionGetSlice',
  async (id, { rejectWithValue }) => {

    try {
      const response = await freeTestProvider.previouseYearSolutionGet(
        id,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getPreviouseYearPaperRankSlice
export const getPreviouseYearPaperRankSlice = createAsyncThunk(
  'user/getPreviouseYearPaperRankSlice',
  async (previousPaperId, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getPreviouseYearPaperRank(
        previousPaperId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getCurrentAffairesSlice
// export const getCurrentAffairesSlice = createAsyncThunk(
//   'getCurrentAffaires',
//   async ({ page = 1 }, { rejectWithValue }) => {
//     try {
//       const response = await freeTestProvider.getCurrentAffairsData(page);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getCurrentAffairesSlice = createAsyncThunk(
//   'getCurrentAffaires',
//   async (page = 1, { rejectWithValue }) => {
//     try {
//       const response = await freeTestProvider.getCurrentAffairsData(page);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getCurrentAffairesSlice = createAsyncThunk(
//   'user/getCurrentAffairesSlice',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await freeTestProvider.getCurrentAffairsData();
//       return response;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   },
// );

// ✅ Updated to accept page parameter
export const getCurrentAffairesSlice = createAsyncThunk(
  'user/getCurrentAffairesSlice',
  async ({ page = 1 }, { rejectWithValue }) => {  // ✅ Accept page parameter
    try {
      const response = await freeTestProvider.getCurrentAffairsData(page);  // ✅ Pass page
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Async Thunks getMindMapSlice
export const getMindMapSlice = createAsyncThunk(
  'user/getMindMapSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getMindMap();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getStudyNotesSlice
export const getStudyNotesSlice = createAsyncThunk(
  'user/getStudyNotesSlice',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getStudyNotes(page);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getStudyNoteDetailsSlice = createAsyncThunk(
  'user/getStudyNoteDetailsSlice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getStudyNoteDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const purchaseStudyMaterialSlice = createAsyncThunk(
  'user/purchaseStudyMaterialSlice',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.purchaseStudyMaterial(purchaseData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const paymentVerifyStudyNoteSlice = createAsyncThunk(
  'user/paymentVerifyStudyNoteSlice',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.paymentVerifyStudyMaterial(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const paymentCancelStudyNoteSlice = createAsyncThunk(
  'user/paymentCancelStudyNoteSlice',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.paymentCancelStudyMaterial(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);














// Slice
const freeTestQuiz = createSlice({
  name: 'freeTestSlice',
  initialState: {},
  reducers: {}

}
);

export const { } = freeTestQuiz.actions;

export default freeTestQuiz.reducer;